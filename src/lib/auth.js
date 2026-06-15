import crypto from 'crypto';

const SECRET = process.env.ADMIN_PASSWORD || 'berseni-local-secret-key-321!';

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
  
  // Mencegah timing attack
  if (signature !== expectedSignature) {
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
