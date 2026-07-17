// Satu sumber kebenaran untuk SELURUH tautan WhatsApp situs.
// Nomor diatur admin di `content.whatsappNumber` (Admin > Konten Halaman >
// Footer & Medsos > "Nomor WhatsApp"). Semua tombol WA — floating, footer,
// CTA beranda, kolaborasi brand & venue — membangun tautannya dari sini,
// sehingga cukup diganti di SATU tempat dan tidak ada nomor yang berbeda-beda.

export const DEFAULT_WA_NUMBER = '6281234567890';

// Normalkan input admin menjadi digit format internasional:
// buang semua non-digit, dan ubah awalan "0" (08xx) -> "62" (628xx).
export function normalizeWaNumber(raw) {
  if (typeof raw !== 'string') return '';
  let digits = raw.replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('0')) digits = '62' + digits.slice(1);
  return digits;
}

// Nomor efektif dari objek content; fallback ke default bila kosong/invalid.
export function resolveWaNumber(content) {
  return normalizeWaNumber(content && content.whatsappNumber) || DEFAULT_WA_NUMBER;
}

// Bangun tautan wa.me dari nomor + pesan opsional (pesan mentah, akan di-encode).
export function buildWaLink(number, message) {
  const digits = normalizeWaNumber(number) || DEFAULT_WA_NUMBER;
  const base = `https://wa.me/${digits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
