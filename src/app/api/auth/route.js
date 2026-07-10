import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';
import { encryptSession, decryptSession, verifyPassword, hashPassword, isHashed } from '@/lib/auth';
import { db } from '@/lib/db';

// --- Rate limiting login (best-effort, in-memory) ---
// Catatan: pada serverless (Vercel) state ini per-instance, jadi tidak sempurna.
// Untuk proteksi produksi yang kuat, ganti dengan @upstash/ratelimit berbasis Redis.
const RL_MAX_ATTEMPTS = 8;
const RL_WINDOW_MS = 15 * 60 * 1000; // 15 menit
const loginAttempts = new Map(); // ip -> { count, resetAt }

function getClientIp(request) {
  const xff = request.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  return request.headers.get('x-real-ip') || 'unknown';
}

function checkRateLimit(ip) {
  const now = Date.now();
  const rec = loginAttempts.get(ip);
  if (!rec || now > rec.resetAt) return { limited: false };
  if (rec.count >= RL_MAX_ATTEMPTS) {
    return { limited: true, retryAfter: Math.max(1, Math.ceil((rec.resetAt - now) / 1000)) };
  }
  return { limited: false };
}

function registerFailure(ip) {
  const now = Date.now();
  const rec = loginAttempts.get(ip);
  if (!rec || now > rec.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + RL_WINDOW_MS });
  } else {
    rec.count += 1;
  }
  // Prune entri kedaluwarsa agar Map tidak tumbuh tanpa batas.
  if (loginAttempts.size > 1000) {
    for (const [key, val] of loginAttempts) {
      if (now > val.resetAt) loginAttempts.delete(key);
    }
  }
}

function clearFailures(ip) {
  loginAttempts.delete(ip);
}

// GET: Cek status autentikasi admin
export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('berseni_session')?.value;
  const session = decryptSession(token);
  
  if (session && session.role === 'admin') {
    const activeSessionId = await db.get('admin_session_id');
    if (session.sessionId === activeSessionId) {
      return NextResponse.json({ authenticated: true });
    }
  }
  
  return NextResponse.json({ authenticated: false });
}

// POST: Melakukan login admin
export async function POST(request) {
  try {
    const ip = getClientIp(request);

    // Tolak lebih awal jika IP sudah melewati batas percobaan.
    const rl = checkRateLimit(ip);
    if (rl.limited) {
      return NextResponse.json(
        { error: 'Terlalu banyak percobaan login. Coba lagi nanti.' },
        { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } }
      );
    }

    const { password } = await request.json();

    // Verifikasi password. Mendukung hash bcrypt maupun plaintext lama (migrasi mulus).
    const stored = await db.get('admin_password');
    let ok = false;
    if (stored) {
      ok = await verifyPassword(password, stored);
      // Kalau cocok tapi masih plaintext, upgrade ke hash bcrypt.
      if (ok && !isHashed(stored)) {
        await db.set('admin_password', await hashPassword(password));
      }
    } else {
      // Belum ada di DB: cocokkan fallback env/default, lalu simpan sebagai hash.
      const fallback = process.env.ADMIN_PASSWORD || 'admin123';
      ok = await verifyPassword(password, fallback);
      if (ok) {
        await db.set('admin_password', await hashPassword(password));
      }
    }

    if (ok) {
      clearFailures(ip);
      const sessionId = crypto.randomUUID();
      await db.set('admin_session_id', sessionId);

      const token = encryptSession({ role: 'admin', sessionId });
      const cookieStore = await cookies();

      cookieStore.set('berseni_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24 // 24 jam
      });

      return NextResponse.json({ success: true });
    }

    registerFailure(ip);
    return NextResponse.json(
      { error: 'Password salah!' },
      { status: 401 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: 'Terjadi kesalahan server.' },
      { status: 500 }
    );
  }
}

// PUT: Mengubah password admin (harus terautentikasi)
export async function PUT(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('berseni_session')?.value;
    const session = decryptSession(token);
    
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Check active session ID
    const activeSessionId = await db.get('admin_session_id');
    if (session.sessionId !== activeSessionId) {
      return NextResponse.json({ error: 'Session expired' }, { status: 401 });
    }
    
    const { oldPassword, newPassword } = await request.json();
    
    if (!oldPassword || !newPassword) {
      return NextResponse.json({ error: 'Password lama dan baru wajib diisi!' }, { status: 400 });
    }
    
    // Cocokkan password lama (hash bcrypt atau plaintext lama / fallback env).
    const stored = await db.get('admin_password');
    const oldOk = stored
      ? await verifyPassword(oldPassword, stored)
      : await verifyPassword(oldPassword, process.env.ADMIN_PASSWORD || 'admin123');

    if (!oldOk) {
      return NextResponse.json({ error: 'Password lama salah!' }, { status: 400 });
    }

    if (typeof newPassword !== 'string' || newPassword.length < 8) {
      return NextResponse.json({ error: 'Password baru minimal 8 karakter!' }, { status: 400 });
    }

    // Selalu simpan sebagai hash bcrypt.
    const success = await db.set('admin_password', await hashPassword(newPassword));
    if (success) {
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: 'Gagal menyimpan ke database' }, { status: 500 });
  } catch (err) {
    console.error("Change password API error:", err);
    return NextResponse.json({ error: 'Terjadi kesalahan server.' }, { status: 500 });
  }
}

// DELETE: Melakukan logout
export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete('berseni_session');

  // Invalidasi sesi di sisi server: rotasi admin_session_id agar token yang
  // sudah terlanjur bocor tidak lagi valid (tidak menunggu 24 jam kedaluwarsa).
  await db.set('admin_session_id', crypto.randomUUID());

  return NextResponse.json({ success: true });
}
