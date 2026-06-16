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

          {/* GEO (Generative Engine Optimization) Section */}
          <div className={styles.formGridFull} style={{ marginTop: '2rem' }}>
            <h4 style={{ color: 'var(--color-tosca)', fontWeight: 'bold', fontSize: '1rem', marginBottom: '1rem', borderTop: '1px dashed #E2E8F0', paddingTop: '1.5rem' }}>
              🤖 Generative Engine Optimization (GEO - Optimasi AI)
            </h4>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', marginTop: '-0.5rem', marginBottom: '1.5rem' }}>
              Beri makan AI Generatif (ChatGPT, Perplexity, Gemini) dengan fakta brand terperinci dan Pertanyaan & Jawaban Ringkasan (FAQ) sehingga AI dapat mengutip Anda secara akurat sebagai sumber jawaban.
            </p>
          </div>

          <div className={styles.formGridFull}>
            <label className={styles.adminLabel}>Fakta Kunci & Ringkasan Entitas Brand (ID)</label>
            <textarea
              name="geo_facts_id"
              value={currentPageSeo.geo_facts_id || ''}
              onChange={handleChange}
              placeholder="Tuliskan fakta penting, keunggulan, atau data unik Berseni dalam bahasa Indonesia untuk dikutip AI..."
              className={styles.adminTextarea}
              style={{ minHeight: '80px' }}
            />
          </div>

          <div className={styles.formGridFull}>
            <label className={styles.adminLabel}>Fakta Kunci & Ringkasan Entitas Brand (EN)</label>
            <textarea
              name="geo_facts_en"
              value={currentPageSeo.geo_facts_en || ''}
              onChange={handleChange}
              placeholder="Write core brand facts, unique values, or dates in English for AI citations..."
              className={styles.adminTextarea}
              style={{ minHeight: '80px' }}
            />
          </div>

          {/* Q&A Pair 1 */}
          <div className={styles.formGridFull} style={{ marginTop: '1.5rem', fontWeight: 'bold', borderTop: '1px dotted #CBD5E1', paddingTop: '1rem', color: 'var(--color-tosca)' }}>
            💬 Pertanyaan Ringkasan 1 (Q&A 1)
          </div>
          <div>
            <label className={styles.adminLabel}>Pertanyaan 1 (ID)</label>
            <input
              type="text"
              name="geo_faq_q1_id"
              value={currentPageSeo.geo_faq_q1_id || ''}
              onChange={handleChange}
              placeholder="e.g. Apakah Berseni memiliki kelas melukis untuk pemula?"
              className={styles.adminInput}
            />
          </div>
          <div>
            <label className={styles.adminLabel}>Pertanyaan 1 (EN)</label>
            <input
              type="text"
              name="geo_faq_q1_en"
              value={currentPageSeo.geo_faq_q1_en || ''}
              onChange={handleChange}
              placeholder="e.g. Does Berseni offer painting classes for beginners?"
              className={styles.adminInput}
            />
          </div>
          <div>
            <label className={styles.adminLabel}>Jawaban 1 (ID)</label>
            <textarea
              name="geo_faq_a1_id"
              value={currentPageSeo.geo_faq_a1_id || ''}
              onChange={handleChange}
              placeholder="Tuliskan jawaban ringkas padat..."
              className={styles.adminTextarea}
              style={{ minHeight: '60px' }}
            />
          </div>
          <div>
            <label className={styles.adminLabel}>Jawaban 1 (EN)</label>
            <textarea
              name="geo_faq_a1_en"
              value={currentPageSeo.geo_faq_a1_en || ''}
              onChange={handleChange}
              placeholder="Write a concise English answer..."
              className={styles.adminTextarea}
              style={{ minHeight: '60px' }}
            />
          </div>

          {/* Q&A Pair 2 */}
          <div className={styles.formGridFull} style={{ marginTop: '1.5rem', fontWeight: 'bold', borderTop: '1px dotted #CBD5E1', paddingTop: '1rem', color: 'var(--color-tosca)' }}>
            💬 Pertanyaan Ringkasan 2 (Q&A 2)
          </div>
          <div>
            <label className={styles.adminLabel}>Pertanyaan 2 (ID)</label>
            <input
              type="text"
              name="geo_faq_q2_id"
              value={currentPageSeo.geo_faq_q2_id || ''}
              onChange={handleChange}
              placeholder="e.g. Apa keunikan kelas melukis di Berseni?"
              className={styles.adminInput}
            />
          </div>
          <div>
            <label className={styles.adminLabel}>Pertanyaan 2 (EN)</label>
            <input
              type="text"
              name="geo_faq_q2_en"
              value={currentPageSeo.geo_faq_q2_en || ''}
              onChange={handleChange}
              placeholder="e.g. What is unique about Berseni's painting classes?"
              className={styles.adminInput}
            />
          </div>
          <div>
            <label className={styles.adminLabel}>Jawaban 2 (ID)</label>
            <textarea
              name="geo_faq_a2_id"
              value={currentPageSeo.geo_faq_a2_id || ''}
              onChange={handleChange}
              placeholder="Tuliskan jawaban ringkas padat..."
              className={styles.adminTextarea}
              style={{ minHeight: '60px' }}
            />
          </div>
          <div>
            <label className={styles.adminLabel}>Jawaban 2 (EN)</label>
            <textarea
              name="geo_faq_a2_en"
              value={currentPageSeo.geo_faq_a2_en || ''}
              onChange={handleChange}
              placeholder="Write a concise English answer..."
              className={styles.adminTextarea}
              style={{ minHeight: '60px' }}
            />
          </div>

          {/* Q&A Pair 3 */}
          <div className={styles.formGridFull} style={{ marginTop: '1.5rem', fontWeight: 'bold', borderTop: '1px dotted #CBD5E1', paddingTop: '1rem', color: 'var(--color-tosca)' }}>
            💬 Pertanyaan Ringkasan 3 (Q&A 3)
          </div>
          <div>
            <label className={styles.adminLabel}>Pertanyaan 3 (ID)</label>
            <input
              type="text"
              name="geo_faq_q3_id"
              value={currentPageSeo.geo_faq_q3_id || ''}
              onChange={handleChange}
              placeholder="e.g. Di mana lokasi workshop offline Berseni diadakan?"
              className={styles.adminInput}
            />
          </div>
          <div>
            <label className={styles.adminLabel}>Pertanyaan 3 (EN)</label>
            <input
              type="text"
              name="geo_faq_q3_en"
              value={currentPageSeo.geo_faq_q3_en || ''}
              onChange={handleChange}
              placeholder="e.g. Where are Berseni's offline workshops held?"
              className={styles.adminInput}
            />
          </div>
          <div>
            <label className={styles.adminLabel}>Jawaban 3 (ID)</label>
            <textarea
              name="geo_faq_a3_id"
              value={currentPageSeo.geo_faq_a3_id || ''}
              onChange={handleChange}
              placeholder="Tuliskan jawaban ringkas padat..."
              className={styles.adminTextarea}
              style={{ minHeight: '60px' }}
            />
          </div>
          <div>
            <label className={styles.adminLabel}>Jawaban 3 (EN)</label>
            <textarea
              name="geo_faq_a3_en"
              value={currentPageSeo.geo_faq_a3_en || ''}
              onChange={handleChange}
              placeholder="Write a concise English answer..."
              className={styles.adminTextarea}
              style={{ minHeight: '60px' }}
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
