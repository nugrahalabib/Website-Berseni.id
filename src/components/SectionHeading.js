'use client';

import RichText from '@/components/RichText';

/**
 * Kepala section beranda: judul + titik beraksen, lalu subjudul.
 *
 * KENAPA ADA KOMPONEN INI:
 * Titik di belakang judul ditulis langsung di JSX sebagai `<span>.</span>`,
 * terpisah dari teks yang diketik admin. Selama judulnya terisi itu tidak
 * kelihatan jadi masalah — tapi begitu admin mengosongkan judulnya, titik itu
 * TETAP dirender. Yang tersisa di halaman adalah sebuah titik kecil menggantung
 * sendirian di tengah ruang kosong, persis seperti yang terjadi pada judul
 * section galeri di beranda.
 *
 * Subjudul yang kosong juga menyisakan <p> kosong, dan kepala section yang
 * kosong tetap memakan jarak — sehingga muncul lompatan putih lebar sebelum
 * konten berikutnya.
 *
 * Aturannya sekarang sederhana dan berlaku di semua section:
 *   - judul kosong  -> judul DAN titiknya tidak dirender
 *   - subjudul kosong -> paragrafnya tidak dirender
 *   - dua-duanya kosong -> kepala section tidak dirender sama sekali
 *
 * Nama kelas tetap diteruskan apa adanya supaya seluruh CSS yang sudah ada
 * (mis. `.programs .sectionHeader h2`, `.sectionHeader h2 span`) tetap berlaku
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
        <h2 style={titleStyle}>
          {heading}
          <span>.</span>
        </h2>
      ) : null}
      {sub ? (
        <p style={subtitleStyle}>
          <RichText text={sub} inline />
        </p>
      ) : null}
    </div>
  );
}
