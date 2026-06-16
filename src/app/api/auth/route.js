import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { encryptSession, decryptSession } from '@/lib/auth';
import { db } from '@/lib/db';

// GET: Cek status autentikasi admin
export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('berseni_session')?.value;
  const session = decryptSession(token);
  
  if (session && session.role === 'admin') {
    return NextResponse.json({ authenticated: true });
  }
  
  return NextResponse.json({ authenticated: false });
}

// POST: Melakukan login admin
export async function POST(request) {
  try {
    const { password } = await request.json();
    
    // Ambil password dari database, fallback ke env atau admin123
    const dbPassword = await db.get('admin_password');
    const expectedPassword = dbPassword || process.env.ADMIN_PASSWORD || 'admin123';
    
    if (password === expectedPassword) {
      const token = encryptSession({ role: 'admin' });
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
    
    const { oldPassword, newPassword } = await request.json();
    
    if (!oldPassword || !newPassword) {
      return NextResponse.json({ error: 'Password lama dan baru wajib diisi!' }, { status: 400 });
    }
    
    // Ambil password lama dari database untuk dicocokkan
    const dbPassword = await db.get('admin_password');
    const currentPassword = dbPassword || process.env.ADMIN_PASSWORD || 'admin123';
    
    if (oldPassword !== currentPassword) {
      return NextResponse.json({ error: 'Password lama salah!' }, { status: 400 });
    }
    
    if (newPassword.length < 4) {
      return NextResponse.json({ error: 'Password baru minimal 4 karakter!' }, { status: 400 });
    }
    
    const success = await db.set('admin_password', newPassword);
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
  
  return NextResponse.json({ success: true });
}
