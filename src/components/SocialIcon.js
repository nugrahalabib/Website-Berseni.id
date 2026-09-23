'use client';

/**
 * Ikon medsos bawaan untuk daftar tautan di footer.
 *
 * Dulu keenam ikon ini ditulis langsung sebagai <svg> di dalam Footer, satu per
 * satu, bersama tautannya. Akibatnya menambah satu platform baru — atau sekadar
 * menyembunyikan Instagram — selalu berarti mengubah kode. Sekarang daftarnya
 * dikelola admin, dan berkas ini menyediakan gambar bawaannya.
 *
 * `path` disalin langsung dari Footer lama supaya bentuk ikonnya tidak berubah
 * sedikit pun. Semuanya viewBox 0 0 24 24 dan memakai fill="currentColor", jadi
 * warnanya ikut warna tombol seperti sebelumnya.
 */
export const SOCIAL_PRESETS = {
  whatsapp: { label: 'WhatsApp', path: 'M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.464L0 24zm6.59-4.846c1.6.95 3.198 1.451 4.938 1.453 5.4 0 9.794-4.39 9.798-9.789.002-2.614-1.012-5.074-2.861-6.924C16.63 2.052 14.17 1.04 11.56 1.04c-5.39 0-9.78 4.39-9.784 9.788-.001 1.737.459 3.43 1.398 4.987l-.997 3.637 3.88-.988z' },
  instagram: { label: 'Instagram', path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z' },
  tiktok: { label: 'TikTok', path: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z' },
  youtube: { label: 'YouTube', path: 'M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.507a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11c1.87.508 9.388.508 9.388.508s7.518 0 9.388-.508a3.002 3.002 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' },
  facebook: { label: 'Facebook', path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
  email: { label: 'Email', path: 'M24 4.5v15c0 .85-.65 1.5-1.5 1.5H1.5C.65 21 0 20.35 0 19.5v-15C0 3.65.65 3 1.5 3h21c.85 0 1.5.65 1.5 1.5zM22 6.99l-9.4 6.63c-.36.26-.84.26-1.2 0L2 6.99V19h20V6.99zM2 5l10 7 10-7H2z' },
  custom: { label: 'Lainnya (unggah ikon sendiri)', path: null },
};

// Urutan tampil di dropdown admin.
export const SOCIAL_PRESET_ORDER = ['whatsapp', 'instagram', 'tiktok', 'youtube', 'facebook', 'email', 'custom'];

/**
 * Ikon bawaan untuk sebuah preset. Mengembalikan null untuk 'custom' (atau
 * preset tak dikenal) — pemanggilnya yang memutuskan apa yang tampil saat admin
 * belum mengunggah gambar.
 */
export default function SocialIcon({ preset, size = 20 }) {
  const entry = SOCIAL_PRESETS[preset];
  if (!entry || !entry.path) return null;

  return (
    <svg width={size} height={size} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d={entry.path} />
    </svg>
  );
}
