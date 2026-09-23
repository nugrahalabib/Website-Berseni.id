'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/components/LanguageContext';
import { uploadImage, uploadIcon } from '@/lib/imageUpload';
import RichTextArea from '@/components/Admin/RichTextArea';
import { WA_MESSAGE_DEFAULTS } from '@/lib/whatsapp';
import SocialIcon, { SOCIAL_PRESETS, SOCIAL_PRESET_ORDER } from '@/components/SocialIcon';
import { buildDefaultFooterSocials } from '@/lib/footerSocials';
import styles from '@/styles/Admin.module.css';

// Pilihan posisi teks highlight (bagian cursive) pada judul dua-bagian.
// Dipakai di beberapa halaman; lihat komponen SplitTitle untuk perilakunya.
// Admin TIDAK perlu lagi mengetik spasi di akhir judul — pemisah dijamin.
// Turunkan { key: {id,en} } menjadi { key_id: '..', key_en: '..' } untuk form admin.
const DEFAULT_WA_MESSAGES = Object.fromEntries(
  Object.entries(WA_MESSAGE_DEFAULTS).flatMap(([key, val]) => [
    [`${key}_id`, val.id],
    [`${key}_en`, val.en],
  ])
);

const LAYOUT_OPTIONS = [
  { value: 'auto', label: 'Otomatis (1 kata = sebaris, kalimat = turun ke bawah)' },
  { value: 'inline', label: 'Selalu sebaris (menyambung di kanan)' },
  { value: 'block', label: 'Selalu baris baru (di bawah)' },
];

// Pengaturan carousel showcase beranda. Sebuah <select> yang tidak pernah
// disentuh admin hanya MENAMPILKAN defaultValue-nya — nilainya tidak ikut
// tersimpan. Tanpa penyemaian ini, admin yang memilih "Otomatis" lalu menyimpan
// akan menyimpan sumbernya saja, sementara filter & jumlah kartu tetap kosong di
// database: yang terlihat di panel tidak sama dengan yang tersimpan.
const CAROUSEL_DEFAULTS = {
  activitiesSource: 'manual',
  activitiesProductFilter: 'all',
  activitiesVisibleCount: '5',
};

