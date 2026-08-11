'use client';

/**
 * Judul dua bagian: teks utama + potongan beraksen cursive.
 * Bagian cursive dirender sebagai <span> agar CSS tiap halaman
 * (mis. `.pillarsTitle span`) tetap berlaku seperti sebelumnya.
 *
 * KENAPA ADA KOMPONEN INI:
 * Dulu tiap halaman menulis langsung:
 *     {getTranslation('xTitle')}<span>{getTranslation('xTitleSpan')}</span>
 * sehingga tampilannya BERGANTUNG pada admin mengetik spasi di akhir teks
 * pertama. Begitu spasi itu tidak ada, kedua bagian menempel — persis kasus
 * "What We BelieveArt is for everyone.". Komponen ini menjamin SELALU ada
 * pemisah, apa pun yang diketik admin, di halaman/section mana pun.
 *
 * layout:
 *  - 'auto' (default) : highlight pendek (1-2 kata) -> sebaris. Ini menjaga
 *                       desain bawaan tetap sama, mis. "Tiga Pilar Utama." dan
 *                       "Artikel & Catatan Seni.".
 *                       highlight berupa kalimat (>=3 kata) -> turun ke baris
 *                       bawah, mis. "Art is for everyone." — kalimat panjang
 *                       yang disambung di kanan judul akan terlihat berantakan.
 *  - 'inline'         : paksa sebaris.
 *  - 'block'          : paksa selalu baris baru.
 */
const AUTO_BLOCK_MIN_WORDS = 3;
export default function SplitTitle({ text, highlight, layout }) {
  const base = typeof text === 'string' ? text.trim() : '';
  const accent = typeof highlight === 'string' ? highlight.trim() : '';

  if (!accent) return base || null;
  if (!base) return <span>{accent}</span>;

  const mode =
    layout === 'inline' || layout === 'block'
      ? layout
      : accent.split(/\s+/).length >= AUTO_BLOCK_MIN_WORDS
        ? 'block'
        : 'inline';

  return (
    <>
      {base}
      {mode === 'block' ? <br /> : ' '}
      <span>{accent}</span>
    </>
  );
}
