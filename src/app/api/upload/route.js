import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { put } from '@vercel/blob';
import fs from 'fs';
import path from 'path';
import { decryptSession } from '@/lib/auth';
import { db } from '@/lib/db';

// Batasan upload: hanya gambar raster, maksimal 5MB.
// Catatan: SVG sengaja TIDAK diizinkan karena bisa memuat <script> (stored XSS).
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
]);
const ALLOWED_EXT = new Set(['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif']);

// Helper untuk validasi session admin
async function isAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('berseni_session')?.value;
  const session = decryptSession(token);
  if (!session || session.role !== 'admin') return false;

  const activeSessionId = await db.get('admin_session_id');
  return session.sessionId === activeSessionId;
}

export async function POST(request) {
  try {
    // Validasi sesi admin terlebih dahulu
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file) {
      return NextResponse.json({ error: 'File tidak ditemukan' }, { status: 400 });
    }

    // Validasi tipe file (whitelist MIME, tolak SVG/HTML/skrip)
    if (!ALLOWED_MIME.has(file.type)) {
      return NextResponse.json(
        { error: 'Tipe file tidak didukung. Gunakan JPEG, PNG, WebP, GIF, atau AVIF.' },
        { status: 400 }
      );
    }

    // Validasi ukuran file (maks 5MB) — cegah penyalahgunaan storage/DoS
    if (typeof file.size === 'number' && file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json(
        { error: 'Ukuran file melebihi batas 5MB.' },
        { status: 400 }
      );
    }

    const filename = file.name || 'image.webp';

    // Validasi ekstensi (cegah bypass MIME: file .svg dengan Content-Type dipalsukan
    // agar tidak tersimpan lalu tersaji sebagai image/svg+xml yang bisa mengeksekusi skrip).
    const ext = (filename.split('.').pop() || '').toLowerCase();
    if (!ALLOWED_EXT.has(ext)) {
      return NextResponse.json(
        { error: 'Ekstensi file tidak didukung. Gunakan jpg, png, webp, gif, atau avif.' },
        { status: 400 }
      );
    }
    const isLocal = !process.env.BLOB_READ_WRITE_TOKEN;
    
    if (isLocal) {
      // MODE LOCAL DEVELOPMENT: Simpan file ke folder public/uploads
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      // Bersihkan nama file agar tidak ada spasi/karakter aneh
      const cleanFilename = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const filePath = path.join(uploadDir, cleanFilename);
      
      fs.writeFileSync(filePath, buffer);
      
      // Return response berformat sama dengan Vercel Blob
      return NextResponse.json({
        url: `/uploads/${cleanFilename}`
      });
    } else {
      // MODE PRODUCTION: Upload langsung ke Vercel Blob
      const blob = await put(filename, file, {
        access: 'public',
      });
      
      return NextResponse.json(blob);
    }
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: 'Gagal mengunggah gambar' }, { status: 500 });
  }
}
