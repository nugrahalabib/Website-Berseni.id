import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { encryptSession, decryptSession } from '@/lib/auth';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

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
    
    if (password === ADMIN_PASSWORD) {
      const token = encryptSession({ role: 'admin' });
      const cookieStore = await cookies();
      
      cookieStore.set('berseni_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24 // 24 jam dalam detik
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

// DELETE: Melakukan logout
export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete('berseni_session');
  
  return NextResponse.json({ success: true });
}