// Component for uploading and editing media URLs / files
const MediaUploadInput = ({ label, name, value, type, onChange, showToast }) => {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadImage(file);
      onChange(name, url);
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Gagal mengunggah file.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ marginBottom: '1.25rem', border: '1px solid #E2E8F0', padding: '1rem', borderRadius: '12px', background: '#F8FAFC', width: '100%' }}>
      <label style={{ display: 'block', fontWeight: 'bold', fontSize: '0.85rem', color: 'var(--color-text-dark)', marginBottom: '0.5rem' }}>{label}</label>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {value ? (
          <div style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#E2E8F0', flexShrink: 0 }}>
            {type === 'video' ? (
              <video 
                src={value} 
                style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }} 
                muted 
                onClick={() => window.open(value, '_blank')}
                title="Klik untuk lihat video penuh (Preview)"
              />
            ) : (
              <img 
                src={value} 
                alt={label} 
                style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }} 
                onClick={() => window.open(value, '_blank')}
                title="Klik untuk lihat gambar penuh (Preview)"
              />
            )}
            <button
              type="button"
              style={{ position: 'absolute', top: '2px', right: '2px', background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', cursor: 'pointer', padding: 0 }}
              onClick={() => onChange(name, '')}
              title="Hapus Media"
            >
              ✕
            </button>
          </div>
        ) : (
          <div style={{ width: '80px', height: '80px', borderRadius: '8px', border: '2px dashed #CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8', fontSize: '0.75rem', textAlign: 'center', padding: '5px', flexShrink: 0 }}>
            No Media
          </div>
        )}
        <div style={{ flex: 1 }}>
          <input
            type="text"
            className={styles.adminInput}
            value={value || ''}
            onChange={(e) => onChange(name, e.target.value)}
            placeholder={`Masukkan URL ${type === 'video' ? 'video' : 'gambar'} atau unggah file...`}
            style={{ marginBottom: '0.5rem' }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <label className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', borderRadius: '8px', fontSize: '0.75rem', cursor: 'pointer', display: 'inline-block', margin: 0 }}>
              {uploading ? 'Mengunggah...' : `Unggah ${type === 'video' ? 'Video' : 'Gambar'}`}
              <input
                type="file"
                accept={type === 'video' ? 'video/*' : 'image/*'}
                style={{ display: 'none' }}
                onChange={handleFileChange}
                disabled={uploading}
              />
            </label>
            {value && (
              <a
                href={value}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
                style={{ padding: '0.35rem 0.75rem', borderRadius: '8px', fontSize: '0.75rem', textDecoration: 'none', color: 'var(--color-tosca)', borderColor: 'var(--color-tosca)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', height: 'auto', background: 'transparent' }}
              >
                📥 Unduh File Asli
              </a>
            )}
            <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Format: {type === 'video' ? 'MP4' : 'PNG, JPG, WEBP'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Default theme colors for reset fallbacks and placeholders
const defaultColors = {
  // Warna teks bawaan = warna yang MEMANG dipakai halaman sekarang
  text_home_hero_title: '#1E293B',
  text_home_hero_body: '#5A6B80',
  text_home_programs_title: '#1E293B',
  text_home_programs_body: '#64748B',
  text_home_gallery_title: '#1E293B',
  text_home_gallery_body: '#64748B',
  text_home_testimonials_title: '#1E293B',
  text_home_testimonials_body: '#5A6B80',
  text_home_blog_title: '#1E293B',
  text_home_blog_body: '#64748B',
  text_home_cta_title: '#FFFFFF',
  text_home_cta_body: '#FFFFFF',
  text_about_hero_title: '#1E293B',
  text_about_hero_body: '#5A6B80',
  text_about_story_title: '#1E293B',
  text_about_story_body: '#5A6B80',
  text_about_pillars_title: '#1E293B',
  text_about_pillars_body: '#64748B',
  text_about_stats_title: '#1E293B',
  text_about_stats_body: '#5A6B80',
  text_about_cta_title: '#FFFFFF',
  text_about_cta_body: '#FFFFFF',
  text_collab_hero_title: '#1E293B',
  text_collab_hero_body: '#64748B',
  text_collab_brand_title: '#1E293B',
  text_collab_brand_body: '#64748B',
  text_collab_venue_title: '#1E293B',
  text_collab_venue_body: '#5A6B80',
  text_store_header_title: '#1E293B',
  text_store_header_body: '#5A6B80',
  text_classes_header_title: '#1E293B',
  text_classes_header_body: '#5A6B80',
  text_blog_header_title: '#1E293B',
  text_blog_header_body: '#5A6B80',
  text_blog_about_title: '#1E293B',
  text_blog_about_body: '#64748B',
  bg_navbar: "#FAF5EB",
  bg_home_hero: "#FAF5EB",
  bg_home_partners: "#FFFFFF",
  bg_home_programs: "#0B132B",
  bg_home_gallery: "#FFFFFF",
  bg_home_testimonials: "#FAF5EB",
  bg_home_blog: "#FFFFFF",
  bg_home_cta: "#14789B",
  bg_about_hero: "#FAF5EB",
  bg_about_feature: "#FFFFFF",
  bg_about_empower: "#FAF5EB",
  bg_about_pillars: "#FFFFFF",
  bg_about_stats: "#0B132B",
  bg_about_cta: "#FAF5EB",
  bg_collab_hero: "#FAF5EB",
  bg_collab_brand: "#FFFFFF",
  bg_collab_venue: "#FAF5EB",
  bg_store_main: "#FAF5EB",
  bg_classes_main: "#FAF5EB",
  bg_blog_header: "#FAF5EB",
  bg_blog_content: "#FFFFFF",
  bg_blog_detail_main: "#FFFFFF",
  bg_blog_detail_cta: "#FAF5EB",

  // Footer. Nilainya = warna yang MEMANG dipakai footer sekarang, disalin dari
  // Components.module.css, supaya tombol DEFAULT di panel mengembalikan
  // tampilan aslinya dan bukan menebak.
  bg_footer: "#0B132B",
  text_footer_title: "#FAA433",
  text_footer_body: "#94A3B8",
  text_footer_brand: "#F8FAFC",
  footerAccentColor: "#14789B"
};

// Component for visual color picking with typed hex codes support
// Penggantian ikon per-slot.
//
// Dibuat terpisah dari MediaUploadInput karena kebutuhannya berbeda: ikon itu
// kecil, harus transparan, dan hasilnya sangat bergantung pada latar tempat ia
// dipasang. Ikon medsos duduk di footer navy gelap, ikon pilar di kartu krem
// terang — sebuah ikon hitam solid akan hilang di footer, dan admin tidak akan
// tahu sebelum situsnya dibuka. Karena itu pratinjaunya ditampilkan di KEDUA
// latar sekaligus.
//
// Kolom kosong = ikon bawaan situs. Itu sebabnya ada tombol "Pakai ikon bawaan":
// membatalkan pilihan tidak menuntut admin mencari lagi ikon aslinya.
const IconUploadInput = ({ label, hint, name, value, onChange, showToast }) => {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      // uploadIcon mengonversi apa pun yang dipilih (termasuk SVG) menjadi WebP
      // transparan berukuran wajar, jadi admin tidak perlu menyiapkan apa-apa.
      const url = await uploadIcon(file);
      onChange(name, url);
      showToast('Ikon berhasil diunggah & dikonversi otomatis.');
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Gagal mengunggah ikon.');
    } finally {
      setUploading(false);
      e.target.value = ''; // supaya memilih berkas yang SAMA lagi tetap memicu onChange
    }
  };

  const previewChip = (background, borderColor, caption) => (
    <div style={{ textAlign: 'center' }}>
      <div
        style={{
          width: '46px', height: '46px', borderRadius: '10px', background,
          border: `1px solid ${borderColor}`, display: 'flex', alignItems: 'center',
          justifyContent: 'center', overflow: 'hidden',
        }}
      >
        {value ? (
          <img src={value} alt="" style={{ width: '26px', height: '26px', objectFit: 'contain' }} />
        ) : (
          <span style={{ fontSize: '0.6rem', color: '#94A3B8' }}>bawaan</span>
        )}
      </div>
      <span style={{ fontSize: '0.6rem', color: '#94A3B8', display: 'block', marginTop: '2px' }}>{caption}</span>
    </div>
  );

  return (
    <div style={{ marginBottom: '1rem', border: '1px solid #E2E8F0', padding: '0.9rem 1rem', borderRadius: '12px', background: '#F8FAFC', width: '100%' }}>
      <label style={{ display: 'block', fontWeight: 'bold', fontSize: '0.82rem', color: 'var(--color-text-dark)', marginBottom: hint ? '0.15rem' : '0.6rem' }}>
        {label}
      </label>
      {hint && (
        <p style={{ fontSize: '0.72rem', color: '#64748B', margin: '0 0 0.6rem 0', lineHeight: 1.5 }}>{hint}</p>
      )}

      <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
          {previewChip('#FAF5EB', '#CBD5E1', 'terang')}
          {previewChip('#0B132B', '#0B132B', 'gelap')}
        </div>

        <div style={{ flex: 1, minWidth: '220px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <label className="btn btn-secondary" style={{ padding: '0.35rem 0.8rem', borderRadius: '8px', fontSize: '0.75rem', cursor: uploading ? 'wait' : 'pointer', display: 'inline-block', margin: 0 }}>
              {uploading ? 'Mengonversi & mengunggah...' : (value ? 'Ganti Ikon' : 'Unggah Ikon')}
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/avif,image/gif,image/svg+xml,.svg"
                style={{ display: 'none' }}
                onChange={handleFileChange}
                disabled={uploading}
              />
            </label>
            {value && (
              <button
                type="button"
                onClick={() => onChange(name, '')}
                style={{ padding: '0.35rem 0.8rem', borderRadius: '8px', fontSize: '0.75rem', cursor: 'pointer', border: '1px solid #CBD5E1', background: '#FFFFFF', color: '#64748B' }}
              >
                Pakai ikon bawaan
              </button>
            )}
          </div>
          <input
            type="text"
            className={styles.adminInput}
            value={value || ''}
            onChange={(e) => onChange(name, e.target.value)}
            placeholder="Kosong = memakai ikon bawaan situs"
            style={{ marginTop: '0.5rem', fontSize: '0.78rem' }}
          />
        </div>
      </div>
    </div>
  );
};

// Daftar tautan medsos di footer.
//
// Setiap entri disunting langsung di tempat — tidak ada mode "sunting" terpisah
// seperti editor aktivitas. Untuk daftar sependek ini, melihat semua isian
// sekaligus jauh lebih cepat daripada bolak-balik membuka satu per satu.
function FooterSocialsEditorSection({ form, setForm, showToast }) {
  const [mengunggahId, setMengunggahId] = useState(null);

  const daftar = Array.isArray(form.footerSocials) ? form.footerSocials : [];

  const ubahItem = (id, kunci, nilai) => {
    setForm((prev) => ({
      ...prev,
      footerSocials: (prev.footerSocials || []).map((it) =>
        it.id === id ? { ...it, [kunci]: nilai } : it
      ),
    }));
  };

  const tambah = () => {
    const baru = {
      id: `soc-${Date.now()}`,
      preset: 'custom',
      label_id: '',
      label_en: '',
      icon: '',
      link: '',
    };
    setForm((prev) => ({ ...prev, footerSocials: [...(prev.footerSocials || []), baru] }));
  };

  const hapus = (id) => {
    const it = daftar.find((x) => x.id === id);
    const nama = (it && (it.label_id || it.label_en)) || (it && SOCIAL_PRESETS[it.preset]?.label) || 'tautan ini';
    if (!confirm(`Hapus "${nama}" dari footer?`)) return;
    setForm((prev) => ({
      ...prev,
      footerSocials: (prev.footerSocials || []).filter((x) => x.id !== id),
    }));
  };

  const geser = (idx, arah) => {
    const next = [...daftar];
    const tujuan = arah === 'up' ? idx - 1 : idx + 1;
    if (tujuan < 0 || tujuan >= next.length) return;
    [next[idx], next[tujuan]] = [next[tujuan], next[idx]];
    setForm((prev) => ({ ...prev, footerSocials: next }));
  };

  const unggahIkon = async (id, e) => {
    const file = e.target.files[0];
    if (!file) return;
    setMengunggahId(id);
    try {
      const url = await uploadIcon(file);
      ubahItem(id, 'icon', url);
      showToast('Ikon berhasil diunggah & dikonversi otomatis.');
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Gagal mengunggah ikon.');
    } finally {
      setMengunggahId(null);
      e.target.value = '';
    }
  };

  // Keterangan kolom Link berbeda per platform: WhatsApp boleh dikosongkan
  // (ikut nomor global), Email cukup alamatnya saja.
  const petunjukLink = (preset) => {
    if (preset === 'whatsapp') return 'Kosongkan untuk memakai Nomor WhatsApp di pengaturan Footer di atas';
    if (preset === 'email') return 'Cukup alamatnya, mis. halo@berseni.id';
    return 'Alamat lengkap, mis. https://instagram.com/berseni.id';
  };

  return (
    <div style={{ marginTop: '1.5rem', borderTop: '1px dashed #E2E8F0', paddingTop: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <label className={styles.adminLabel} style={{ marginBottom: 0 }}>Tautan Media Sosial di Footer</label>
        <button type="button" className="btn btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', borderRadius: '8px' }} onClick={tambah}>
          + Tambah Tautan
        </button>
      </div>
      <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '0 0 1.25rem 0', lineHeight: 1.6 }}>
        Tambah, hapus, atau geser urutannya sesuka Anda. Tidak ingin menampilkan Instagram? Hapus saja barisnya.
        Ingin menambah platform yang belum ada di daftar pilihan, pilih <strong>Lainnya</strong>, unggah ikonnya, lalu isi label &amp; link-nya.
        Baris yang link-nya kosong tidak akan tampil di situs.
      </p>

      {daftar.length === 0 ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8', border: '1px dashed #CBD5E1', borderRadius: '12px' }}>
          Belum ada tautan medsos. Klik &quot;+ Tambah Tautan&quot; untuk menambahkan.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {daftar.map((item, idx) => (
            <div key={item.id} style={{ border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1rem', background: '#FFFFFF' }}>
              <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center', marginBottom: '0.85rem', flexWrap: 'wrap' }}>
                {/* Pratinjau di atas latar gelap — footer memang berlatar gelap */}
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#0B132B', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', flexShrink: 0, border: '1px solid #1E293B' }}>
                  {item.icon
                    ? <img src={item.icon} alt="" style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
                    : <SocialIcon preset={item.preset} size={20} />}
                </div>

                <div style={{ flex: 1, minWidth: '180px' }}>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 'bold', color: '#64748B', marginBottom: '0.25rem' }}>Platform</label>
                  <select
                    value={item.preset || 'custom'}
                    onChange={(e) => ubahItem(item.id, 'preset', e.target.value)}
                    className={styles.adminSelect}
                    style={{ width: '100%', padding: '0.5rem 0.7rem', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                  >
                    {SOCIAL_PRESET_ORDER.map((key) => (
                      <option key={key} value={key}>{SOCIAL_PRESETS[key].label}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '0.35rem', flexShrink: 0 }}>
                  <button type="button" onClick={() => geser(idx, 'up')} disabled={idx === 0} title="Naikkan" style={{ padding: '0.4rem 0.6rem', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FFFFFF', cursor: idx === 0 ? 'not-allowed' : 'pointer', opacity: idx === 0 ? 0.4 : 1 }}>↑</button>
                  <button type="button" onClick={() => geser(idx, 'down')} disabled={idx === daftar.length - 1} title="Turunkan" style={{ padding: '0.4rem 0.6rem', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FFFFFF', cursor: idx === daftar.length - 1 ? 'not-allowed' : 'pointer', opacity: idx === daftar.length - 1 ? 0.4 : 1 }}>↓</button>
                  <button type="button" onClick={() => hapus(item.id)} title="Hapus" style={{ padding: '0.4rem 0.7rem', borderRadius: '8px', border: '1px solid #FCA5A5', background: '#FEF2F2', color: '#B91C1C', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 'bold' }}>Hapus</button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 'bold', color: '#64748B', marginBottom: '0.25rem' }}>Keterangan (ID)</label>
                  <input type="text" className={styles.adminInput} value={item.label_id || ''} onChange={(e) => ubahItem(item.id, 'label_id', e.target.value)} placeholder="mis. Instagram" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 'bold', color: '#64748B', marginBottom: '0.25rem' }}>Keterangan (EN)</label>
                  <input type="text" className={styles.adminInput} value={item.label_en || ''} onChange={(e) => ubahItem(item.id, 'label_en', e.target.value)} placeholder="e.g. Instagram" />
                </div>
              </div>

              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 'bold', color: '#64748B', marginBottom: '0.25rem' }}>Link Tujuan</label>
                <input type="text" className={styles.adminInput} value={item.link || ''} onChange={(e) => ubahItem(item.id, 'link', e.target.value)} placeholder={petunjukLink(item.preset)} />
                <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>{petunjukLink(item.preset)}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <label className="btn btn-secondary" style={{ padding: '0.35rem 0.8rem', borderRadius: '8px', fontSize: '0.75rem', cursor: mengunggahId === item.id ? 'wait' : 'pointer', margin: 0 }}>
                  {mengunggahId === item.id ? 'Mengonversi & mengunggah...' : (item.icon ? 'Ganti Ikon' : 'Unggah Ikon Sendiri')}
                  <input type="file" accept="image/png,image/jpeg,image/webp,image/avif,image/gif,image/svg+xml,.svg" style={{ display: 'none' }} onChange={(e) => unggahIkon(item.id, e)} disabled={mengunggahId === item.id} />
                </label>
                {item.icon && (
                  <button type="button" onClick={() => ubahItem(item.id, 'icon', '')} style={{ padding: '0.35rem 0.8rem', borderRadius: '8px', fontSize: '0.75rem', border: '1px solid #CBD5E1', background: '#FFFFFF', color: '#64748B', cursor: 'pointer' }}>
                    Pakai ikon bawaan
                  </button>
                )}
                <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>
                  {item.preset === 'custom' && !item.icon
                    ? 'Platform "Lainnya" wajib punya ikon sendiri.'
                    : 'Kosong = ikon bawaan platform.'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const ColorPickerInput = ({ label, name, value, onChange }) => {
  const defaultVal = defaultColors[name] || '#ffffff';

  // Helper to convert any custom input to standard 7-character lowercase hex required by HTML5 color picker
  const getPickerHexValue = (val) => {
    const rawVal = val || defaultVal;
    let cleaned = rawVal.trim().toLowerCase();
    if (!cleaned.startsWith('#')) return '#ffffff';
    
    let hex = cleaned.substring(1);
    // Expand shorthand (e.g. #fff -> #ffffff)
    if (hex.length === 3 || hex.length === 4) {
      hex = hex.split('').slice(0, 3).map(char => char + char).join('');
    }
    if (hex.length === 6) {
      return '#' + hex;
    }
    if (hex.length === 8) {
      // Ignore alpha channel for the browser color picker
      return '#' + hex.substring(0, 6);
    }
    return '#ffffff';
  };

  const hexValue = getPickerHexValue(value);

  return (
    <div style={{ marginBottom: '1.25rem', border: '1px solid #E2E8F0', padding: '1rem', borderRadius: '12px', background: '#F8FAFC', width: '100%' }}>
      <label style={{ display: 'block', fontWeight: 'bold', fontSize: '0.85rem', color: 'var(--color-text-dark)', marginBottom: '0.5rem' }}>{label}</label>
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        <input
          type="color"
          value={hexValue}
          onChange={(e) => onChange(name, e.target.value)}
          style={{
            border: '1px solid #CBD5E1',
            borderRadius: '8px',
            width: '46px',
            height: '42px',
            padding: '2px',
            cursor: 'pointer',
            backgroundColor: '#FFFFFF',
            flexShrink: 0
          }}
        />
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(name, e.target.value)}
          placeholder={`Default: ${defaultVal}`}
          className={styles.adminInput}
          style={{ margin: 0, flex: 1 }}
        />
        <button
          type="button"
          className="btn btn-outline"
          style={{ padding: '0.5rem 0.75rem', fontSize: '0.75rem', borderRadius: '8px', flexShrink: 0, height: '42px', display: 'flex', alignItems: 'center', background: 'transparent' }}
          onClick={() => onChange(name, defaultVal)}
        >
          Default
        </button>
      </div>
      <span style={{ fontSize: '0.7rem', color: '#64748B', display: 'block', marginTop: '0.25rem' }}>
        Geser kotak warna di kiri, atau ketik kode HEX/RGB/RGBA secara manual.
      </span>
    </div>
  );
};


// Editor daftar Misi (bilingual). Di-hoist ke module scope agar identitas komponen
// stabil antar-render induk — mencegah remount yang membuat input kehilangan fokus.
function MisiListSection({ misiListId, misiListEn, onMisiChange, onRemoveMisi, onAddMisi }) {
  const [newMisiId, setNewMisiId] = useState('');
  const [newMisiEn, setNewMisiEn] = useState('');

  const currentMisiId = misiListId || [];
  const currentMisiEn = misiListEn || [];

  return (
    <div style={{ marginTop: '1rem', borderTop: '1px dashed #E2E8F0', paddingTop: '1rem' }}>
      <label className={styles.adminLabel} style={{ marginBottom: '1rem' }}>Daftar Misi Komunitas (Bilingual)</label>

      {currentMisiId.map((misi, index) => (
        <div key={index} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 42px', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <input
            type="text"
            className={styles.adminInput}
            value={misi}
            onChange={(e) => onMisiChange(index, 'id', e.target.value)}
            placeholder={`Misi ${index + 1} (Indonesian)`}
            required
          />
          <input
            type="text"
            className={styles.adminInput}
            value={currentMisiEn[index] || ''}
            onChange={(e) => onMisiChange(index, 'en', e.target.value)}
            placeholder={`Mission ${index + 1} (English)`}
            required
          />
          <button
            type="button"
            className={styles.misiRemoveBtn}
            onClick={() => onRemoveMisi(index)}
            title="Hapus misi ini"
          >
            ✕
          </button>
        </div>
      ))}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '0.5rem', marginTop: '1rem' }}>
        <input
          type="text"
          className={styles.adminInput}
          value={newMisiId}
          onChange={(e) => setNewMisiId(e.target.value)}
          placeholder="Tambah Misi Baru (ID)..."
        />
        <input
          type="text"
          className={styles.adminInput}
          value={newMisiEn}
          onChange={(e) => setNewMisiEn(e.target.value)}
          placeholder="Add New Mission (EN)..."
        />
        <button
          type="button"
          className="btn btn-secondary"
          style={{ padding: '0 1.5rem', borderRadius: '10px', height: '100%', whiteSpace: 'nowrap' }}
          onClick={() => onAddMisi(newMisiId, newMisiEn, () => { setNewMisiId(''); setNewMisiEn(''); })}
        >
          + Tambah
        </button>
      </div>
    </div>
  );
}

// Helper Custom Activities Carousel Editor (hoisted ke module scope agar tidak remount)
function ActivitiesEditorSection({ form, setForm, showToast }) {
    const [editingIndex, setEditingIndex] = useState(null); // index or 'new'
    const [actForm, setActForm] = useState({
      id: '',
      title_id: '',
      title_en: '',
      category: 'workshop',
      image: '',
      summary_id: '',
      summary_en: '',
      description_id: '',
      description_en: '',
      details_id: '',
      details_en: '',
      link: ''
    });

    const activities = form.activities || [];

    const handleEdit = (idx) => {
      setEditingIndex(idx);
      setActForm({
        id: activities[idx].id || `act-${Date.now()}`,
        title_id: activities[idx].title_id || '',
        title_en: activities[idx].title_en || '',
        category: activities[idx].category || 'workshop',
        image: activities[idx].image || '',
        summary_id: activities[idx].summary_id || '',
        summary_en: activities[idx].summary_en || '',
        description_id: activities[idx].description_id || '',
        description_en: activities[idx].description_en || '',
        details_id: activities[idx].details_id || '',
        details_en: activities[idx].details_en || '',
        link: activities[idx].link || 'https://lynk.id/berseni.id'
      });
    };

    const handleAddNew = () => {
      setEditingIndex('new');
      setActForm({
        id: `act-${Date.now()}`,
        title_id: '',
        title_en: '',
        category: 'workshop',
        image: '',
        summary_id: '',
        summary_en: '',
        description_id: '',
        description_en: '',
        details_id: '',
        details_en: '',
        link: 'https://lynk.id/berseni.id'
      });
    };

    const handleDelete = (idx) => {
      if (confirm('Apakah Anda yakin ingin menghapus aktivitas ini?')) {
        const updated = activities.filter((_, i) => i !== idx);
        setForm(prev => ({ ...prev, activities: updated }));
      }
    };

    const handleSave = () => {
      if (!actForm.title_id || !actForm.title_en) {
        showToast('Judul Aktivitas (ID & EN) wajib diisi keduanya!');
        return;
      }
      
      let updated = [...activities];
      if (editingIndex === 'new') {
        updated.push(actForm);
      } else {
        updated[editingIndex] = actForm;
      }
      
      setForm(prev => ({ ...prev, activities: updated }));
      setEditingIndex(null);
    };

    const handleActFormChange = (e) => {
      const { name, value } = e.target;
      setActForm(prev => ({ ...prev, [name]: value }));
    };

    const handleActImageUpload = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      try {
        const url = await uploadImage(file);
        setActForm(prev => ({ ...prev, image: url }));
      } catch (err) {
        console.error(err);
        showToast(err.message || 'Gagal mengunggah gambar.');
      }
    };

    if (editingIndex !== null) {
      return (
        <div style={{ background: '#F8FAFC', padding: '1.5rem', borderRadius: '12px', border: '1px solid #E2E8F0', marginTop: '1rem' }}>
          <h4 style={{ fontWeight: 'bold', marginBottom: '1.25rem', color: 'var(--color-tosca)', fontSize: '1rem' }}>
            {editingIndex === 'new' ? 'Tambah Aktivitas Baru' : 'Sunting Aktivitas'}
          </h4>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label className={styles.adminLabel}>Judul Aktivitas (ID)</label>
              <input
                type="text"
                name="title_id"
                value={actForm.title_id}
                onChange={handleActFormChange}
                className={styles.adminInput}
                required
              />
            </div>
            <div>
              <label className={styles.adminLabel}>Judul Aktivitas (EN)</label>
              <input
                type="text"
                name="title_en"
                value={actForm.title_en}
                onChange={handleActFormChange}
                className={styles.adminInput}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label className={styles.adminLabel}>Kategori</label>
              <select
                name="category"
                value={actForm.category}
                onChange={handleActFormChange}
                className={styles.adminSelect}
              >
                <option value="workshop">Workshop</option>
                <option value="exhibition">Exhibition</option>
                <option value="social">Kegiatan Komunitas</option>
              </select>
            </div>
            <div>
              <label className={styles.adminLabel}>Link URL Detail / Lynk.id</label>
              <input
                type="text"
                name="link"
                value={actForm.link}
                onChange={handleActFormChange}
                className={styles.adminInput}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label className={styles.adminLabel}>Gambar Aktivitas</label>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              {actForm.image ? (
                <img 
                  src={actForm.image} 
                  alt="Preview" 
                  style={{ width: '80px', height: '80px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #CBD5E1', cursor: 'pointer' }} 
                  onClick={() => window.open(actForm.image, '_blank')}
                  title="Klik untuk lihat gambar penuh (Preview)"
                />
              ) : (
                <div style={{ width: '80px', height: '80px', borderRadius: '8px', border: '2px dashed #CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8', fontSize: '0.75rem', textAlign: 'center' }}>No Image</div>
              )}
              <div style={{ flex: 1 }}>
                <input
                  type="text"
                  name="image"
                  value={actForm.image}
                  onChange={handleActFormChange}
                  className={styles.adminInput}
                  placeholder="URL gambar..."
                  style={{ marginBottom: '0.5rem' }}
                />
                <label className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', borderRadius: '8px', fontSize: '0.75rem', cursor: 'pointer', display: 'inline-block', margin: 0 }}>
                  Unggah Gambar
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleActImageUpload}
                  />
                </label>
                {actForm.image && (
                  <a
                    href={actForm.image}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline"
                    style={{ padding: '0.35rem 0.75rem', borderRadius: '8px', fontSize: '0.75rem', textDecoration: 'none', color: 'var(--color-tosca)', borderColor: 'var(--color-tosca)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', height: 'auto', background: 'transparent', marginLeft: '0.5rem' }}
                  >
                    📥 Unduh Gambar Asli
                  </a>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label className={styles.adminLabel}>Ringkasan Singkat (ID)</label>
              <input
                type="text"
                name="summary_id"
                value={actForm.summary_id}
                onChange={handleActFormChange}
                className={styles.adminInput}
              />
            </div>
            <div>
              <label className={styles.adminLabel}>Ringkasan Singkat (EN)</label>
              <input
                type="text"
                name="summary_en"
                value={actForm.summary_en}
                onChange={handleActFormChange}
                className={styles.adminInput}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label className={styles.adminLabel}>Deskripsi Lengkap (ID)</label>
              <textarea
                name="description_id"
                value={actForm.description_id}
                onChange={handleActFormChange}
                className={styles.adminTextarea}
                rows={3}
              />
            </div>
            <div>
              <label className={styles.adminLabel}>Deskripsi Lengkap (EN)</label>
              <textarea
                name="description_en"
                value={actForm.description_en}
                onChange={handleActFormChange}
                className={styles.adminTextarea}
                rows={3}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label className={styles.adminLabel}>Detail Aktivitas (ID)</label>
              <input
                type="text"
                name="details_id"
                value={actForm.details_id}
                onChange={handleActFormChange}
                className={styles.adminInput}
                placeholder="misal: Durasi: 3 Jam | Lokasi: Ubud"
              />
            </div>
            <div>
              <label className={styles.adminLabel}>Detail Aktivitas (EN)</label>
              <input
                type="text"
                name="details_en"
                value={actForm.details_en}
                onChange={handleActFormChange}
                className={styles.adminInput}
                placeholder="e.g. Duration: 3 Hours | Location: Ubud"
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-outline" style={{ padding: '0.5rem 1.5rem' }} onClick={() => setEditingIndex(null)}>
              Batal
            </button>
            <button type="button" className="btn btn-primary" style={{ padding: '0.5rem 1.5rem' }} onClick={handleSave}>
              Simpan Aktivitas
            </button>
          </div>
        </div>
      );
    }

    // Daftar di bawah ini hanya berpengaruh pada sebagian pilihan sumber:
    //
    //   manual   -> dipakai sendirian          (aktif)
    //   mixed    -> dipakai BERSAMA katalog    (aktif — sengaja tidak dikunci)
    //   products -> tidak dipakai sama sekali  (dikunci)
    //
    // Saat dikunci, daftarnya tidak cukup diberi keterangan: ia harus TERLIHAT
    // mati. Tanpa itu admin tetap menyunting daftar yang tidak berpengaruh apa
    // pun, lalu bingung kenapa situsnya tidak berubah.
    const sumberCarousel = form.activitiesSource || 'manual';
    const terkunci = sumberCarousel === 'products';
    const digabung = sumberCarousel === 'mixed';

    return (
      <div style={{ marginTop: '1rem' }}>
        {terkunci && (
          <div style={{ padding: '1rem 1.25rem', marginBottom: '1.25rem', borderRadius: '12px', background: '#FFFBEB', border: '1px solid #FCD34D', color: '#78350F', fontSize: '0.88rem', lineHeight: 1.6 }}>
            <strong>🔒 Daftar di bawah sedang TIDAK DIPAKAI.</strong>
            <br />
            Sumber carousel disetel ke <strong>&quot;Hanya Katalog Produk&quot;</strong>, jadi kartu di beranda diambil dari tab <strong>Katalog Produk</strong> — bukan dari daftar ini. Isinya <strong>tetap tersimpan aman</strong>, hanya tidak bisa disunting dan tidak ditampilkan selama pilihan di atas belum diubah.
            <br />
            <span style={{ display: 'inline-block', marginTop: '0.5rem' }}>
              Ingin memakainya lagi? Pilih <strong>&quot;Hanya aktivitas manual&quot;</strong> — atau <strong>&quot;Gabungan&quot;</strong> kalau ingin daftar ini tampil berdampingan dengan katalog.
            </span>
          </div>
        )}

        {digabung && (
          <div style={{ padding: '0.9rem 1.25rem', marginBottom: '1.25rem', borderRadius: '12px', background: '#ECFDF5', border: '1px solid #6EE7B7', color: '#065F46', fontSize: '0.88rem', lineHeight: 1.6 }}>
            <strong>⚡ Mode Gabungan aktif.</strong> Daftar di bawah ini <strong>tetap tampil</strong> di beranda, berdampingan dengan seluruh isi Katalog Produk.
          </div>
        )}

        {/* `inert` mematikan klik DAN fokus keyboard untuk seluruh isinya — lebih
            tepat daripada sekadar pointer-events:none, yang masih bisa di-Tab. */}
        <div
          inert={terkunci ? true : undefined}
          aria-disabled={terkunci || undefined}
          style={terkunci ? { opacity: 0.4, filter: 'grayscale(1)', userSelect: 'none' } : undefined}
        >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <label className={styles.adminLabel} style={{ marginBottom: 0 }}>Daftar Aktivitas Carousel</label>
          <button type="button" className="btn btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', borderRadius: '8px' }} onClick={handleAddNew}>
            + Tambah Aktivitas
          </button>
        </div>

        {activities.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8', border: '1px dashed #CBD5E1', borderRadius: '12px' }}>
            Belum ada aktivitas. Silakan klik tombol "+ Tambah Aktivitas" untuk menambahkan.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {activities.map((act, idx) => (
              <div key={act.id || idx} style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '0.75rem', border: '1px solid #E2E8F0', borderRadius: '10px', background: '#FFFFFF' }}>
                <div style={{ position: 'relative', display: 'inline-block', flexShrink: 0 }}>
                  <img 
                    src={act.image || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=150'} 
                    alt="" 
                    style={{ width: '50px', height: '50px', borderRadius: '6px', objectFit: 'cover', cursor: 'pointer', display: 'block' }} 
                    onClick={() => window.open(act.image || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=150', '_blank')}
                    title="Klik untuk lihat gambar penuh (Preview)"
                  />
                  {act.image && (
                    <a
                      href={act.image}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        position: 'absolute',
                        bottom: '2px',
                        right: '2px',
                        background: 'rgba(20, 120, 155, 0.85)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3px',
                        width: '16px',
                        height: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '9px',
                        cursor: 'pointer',
                        textDecoration: 'none'
                      }}
                      title="Unduh Gambar"
                      onClick={(e) => e.stopPropagation()}
                    >
                      📥
                    </a>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{act.title_id || 'Tanpa Judul'}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', textTransform: 'capitalize' }}>
                    Kategori: {act.category} | Detail: {act.details_id || '-'}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button type="button" className="btn btn-outline" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem', borderRadius: '6px' }} onClick={() => handleEdit(idx)}>
                    Sunting
                  </button>
                  <button type="button" className="btn btn-outline" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem', borderRadius: '6px', color: '#EF4444', borderColor: '#FCA5A5' }} onClick={() => handleDelete(idx)}>
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      </div>
    );
}

// Helper Custom Partners List Editor (hoisted ke module scope agar tidak remount)
function PartnersEditorSection({ form, setForm, showToast }) {
    const [newLogoUrl, setNewLogoUrl] = useState('');
    const [uploading, setUploading] = useState(false);

    const partners = form.partners || [];

    const handleFileUpload = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      setUploading(true);
      try {
        const url = await uploadImage(file);
        // Add to partners list immediately
        setForm(prev => ({
          ...prev,
          partners: [...(prev.partners || []), url]
        }));
      } catch (err) {
        console.error(err);
        showToast(err.message || 'Gagal mengunggah gambar.');
      } finally {
        setUploading(false);
      }
    };

    const handleAddUrl = () => {
      if (!newLogoUrl.trim()) return;
      setForm(prev => ({
        ...prev,
        partners: [...(prev.partners || []), newLogoUrl.trim()]
      }));
      setNewLogoUrl('');
    };

    const handleDelete = (idx) => {
      if (confirm('Apakah Anda yakin ingin menghapus logo partner ini?')) {
        const updated = partners.filter((_, i) => i !== idx);
        setForm(prev => ({ ...prev, partners: updated }));
      }
    };

    const moveItem = (idx, direction) => {
      const updated = [...partners];
      if (direction === 'up' && idx > 0) {
        const temp = updated[idx];
        updated[idx] = updated[idx - 1];
        updated[idx - 1] = temp;
      } else if (direction === 'down' && idx < updated.length - 1) {
        const temp = updated[idx];
        updated[idx] = updated[idx + 1];
        updated[idx + 1] = temp;
      }
      setForm(prev => ({ ...prev, partners: updated }));
    };

    return (
      <div style={{ marginTop: '1rem', borderTop: '1px dashed #E2E8F0', paddingTop: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <label className={styles.adminLabel} style={{ marginBottom: 0 }}>Daftar Logo Partner (Dipercaya Oleh)</label>
        </div>
        
        {/* Tambah Partner Baru */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', background: '#F8FAFC', padding: '1rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
          <div style={{ flex: 1, minWidth: '150px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#64748B' }}>Unggah File Logo Baru</label>
            <label className="btn btn-secondary" style={{ display: 'inline-block', padding: '0.4rem 1rem', cursor: 'pointer', margin: 0, fontSize: '0.8rem', borderRadius: '8px' }}>
              {uploading ? 'Mengunggah...' : 'Pilih File Gambar'}
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileUpload} disabled={uploading} />
            </label>
          </div>
          <div style={{ flex: 2, minWidth: '220px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#64748B' }}>Atau Masukkan URL Gambar</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                className={styles.adminInput}
                value={newLogoUrl}
                onChange={(e) => setNewLogoUrl(e.target.value)}
                placeholder="https://example.com/logo.png"
                style={{ margin: 0, height: '36px', fontSize: '0.85rem' }}
              />
              <button type="button" className="btn btn-primary" onClick={handleAddUrl} style={{ padding: '0.4rem 1.25rem', backgroundColor: 'var(--color-tosca)', color: 'white', borderRadius: '8px', fontSize: '0.8rem', height: '36px' }}>Tambah</button>
            </div>
          </div>
        </div>

        {/* List of Partners */}
        {partners.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8', border: '1px dashed #CBD5E1', borderRadius: '12px' }}>
            Belum ada logo partner yang ditambahkan. Silakan unggah di atas.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
            {partners.map((url, idx) => (
              <div key={idx} style={{ border: '1px solid #E2E8F0', borderRadius: '10px', padding: '0.75rem', background: '#FFFFFF', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                <span style={{ position: 'absolute', top: '5px', left: '10px', fontSize: '0.7rem', fontWeight: 'bold', color: '#94A3B8' }}>#{idx + 1}</span>
                
                {/* Logo Image Preview */}
                <div style={{ width: '100%', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC', borderRadius: '6px', border: '1px solid #E2E8F0', padding: '4px', cursor: 'pointer', marginBottom: '0.75rem', overflow: 'hidden' }} onClick={() => window.open(url, '_blank')} title="Klik untuk preview ukuran penuh">
                  <img src={url} alt={`Partner ${idx + 1}`} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.25rem', width: '100%', justifyContent: 'center', marginBottom: '0.5rem' }}>
                  <button type="button" className="btn btn-outline" style={{ padding: '2px 6px', fontSize: '0.7rem', height: 'auto', background: 'transparent' }} onClick={() => moveItem(idx, 'up')} disabled={idx === 0} title="Geser Kiri">←</button>
                  <button type="button" className="btn btn-outline" style={{ padding: '2px 6px', fontSize: '0.7rem', height: 'auto', background: 'transparent' }} onClick={() => moveItem(idx, 'down')} disabled={idx === partners.length - 1} title="Geser Kanan">→</button>
                </div>
                
                <div style={{ display: 'flex', gap: '0.25rem', width: '100%', justifyContent: 'center' }}>
                  <a href={url} download target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ padding: '3px 6px', fontSize: '0.65rem', textDecoration: 'none', color: 'var(--color-tosca)', borderColor: 'var(--color-tosca)', display: 'inline-flex', alignItems: 'center', height: 'auto', background: 'transparent' }} title="Unduh gambar asli">
                    📥
                  </a>
                  <button type="button" className="btn btn-outline" style={{ padding: '3px 6px', fontSize: '0.65rem', color: '#EF4444', borderColor: '#FCA5A5', height: 'auto', background: 'transparent' }} onClick={() => handleDelete(idx)} title="Hapus Partner">
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
}

// Helper Custom Testimonials Editor (hoisted ke module scope agar tidak remount)
function TestimonialsEditorSection({ form, setForm, showToast }) {
    const [editingIndex, setEditingIndex] = useState(null); // index or 'new'
     const [testiForm, setTestiForm] = useState({
       id: '',
       name: '',
       avatar: '',
       rating: 5,
       comment_id: '',
       comment_en: '',
       borderColor: 'var(--color-tosca)',
       videoThumbnail: '',
       videoLink: ''
     });
 
     const testimonials = form.testimonials || [];
 
     const handleEdit = (idx) => {
       setEditingIndex(idx);
       setTestiForm({
         id: testimonials[idx].id || `testi-${Date.now()}`,
         name: testimonials[idx].name || '',
         avatar: testimonials[idx].avatar || '',
         rating: testimonials[idx].rating || 5,
         comment_id: testimonials[idx].comment_id || '',
         comment_en: testimonials[idx].comment_en || '',
         borderColor: testimonials[idx].borderColor || 'var(--color-tosca)',
         videoThumbnail: testimonials[idx].videoThumbnail || '',
         videoLink: testimonials[idx].videoLink || ''
       });
     };
 
     const handleAddNew = () => {
       setEditingIndex('new');
       setTestiForm({
         id: `testi-${Date.now()}`,
         name: '',
         avatar: '',
         rating: 5,
         comment_id: '',
         comment_en: '',
         borderColor: 'var(--color-tosca)',
         videoThumbnail: '',
         videoLink: ''
       });
     };

    const handleDelete = (idx) => {
      if (confirm('Apakah Anda yakin ingin menghapus testimonial ini?')) {
        const updated = testimonials.filter((_, i) => i !== idx);
        setForm(prev => ({ ...prev, testimonials: updated }));
      }
    };

    const handleSave = () => {
      if (!testiForm.name || !testiForm.comment_id || !testiForm.comment_en) {
        showToast('Nama reviewer dan isi komentar (ID & EN) wajib diisi!');
        return;
      }
      
      let updated = [...testimonials];
      if (editingIndex === 'new') {
        updated.push(testiForm);
      } else {
        updated[editingIndex] = testiForm;
      }
      
      setForm(prev => ({ ...prev, testimonials: updated }));
      setEditingIndex(null);
    };

    const handleFormChange = (e) => {
      const { name, value } = e.target;
      setTestiForm(prev => ({ ...prev, [name]: name === 'rating' ? parseInt(value) : value }));
    };

    const handleAvatarUpload = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      try {
        const url = await uploadImage(file);
        setTestiForm(prev => ({ ...prev, avatar: url }));
      } catch (err) {
        console.error(err);
        showToast(err.message || 'Gagal mengunggah avatar.');
      }
    };

    return (
      <div style={{ marginTop: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <label className={styles.adminLabel} style={{ marginBottom: 0 }}>Daftar Testimonial (reviews)</label>
          <button type="button" className="btn btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', borderRadius: '8px' }} onClick={handleAddNew}>
            + Tambah Testimonial
          </button>
        </div>

        {editingIndex !== null && (
          <div style={{ background: '#F8FAFC', padding: '1.5rem', borderRadius: '12px', border: '1px solid #E2E8F0', marginTop: '1rem', marginBottom: '1.5rem' }}>
            <h4 style={{ fontWeight: 'bold', marginBottom: '1.25rem', color: 'var(--color-tosca)', fontSize: '1rem' }}>
              {editingIndex === 'new' ? 'Tambah Testimonial Baru' : 'Sunting Testimonial'}
            </h4>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label className={styles.adminLabel}>Nama Reviewer</label>
                <input
                  type="text"
                  name="name"
                  value={testiForm.name}
                  onChange={handleFormChange}
                  className={styles.adminInput}
                  required
                />
              </div>
              <div>
                <label className={styles.adminLabel}>Rating (Bintang)</label>
                <select
                  name="rating"
                  value={testiForm.rating}
                  onChange={handleFormChange}
                  className={styles.adminSelect}
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5 Bintang)</option>
                  <option value={4}>⭐⭐⭐⭐ (4 Bintang)</option>
                  <option value={3}>⭐⭐⭐ (3 Bintang)</option>
                  <option value={2}>⭐⭐ (2 Bintang)</option>
                  <option value={1}>⭐ (1 Bintang)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label className={styles.adminLabel}>Warna Border Card</label>
                <select
                  name="borderColor"
                  value={testiForm.borderColor}
                  onChange={handleFormChange}
                  className={styles.adminSelect}
                >
                  <option value="var(--color-tosca)">Tosca (Hijau Tosca)</option>
                  <option value="var(--color-maroon)">Maroon (Merah Maroon)</option>
                  <option value="var(--color-kunyit)">Kunyit (Kuning Kunyit)</option>
                </select>
              </div>
              <div>
                {/* Spacer */}
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label className={styles.adminLabel}>Foto Avatar Reviewer</label>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                {testiForm.avatar ? (
                  <img 
                    src={testiForm.avatar} 
                    alt="Preview" 
                    style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #CBD5E1', cursor: 'pointer' }} 
                    onClick={() => window.open(testiForm.avatar, '_blank')}
                    title="Klik untuk lihat gambar penuh (Preview)"
                  />
                ) : (
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', border: '2px dashed #CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8', fontSize: '0.75rem', textAlign: 'center' }}>No Avatar</div>
                )}
                <div style={{ flex: 1 }}>
                  <input
                    type="text"
                    name="avatar"
                    value={testiForm.avatar}
                    onChange={handleFormChange}
                    className={styles.adminInput}
                    placeholder="URL avatar gambar..."
                    style={{ marginBottom: '0.5rem' }}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <label className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', borderRadius: '8px', fontSize: '0.75rem', cursor: 'pointer', display: 'inline-block', margin: 0 }}>
                      Unggah Foto Avatar
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleAvatarUpload}
                      />
                    </label>
                    {testiForm.avatar && (
                      <a
                        href={testiForm.avatar}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline"
                        style={{ padding: '0.35rem 0.75rem', borderRadius: '8px', fontSize: '0.75rem', textDecoration: 'none', color: 'var(--color-tosca)', borderColor: 'var(--color-tosca)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', height: 'auto', background: 'transparent' }}
                      >
                        📥 Unduh Foto
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label className={styles.adminLabel}>Isi Ulasan / Komentar (ID)</label>
                <textarea
                  name="comment_id"
                  value={testiForm.comment_id}
                  onChange={handleFormChange}
                  className={styles.adminTextarea}
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className={styles.adminLabel}>Isi Ulasan / Komentar (EN)</label>
                <textarea
                  name="comment_en"
                  value={testiForm.comment_en}
                  onChange={handleFormChange}
                  className={styles.adminTextarea}
                  rows={3}
                  required
                />
              </div>
            </div>

            {/* Video Review config cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem', borderTop: '1px dashed #E2E8F0', paddingTop: '1.25rem' }}>
              <div>
                <label className={styles.adminLabel}>URL Thumbnail Video Review (Gambar Preview - Opsional)</label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  {testiForm.videoThumbnail && (
                    <img 
                      src={testiForm.videoThumbnail} 
                      alt="Thumbnail Preview" 
                      style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover', border: '1px solid #CBD5E1', cursor: 'pointer' }}
                      onClick={() => window.open(testiForm.videoThumbnail, '_blank')}
                      title="Klik untuk lihat gambar penuh"
                    />
                  )}
                  <input
                    type="text"
                    name="videoThumbnail"
                    value={testiForm.videoThumbnail || ''}
                    onChange={handleFormChange}
                    placeholder="Masukkan URL gambar atau unggah file..."
                    className={styles.adminInput}
                    style={{ flex: 1, margin: 0 }}
                  />
                </div>
                <div style={{ marginTop: '0.5rem' }}>
                  <label className="btn btn-secondary" style={{ padding: '0.3rem 0.65rem', borderRadius: '6px', fontSize: '0.7rem', cursor: 'pointer', display: 'inline-block', margin: 0 }}>
                    Unggah Gambar Thumbnail
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        try {
                          const url = await uploadImage(file);
                          setTestiForm(prev => ({ ...prev, videoThumbnail: url }));
                        } catch (err) {
                          showToast(err.message || 'Gagal mengunggah thumbnail.');
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
              <div>
                <label className={styles.adminLabel}>Tautan Video Review (YouTube, TikTok, dll - Opsional)</label>
                <input
                  type="text"
                  name="videoLink"
                  value={testiForm.videoLink || ''}
                  onChange={handleFormChange}
                  placeholder="e.g. https://www.youtube.com/watch?v=..."
                  className={styles.adminInput}
                />
                <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block', marginTop: '0.35rem' }}>
                  Jika diisi, ulasan ini akan menampilkan card preview video interaktif di bagian paling atas.
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-outline" style={{ padding: '0.5rem 1.5rem' }} onClick={() => setEditingIndex(null)}>
                Batal
              </button>
              <button type="button" className="btn btn-primary" style={{ padding: '0.5rem 1.5rem' }} onClick={handleSave}>
                Simpan Testimonial
              </button>
            </div>
          </div>
        )}

        {testimonials.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8', border: '1px dashed #CBD5E1', borderRadius: '12px' }}>
            Belum ada testimonial. Silakan klik tombol "+ Tambah Testimonial" untuk menambahkan.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {testimonials.map((testi, idx) => (
              <div key={testi.id || idx} style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '0.75rem', border: '1px solid #E2E8F0', borderRadius: '10px', background: '#FFFFFF' }}>
                <div style={{ position: 'relative', display: 'inline-block', flexShrink: 0 }}>
                  <img 
                    src={testi.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150'} 
                    alt="" 
                    style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', cursor: 'pointer', display: 'block' }} 
                    onClick={() => window.open(testi.avatar, '_blank')}
                    title="Klik untuk lihat gambar penuh (Preview)"
                  />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <strong style={{ fontSize: '0.9rem', color: '#1E293B' }}>{testi.name}</strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-kunyit)' }}>
                      {'⭐'.repeat(testi.rating || 5)}
                    </span>
                    <span 
                      style={{ 
                        display: 'inline-block', 
                        width: '10px', 
                        height: '10px', 
                        borderRadius: '50%', 
                        backgroundColor: testi.borderColor === 'var(--color-tosca)' ? 'var(--color-tosca)' : testi.borderColor === 'var(--color-maroon)' ? 'var(--color-maroon)' : 'var(--color-kunyit)' 
                      }} 
                      title={`Border: ${testi.borderColor}`}
                    />
                    {testi.videoLink && (
                      <span style={{ fontSize: '0.65rem', padding: '1px 5px', borderRadius: '4px', background: '#E0F2FE', color: '#0369A1', fontWeight: 'bold' }}>
                        📹 Video
                      </span>
                    )}
                  </div>
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: '#64748B', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {testi.comment_id}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                  <button type="button" className="btn btn-outline" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', height: 'auto', background: 'transparent' }} onClick={() => handleEdit(idx)}>
                    Edit
                  </button>
                  <button type="button" className="btn btn-outline" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', color: '#EF4444', borderColor: '#FCA5A5', height: 'auto', background: 'transparent' }} onClick={() => handleDelete(idx)}>
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
}

export default function PageContentEditor({ showToast, setIsDirty = () => {} }) {
  const { refreshContent } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedPage, setSelectedPage] = useState('home');
  const [activeSection, setActiveSection] = useState('hero');

  const [form, setForm] = useState({});

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch('/api/content', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          // Pre-populate missing background colors with default colors
          const updatedForm = { ...data };
          Object.keys(defaultColors).forEach(key => {
            if (updatedForm[key] === undefined || updatedForm[key] === '') {
              updatedForm[key] = defaultColors[key];
            }
          });
          // Isi kolom pesan WhatsApp dengan teks yang SEDANG dipakai situs bila
          // di database masih kosong. Tanpa ini kotaknya tampak kosong padahal
          // tombol WA tetap mengirim kalimat bawaan — admin jadi tidak tahu apa
          // yang sebenarnya terkirim dan tidak punya titik awal untuk mengedit.
          Object.keys(DEFAULT_WA_MESSAGES).forEach(key => {
            if (updatedForm[key] === undefined || updatedForm[key] === '') {
              updatedForm[key] = DEFAULT_WA_MESSAGES[key];
            }
          });
          // Samakan pilihan carousel yang TAMPIL di panel dengan yang TERSIMPAN
          // (lihat CAROUSEL_DEFAULTS).
          Object.keys(CAROUSEL_DEFAULTS).forEach(key => {
            if (updatedForm[key] === undefined || updatedForm[key] === '') {
              updatedForm[key] = CAROUSEL_DEFAULTS[key];
            }
          });
          // Daftar medsos footer: kalau belum pernah disunting, isi dari
          // field-field lama (footerLinkIg, footerIconWa, dst) supaya admin
          // mulai dari kondisi situs saat ini, bukan dari daftar kosong.
          if (!Array.isArray(updatedForm.footerSocials)) {
            updatedForm.footerSocials = buildDefaultFooterSocials(updatedForm);
          }
          setForm(updatedForm);
        }
      } catch (err) {
        console.error("Gagal memuat konten:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
    setIsDirty(false);
  }, []);

  // Semua mutasi form milik user lewat sini, agar status "belum disimpan" selalu akurat.
  // Fetch awal sengaja memakai setForm langsung supaya tidak menandai form kotor.
  const updateForm = (updater) => {
    setIsDirty(true);
    setForm(updater);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateForm(prev => ({ ...prev, [name]: value }));
  };

  const handleMisiChange = (index, lang, value) => {
    const fieldName = `misiList_${lang}`;
    const list = [...(form[fieldName] || [])];
    list[index] = value;
    updateForm(prev => ({ ...prev, [fieldName]: list }));
  };

  const addMisiItem = (newMisiId, newMisiEn, clearInputs) => {
    if (!newMisiId.trim() || !newMisiEn.trim()) {
      showToast('Isian Misi (ID & EN) wajib diisi keduanya!');
      return;
    }
    updateForm(prev => ({
      ...prev,
      misiList_id: [...(prev.misiList_id || []), newMisiId.trim()],
      misiList_en: [...(prev.misiList_en || []), newMisiEn.trim()]
    }));
    clearInputs();
  };

  const removeMisiItem = (index) => {
    const listId = (form.misiList_id || []).filter((_, idx) => idx !== index);
    const listEn = (form.misiList_en || []).filter((_, idx) => idx !== index);
    updateForm(prev => ({ ...prev, misiList_id: listId, misiList_en: listEn }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (res.ok) {
        showToast('Konten halaman berhasil disimpan!');
        setIsDirty(false);
        if (refreshContent) {
          refreshContent();
        }
      } else if (res.status === 401) {
        // Sistem satu-sesi: login baru di perangkat/tab lain menggusur sesi ini.
        showToast('Sesi login Anda sudah berakhir (ada login lain yang lebih baru). Silakan Keluar Portal, login ulang, lalu simpan lagi.');
      } else {
        const data = await res.json();
        showToast(data.error || 'Gagal menyimpan konten.');
      }
    } catch (err) {
      showToast('Terjadi kesalahan koneksi saat menyimpan.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.editorCard} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
        <div style={{ color: 'var(--color-tosca)', fontWeight: 'bold' }}>Memuat data editor...</div>
      </div>
    );
  }

  // Configuration of fields and sections for each page
  const pagesConfig = {
    home: {
      title: 'Halaman Utama (Landing Page)',
      sections: {
        general: {
          title: 'Pengaturan Umum Situs & Menu (Navbar)',
          fields: [
            { name: 'defaultLanguage', label: 'Bahasa Default Website (Untuk Pengunjung Baru)', type: 'select', defaultValue: 'id', options: [
              { value: 'id', label: 'Bahasa Indonesia (ID)' },
              { value: 'en', label: 'English (EN)' }
            ]},
                        // Nama menu di navbar & footer — admin bebas mengganti (mis. Galeri -> Artwork)
            { name: 'navHome_id', label: 'Menu: Beranda (ID)', type: 'text' },
            { name: 'navHome_en', label: 'Menu: Beranda (EN)', type: 'text' },
            { name: 'navStore_id', label: 'Menu: Galeri/Artwork (ID)', type: 'text' },
            { name: 'navStore_en', label: 'Menu: Galeri/Artwork (EN)', type: 'text' },
            { name: 'navClasses_id', label: 'Menu: Kelas (ID)', type: 'text' },
            { name: 'navClasses_en', label: 'Menu: Kelas (EN)', type: 'text' },
            { name: 'navAbout_id', label: 'Menu: Tentang Kami (ID)', type: 'text' },
            { name: 'navAbout_en', label: 'Menu: Tentang Kami (EN)', type: 'text' },
            { name: 'navCollab_id', label: 'Menu: Kolaborasi (ID)', type: 'text' },
            { name: 'navCollab_en', label: 'Menu: Kolaborasi (EN)', type: 'text' },
            { name: 'navBlog_id', label: 'Menu: Blog (ID)', type: 'text' },
            { name: 'navBlog_en', label: 'Menu: Blog (EN)', type: 'text' },
            { name: 'navGallery_id', label: 'Menu: Galeri Kegiatan (ID)', type: 'text' },
            { name: 'navGallery_en', label: 'Menu: Galeri Kegiatan (EN)', type: 'text' },
{ name: 'navLayout', label: 'Layout Menu Navigasi (Navbar)', type: 'select', defaultValue: 'floating', options: [
              { value: 'floating', label: 'Capsule Melayang (Melayang dengan sudut tumpul di atas)' },
              { value: 'full', label: 'Kotak Penuh Lebar (Full-width rectangle di atas)' }
            ]},
            { name: 'navOpacity', label: 'Opasitas Latar Belakang Navbar (Nilai 0.0 s.d 1.0. Semakin dekat ke 0.0 semakin transparan, semakin dekat ke 1.0 semakin tebal/solid. Default: 0.65)', type: 'text', placeholder: '0.65' },
            { name: 'theme_tosca', label: 'Warna Brand Utama / Tosca (ikon, aksen, tombol tosca di seluruh situs)', type: 'color', defaultValue: '#14789B' },
            { name: 'theme_maroon', label: 'Warna Brand Aksen / Maroon (tombol utama, aksen judul di seluruh situs)', type: 'color', defaultValue: '#AB2223' },
            { name: 'theme_kunyit', label: 'Warna Brand Sorot / Kuning Kunyit (tombol CTA, bintang rating di seluruh situs)', type: 'color', defaultValue: '#FAA433' }
          ]
        },
        hero: {
          title: 'Hero Banner Utama',
          fields: [
            { name: 'heroSubtitle_id', label: 'Hero Subtitle (ID)', type: 'text', placeholder: 'Belajar. Melukis. Berseni.' },
            { name: 'heroSubtitle_en', label: 'Hero Subtitle (EN)', type: 'text', placeholder: 'Learn. Paint. Experience.' },
            { name: 'heroTitle_id', label: 'Hero Title (ID - gunakan titik "." untuk teks cursive)', type: 'text', placeholder: 'Experience Art. Feel Indonesia.' },
            { name: 'heroTitle_en', label: 'Hero Title (EN - gunakan titik "." untuk teks cursive)', type: 'text', placeholder: 'Experience Art. Feel Indonesia.' },
            { name: 'heroDescription_id', label: 'Hero Description (ID)', type: 'textarea' },
            { name: 'heroDescription_en', label: 'Hero Description (EN)', type: 'textarea' },
            { name: 'heroBtn1Link', label: 'Tujuan Tombol Kiri Hero ("Lihat Galeri & Kelas") (Link/Section)', type: 'text', placeholder: '#products' },
            { name: 'heroBtn1Status', label: 'Status Tombol Kiri Hero', type: 'select', defaultValue: 'active', options: [
              { value: 'active', label: 'Tampilkan & Aktif' },
              { value: 'disabled', label: 'Tampilkan tapi Nonaktif/Tidak Berfungsi' },
              { value: 'hidden', label: 'Sembunyikan Tombol' }
            ]},
            { name: 'heroBtn2Link', label: 'Tujuan Tombol Kanan Hero ("Tentang Kami") (Link/Section)', type: 'text', placeholder: '/about' },
            { name: 'heroBtn2Status', label: 'Status Tombol Kanan Hero', type: 'select', defaultValue: 'active', options: [
              { value: 'active', label: 'Tampilkan & Aktif' },
              { value: 'disabled', label: 'Tampilkan tapi Nonaktif/Tidak Berfungsi' },
              { value: 'hidden', label: 'Sembunyikan Tombol' }
            ]},
            { name: 'heroCardOpacity', label: 'Opasitas Kotak Teks Hero (Nilai 0.0 s.d 1.0. Semakin dekat ke 0.0 semakin transparan/tembus pandang, semakin dekat ke 1.0 semakin solid/tebal warna putihnya. Default: 0.85)', type: 'text', placeholder: '0.85' },
            { name: 'heroBirdsTop', label: 'Posisi Tinggi Burung Parallax Desktop (Semakin besar persentase atau px maka burung makin TURUN ke bawah, contoh: 15% atau 50px. Gunakan nilai negatif seperti -60px untuk MENAIKKAN burung ke atas. Default: 10%)', type: 'text', placeholder: '10%' }
          ]
        },
        programs: {
          title: 'Section Program Kami (3 Pilar)',
          fields: [
            { name: 'ourPrograms_id', label: 'Pilar Title (ID)', type: 'text', placeholder: 'Program Kami' },
            { name: 'ourPrograms_en', label: 'Pilar Title (EN)', type: 'text', placeholder: 'Our Programs' },
            { name: 'programsSubtitle_id', label: 'Pilar Subtitle (ID)', type: 'textarea' },
            { name: 'programsSubtitle_en', label: 'Pilar Subtitle (EN)', type: 'textarea' },
            // Program 1
            { name: 'prog1Title_id', label: 'Program 1 Title (ID)', type: 'text' },
            { name: 'prog1Title_en', label: 'Program 1 Title (EN)', type: 'text' },
            { name: 'prog1Desc_id', label: 'Program 1 Description (ID)', type: 'textarea' },
            { name: 'prog1Desc_en', label: 'Program 1 Description (EN)', type: 'textarea' },
            { name: 'prog1Btn_id', label: 'Program 1 Button Text (ID)', type: 'text' },
            { name: 'prog1Btn_en', label: 'Program 1 Button Text (EN)', type: 'text' },
            { name: 'prog1Link', label: 'Tujuan Tombol Program 1 ("Workshop Offline")', type: 'text', placeholder: 'filter:offline' },
            { name: 'prog1Status', label: 'Status Tombol Program 1', type: 'select', defaultValue: 'active', options: [
              { value: 'active', label: 'Tampilkan & Aktif' },
              { value: 'disabled', label: 'Tampilkan tapi Nonaktif/Tidak Berfungsi' },
              { value: 'hidden', label: 'Sembunyikan Tombol' }
            ]},
            // Program 2
            { name: 'prog2Title_id', label: 'Program 2 Title (ID)', type: 'text' },
            { name: 'prog2Title_en', label: 'Program 2 Title (EN)', type: 'text' },
            { name: 'prog2Desc_id', label: 'Program 2 Description (ID)', type: 'textarea' },
            { name: 'prog2Desc_en', label: 'Program 2 Description (EN)', type: 'textarea' },
            { name: 'prog2Btn_id', label: 'Program 2 Button Text (ID)', type: 'text' },
            { name: 'prog2Btn_en', label: 'Program 2 Button Text (EN)', type: 'text' },
            { name: 'prog2Link', label: 'Tujuan Tombol Program 2 ("Kelas Video Online")', type: 'text', placeholder: 'filter:online' },
            { name: 'prog2Status', label: 'Status Tombol Program 2', type: 'select', defaultValue: 'active', options: [
              { value: 'active', label: 'Tampilkan & Aktif' },
              { value: 'disabled', label: 'Tampilkan tapi Nonaktif/Tidak Berfungsi' },
              { value: 'hidden', label: 'Sembunyikan Tombol' }
            ]},
            // Program 3
            { name: 'prog3Title_id', label: 'Program 3 Title (ID)', type: 'text' },
            { name: 'prog3Title_en', label: 'Program 3 Title (EN)', type: 'text' },
            { name: 'prog3Desc_id', label: 'Program 3 Description (ID)', type: 'textarea' },
            { name: 'prog3Desc_en', label: 'Program 3 Description (EN)', type: 'textarea' },
            { name: 'prog3Btn_id', label: 'Program 3 Button Text (ID)', type: 'text' },
            { name: 'prog3Btn_en', label: 'Program 3 Button Text (EN)', type: 'text' },
            { name: 'prog3Link', label: 'Tujuan Tombol Program 3 ("Karya Seni & Perlengkapan")', type: 'text', placeholder: 'filter:artwork' },
            { name: 'prog3Status', label: 'Status Tombol Program 3', type: 'select', defaultValue: 'active', options: [
              { value: 'active', label: 'Tampilkan & Aktif' },
              { value: 'disabled', label: 'Tampilkan tapi Nonaktif/Tidak Berfungsi' },
              { value: 'hidden', label: 'Sembunyikan Tombol' }
            ]}
          ]
        },
        gallery_header: {
          title: 'Header Koleksi & Kelas Seni',
          fields: [
            { name: 'galleryTitle_id', label: 'Gallery Section Title (ID)', type: 'text' },
            { name: 'galleryTitle_en', label: 'Gallery Section Title (EN)', type: 'text' },
            { name: 'gallerySubtitle_id', label: 'Gallery Section Subtitle (ID)', type: 'textarea' },
            { name: 'gallerySubtitle_en', label: 'Gallery Section Subtitle (EN)', type: 'textarea' },
            { name: 'galleryBtnLink', label: 'Tujuan Tombol "Lihat Selengkapnya" Galeri', type: 'text', placeholder: '/store' },
            { name: 'galleryBtnStatus', label: 'Status Tombol Galeri', type: 'select', defaultValue: 'active', options: [
              { value: 'active', label: 'Tampilkan & Aktif' },
              { value: 'disabled', label: 'Tampilkan tapi Nonaktif/Tidak Berfungsi' },
              { value: 'hidden', label: 'Sembunyikan Tombol' }
            ]},
            { name: 'blogBtnLink', label: 'Tujuan Tombol "Lihat Semua Artikel" Blog', type: 'text', placeholder: '/blog' },
            { name: 'blogBtnStatus', label: 'Status Tombol Blog', type: 'select', defaultValue: 'active', options: [
              { value: 'active', label: 'Tampilkan & Aktif' },
              { value: 'disabled', label: 'Tampilkan tapi Nonaktif/Tidak Berfungsi' },
              { value: 'hidden', label: 'Sembunyikan Tombol' }
            ]}
          ]
        },
        promo: {
          title: 'Banner Promo / Countdown',
          fields: [
            { name: 'promoTitle_id', label: 'Promo Title (ID) — kosongkan judul, subjudul, DAN tanggal untuk menyembunyikan banner promo dari beranda', type: 'text' },
            { name: 'promoTitle_en', label: 'Promo Title (EN)', type: 'text' },
            { name: 'promoSubtitle_id', label: 'Promo Subtitle (ID)', type: 'textarea' },
            { name: 'promoSubtitle_en', label: 'Promo Subtitle (EN)', type: 'textarea' },
            { name: 'promoEnds_id', label: 'Promo Ends label (ID)', type: 'text', placeholder: 'Berakhir Dalam:' },
            { name: 'promoEnds_en', label: 'Promo Ends label (EN)', type: 'text', placeholder: 'Ends In:' },
            { name: 'promoEndDate', label: 'Tanggal & Jam Berakhir Promo (countdown asli — kosongkan untuk menyembunyikan timer)', type: 'text', placeholder: '2026-08-17T23:59' }
          ]
        },
        testimonials: {
          title: 'Kelola Testimonial (Apa Kata Mereka)',
          fields: [
            { name: 'testimonialsTitle_id', label: 'Testimonials Title (ID)', type: 'text' },
            { name: 'testimonialsTitle_en', label: 'Testimonials Title (EN)', type: 'text' },
            { name: 'testimonialsSubtitle_id', label: 'Testimonials Subtitle (ID)', type: 'textarea' },
            { name: 'testimonialsSubtitle_en', label: 'Testimonials Subtitle (EN)', type: 'textarea' }
          ],
          customRender: 'testimonials_editor'
        },
        cta: {
          title: 'CTA Section WhatsApp',
          fields: [
            { name: 'ctaTitle_id', label: 'CTA Title (ID)', type: 'text' },
            { name: 'ctaTitle_en', label: 'CTA Title (EN)', type: 'text' },
            { name: 'ctaSubtitle_id', label: 'CTA Subtitle (ID)', type: 'textarea' },
            { name: 'ctaSubtitle_en', label: 'CTA Subtitle (EN)', type: 'textarea' },
            { name: 'ctaBtn_id', label: 'CTA Button Text (ID)', type: 'text' },
            { name: 'ctaBtn_en', label: 'CTA Button Text (EN)', type: 'text' },
            { name: 'ctaWaMessage_id', label: '💬 Pesan Otomatis WhatsApp — Tombol CTA Beranda (ID)', type: 'textarea', variant: 'whatsapp', placeholder: 'Teks yang otomatis terisi di chat WhatsApp pelanggan' },
            { name: 'ctaWaMessage_en', label: '💬 Pesan Otomatis WhatsApp — Tombol CTA Beranda (EN)', type: 'textarea', variant: 'whatsapp' },
            // Link tombol ini otomatis pakai Nomor WhatsApp tunggal (atur di section Footer & Medsos).
            { name: 'ctaBtnStatus', label: 'Status Tombol WhatsApp CTA', type: 'select', defaultValue: 'active', options: [
              { value: 'active', label: 'Tampilkan & Aktif' },
              { value: 'disabled', label: 'Tampilkan tapi Nonaktif/Tidak Berfungsi' },
              { value: 'hidden', label: 'Sembunyikan Tombol' }
            ]}
          ]
        },
        activities: {
          title: 'Kelola Carousel Aktivitas',
          fields: [
            { name: 'activitiesSource', label: '🔄 Isi Carousel — apa yang ditampilkan di section "Berseni Activities" beranda', type: 'select', defaultValue: 'manual', options: [
              { value: 'manual', label: '✍️ Hanya aktivitas manual — daftar yang Anda ketik di bawah' },
              { value: 'mixed', label: '⚡ Gabungan — aktivitas manual + seluruh Katalog Produk' },
              { value: 'products', label: '🛍️ Hanya Katalog Produk — artwork, workshop, & kelas online' }
            ] },
            { name: 'activitiesProductFilter', label: 'Kalau Katalog Produk ikut: produk mana saja yang ditampilkan?', type: 'select', defaultValue: 'all', options: [
              { value: 'all', label: 'Semua — Artwork + Workshop Offline + Kelas Online' },
              { value: 'artwork', label: 'Hanya Artwork (lukisan orisinal)' },
              { value: 'classes', label: 'Hanya Kelas & Workshop' }
            ] },
            { name: 'activitiesVisibleCount', label: '👁️ Berapa kartu terlihat bersamaan? Ini BUKAN batas isi — berapa pun pilihannya, carousel tetap berputar melewati SELURUH katalog', type: 'select', defaultValue: '5', options: [
              { value: '3', label: '3 kartu terlihat' },
              { value: '5', label: '5 kartu terlihat (disarankan)' },
              { value: '7', label: '7 kartu terlihat' },
              { value: '9', label: '9 kartu terlihat' }
            ] }
          ],
          customRender: 'activities_editor'
        },
        partners: {
          title: 'Kelola Logo Partner (Dipercaya Oleh)',
          fields: [],
          customRender: 'partners_editor'
        },
        footer: {
          title: 'Pengaturan Kaki Halaman (Footer) & Medsos',
          fields: [
            { name: 'footerBrandText', label: 'Nama Brand di Footer (tulisan besar bergaya tulisan tangan)', type: 'text', placeholder: 'Berseni' },
            { name: 'footerDesc_id', label: 'Deskripsi Singkat Footer (ID)', type: 'textarea' },
            { name: 'footerDesc_en', label: 'Deskripsi Singkat Footer (EN)', type: 'textarea' },
            { name: 'footerContactDesc_id', label: 'Teks Ajakan Kontak Hubungi Kami (ID)', type: 'textarea' },
            { name: 'footerContactDesc_en', label: 'Teks Ajakan Kontak Hubungi Kami (EN)', type: 'textarea' },
            { name: 'whatsappNumber', label: '📱 Nomor WhatsApp — SATU nomor untuk SEMUA tombol WA di situs (floating, footer, CTA beranda, kolaborasi brand & venue). Contoh: 6281234567890 atau 08123456789', type: 'text', placeholder: '6281234567890' },
            { name: 'waFloatMessage_id', label: '💬 Pesan Otomatis WhatsApp — Tombol Melayang (ID)', type: 'textarea', variant: 'whatsapp', placeholder: 'Teks yang sudah terisi otomatis di chat WhatsApp pelanggan' },
            { name: 'waFloatMessage_en', label: '💬 Pesan Otomatis WhatsApp — Tombol Melayang (EN)', type: 'textarea', variant: 'whatsapp' },

            // Baris paling bawah footer.
            { name: 'footerCopyright_id', label: 'Baris Hak Cipta (ID) — kosongkan untuk teks otomatis bertahun berjalan', type: 'text', placeholder: 'Hak Cipta © 2026 Berseni. Hak cipta dilindungi undang-undang.' },
            { name: 'footerCopyright_en', label: 'Baris Hak Cipta (EN) — kosongkan untuk teks otomatis', type: 'text', placeholder: 'Copyright © 2026 Berseni. All rights reserved.' },
            { name: 'footerPoweredByText', label: 'Teks Kredit Pembuat — kosongkan untuk menyembunyikan', type: 'text', placeholder: 'Powered by' },
            { name: 'footerPoweredByName', label: 'Nama Kredit Pembuat (tampil berwarna)', type: 'text', placeholder: 'AgentBuff' },
            { name: 'footerPoweredByLink', label: 'Link Kredit Pembuat (opsional — kosongkan agar tidak bisa diklik)', type: 'text', placeholder: 'https://...' },

            // Warna footer. Kosong = warna bawaan situs.
            { name: 'bg_footer', label: '🎨 Warna Latar Belakang Footer', type: 'color' },
            { name: 'text_footer_title', label: '🎨 Warna Judul Kolom (NAVIGATION / CONTACT US)', type: 'color' },
            { name: 'text_footer_body', label: '🎨 Warna Teks Isi (deskripsi, tautan, tagline, baris hak cipta)', type: 'color' },
            { name: 'text_footer_brand', label: '🎨 Warna Nama Brand', type: 'color' },
            { name: 'footerAccentColor', label: '🎨 Warna Garis Aksen di Atas Footer', type: 'color' }
          ],
          customRender: 'footer_socials_editor'
        },
        backgrounds: {
          title: '🎨 Warna Latar Belakang Section & Navbar',
          fields: [
            { name: 'bg_navbar', label: 'Warna Latar Belakang Navbar', type: 'color' },
            { name: 'bg_home_hero', label: 'Latar Belakang Hero Banner', type: 'color' },
            { name: 'bg_home_partners', label: 'Latar Belakang Partner Logo', type: 'color' },
            { name: 'bg_home_programs', label: 'Latar Belakang Program Kami (3 Pilar)', type: 'color' },
            { name: 'bg_home_gallery', label: 'Latar Belakang Koleksi & Kelas Seni', type: 'color' },
            { name: 'bg_home_testimonials', label: 'Latar Belakang Testimonial (Apa Kata Mereka)', type: 'color' },
            { name: 'bg_home_blog', label: 'Latar Belakang Blog/Artikel Terbaru', type: 'color' },
            { name: 'bg_home_cta', label: 'Latar Belakang CTA Banner WhatsApp', type: 'color' },
            { name: 'text_home_hero_title', label: '🖊️ Warna Teks Judul — Hero Banner', type: 'color' },
            { name: 'text_home_hero_body', label: '🖊️ Warna Teks Paragraf — Hero Banner', type: 'color' },
            { name: 'text_home_programs_title', label: '🖊️ Warna Teks Judul — Program Kami', type: 'color' },
            { name: 'text_home_programs_body', label: '🖊️ Warna Teks Paragraf — Program Kami', type: 'color' },
            { name: 'text_home_gallery_title', label: '🖊️ Warna Teks Judul — Koleksi & Kelas', type: 'color' },
            { name: 'text_home_gallery_body', label: '🖊️ Warna Teks Paragraf — Koleksi & Kelas', type: 'color' },
            { name: 'text_home_testimonials_title', label: '🖊️ Warna Teks Judul — Testimonial', type: 'color' },
            { name: 'text_home_testimonials_body', label: '🖊️ Warna Teks Paragraf — Testimonial', type: 'color' },
            { name: 'text_home_blog_title', label: '🖊️ Warna Teks Judul — Blog Terbaru', type: 'color' },
            { name: 'text_home_blog_body', label: '🖊️ Warna Teks Paragraf — Blog Terbaru', type: 'color' },
            { name: 'text_home_cta_title', label: '🖊️ Warna Teks Judul — CTA WhatsApp', type: 'color' },
            { name: 'text_home_cta_body', label: '🖊️ Warna Teks Paragraf — CTA WhatsApp', type: 'color' },
          ]
        }
      }
    },
    about: {
      title: 'Halaman Tentang Kami (About Us)',
      sections: {
        hero: {
          title: 'Hero Header Section',
          fields: [
            { name: 'aboutHeroLabel_id', label: 'Label Atas (ID)', type: 'text' },
            { name: 'aboutHeroLabel_en', label: 'Label Atas (EN)', type: 'text' },
            { name: 'aboutHeroTitle_id', label: 'Hero Title (ID)', type: 'text' },
            { name: 'aboutHeroTitle_en', label: 'Hero Title (EN)', type: 'text' },
            { name: 'aboutHeroTitleSpan_id', label: 'Title Highlighted Word (ID) — teks beraksen cursive', type: 'text' },
            { name: 'aboutHeroTitleSpan_en', label: 'Title Highlighted Word (EN) — teks beraksen cursive', type: 'text' },
            { name: 'aboutHeroTitleLayout', label: 'Posisi Teks Highlight (Hero)', type: 'select', defaultValue: 'auto', options: LAYOUT_OPTIONS },
            { name: 'aboutHeroDesc_id', label: 'Hero Description (ID)', type: 'textarea' },
            { name: 'aboutHeroDesc_en', label: 'Hero Description (EN)', type: 'textarea' },
            { name: 'aboutCollage1', label: 'Kolase Gambar 1 (Outdoor)', type: 'image' },
            { name: 'aboutCollage2', label: 'Kolase Gambar 2 (Batik)', type: 'image' },
            { name: 'aboutCollage3', label: 'Kolase Gambar 3 (Talkshow)', type: 'image' },
            { name: 'aboutCollage4', label: 'Kolase Gambar 4 (Inclusion)', type: 'image' }
          ]
        },
        story: {
          title: 'Story Section (Tentang Kami)',
          fields: [
            { name: 'aboutTitle_id', label: 'Story Title (ID)', type: 'text' },
            { name: 'aboutTitle_en', label: 'Story Title (EN)', type: 'text' },
            { name: 'aboutSubtitle_id', label: 'Story Subtitle (ID)', type: 'text' },
            { name: 'aboutSubtitle_en', label: 'Story Subtitle (EN)', type: 'text' },
            { name: 'aboutDescription_id', label: 'Story Description (ID - gunakan double enter \\n\\n untuk paragraf baru)', type: 'textarea' },
            { name: 'aboutDescription_en', label: 'Story Description (EN - gunakan double enter \\n\\n untuk paragraf baru)', type: 'textarea' },
            { name: 'aboutStudioImg', label: 'Gambar Studio Ubud', type: 'image' }
          ]
        },
        visimisi: {
          title: 'Visi & Misi',
          fields: [
            { name: 'visiTitle_id', label: 'Visi Title (ID)', type: 'text' },
            { name: 'visiTitle_en', label: 'Visi Title (EN)', type: 'text' },
            { name: 'visiDescription_id', label: 'Visi Description (ID)', type: 'textarea' },
            { name: 'visiDescription_en', label: 'Visi Description (EN)', type: 'textarea' },
            { name: 'misiTitle_id', label: 'Misi Title (ID)', type: 'text' },
            { name: 'misiTitle_en', label: 'Misi Title (EN)', type: 'text' }
          ],
          customRender: 'visimisi_list'
        },
        pillars: {
          title: 'Three Pillars Section',
          fields: [
            { name: 'aboutPillarsTitle_id', label: 'Pillar Main Title (ID)', type: 'text' },
            { name: 'aboutPillarsTitle_en', label: 'Pillar Main Title (EN)', type: 'text' },
            { name: 'aboutPillarsTitleSpan_id', label: 'Pillar Title Highlight (ID) — teks beraksen cursive', type: 'text' },
            { name: 'aboutPillarsTitleSpan_en', label: 'Pillar Title Highlight (EN) — teks beraksen cursive', type: 'text' },
            { name: 'aboutPillarsTitleLayout', label: 'Posisi Teks Highlight (Judul Pilar)', type: 'select', defaultValue: 'auto', options: LAYOUT_OPTIONS },
            { name: 'aboutPillarsSubtitle_id', label: 'Pillar Subtitle (ID)', type: 'textarea' },
            { name: 'aboutPillarsSubtitle_en', label: 'Pillar Subtitle (EN)', type: 'textarea' },
            // Pillar 1
            { name: 'aboutPillar1Icon', label: '🖼️ Ikon Pilar 1 — kartu paling kiri', type: 'icon', hint: 'Unggah PNG, JPG, WebP, atau SVG — ukuran & format diurus otomatis (dikonversi jadi WebP transparan). Kosongkan untuk kembali ke ikon bawaan situs.' },
            { name: 'aboutPillar1Title_id', label: 'Pillar 1 Title (ID)', type: 'text' },
            { name: 'aboutPillar1Title_en', label: 'Pillar 1 Title (EN)', type: 'text' },
            { name: 'aboutPillar1Desc_id', label: 'Pillar 1 Desc (ID)', type: 'textarea' },
            { name: 'aboutPillar1Desc_en', label: 'Pillar 1 Desc (EN)', type: 'textarea' },
            // Pillar 2
            { name: 'aboutPillar2Icon', label: '🖼️ Ikon Pilar 2 — kartu tengah', type: 'icon' },
            { name: 'aboutPillar2Title_id', label: 'Pillar 2 Title (ID)', type: 'text' },
            { name: 'aboutPillar2Title_en', label: 'Pillar 2 Title (EN)', type: 'text' },
            { name: 'aboutPillar2Desc_id', label: 'Pillar 2 Desc (ID)', type: 'textarea' },
            { name: 'aboutPillar2Desc_en', label: 'Pillar 2 Desc (EN)', type: 'textarea' },
            // Pillar 3
            { name: 'aboutPillar3Icon', label: '🖼️ Ikon Pilar 3 — kartu paling kanan', type: 'icon' },
            { name: 'aboutPillar3Title_id', label: 'Pillar 3 Title (ID)', type: 'text' },
            { name: 'aboutPillar3Title_en', label: 'Pillar 3 Title (EN)', type: 'text' },
            { name: 'aboutPillar3Desc_id', label: 'Pillar 3 Desc (ID)', type: 'textarea' },
            { name: 'aboutPillar3Desc_en', label: 'Pillar 3 Desc (EN)', type: 'textarea' }
          ]
        },
        commitment: {
          title: 'Commitment Section',
          fields: [
            { name: 'aboutCommitmentLabel_id', label: 'Commitment Label (ID)', type: 'text' },
            { name: 'aboutCommitmentLabel_en', label: 'Commitment Label (EN)', type: 'text' },
            { name: 'aboutCommitmentTitle_id', label: 'Commitment Title (ID)', type: 'text' },
            { name: 'aboutCommitmentTitle_en', label: 'Commitment Title (EN)', type: 'text' },
            { name: 'aboutCommitmentDesc_id', label: 'Commitment Description (ID)', type: 'textarea' },
            { name: 'aboutCommitmentDesc_en', label: 'Commitment Description (EN)', type: 'textarea' },
            { name: 'aboutCommitBtn_id', label: 'Commitment Button Text (ID)', type: 'text' },
            { name: 'aboutCommitBtn_en', label: 'Commitment Button Text (EN)', type: 'text' },
            { name: 'aboutCommitBtnLink', label: 'Tujuan Tombol Komitmen ("Jelajahi Program")', type: 'text', placeholder: '/#products' },
            { name: 'aboutCommitBtnStatus', label: 'Status Tombol Komitmen', type: 'select', defaultValue: 'active', options: [
              { value: 'active', label: 'Tampilkan & Aktif' },
              { value: 'disabled', label: 'Tampilkan tapi Nonaktif/Tidak Berfungsi' },
              { value: 'hidden', label: 'Sembunyikan Tombol' }
            ]},
            // Commit Point 1
            { name: 'aboutCommit1Title_id', label: 'Commit Point 1 Title (ID)', type: 'text' },
            { name: 'aboutCommit1Title_en', label: 'Commit Point 1 Title (EN)', type: 'text' },
            { name: 'aboutCommit1Desc_id', label: 'Commit Point 1 Desc (ID)', type: 'textarea' },
            { name: 'aboutCommit1Desc_en', label: 'Commit Point 1 Desc (EN)', type: 'textarea' },
            // Commit Point 2
            { name: 'aboutCommit2Title_id', label: 'Commit Point 2 Title (ID)', type: 'text' },
            { name: 'aboutCommit2Title_en', label: 'Commit Point 2 Title (EN)', type: 'text' },
            { name: 'aboutCommit2Desc_id', label: 'Commit Point 2 Desc (ID)', type: 'textarea' },
            { name: 'aboutCommit2Desc_en', label: 'Commit Point 2 Desc (EN)', type: 'textarea' },
            // Commit Point 3
            { name: 'aboutCommit3Title_id', label: 'Commit Point 3 Title (ID)', type: 'text' },
            { name: 'aboutCommit3Title_en', label: 'Commit Point 3 Title (EN)', type: 'text' },
            { name: 'aboutCommit3Desc_id', label: 'Commit Point 3 Desc (ID)', type: 'textarea' },
            { name: 'aboutCommit3Desc_en', label: 'Commit Point 3 Desc (EN)', type: 'textarea' }
          ]
        },
        quote: {
          title: 'Quote / Testimoni Ubud Studio',
          fields: [
            { name: 'aboutQuote_id', label: 'Teks Quote (ID)', type: 'textarea' },
            { name: 'aboutQuote_en', label: 'Teks Quote (EN)', type: 'textarea' },
            { name: 'aboutQuoteAuthor_id', label: 'Author Quote (ID)', type: 'text' },
            { name: 'aboutQuoteAuthor_en', label: 'Author Quote (EN)', type: 'text' },
            { name: 'aboutQuoteLocation_id', label: 'Lokasi Quote (ID)', type: 'text' },
            { name: 'aboutQuoteLocation_en', label: 'Lokasi Quote (EN)', type: 'text' }
          ]
        },
        statistics_labels: {
          title: 'Statistics Section Content & Labels',
          fields: [
            { name: 'statsUsers', label: 'Stats 1 Number (e.g. 20k+)', type: 'text' },
            { name: 'aboutStats1Label_id', label: 'Stats 1 Label - User (ID)', type: 'text' },
            { name: 'aboutStats1Label_en', label: 'Stats 1 Label - User (EN)', type: 'text' },
            { name: 'stats2Number', label: 'Stats 2 Number (e.g. 100%)', type: 'text' },
            { name: 'aboutStats2Label_id', label: 'Stats 2 Label - Karya (ID)', type: 'text' },
            { name: 'aboutStats2Label_en', label: 'Stats 2 Label - Karya (EN)', type: 'text' },
            { name: 'stats3Number', label: 'Stats 3 Number (e.g. 15+)', type: 'text' },
            { name: 'aboutStats3Label_id', label: 'Stats 3 Label - Maestro (ID)', type: 'text' },
            { name: 'aboutStats3Label_en', label: 'Stats 3 Label - Maestro (EN)', type: 'text' },
            { name: 'stats4Number', label: 'Stats 4 Number (e.g. 50+)', type: 'text' },
            { name: 'aboutStats4Label_id', label: 'Stats 4 Label - Aktivitas (ID)', type: 'text' },
            { name: 'aboutStats4Label_en', label: 'Stats 4 Label - Aktivitas (EN)', type: 'text' }
          ]
        },
        cta_about: {
          title: 'CTA Section (Tengah/Bawah)',
          fields: [
            { name: 'aboutCtaTitle_id', label: 'CTA Title (ID)', type: 'text' },
            { name: 'aboutCtaTitle_en', label: 'CTA Title (EN)', type: 'text' },
            { name: 'aboutCtaDesc_id', label: 'CTA Description (ID)', type: 'textarea' },
            { name: 'aboutCtaDesc_en', label: 'CTA Description (EN)', type: 'textarea' },
            { name: 'aboutCtaBtn1_id', label: 'CTA Button 1 Text (ID)', type: 'text' },
            { name: 'aboutCtaBtn1_en', label: 'CTA Button 1 Text (EN)', type: 'text' },
            { name: 'aboutCtaBtn1Link', label: 'Tujuan Tombol 1 ("Buka Kelas & Galeri") CTA', type: 'text', placeholder: '/#products' },
            { name: 'aboutCtaBtn1Status', label: 'Status Tombol 1 CTA', type: 'select', defaultValue: 'active', options: [
              { value: 'active', label: 'Tampilkan & Aktif' },
              { value: 'disabled', label: 'Tampilkan tapi Nonaktif/Tidak Berfungsi' },
              { value: 'hidden', label: 'Sembunyikan Tombol' }
            ]},
            { name: 'aboutCtaBtn2_id', label: 'CTA Button 2 Text (ID)', type: 'text' },
            { name: 'aboutCtaBtn2_en', label: 'CTA Button 2 Text (EN)', type: 'text' },
            { name: 'aboutCtaBtn2Link', label: 'Tujuan Tombol 2 ("Lihat Aktivitas") CTA', type: 'text', placeholder: '/#programs' },
            { name: 'aboutCtaBtn2Status', label: 'Status Tombol 2 CTA', type: 'select', defaultValue: 'active', options: [
              { value: 'active', label: 'Tampilkan & Aktif' },
              { value: 'disabled', label: 'Tampilkan tapi Nonaktif/Tidak Berfungsi' },
              { value: 'hidden', label: 'Sembunyikan Tombol' }
            ]}
          ]
        },
        backgrounds: {
          title: '🎨 Warna Latar Belakang Section',
          fields: [
            { name: 'bg_about_hero', label: 'Latar Belakang Hero Header', type: 'color' },
            { name: 'bg_about_empower', label: 'Latar Belakang Story (Tentang Kami)', type: 'color' },
            { name: 'bg_about_pillars', label: 'Latar Belakang Pillars Section', type: 'color' },
            { name: 'bg_about_feature', label: 'Latar Belakang Commitment Section', type: 'color' },
            { name: 'bg_about_stats', label: 'Latar Belakang Stats Section', type: 'color' },
            { name: 'bg_about_cta', label: 'Latar Belakang CTA Section', type: 'color' },
            { name: 'text_about_hero_title', label: '🖊️ Warna Teks Judul — Hero About', type: 'color' },
            { name: 'text_about_hero_body', label: '🖊️ Warna Teks Paragraf — Hero About', type: 'color' },
            { name: 'text_about_story_title', label: '🖊️ Warna Teks Judul — Story', type: 'color' },
            { name: 'text_about_story_body', label: '🖊️ Warna Teks Paragraf — Story', type: 'color' },
            { name: 'text_about_pillars_title', label: '🖊️ Warna Teks Judul — Tiga Pilar', type: 'color' },
            { name: 'text_about_pillars_body', label: '🖊️ Warna Teks Paragraf — Tiga Pilar', type: 'color' },
            { name: 'text_about_stats_title', label: '🖊️ Warna Teks Judul — Statistik', type: 'color' },
            { name: 'text_about_stats_body', label: '🖊️ Warna Teks Paragraf — Statistik', type: 'color' },
            { name: 'text_about_cta_title', label: '🖊️ Warna Teks Judul — CTA About', type: 'color' },
            { name: 'text_about_cta_body', label: '🖊️ Warna Teks Paragraf — CTA About', type: 'color' },
          ]
        }
      }
    },
    collaboration: {
      title: 'Halaman Kolaborasi (Collaboration)',
      sections: {
        hero: {
          title: 'Hero Header Section',
          fields: [
            { name: 'collabHeroSubtitle_id', label: 'Hero Subtitle (ID)', type: 'text' },
            { name: 'collabHeroSubtitle_en', label: 'Hero Subtitle (EN)', type: 'text' },
            { name: 'collabHeroTitle_id', label: 'Hero Title (ID)', type: 'text' },
            { name: 'collabHeroTitle_en', label: 'Hero Title (EN)', type: 'text' },
            { name: 'collabHeroDesc_id', label: 'Hero Description (ID)', type: 'textarea' },
            { name: 'collabHeroDesc_en', label: 'Hero Description (EN)', type: 'textarea' }
          ]
        },
        brand: {
          title: 'Section Brand & Corporate',
          fields: [
            { name: 'collabBrandBadge_id', label: 'Badge (ID)', type: 'text' },
            { name: 'collabBrandBadge_en', label: 'Badge (EN)', type: 'text' },
            { name: 'collabBrandTitle_id', label: 'Brand Title (ID)', type: 'text' },
            { name: 'collabBrandTitle_en', label: 'Brand Title (EN)', type: 'text' },
            { name: 'collabBrandIntro_id', label: 'Brand Intro (ID)', type: 'textarea' },
            { name: 'collabBrandIntro_en', label: 'Brand Intro (EN)', type: 'textarea' },
            // Feat 1
            { name: 'collabBrandFeat1Icon', label: '🖼️ Ikon Fitur 1 (Brand) — baris teratas', type: 'icon', hint: 'Unggah PNG, JPG, WebP, atau SVG — ukuran & format diurus otomatis (dikonversi jadi WebP transparan). Kosongkan untuk kembali ke ikon bawaan situs.' },
            { name: 'collabBrandFeat1Title_id', label: 'Feature 1 Title (ID)', type: 'text' },
            { name: 'collabBrandFeat1Title_en', label: 'Feature 1 Title (EN)', type: 'text' },
            { name: 'collabBrandFeat1Desc_id', label: 'Feature 1 Desc (ID)', type: 'textarea' },
            { name: 'collabBrandFeat1Desc_en', label: 'Feature 1 Desc (EN)', type: 'textarea' },
            // Feat 2
            { name: 'collabBrandFeat2Icon', label: '🖼️ Ikon Fitur 2 (Brand)', type: 'icon' },
            { name: 'collabBrandFeat2Title_id', label: 'Feature 2 Title (ID)', type: 'text' },
            { name: 'collabBrandFeat2Title_en', label: 'Feature 2 Title (EN)', type: 'text' },
            { name: 'collabBrandFeat2Desc_id', label: 'Feature 2 Desc (ID)', type: 'textarea' },
            { name: 'collabBrandFeat2Desc_en', label: 'Feature 2 Desc (EN)', type: 'textarea' },
            // Feat 3
            { name: 'collabBrandFeat3Icon', label: '🖼️ Ikon Fitur 3 (Brand)', type: 'icon' },
            { name: 'collabBrandFeat3Title_id', label: 'Feature 3 Title (ID)', type: 'text' },
            { name: 'collabBrandFeat3Title_en', label: 'Feature 3 Title (EN)', type: 'text' },
            { name: 'collabBrandFeat3Desc_id', label: 'Feature 3 Desc (ID)', type: 'textarea' },
            { name: 'collabBrandFeat3Desc_en', label: 'Feature 3 Desc (EN)', type: 'textarea' },
            // Feat 4
            { name: 'collabBrandFeat4Icon', label: '🖼️ Ikon Fitur 4 (Brand) — baris terbawah', type: 'icon' },
            { name: 'collabBrandFeat4Title_id', label: 'Feature 4 Title (ID)', type: 'text' },
            { name: 'collabBrandFeat4Title_en', label: 'Feature 4 Title (EN)', type: 'text' },
            { name: 'collabBrandFeat4Desc_id', label: 'Feature 4 Desc (ID)', type: 'textarea' },
            { name: 'collabBrandFeat4Desc_en', label: 'Feature 4 Desc (EN)', type: 'textarea' },
            // Callout
            { name: 'collabBrandCallout_id', label: 'Callout Text (ID)', type: 'text' },
            { name: 'collabBrandCallout_en', label: 'Callout Text (EN)', type: 'text' },
            // Button
            { name: 'collabBrandBtn_id', label: 'Button Text (ID)', type: 'text' },
            { name: 'collabBrandBtn_en', label: 'Button Text (EN)', type: 'text' },
            { name: 'collabBrandWaMessage_id', label: '💬 Pesan Otomatis WhatsApp — Tombol Brand Collab (ID)', type: 'textarea', variant: 'whatsapp', placeholder: 'Teks yang otomatis terisi di chat WhatsApp pelanggan' },
            { name: 'collabBrandWaMessage_en', label: '💬 Pesan Otomatis WhatsApp — Tombol Brand Collab (EN)', type: 'textarea', variant: 'whatsapp' },
            // Link tombol ini otomatis pakai Nomor WhatsApp tunggal (atur di section Footer & Medsos).
            { name: 'collabBrandBtnStatus', label: 'Status Tombol Brand Collab', type: 'select', defaultValue: 'active', options: [
              { value: 'active', label: 'Tampilkan & Aktif' },
              { value: 'disabled', label: 'Tampilkan tapi Nonaktif/Tidak Berfungsi' },
              { value: 'hidden', label: 'Sembunyikan Tombol' }
            ]},
            { name: 'collabCanvasImg', label: 'Latar Belakang Poster Canvas', type: 'image' }
          ]
        },
        venue: {
          title: 'Section Host & Space Partners (Venue)',
          fields: [
            { name: 'collabVenueBadge_id', label: 'Badge (ID)', type: 'text' },
            { name: 'collabVenueBadge_en', label: 'Badge (EN)', type: 'text' },
            { name: 'collabVenueTitle_id', label: 'Venue Title (ID)', type: 'text' },
            { name: 'collabVenueTitle_en', label: 'Venue Title (EN)', type: 'text' },
            { name: 'collabVenueSub_id', label: 'Venue Subtitle (ID)', type: 'textarea' },
            { name: 'collabVenueSub_en', label: 'Venue Subtitle (EN)', type: 'textarea' },
            // Feat 1
            { name: 'collabVenueFeat1Icon', label: '🖼️ Ikon Kartu 1 (Venue) — kartu paling kiri', type: 'icon', hint: 'Unggah PNG, JPG, WebP, atau SVG — ukuran & format diurus otomatis (dikonversi jadi WebP transparan). Kosongkan untuk kembali ke ikon bawaan situs.' },
            { name: 'collabVenueFeat1Title_id', label: 'Feature 1 Title (ID)', type: 'text' },
            { name: 'collabVenueFeat1Title_en', label: 'Feature 1 Title (EN)', type: 'text' },
            { name: 'collabVenueFeat1Desc_id', label: 'Feature 1 Desc (ID)', type: 'textarea' },
            { name: 'collabVenueFeat1Desc_en', label: 'Feature 1 Desc (EN)', type: 'textarea' },
            // Feat 2
            { name: 'collabVenueFeat2Icon', label: '🖼️ Ikon Kartu 2 (Venue) — kartu tengah', type: 'icon' },
            { name: 'collabVenueFeat2Title_id', label: 'Feature 2 Title (ID)', type: 'text' },
            { name: 'collabVenueFeat2Title_en', label: 'Feature 2 Title (EN)', type: 'text' },
            { name: 'collabVenueFeat2Desc_id', label: 'Feature 2 Desc (ID)', type: 'textarea' },
            { name: 'collabVenueFeat2Desc_en', label: 'Feature 2 Desc (EN)', type: 'textarea' },
            // Feat 3
            { name: 'collabVenueFeat3Icon', label: '🖼️ Ikon Kartu 3 (Venue) — kartu paling kanan', type: 'icon' },
            { name: 'collabVenueFeat3Title_id', label: 'Feature 3 Title (ID)', type: 'text' },
            { name: 'collabVenueFeat3Title_en', label: 'Feature 3 Title (EN)', type: 'text' },
            { name: 'collabVenueFeat3Desc_id', label: 'Feature 3 Desc (ID)', type: 'textarea' },
            { name: 'collabVenueFeat3Desc_en', label: 'Feature 3 Desc (EN)', type: 'textarea' },
            // Cta Callout Title & Desc
            { name: 'collabVenueCtaTitle_id', label: 'CTA Callout Title (ID)', type: 'text' },
            { name: 'collabVenueCtaTitle_en', label: 'CTA Callout Title (EN)', type: 'text' },
            { name: 'collabVenueCtaDesc_id', label: 'CTA Callout Desc (ID)', type: 'textarea' },
            { name: 'collabVenueCtaDesc_en', label: 'CTA Callout Desc (EN)', type: 'textarea' },
            // Button
            { name: 'collabVenueBtn_id', label: 'Button Text (ID)', type: 'text' },
            { name: 'collabVenueBtn_en', label: 'Button Text (EN)', type: 'text' },
            { name: 'collabVenueWaMessage_id', label: '💬 Pesan Otomatis WhatsApp — Tombol Venue Collab (ID)', type: 'textarea', variant: 'whatsapp', placeholder: 'Teks yang otomatis terisi di chat WhatsApp pelanggan' },
            { name: 'collabVenueWaMessage_en', label: '💬 Pesan Otomatis WhatsApp — Tombol Venue Collab (EN)', type: 'textarea', variant: 'whatsapp' },
            // Link tombol ini otomatis pakai Nomor WhatsApp tunggal (atur di section Footer & Medsos).
            { name: 'collabVenueBtnStatus', label: 'Status Tombol Venue Collab', type: 'select', defaultValue: 'active', options: [
              { value: 'active', label: 'Tampilkan & Aktif' },
              { value: 'disabled', label: 'Tampilkan tapi Nonaktif/Tidak Berfungsi' },
              { value: 'hidden', label: 'Sembunyikan Tombol' }
            ]}
          ]
        },
        backgrounds: {
          title: '🎨 Warna Latar Belakang Section',
          fields: [
            { name: 'bg_collab_hero', label: 'Latar Belakang Hero Header', type: 'color' },
            { name: 'bg_collab_brand', label: 'Latar Belakang Brand & Corporate Collab', type: 'color' },
            { name: 'bg_collab_venue', label: 'Latar Belakang Host & Space Partners', type: 'color' },
            { name: 'text_collab_hero_title', label: '🖊️ Warna Teks Judul — Hero Kolaborasi', type: 'color' },
            { name: 'text_collab_hero_body', label: '🖊️ Warna Teks Paragraf — Hero Kolaborasi', type: 'color' },
            { name: 'text_collab_brand_title', label: '🖊️ Warna Teks Judul — Section Brand', type: 'color' },
            { name: 'text_collab_brand_body', label: '🖊️ Warna Teks Paragraf — Section Brand', type: 'color' },
            { name: 'text_collab_venue_title', label: '🖊️ Warna Teks Judul — Section Venue', type: 'color' },
            { name: 'text_collab_venue_body', label: '🖊️ Warna Teks Paragraf — Section Venue', type: 'color' },
          ]
        }
      }
    },
    store: {
      title: 'Halaman Art Market (Store)',
      sections: {
        header: {
          title: 'Store Headings & Labels',
          fields: [
            { name: 'storeTitle_id', label: 'Store Main Title (ID)', type: 'text' },
            { name: 'storeTitle_en', label: 'Store Main Title (EN)', type: 'text' },
            { name: 'storeSearchPlaceholder_id', label: 'Search Input Placeholder (ID)', type: 'text' },
            { name: 'storeSearchPlaceholder_en', label: 'Search Input Placeholder (EN)', type: 'text' },
            { name: 'sortByLabel_id', label: 'Sort Dropdown Label (ID)', type: 'text' },
            { name: 'sortByLabel_en', label: 'Sort Dropdown Label (EN)', type: 'text' },
            { name: 'sortLatest_id', label: 'Sort Option "Latest" (ID)', type: 'text' },
            { name: 'sortLatest_en', label: 'Sort Option "Latest" (EN)', type: 'text' },
            { name: 'sortPriceAsc_id', label: 'Sort Option "Price Low-High" (ID)', type: 'text' },
            { name: 'sortPriceAsc_en', label: 'Sort Option "Price Low-High" (EN)', type: 'text' },
            { name: 'sortPriceDesc_id', label: 'Sort Option "Price High-Low" (ID)', type: 'text' },
            { name: 'sortPriceDesc_en', label: 'Sort Option "Price High-Low" (EN)', type: 'text' },
            { name: 'resultsCount_id', label: 'Results Count text (ID - gunakan {count})', type: 'text' },
            { name: 'resultsCount_en', label: 'Results Count text (EN - gunakan {count})', type: 'text' },
            { name: 'resetFilters_id', label: 'Reset Filter Button (ID)', type: 'text' },
            { name: 'resetFilters_en', label: 'Reset Filter Button (EN)', type: 'text' },
            { name: 'emptyStoreTitle_id', label: 'Empty Results Title (ID)', type: 'text' },
            { name: 'emptyStoreTitle_en', label: 'Empty Results Title (EN)', type: 'text' },
            { name: 'emptyStoreDesc_id', label: 'Empty Results Description (ID)', type: 'textarea' },
            { name: 'emptyStoreDesc_en', label: 'Empty Results Description (EN)', type: 'textarea' },
            { name: 'showAllProducts_id', label: 'Show All Button text (ID)', type: 'text' },
            { name: 'showAllProducts_en', label: 'Show All Button text (EN)', type: 'text' }
          ]
        },
        backgrounds: {
          title: '🎨 Warna Latar Belakang Page',
          fields: [
            { name: 'bg_store_main', label: 'Latar Belakang Utama Halaman Galeri', type: 'color' },
            { name: 'text_store_header_title', label: '🖊️ Warna Teks Judul — Header Galeri/Artwork', type: 'color' },
            { name: 'text_store_header_body', label: '🖊️ Warna Teks Paragraf — Header Galeri/Artwork', type: 'color' },
          ]
        }
      }
    },
    classes: {
      title: 'Halaman Kelas & Akademi (Classes)',
      sections: {
        header: {
          title: 'Classes Headings & Labels',
          fields: [
            { name: 'classesTitle_id', label: 'Classes Main Title (ID)', type: 'text' },
            { name: 'classesTitle_en', label: 'Classes Main Title (EN)', type: 'text' },
            { name: 'classesSubtitle_id', label: 'Classes Subtitle (ID)', type: 'textarea' },
            { name: 'classesSubtitle_en', label: 'Classes Subtitle (EN)', type: 'textarea' },
            { name: 'classesSearchPlaceholder_id', label: 'Search Input Placeholder (ID)', type: 'text' },
            { name: 'classesSearchPlaceholder_en', label: 'Search Input Placeholder (EN)', type: 'text' },
            { name: 'resultsCountClasses_id', label: 'Results Count text (ID - gunakan {count})', type: 'text' },
            { name: 'resultsCountClasses_en', label: 'Results Count text (EN - gunakan {count})', type: 'text' },
            { name: 'emptyClassesTitle_id', label: 'Empty Results Title (ID)', type: 'text' },
            { name: 'emptyClassesTitle_en', label: 'Empty Results Title (EN)', type: 'text' },
            { name: 'emptyClassesDesc_id', label: 'Empty Results Description (ID)', type: 'textarea' },
            { name: 'emptyClassesDesc_en', label: 'Empty Results Description (EN)', type: 'textarea' },
            { name: 'showAllClasses_id', label: 'Show All Button text (ID)', type: 'text' },
            { name: 'showAllClasses_en', label: 'Show All Button text (EN)', type: 'text' }
          ]
        },
        backgrounds: {
          title: '🎨 Warna Latar Belakang Page',
          fields: [
            { name: 'bg_classes_main', label: 'Latar Belakang Utama Halaman Kelas', type: 'color' },
            { name: 'text_classes_header_title', label: '🖊️ Warna Teks Judul — Header Kelas', type: 'color' },
            { name: 'text_classes_header_body', label: '🖊️ Warna Teks Paragraf — Header Kelas', type: 'color' },
          ]
        }
      }
    },
    blog: {
      title: 'Halaman Kumpulan Blog',
      sections: {
        header: {
          title: 'Blog Page Headings',
          fields: [
            { name: 'blogHeaderTitleText_id', label: 'Header Title Text (ID)', type: 'text' },
            { name: 'blogHeaderTitleText_en', label: 'Header Title Text (EN)', type: 'text' },
            { name: 'blogHeaderTitleSpan_id', label: 'Header Title Highlighted (ID) — teks beraksen cursive', type: 'text' },
            { name: 'blogHeaderTitleSpan_en', label: 'Header Title Highlighted (EN) — teks beraksen cursive', type: 'text' },
            { name: 'blogHeaderTitleLayout', label: 'Posisi Teks Highlight (Judul Blog)', type: 'select', defaultValue: 'auto', options: LAYOUT_OPTIONS },
            { name: 'blogHeaderDesc_id', label: 'Header Description (ID)', type: 'textarea' },
            { name: 'blogHeaderDesc_en', label: 'Header Description (EN)', type: 'textarea' },
            { name: 'blogFeaturedTag_id', label: 'Featured Article Tag (ID)', type: 'text' },
            { name: 'blogFeaturedTag_en', label: 'Featured Article Tag (EN)', type: 'text' },
            { name: 'blogLatestTitle_id', label: 'Latest Section Header (ID)', type: 'text' },
            { name: 'blogLatestTitle_en', label: 'Latest Section Header (EN)', type: 'text' },
            { name: 'blogReadFullBtn_id', label: 'Read Full Article Button (ID)', type: 'text' },
            { name: 'blogReadFullBtn_en', label: 'Read Full Article Button (EN)', type: 'text' },
            { name: 'blogEmpty_id', label: 'Empty Blog Warning (ID)', type: 'textarea' },
            { name: 'blogEmpty_en', label: 'Empty Blog Warning (EN)', type: 'textarea' }
          ]
        },
        about_berseni: {
          title: 'Tentang Berseni (Di Bawah Artikel)',
          fields: [
            { name: 'blogAboutTitle_id', label: 'Judul Tentang Berseni (ID)', type: 'text' },
            { name: 'blogAboutTitle_en', label: 'Judul Tentang Berseni (EN)', type: 'text' },
            { name: 'blogAboutDesc_id', label: 'Deskripsi Tentang Berseni (ID)', type: 'textarea' },
            { name: 'blogAboutDesc_en', label: 'Deskripsi Tentang Berseni (EN)', type: 'textarea' }
          ]
        },
        backgrounds: {
          title: '🎨 Warna Latar Belakang Page & Detail',
          fields: [
            { name: 'bg_blog_header', label: 'Latar Belakang Header Halaman Blog', type: 'color' },
            { name: 'bg_blog_content', label: 'Latar Belakang Konten Daftar Blog', type: 'color' },
            { name: 'bg_blog_detail_main', label: 'Latar Belakang Utama Detail Artikel (Detail Blog)', type: 'color' },
            { name: 'bg_blog_detail_cta', label: 'Latar Belakang CTA Detail Artikel (Detail Blog)', type: 'color' },
            { name: 'text_blog_header_title', label: '🖊️ Warna Teks Judul — Header Blog', type: 'color' },
            { name: 'text_blog_header_body', label: '🖊️ Warna Teks Paragraf — Header Blog', type: 'color' },
            { name: 'text_blog_about_title', label: '🖊️ Warna Teks Judul — Tentang Berseni', type: 'color' },
            { name: 'text_blog_about_body', label: '🖊️ Warna Teks Paragraf — Tentang Berseni', type: 'color' },
          ]
        }
      }
    }
  };

  // MisiListSection di-hoist ke module scope (didefinisikan di atas komponen ini)
  // agar tidak remount & kehilangan fokus input saat mengetik.

  const currentPageConfig = pagesConfig[selectedPage];

  return (
    <div className={styles.editorCard}>
      <h2 className={styles.editorTitle}>Rombak & Sunting Konten Halaman Web</h2>

      {/* Dropdown Page Selector */}
      <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <span style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--color-text-dark)' }}>PILIH HALAMAN:</span>
        <select
          value={selectedPage}
          onChange={(e) => { setSelectedPage(e.target.value); setActiveSection(Object.keys(pagesConfig[e.target.value].sections)[0]); }}
          className={styles.adminSelect}
          style={{ maxWidth: '300px', fontWeight: 'bold' }}
        >
          {Object.keys(pagesConfig).map(p => (
            <option key={p} value={p}>{pagesConfig[p].title}</option>
          ))}
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '2rem', marginTop: '1rem' }}>
        {/* Section Tabs inside selected page */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderRight: '1px solid #E2E8F0', paddingRight: '1rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Sections</span>
          {Object.keys(currentPageConfig.sections).map(secKey => (
            <button
              key={secKey}
              type="button"
              className={`${styles.menuItem} ${activeSection === secKey ? styles.menuItemActive : ''}`}
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                border: 'none',
                background: 'transparent',
                textAlign: 'left',
                justifyContent: 'flex-start',
                fontSize: '0.85rem'
              }}
              onClick={() => setActiveSection(secKey)}
            >
              {currentPageConfig.sections[secKey].title}
            </button>
          ))}
        </aside>

        {/* Section Editor Form */}
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--color-tosca)', marginBottom: '1.5rem', borderBottom: '1px dashed #E2E8F0', paddingBottom: '0.5rem' }}>
            {currentPageConfig.sections[activeSection].title}
          </h3>

          <form onSubmit={handleSubmit}>
            <div className={styles.formGrid}>
              {currentPageConfig.sections[activeSection].fields.map(field => (
                <div key={field.name} className={(field.type === 'textarea' || field.type === 'image' || field.type === 'video' || field.type === 'color' || field.type === 'icon') ? styles.formGridFull : ''}>
                  {field.type === 'image' || field.type === 'video' ? (
                    <MediaUploadInput
                      label={field.label}
                      name={field.name}
                      value={form[field.name] || ''}
                      type={field.type}
                      showToast={showToast}
                      onChange={(name, val) => updateForm(prev => ({ ...prev, [name]: val }))}
                    />
                  ) : field.type === 'icon' ? (
                    <IconUploadInput
                      label={field.label}
                      hint={field.hint}
                      name={field.name}
                      value={form[field.name] || ''}
                      showToast={showToast}
                      onChange={(name, val) => updateForm(prev => ({ ...prev, [name]: val }))}
                    />
                  ) : field.type === 'color' ? (
                    <ColorPickerInput
                      label={field.label}
                      name={field.name}
                      value={form[field.name] || ''}
                      onChange={(name, val) => updateForm(prev => ({ ...prev, [name]: val }))}
                    />
                  ) : field.type === 'textarea' ? (
                    <>
                      <label className={styles.adminLabel}>{field.label}</label>
                      <RichTextArea
                        name={field.name}
                        value={form[field.name] || ''}
                        onChange={handleChange}
                        placeholder={field.placeholder || `Masukkan teks ${field.label}...`}
                      variant={field.variant}
                      />
                    </>
                  ) : field.type === 'select' ? (
                    <>
                      <label className={styles.adminLabel}>{field.label}</label>
                      <select
                        name={field.name}
                        value={form[field.name] || field.defaultValue || ''}
                        onChange={handleChange}
                        className={styles.adminSelect}
                        style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #CBD5E1', outline: 'none' }}
                      >
                        {field.options.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </>
                  ) : (
                    <>
                      <label className={styles.adminLabel}>{field.label}</label>
                      <input
                        type="text"
                        name={field.name}
                        value={form[field.name] || ''}
                        onChange={handleChange}
                        placeholder={field.placeholder || `Masukkan ${field.label}...`}
                        className={styles.adminInput}
                      />
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Custom render for Visi & Misi list */}
            {currentPageConfig.sections[activeSection].customRender === 'visimisi_list' && (
              <MisiListSection
                misiListId={form.misiList_id}
                misiListEn={form.misiList_en}
                onMisiChange={handleMisiChange}
                onRemoveMisi={removeMisiItem}
                onAddMisi={addMisiItem}
              />
            )}

            {/* Custom render for Activities list */}
            {currentPageConfig.sections[activeSection].customRender === 'activities_editor' && (
              <ActivitiesEditorSection form={form} setForm={updateForm} showToast={showToast} />
            )}

            {/* Custom render for Footer socials list */}
            {currentPageConfig.sections[activeSection].customRender === 'footer_socials_editor' && (
              <FooterSocialsEditorSection form={form} setForm={updateForm} showToast={showToast} />
            )}

            {/* Custom render for Partners list */}
            {currentPageConfig.sections[activeSection].customRender === 'partners_editor' && (
              <PartnersEditorSection form={form} setForm={updateForm} showToast={showToast} />
            )}

            {/* Custom render for Testimonials list */}
            {currentPageConfig.sections[activeSection].customRender === 'testimonials_editor' && (
              <TestimonialsEditorSection form={form} setForm={updateForm} showToast={showToast} />
            )}

            <div className={styles.formActions} style={{ marginTop: '2rem' }}>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
                style={{ minWidth: '150px' }}
              >
                {saving ? 'Menyimpan...' : 'Simpan Section'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
