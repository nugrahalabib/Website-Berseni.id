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
    blog: 'Halaman Kumpulan Blog (Blog)',
    global: 'Integrasi Meta Pixel'
  };

  const currentPageSeo = seoData[selectedPage] || {};

  return (
    <div className={styles.editorCard}>
      <h2 className={styles.editorTitle}>Pengaturan Global Meta SEO & GEO Tag</h2>
      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '2rem', marginTop: '-1rem' }}>
        Konfigurasikan judul halaman, deskripsi pencarian, kata kunci, lokasi geografis (GEO Tag), serta integrasi pelacakan pihak ketiga seperti Meta Pixel.
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
        {selectedPage === 'global' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            {/* Left Column: Form Inputs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <h4 style={{ color: 'var(--color-tosca)', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                  🔗 Pengaturan Integrasi & Tracking
                </h4>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                  Hubungkan website Berseni dengan layanan pelacakan eksternal untuk analitik iklan dan SEO Google.
                </p>
              </div>

              {/* Meta Pixel Config Card */}
              <div style={{ border: '1px solid #E2E8F0', padding: '1.25rem', borderRadius: '12px', background: '#F8FAFC' }}>
                <h5 style={{ color: 'var(--color-text-dark)', fontWeight: 'bold', fontSize: '0.95rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  📷 Meta Pixel (Facebook Pixel)
                </h5>
                
                <div style={{ marginBottom: '1rem' }}>
                  <label className={styles.adminLabel}>Status Integrasi</label>
                  <select
                    name="meta_pixel_enabled"
                    value={currentPageSeo.meta_pixel_enabled || 'false'}
                    onChange={handleChange}
                    className={styles.adminSelect}
                    style={{ marginBottom: '1rem' }}
                  >
                    <option value="false">Nonaktif (Matikan Tracking)</option>
                    <option value="true">Aktif (Mulai Melacak)</option>
                  </select>
                </div>

                <div>
                  <label className={styles.adminLabel}>Meta Pixel ID</label>
                  <input
                    type="text"
                    name="meta_pixel_id"
                    value={currentPageSeo.meta_pixel_id || ''}
                    onChange={handleChange}
                    placeholder="e.g. 123456789012345"
                    className={styles.adminInput}
                    required={currentPageSeo.meta_pixel_enabled === 'true'}
                  />
                </div>
              </div>

              {/* Google Search Console Config Card */}
              <div style={{ border: '1px solid #E2E8F0', padding: '1.25rem', borderRadius: '12px', background: '#F8FAFC' }}>
                <h5 style={{ color: 'var(--color-text-dark)', fontWeight: 'bold', fontSize: '0.95rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  🔍 Google Search Console
                </h5>

                <div>
                  <label className={styles.adminLabel}>Google Site Verification Token</label>
                  <input
                    type="text"
                    name="google_site_verification"
                    value={currentPageSeo.google_site_verification || ''}
                    onChange={handleChange}
                    placeholder="e.g. key_atau_token_panjang_dari_google"
                    className={styles.adminInput}
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Help Guides & Tutorials */}
            <div style={{ border: '1px solid #E2E8F0', padding: '1.5rem', borderRadius: '16px', background: '#FFFFFF', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <h4 style={{ color: 'var(--color-text-dark)', fontWeight: 'bold', fontSize: '1.05rem', marginBottom: '1.25rem', borderBottom: '1px dashed #E2E8F0', paddingBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                📖 Panduan Cara Integrasi
              </h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Meta Pixel Guide */}
                <div>
                  <h5 style={{ fontWeight: 'bold', fontSize: '0.85rem', color: 'var(--color-tosca)', marginBottom: '0.5rem' }}>
                    Cara Menghubungkan Meta Pixel:
                  </h5>
                  <ol style={{ fontSize: '0.8rem', color: '#475569', paddingLeft: '1.2rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <li>Masuk ke akun Facebook Ads Manager / Events Manager Anda.</li>
                    <li>Pilih menu <strong>Data Sources</strong> lalu pilih Pixel Anda.</li>
                    <li>Salin kode angka unik (Pixel ID) yang ada di bawah nama Pixel Anda (contoh: <code>123456789012345</code>).</li>
                    <li>Masukkan ID tersebut ke kolom di sebelah kiri, pilih status <strong>Aktif</strong>, lalu klik <strong>Simpan</strong>.</li>
                  </ol>
                </div>

                {/* GSC Guide */}
                <div>
                  <h5 style={{ fontWeight: 'bold', fontSize: '0.85rem', color: 'var(--color-tosca)', marginBottom: '0.5rem' }}>
                    Cara Verifikasi Google Search Console:
                  </h5>
                  <ol style={{ fontSize: '0.8rem', color: '#475569', paddingLeft: '1.2rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <li>Masuk ke <a href="https://search.google.com/search-console" target="_blank" rel="noreferrer" style={{ textDecoration: 'underline', color: 'var(--color-tosca)', fontWeight: 'bold' }}>Google Search Console</a>.</li>
                    <li>Masukkan domain/URL website Anda di bagian <strong>Awalan URL</strong> lalu lanjutkan.</li>
                    <li>Pilih metode verifikasi <strong>HTML Tag</strong>.</li>
                    <li>Google akan memberikan kode meta tag. Salin kode token panjang yang ada di dalam kutipan <code>content="..."</code> saja.</li>
                    <li>Tempel token tersebut ke kolom di sebelah kiri lalu klik <strong>Simpan</strong>.</li>
                    <li>Terakhir, kembali ke Google Search Console dan klik tombol <strong>Verify / Verifikasi</strong>.</li>
                  </ol>
                </div>

                {/* Sitemap Info Box */}
                <div style={{ padding: '0.75rem 1rem', background: '#F0FDFA', border: '1px solid #CCFBF1', borderRadius: '8px' }}>
                  <h6 style={{ fontWeight: 'bold', fontSize: '0.8rem', color: '#0F766E', margin: '0 0 0.25rem 0' }}>
                    💡 Informasi Penting Sitemap
                  </h6>
                  <p style={{ fontSize: '0.75rem', color: '#115E59', margin: 0, lineHeight: 1.4 }}>
                    Website ini secara otomatis membuat sitemap dinamis di alamat: <br />
                    <a href="/sitemap.xml" target="_blank" rel="noreferrer" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>/sitemap.xml</a> <br />
                    Daftarkan alamat sitemap ini di menu <strong>Sitemaps</strong> Google Search Console agar halaman produk dan blog baru diindeks secara otomatis.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
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
        )}

        <div className={styles.formActions} style={{ marginTop: '2.5rem' }}>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={saving}
            style={{ minWidth: '150px' }}
          >
            {saving ? 'Menyimpan...' : (selectedPage === 'global' ? 'Simpan Pengaturan' : 'Simpan SEO & GEO')}
          </button>
        </div>
      </form>
    </div>
  );
}
