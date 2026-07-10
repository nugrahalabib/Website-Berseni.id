import crypto from 'crypto';
import bcrypt from 'bcryptjs';

const BCRYPT_ROUNDS = 12;

// Apakah nilai tersimpan sudah berupa hash bcrypt (bukan plaintext lama)?
export function isHashed(value) {
  return typeof value === 'string' && /^\$2[aby]\$/.test(value);
}

export async function hashPassword(plain) {
  return bcrypt.hash(String(plain), BCRYPT_ROUNDS);
}

// Verifikasi password terhadap nilai tersimpan. Mendukung hash bcrypt DAN
// plaintext lama (untuk migrasi mulus). Perbandingan plaintext konstan-waktu.
export async function verifyPassword(plain, stored) {
  if (!stored) return false;
  if (isHashed(stored)) {
    return bcrypt.compare(String(plain), stored);
  }
  const a = Buffer.from(String(plain));
  const b = Buffer.from(String(stored));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// Kunci penandatanganan session. Diutamakan SESSION_SECRET khusus (terpisah dari
// password admin). Fallback lama dipertahankan agar produksi tidak langsung rusak,
// tapi WAJIB set SESSION_SECRET di environment (Vercel + .env.local) — begitu diset,
// fallback tidak lagi dipakai. TODO: hapus fallback setelah SESSION_SECRET aktif di prod.
const SECRET = process.env.SESSION_SECRET || process.env.ADMIN_PASSWORD || 'berseni-local-secret-key-321!';

if (!process.env.SESSION_SECRET) {
  console.warn(
    '[auth] SESSION_SECRET belum di-set — memakai kunci fallback yang tidak aman. ' +
    'Set SESSION_SECRET di environment untuk mengamankan session.'
  );
}

// Membuat token session aman
export function encryptSession(data) {
  const payload = JSON.stringify({
    ...data,
    exp: Date.now() + 24 * 60 * 60 * 1000 // Berlaku 24 jam
  });
  
  const payloadBase64 = Buffer.from(payload).toString('base64');
  const hmac = crypto.createHmac('sha256', SECRET).update(payloadBase64).digest('hex');
  
  return `${payloadBase64}.${hmac}`;
}

// Membaca dan memverifikasi token session
export function decryptSession(token) {
  if (!token) return null;
  
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  
  const [payloadBase64, signature] = parts;
  const expectedSignature = crypto.createHmac('sha256', SECRET).update(payloadBase64).digest('hex');

  // Perbandingan konstan-waktu untuk mencegah timing attack
  const sigBuf = Buffer.from(signature, 'hex');
  const expBuf = Buffer.from(expectedSignature, 'hex');
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return null;
  }
  
  try {
    const payload = Buffer.from(payloadBase64, 'base64').toString('utf-8');
    const data = JSON.parse(payload);
    
    // Periksa kadaluarsa
    if (Date.now() > data.exp) {
      return null;
    }
    
    return data;
  } catch (err) {
    return null;
  }
}
