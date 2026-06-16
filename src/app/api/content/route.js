import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { decryptSession } from '@/lib/auth';

// Helper untuk validasi session admin
async function isAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('berseni_session')?.value;
  const session = decryptSession(token);
  return session && session.role === 'admin';
}

// GET: Mengambil seluruh teks konten landing page
export async function GET() {
  try {
    const content = await db.get('content');
    if (!content) {
      return NextResponse.json({ error: 'Konten tidak ditemukan' }, { status: 404 });
    }
    return NextResponse.json(content);
  } catch (err) {
    console.error("GET content error:", err);
    return NextResponse.json({ error: 'Gagal mengambil data' }, { status: 500 });
  }
}

// POST: Mengubah/memperbarui teks konten landing page (hanya admin)
export async function POST(request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    
    // Validasi sederhana untuk memastikan data memiliki field dasar yang dibutuhkan
    if (!body.heroTitle_id || !body.heroTitle_en || !body.heroDescription_id || !body.heroDescription_en) {
      return NextResponse.json({ error: 'Field utama Hero (Indonesian & English) harus diisi!' }, { status: 400 });
    }
    
    const success = await db.set('content', body);
    if (success) {
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json({ error: 'Gagal menyimpan ke database' }, { status: 500 });
  } catch (err) {
    console.error("POST content error:", err);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}
