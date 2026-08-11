// Satu sumber kebenaran untuk SELURUH tautan WhatsApp situs.
// Nomor diatur admin di `content.whatsappNumber` (Admin > Konten Halaman >
// Footer & Medsos > "Nomor WhatsApp"). Semua tombol WA — floating, footer,
// CTA beranda, kolaborasi brand & venue — membangun tautannya dari sini,
// sehingga cukup diganti di SATU tempat dan tidak ada nomor yang berbeda-beda.

export const DEFAULT_WA_NUMBER = '6281234567890';

// Teks pesan otomatis bawaan tiap tombol WhatsApp. SATU sumber: dipakai kamus
// bahasa (untuk ditampilkan di situs) DAN panel admin (untuk mengisi kotak
// editor saat database masih kosong), sehingga keduanya tak mungkin berbeda.
export const WA_MESSAGE_DEFAULTS = {
  waFloatMessage: {
    id: 'Halo Berseni! Saya ingin tahu lebih lanjut mengenai karya seni, kelas, atau pilar Berseni.',
    en: 'Hello Berseni! I would like to know more about the artworks, classes, or pillars of Berseni.',
  },
  ctaWaMessage: {
    id: 'Halo Berseni! Saya tertarik untuk bergabung sebagai early supporter dan ingin mendapatkan info terbaru mengenai karya seni dan workshop.',
    en: 'Hello Berseni! I am interested in joining as an early supporter and want to get the latest info about artworks and workshops.',
  },
  collabBrandWaMessage: {
    id: 'Halo Berseni! Brand/Perusahaan kami tertarik untuk berkolaborasi kreatif dengan Berseni.',
    en: 'Hello Berseni! Our brand/company is interested in collaborating creatively with Berseni.',
  },
  collabVenueWaMessage: {
    id: 'Halo Berseni! Saya memiliki venue/tempat yang tertarik untuk berkolaborasi dengan komunitas Berseni.',
    en: 'Hello Berseni! I have a venue/space and I am interested in collaborating with the Berseni community.',
  },
};

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
