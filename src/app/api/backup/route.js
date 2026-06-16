import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { decryptSession } from '@/lib/auth';

// Validate admin session
async function isAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('berseni_session')?.value;
  const session = decryptSession(token);
  if (!session || session.role !== 'admin') return false;

  const activeSessionId = await db.get('admin_session_id');
  return session.sessionId === activeSessionId;
}

export async function GET() {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const content = await db.get('content') || {};
    const products = await db.get('products') || [];
    const posts = await db.get('posts') || [];
    const seo_pages = await db.get('seo_pages') || {};

    const backupData = {
      content,
      products,
      posts,
      seo_pages
    };

    return new NextResponse(JSON.stringify(backupData, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="berseni-full-backup-${new Date().toISOString().split('T')[0]}.json"`
      }
    });
  } catch (err) {
    console.error("Gagal mengekspor data cadangan:", err);
    return NextResponse.json({ error: 'Gagal membuat file cadangan' }, { status: 500 });
  }
}
