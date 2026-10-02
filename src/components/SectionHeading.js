'use client';

import RichText from '@/components/RichText';

/**
 * Kepala section beranda: judul, lalu subjudul.
 *
 * Dulu judulnya selalu ditambahi titik dekoratif (`<span>.</span>`) di JSX,
 * terpisah dari teks yang diketik admin. Klien tidak bisa menghapusnya dari
 * panel, dan di HP judul berhuruf besar seperti "WHAT THEY SAY" memenuhi satu
 * baris penuh sehingga titik itu terlempar ke baris sendiri — sebuah titik
 * yatim di bawah judul. Titiknya sekarang dihilangkan sepenuhnya: kalau admin
 * memang ingin tanda baca, cukup diketik di teks judulnya sendiri.
 *
 * Subjudul yang kosong juga menyisakan <p> kosong, dan kepala section yang
 * kosong tetap memakan jarak — sehingga muncul lompatan putih lebar sebelum
 * konten berikutnya.
 *
 * Aturannya sekarang sederhana dan berlaku di semua section:
 *   - judul kosong  -> judulnya tidak dirender
 *   - subjudul kosong -> paragrafnya tidak dirender
 *   - dua-duanya kosong -> kepala section tidak dirender sama sekali
 *
 * Nama kelas tetap diteruskan apa adanya supaya seluruh CSS yang sudah ada
 * (mis. `.programs .sectionHeader h2`) tetap berlaku
 * persis seperti sebelumnya.
 */
export default function SectionHeading({
  title,
  subtitle,
  className,
  titleStyle,
  subtitleStyle,
}) {
  const heading = typeof title === 'string' ? title.trim() : '';
  const sub = typeof subtitle === 'string' ? subtitle.trim() : '';

  if (!heading && !sub) return null;

  return (
    <div className={className}>
      {heading ? (
        <h2 style={titleStyle}>{heading}</h2>
      ) : null}
      {sub ? (
        <p style={subtitleStyle}>
          <RichText text={sub} inline />
        </p>
      ) : null}
    </div>
  );
}
