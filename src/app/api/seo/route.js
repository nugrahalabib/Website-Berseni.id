import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { decryptSession } from '@/lib/auth';

// Helper untuk validasi session admin
async function isAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('berseni_session')?.value;
  const session = decryptSession(token);
  if (!session || session.role !== 'admin') return false;

  const activeSessionId = await db.get('admin_session_id');
  return session.sessionId === activeSessionId;
}

// GET: Mengambil metadata SEO halaman
export async function GET() {
  try {
    const seoPages = await db.get('seo_pages') || {};
    return NextResponse.json(seoPages);
  } catch (err) {
    console.error("GET SEO error:", err);
    return NextResponse.json({ error: 'Gagal mengambil metadata SEO' }, { status: 500 });
  }
}

// POST: Memperbarui metadata SEO halaman (hanya admin)
export async function POST(request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Payload tidak valid!' }, { status: 400 });
    }
    
    const success = await db.set('seo_pages', body);
    if (success) {
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: 'Gagal menyimpan ke database' }, { status: 500 });
  } catch (err) {
    console.error("POST SEO error:", err);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}
