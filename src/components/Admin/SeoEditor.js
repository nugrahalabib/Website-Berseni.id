'use client';

import { useState, useEffect } from 'react';
import styles from '@/styles/Admin.module.css';

export default function SeoEditor({ showToast }) {
  const [seoData, setSeoData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedPage, setSelectedPage] = useState('home');

  useEffect(() => {
    const fetchSeo = async () => {
      try {
        const res = await fetch('/api/seo');
        if (res.ok) {
          const data = await res.json();
          setSeoData(data);
        }
      } catch (err) {
        console.error("Gagal memuat SEO data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSeo();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSeoData(prev => ({
      ...prev,
      [selectedPage]: {
        ...(prev[selectedPage] || {}),
        [name]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch('/api/seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(seoData)
      });

      if (res.ok) {
        showToast('Pengaturan SEO & GEO halaman berhasil disimpan!');
      } else {
        const errData = await res.json();
        alert(errData.error || 'Gagal menyimpan data SEO.');
      }
    } catch (err) {
      alert('Terjadi kesalahan koneksi.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.editorCard} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
        <div style={{ color: 'var(--color-tosca)', fontWeight: 'bold' }}>Memuat data SEO/GEO...</div>
      </div>
    );
  }

  const pagesInfo = {
    home: 'Halaman Utama (Home)',
    about: 'Halaman Tentang Kami (About Us)',
    collaboration: 'Halaman Kemitraan (Collaboration)',
    store: 'Halaman Art Market (Store)',
    blog: 'Halaman Kumpulan Blog (Blog)'
  };

  const currentPageSeo = seoData[selectedPage] || {};

  return (
    <div className={styles.editorCard}>
      <h2 className={styles.editorTitle}>Pengaturan Global Meta SEO & GEO Tag</h2>
      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '2rem', marginTop: '-1rem' }}>
        Konfigurasikan judul halaman, deskripsi pencarian, kata kunci, dan lokasi geografis (GEO Tag) agar website terindeks sempurna oleh mesin pencari Google, Bing, maupun Bot AI.
      </p>

      {/* Page Select Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap', borderBottom: '2px solid #E2E8F0', paddingBottom: '1rem' }}>
        {Object.keys(pagesInfo).map((pageKey) => (
          <button
            key={pageKey}
            type="button"
            className={`${styles.menuItem} ${selectedPage === pageKey ? styles.menuItemActive : ''}`}
            onClick={() => setSelectedPage(pageKey)}
            style={{
              padding: '0.5rem 1rem',
              border: 'none',
              background: selectedPage === pageKey ? 'var(--color-tosca)' : 'transparent',
              color: selectedPage === pageKey ? 'var(--color-white)' : 'var(--color-text-dark)',
              fontSize: '0.85rem',
              borderRadius: '8px'
            }}
          >
            {pagesInfo[pageKey]}
          </button>
        ))}
      </div>

      {/* SEO Form */}
      <form onSubmit={handleSubmit}>
        <div className={styles.formGrid}>
          
          <div className={styles.formGridFull}>
            <h4 style={{ color: 'var(--color-tosca)', fontWeight: 'bold', fontSize: '1rem', marginBottom: '1rem' }}>
              🔍 Metadata SEO ({pagesInfo[selectedPage]})
            </h4>
          </div>

          <div>
            <label className={styles.adminLabel}>Meta Title Halaman (ID)</label>
            <input
              type="text"
              name="title_id"
              value={currentPageSeo.title_id || ''}
              onChange={handleChange}
              placeholder="e.g. Berseni - A World of Art For Everyone"
              className={styles.adminInput}
              required
            />
          </div>

          <div>
            <label className={styles.adminLabel}>Meta Title Halaman (EN)</label>
            <input
              type="text"
              name="title_en"
              value={currentPageSeo.title_en || ''}
              onChange={handleChange}
              placeholder="e.g. About Us | Berseni.id"
              className={styles.adminInput}
              required
            />
          </div>

          <div>
            <label className={styles.adminLabel}>Meta Description Pencarian (ID)</label>
            <textarea
              name="description_id"
              value={currentPageSeo.description_id || ''}
              onChange={handleChange}
              placeholder="Deskripsi singkat maksimal 160 karakter untuk muncul di hasil pencarian Google..."
              className={styles.adminTextarea}
              style={{ minHeight: '80px' }}
              required
            />
          </div>

          <div>
            <label className={styles.adminLabel}>Meta Description Pencarian (EN)</label>
            <textarea
              name="description_en"
              value={currentPageSeo.description_en || ''}
              onChange={handleChange}
              placeholder="Search snippet description for Google in English..."
              className={styles.adminTextarea}
              style={{ minHeight: '80px' }}
              required
            />
          </div>

          <div>
            <label className={styles.adminLabel}>Kata Kunci / Keywords (ID)</label>
            <input
              type="text"
              name="keywords_id"
              value={currentPageSeo.keywords_id || ''}
              onChange={handleChange}
              placeholder="pisahkan dengan koma, misal: kelas melukis, maesto seni, indonesia"
              className={styles.adminInput}
            />
          </div>

          <div>
            <label className={styles.adminLabel}>Kata Kunci / Keywords (EN)</label>
            <input
              type="text"
              name="keywords_en"
              value={currentPageSeo.keywords_en || ''}
              onChange={handleChange}
              placeholder="comma separated, e.g. art classes, painting masters, indonesia"
              className={styles.adminInput}
            />
          </div>

          {/* GEO Tags Section */}
          <div className={styles.formGridFull} style={{ marginTop: '2rem' }}>
            <h4 style={{ color: 'var(--color-tosca)', fontWeight: 'bold', fontSize: '1rem', marginBottom: '1rem', borderTop: '1px dashed #E2E8F0', paddingTop: '1.5rem' }}>
              📍 GEO Tags (Lokasi Geografis & Bisnis Lokal)
            </h4>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', marginTop: '-0.5rem', marginBottom: '1.5rem' }}>
              GEO tag membantu mesin pencari mengidentifikasi area target audiens dan lokasi operasional fisik utama Anda.
            </p>
          </div>

          <div>
            <label className={styles.adminLabel}>GEO Region Code</label>
            <input
              type="text"
              name="geo_region"
              value={currentPageSeo.geo_region || ''}
              onChange={handleChange}
              placeholder="e.g. ID-JK (Indonesia, DKI Jakarta)"
              className={styles.adminInput}
            />
          </div>

          <div>
            <label className={styles.adminLabel}>GEO Placename</label>
            <input
              type="text"
              name="geo_placename"
              value={currentPageSeo.geo_placename || ''}
              onChange={handleChange}
              placeholder="e.g. Jakarta"
              className={styles.adminInput}
            />
          </div>

          <div>
            <label className={styles.adminLabel}>GEO Position Coords (Semicolon separated)</label>
            <input
              type="text"
              name="geo_position"
              value={currentPageSeo.geo_position || ''}
              onChange={handleChange}
              placeholder="e.g. -6.2088;106.8456"
              className={styles.adminInput}
            />
          </div>

          <div>
            <label className={styles.adminLabel}>ICBM Coordinates (Comma separated)</label>
            <input
              type="text"
              name="geo_icbm"
              value={currentPageSeo.geo_icbm || ''}
              onChange={handleChange}
              placeholder="e.g. -6.2088, 106.8456"
              className={styles.adminInput}
            />
          </div>

        </div>

        <div className={styles.formActions} style={{ marginTop: '2.5rem' }}>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={saving}
            style={{ minWidth: '150px' }}
          >
            {saving ? 'Menyimpan...' : 'Simpan SEO & GEO'}
          </button>
        </div>
      </form>
    </div>
  );
}
