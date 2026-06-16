import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { put } from '@vercel/blob';
import fs from 'fs';
import path from 'path';
import { decryptSession } from '@/lib/auth';
import { db } from '@/lib/db';

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
    
    const filename = file.name || 'image.webp';
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
