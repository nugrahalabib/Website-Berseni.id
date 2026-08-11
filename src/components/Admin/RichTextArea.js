'use client';

import { useRef } from 'react';
import styles from '@/styles/Admin.module.css';

/**
 * Textarea admin + toolbar format sederhana (Tebal / Miring / Paragraf baru).
 *
 * Dibuat karena klien tidak punya cara menebalkan kata ("ga ada menu untuk
 * bold") dan bingung membuat paragraf. Tombol di sini menyisipkan penanda yang
 * dimengerti komponen <RichText> saat ditampilkan di website.
 *
 * onChange dipanggil dengan bentuk event sintetis { target: { name, value } }
 * supaya bisa langsung dipakai handler form yang sudah ada di kedua editor.
 */

const TOOLBAR_BTN = {
  padding: '0.28rem 0.6rem',
  borderRadius: '7px',
  border: '1px solid #CBD5E1',
  background: '#FFFFFF',
  color: 'var(--color-text-dark)',
  fontSize: '0.78rem',
  lineHeight: 1.2,
  cursor: 'pointer',
};

export default function RichTextArea({
  name,
  value,
  onChange,
  placeholder,
  style,
  required = false,
  hint = true,
  variant = 'markdown', // 'markdown' = teks website | 'whatsapp' = pesan chat
}) {
  const isWa = variant === 'whatsapp';
  const ref = useRef(null);
  const text = value || '';

  // Terapkan perubahan lalu kembalikan posisi kursor/seleksi supaya klien bisa
  // langsung mengetik — tanpa ini kursor melompat ke akhir teks tiap klik.
  const emit = (nextValue, selStart, selEnd) => {
    onChange({ target: { name, value: nextValue, type: 'textarea' } });
    requestAnimationFrame(() => {
      const el = ref.current;
      if (!el) return;
      el.focus();
      el.setSelectionRange(selStart, selEnd);
    });
  };

  const wrapSelection = (marker, sampleText) => {
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart ?? text.length;
    const end = el.selectionEnd ?? text.length;
    const selected = text.slice(start, end) || sampleText;
    const next = text.slice(0, start) + marker + selected + marker + text.slice(end);
    emit(next, start + marker.length, start + marker.length + selected.length);
  };

  const insertParagraph = () => {
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart ?? text.length;
    const end = el.selectionEnd ?? text.length;
    const next = `${text.slice(0, start)}\n\n${text.slice(end)}`;
    emit(next, start + 2, start + 2);
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
        {/* WhatsApp memakai penanda yang BERBEDA dari teks website:
            *tebal*, _miring_, ~coret~ (bukan **tebal** ala markdown). Kalau
            disamakan, penandanya akan tampil mentah di chat pelanggan. */}
        <button
          type="button"
          style={{ ...TOOLBAR_BTN, fontWeight: 800 }}
          onClick={() => wrapSelection(isWa ? '*' : '**', 'teks tebal')}
          title="Tebalkan teks terpilih (atau sisipkan contoh)"
        >
          B
        </button>
        <button
          type="button"
          style={{ ...TOOLBAR_BTN, fontStyle: 'italic' }}
          onClick={() => wrapSelection(isWa ? '_' : '*', 'teks miring')}
          title="Miringkan teks terpilih (atau sisipkan contoh)"
        >
          I
        </button>
        {isWa ? (
          <button
            type="button"
            style={{ ...TOOLBAR_BTN, textDecoration: 'line-through' }}
            onClick={() => wrapSelection('~', 'teks dicoret')}
            title="Coret teks terpilih (khas WhatsApp)"
          >
            S
          </button>
        ) : null}
        <button
          type="button"
          style={TOOLBAR_BTN}
          onClick={insertParagraph}
          title={isWa ? 'Sisipkan baris kosong (jadi paragraf baru di chat)' : 'Sisipkan baris kosong = paragraf baru'}
        >
          ¶ {isWa ? 'Baris baru' : 'Paragraf baru'}
        </button>
      </div>

      <textarea
        ref={ref}
        name={name}
        value={text}
        onChange={onChange}
        placeholder={placeholder}
        className={styles.adminTextarea}
        style={style}
        required={required}
      />

      {hint && isWa ? (
        <p style={{ margin: '0.35rem 0 0', fontSize: '0.72rem', color: '#64748B', lineHeight: 1.5 }}>
          Teks ini yang otomatis terisi di chat WhatsApp pelanggan. Blok teks lalu klik
          <strong> B</strong> / <em>I</em> / <span style={{ textDecoration: 'line-through' }}>S</span>.
          Format WhatsApp: <code style={{ margin: '0 0.25rem' }}>*tebal*</code>,
          <code style={{ margin: '0 0.25rem' }}>_miring_</code>,
          <code style={{ margin: '0 0.25rem' }}>~coret~</code> (pakai SATU bintang, bukan dua).
          Tekan Enter untuk ganti baris — ikut terkirim ke chat.
        </p>
      ) : hint ? (
        <p style={{ margin: '0.35rem 0 0', fontSize: '0.72rem', color: '#64748B', lineHeight: 1.5 }}>
          Blok teks lalu klik <strong>B</strong> untuk menebalkan, <em>I</em> untuk memiringkan.
          Untuk <strong>tebal + miring sekaligus</strong>, blok teks lalu klik <strong>B</strong>
          kemudian <em>I</em>. Paragraf baru: tekan Enter <strong>dua kali</strong> (satu baris
          kosong). Ketik manual juga bisa:
          <code style={{ margin: '0 0.25rem' }}>**tebal**</code>,
          <code style={{ margin: '0 0.25rem' }}>*miring*</code>,
          <code style={{ margin: '0 0.25rem' }}>***tebal miring***</code>.
        </p>
      ) : null}
    </div>
  );
}
