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

// Ganda didahulukan agar "**tebal**" tidak tertangkap aturan miring.
// Sengaja TIDAK mendukung garis bawah (_) supaya nama_file atau URL berisi
// underscore tidak berubah jadi miring tanpa sengaja.
const EMPHASIS_RE = /\*\*([\s\S]+?)\*\*|\*([^*\n]+?)\*/g;

function renderEmphasis(line, keyPrefix) {
  const out = [];
  let lastIndex = 0;
  let match;
  let i = 0;

  EMPHASIS_RE.lastIndex = 0;
  while ((match = EMPHASIS_RE.exec(line)) !== null) {
    if (match.index > lastIndex) out.push(line.slice(lastIndex, match.index));

    if (match[1] !== undefined) {
      out.push(<strong key={`${keyPrefix}b${i}`}>{match[1]}</strong>);
    } else {
      out.push(<em key={`${keyPrefix}i${i}`}>{match[2]}</em>);
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

  // Mode inline: dipakai di dalam <p> yang sudah ada (deskripsi pendek).
  if (inline) return <>{renderLines(raw.replace(/\r\n/g, '\n'), 'i')}</>;

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
