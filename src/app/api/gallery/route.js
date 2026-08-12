import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { decryptSession } from '@/lib/auth';

// Galeri kegiatan: foto workshop/aktivitas Berseni.
// Bentuk data sama polanya dengan produk & blog supaya konsisten.

async function isAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('berseni_session')?.value;
  const session = decryptSession(token);
  if (!session || session.role !== 'admin') return false;

  const activeSessionId = await db.get('admin_session_id');
  return session.sessionId === activeSessionId;
}

const unauthorized = () =>
  NextResponse.json(
    { error: 'Sesi login Anda sudah berakhir. Silakan keluar portal, login ulang, lalu coba lagi.' },
    { status: 401 }
  );

export async function GET() {
  try {
    const gallery = await db.get('gallery') || [];
    return NextResponse.json(gallery);
  } catch (err) {
    console.error('GET gallery error:', err);
    return NextResponse.json({ error: 'Gagal mengambil daftar foto galeri' }, { status: 500 });
  }
}

// POST: tambah foto baru
export async function POST(request) {
  try {
    if (!(await isAdmin())) return unauthorized();

    const body = await request.json();
    const { image } = body;

    if (!image) {
      return NextResponse.json({ error: 'Foto wajib diunggah terlebih dahulu.' }, { status: 400 });
    }

    const gallery = await db.get('gallery') || [];
    const newItem = {
      id: `gal-${Date.now()}`,
      image,
      title_id: body.title_id || '',
      title_en: body.title_en || '',
      caption_id: body.caption_id || '',
      caption_en: body.caption_en || '',
      location: body.location || '',
      date: body.date || '',
    };

    gallery.unshift(newItem);
    const ok = await db.set('gallery', gallery);
    if (!ok) return NextResponse.json({ error: 'Gagal menyimpan foto galeri' }, { status: 500 });

    return NextResponse.json(newItem, { status: 201 });
  } catch (err) {
    console.error('POST gallery error:', err);
    return NextResponse.json({ error: 'Gagal menambahkan foto galeri' }, { status: 500 });
  }
}

// PUT: ubah satu foto (kirim objek berisi id), ATAU simpan ulang urutan
// (kirim array) — dipakai fitur geser urutan di admin.
export async function PUT(request) {
  try {
    if (!(await isAdmin())) return unauthorized();

    const body = await request.json();

    if (Array.isArray(body)) {
      const ok = await db.set('gallery', body);
      if (!ok) return NextResponse.json({ error: 'Gagal menyimpan urutan galeri' }, { status: 500 });
      return NextResponse.json({ success: true });
    }

    const gallery = await db.get('gallery') || [];
    const index = gallery.findIndex((item) => item.id === body.id);
    if (index === -1) {
      return NextResponse.json({ error: 'Foto tidak ditemukan' }, { status: 404 });
    }

    gallery[index] = { ...gallery[index], ...body };
    const ok = await db.set('gallery', gallery);
    if (!ok) return NextResponse.json({ error: 'Gagal memperbarui foto galeri' }, { status: 500 });

    return NextResponse.json(gallery[index]);
  } catch (err) {
    console.error('PUT gallery error:', err);
    return NextResponse.json({ error: 'Gagal memperbarui galeri' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    if (!(await isAdmin())) return unauthorized();

    const id = new URL(request.url).searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID foto tidak dikirim' }, { status: 400 });

    const gallery = await db.get('gallery') || [];
    const remaining = gallery.filter((item) => item.id !== id);
    if (remaining.length === gallery.length) {
      return NextResponse.json({ error: 'Foto tidak ditemukan' }, { status: 404 });
    }

    const ok = await db.set('gallery', remaining);
    if (!ok) return NextResponse.json({ error: 'Gagal menghapus foto galeri' }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE gallery error:', err);
    return NextResponse.json({ error: 'Gagal menghapus foto galeri' }, { status: 500 });
  }
}
