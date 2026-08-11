'use client';

import { Fragment } from 'react';

/**
 * Penampil teks admin dengan format sederhana.
 *
 * Kenapa ada: seluruh teks situs diketik klien lewat panel admin sebagai teks
 * polos. Di HTML, ENTER tidak menghasilkan baris baru dan tidak ada cara
 * menebalkan kata, sehingga tulisan panjang menyatu jadi satu blok dan klien
 * tidak punya menu "bold". Komponen ini menerjemahkan format ringan yang
 * diketik di admin menjadi tampilan yang benar.
 *
 * Format yang didukung (sama persis dengan tombol di toolbar admin):
 *   **tebal**      -> tebal
 *   *miring*       -> miring
 *   baris kosong   -> paragraf baru
 *   satu enter     -> ganti baris
 *   > kutipan      -> blockquote (mode blok)
 *
 * AMAN: teks dirender sebagai elemen React, BUKAN innerHTML — jadi tag/skrip
 * yang diketik di admin tidak akan pernah dieksekusi (tidak ada celah XSS).
 */

// Urutan penting: tiga bintang dulu, lalu dua, baru satu — kalau dibalik,
// "***teks***" akan tertangkap aturan tebal dan menyisakan bintang nyasar.
// Sengaja TIDAK mendukung garis bawah (_) supaya nama_file atau URL berisi
// underscore tidak berubah jadi miring tanpa sengaja.
const EMPHASIS_SOURCE = '\\*\\*\\*([\\s\\S]+?)\\*\\*\\*|\\*\\*([\\s\\S]+?)\\*\\*|\\*([^*\\n]+?)\\*';
const MAX_NESTING = 3;

// Isi penanda diproses ULANG (rekursif) supaya "**tebal dengan *miring* di
// dalam**" ikut terbaca. Regex dibuat baru tiap panggilan karena lastIndex
// pada regex /g bersifat stateful — kalau dipakai bersama, rekursinya kacau.
function renderEmphasis(line, keyPrefix, depth = 0) {
  if (depth > MAX_NESTING) return line;

  const re = new RegExp(EMPHASIS_SOURCE, 'g');
  const out = [];
  let lastIndex = 0;
  let match;
  let i = 0;

  while ((match = re.exec(line)) !== null) {
    if (match.index > lastIndex) out.push(line.slice(lastIndex, match.index));

    const key = `${keyPrefix}e${i}`;
    const inner = (value) => renderEmphasis(value, `${key}-`, depth + 1);

    if (match[1] !== undefined) {
      // ***teks*** -> tebal + miring sekaligus
      out.push(
        <strong key={key}>
          <em>{inner(match[1])}</em>
        </strong>
      );
    } else if (match[2] !== undefined) {
      out.push(<strong key={key}>{inner(match[2])}</strong>);
    } else {
      out.push(<em key={key}>{inner(match[3])}</em>);
    }

    lastIndex = match.index + match[0].length;
    i += 1;
  }

  if (lastIndex < line.length) out.push(line.slice(lastIndex));
  return out.length ? out : line;
}

// Satu enter di dalam paragraf -> <br>
function renderLines(text, keyPrefix) {
  return text.split('\n').map((line, idx) => (
    <Fragment key={`${keyPrefix}l${idx}`}>
      {idx > 0 ? <br /> : null}
      {renderEmphasis(line, `${keyPrefix}l${idx}-`)}
    </Fragment>
  ));
}

// Pemisah paragraf yang memaafkan: baris kosong walau berisi spasi/tab, dan
// beberapa baris kosong berturut-turut, tetap dihitung satu pemisah.
export function splitParagraphs(text) {
  return String(text ?? '')
    .replace(/\r\n/g, '\n')
    .split(/\n[ \t]*\n+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

export default function RichText({ text, inline = false, className, paragraphClassName }) {
  const raw = typeof text === 'string' ? text : text == null ? '' : String(text);
  if (!raw.trim()) return null;

  // Mode inline: dipakai DI DALAM <p> yang sudah ada.
  if (inline) {
    const parts = splitParagraphs(raw);

    // Satu paragraf: cukup teks biasa (satu enter tetap jadi <br>).
    if (parts.length <= 1) return <>{renderLines(raw.replace(/\r\n/g, '\n'), 'i')}</>;

    // Lebih dari satu paragraf: JANGAN andalkan <br><br> — itu cuma turun baris,
    // tidak memberi jarak antar paragraf sehingga tulisan tetap terlihat
    // menyatu. <p> tidak boleh disarangkan di dalam <p>, jadi dipakai <span>
    // display:block yang valid dan memberi jarak sungguhan.
    return (
      <>
        {parts.map((part, idx) => (
          <span
            key={`ip${idx}`}
            style={{ display: 'block', marginTop: idx === 0 ? 0 : '0.9em' }}
          >
            {renderLines(part, `ip${idx}-`)}
          </span>
        ))}
      </>
    );
  }

  // Mode blok: menghasilkan <p> sendiri per paragraf (teks panjang/artikel).
  return (
    <div className={className}>
      {splitParagraphs(raw).map((para, idx) =>
        para.startsWith('>') ? (
          <blockquote key={idx}>{renderLines(para.replace(/^>[ \t]?/gm, ''), `q${idx}-`)}</blockquote>
        ) : (
          <p key={idx} className={paragraphClassName}>
            {renderLines(para, `p${idx}-`)}
          </p>
        )
      )}
    </div>
  );
}
