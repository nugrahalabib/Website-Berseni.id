'use client';

import { useState, useEffect } from 'react';
import styles from '@/styles/Admin.module.css';

export default function ContentEditor({ showToast }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    heroTitle_id: '',
    heroTitle_en: '',
    heroSubtitle_id: '',
    heroSubtitle_en: '',
    heroDescription_id: '',
    heroDescription_en: '',
    aboutTitle_id: '',
    aboutTitle_en: '',
    aboutSubtitle_id: '',
    aboutSubtitle_en: '',
    aboutDescription_id: '',
    aboutDescription_en: '',
    visiTitle_id: '',
    visiTitle_en: '',
    visiDescription_id: '',
    visiDescription_en: '',
    misiList_id: [],
    misiList_en: [],
    statsUsers: '',
    statsDescription_id: '',
    statsDescription_en: ''
  });

  const [newMisiId, setNewMisiId] = useState('');
  const [newMisiEn, setNewMisiEn] = useState('');

  // Muat data teks awal
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch('/api/content');
        if (res.ok) {
          const data = await res.json();
          setForm({
            heroTitle_id: data.heroTitle_id || '',
            heroTitle_en: data.heroTitle_en || '',
            heroSubtitle_id: data.heroSubtitle_id || '',
            heroSubtitle_en: data.heroSubtitle_en || '',
            heroDescription_id: data.heroDescription_id || '',
            heroDescription_en: data.heroDescription_en || '',
            aboutTitle_id: data.aboutTitle_id || '',
            aboutTitle_en: data.aboutTitle_en || '',
            aboutSubtitle_id: data.aboutSubtitle_id || '',
            aboutSubtitle_en: data.aboutSubtitle_en || '',
            aboutDescription_id: data.aboutDescription_id || '',
            aboutDescription_en: data.aboutDescription_en || '',
            visiTitle_id: data.visiTitle_id || '',
            visiTitle_en: data.visiTitle_en || '',
            visiDescription_id: data.visiDescription_id || '',
            visiDescription_en: data.visiDescription_en || '',
            misiList_id: data.misiList_id || [],
            misiList_en: data.misiList_en || [],
            statsUsers: data.statsUsers || '',
            statsDescription_id: data.statsDescription_id || '',
            statsDescription_en: data.statsDescription_en || ''
          });
        }
      } catch (err) {
        console.error("Gagal memuat konten:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleMisiChange = (index, lang, value) => {
    const fieldName = `misiList_${lang}`;
    const list = [...form[fieldName]];
    list[index] = value;
    setForm(prev => ({ ...prev, [fieldName]: list }));
  };

  const addMisiItem = () => {
    if (newMisiId.trim() === '' || newMisiEn.trim() === '') {
      alert('Teks Misi (ID & EN) keduanya harus diisi untuk menambahkan baris baru!');
      return;
    }
    setForm(prev => ({
      ...prev,
      misiList_id: [...prev.misiList_id, newMisiId.trim()],
      misiList_en: [...prev.misiList_en, newMisiEn.trim()]
    }));
    setNewMisiId('');
    setNewMisiEn('');
  };

  const removeMisiItem = (index) => {
    const listId = form.misiList_id.filter((_, idx) => idx !== index);
    const listEn = form.misiList_en.filter((_, idx) => idx !== index);
    setForm(prev => ({ ...prev, misiList_id: listId, misiList_en: listEn }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (res.ok) {
        showToast('Konten website berhasil diperbarui!');
      } else {
        const data = await res.json();
        alert(data.error || 'Gagal menyimpan data.');
      }
    } catch (err) {
      alert('Terjadi kesalahan koneksi.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className={styles.editorCard}>Memuat editor teks...</div>;
  }

  return (
    <div className={styles.editorCard}>
      <h2 className={styles.editorTitle}>Edit Teks Landing Page (Bilingual ID & EN)</h2>
      
      <form onSubmit={handleSubmit}>
        <div className={styles.formGrid}>
          {/* Section 1: Hero Section */}
          <div className={styles.formGridFull}>
            <h3 style={{ fontSize: '1rem', color: 'var(--color-tosca)', marginBottom: '1.5rem', fontWeight: 800 }}>Hero Banner</h3>
          </div>
          
          <div>
            <label className={styles.adminLabel}>Hero Subtitle / Overline (ID)</label>
            <input
              type="text"
              name="heroSubtitle_id"
              className={styles.adminInput}
              value={form.heroSubtitle_id}
              onChange={handleChange}
              placeholder="e.g. Learn. Create. Experience."
              required
            />
          </div>
          
          <div>
            <label className={styles.adminLabel}>Hero Subtitle / Overline (EN)</label>
            <input
              type="text"
              name="heroSubtitle_en"
              className={styles.adminInput}
              value={form.heroSubtitle_en}
              onChange={handleChange}
              placeholder="e.g. Learn. Create. Experience."
              required
            />
          </div>

          <div>
            <label className={styles.adminLabel}>Hero Title (ID - gunakan titik '.' untuk cursive)</label>
            <input
              type="text"
              name="heroTitle_id"
              className={styles.adminInput}
              value={form.heroTitle_id}
              onChange={handleChange}
              placeholder="e.g. Experience Art. Feel Indonesia."
              required
            />
          </div>
          
          <div>
            <label className={styles.adminLabel}>Hero Title (EN - gunakan titik '.' untuk cursive)</label>
            <input
              type="text"
              name="heroTitle_en"
              className={styles.adminInput}
              value={form.heroTitle_en}
              onChange={handleChange}
              placeholder="e.g. Experience Art. Feel Indonesia."
              required
            />
          </div>

          <div>
            <label className={styles.adminLabel}>Hero Description (ID)</label>
            <textarea
              name="heroDescription_id"
              className={styles.adminTextarea}
              value={form.heroDescription_id}
              onChange={handleChange}
              placeholder="Masukkan deskripsi banner utama dalam Bahasa Indonesia..."
              required
            />
          </div>

          <div>
            <label className={styles.adminLabel}>Hero Description (EN)</label>
            <textarea
              name="heroDescription_en"
              className={styles.adminTextarea}
              value={form.heroDescription_en}
              onChange={handleChange}
              placeholder="Enter main banner description in English..."
              required
            />
          </div>

          {/* Section 2: About Us */}
          <div className={styles.formGridFull} style={{ marginTop: '2rem' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--color-tosca)', marginBottom: '1.5rem', fontWeight: 800 }}>Tentang Kami (Story)</h3>
          </div>

          <div>
            <label className={styles.adminLabel}>About Title (ID)</label>
            <input
              type="text"
              name="aboutTitle_id"
              className={styles.adminInput}
              value={form.aboutTitle_id}
              onChange={handleChange}
              placeholder="e.g. When passion meets arts"
              required
            />
          </div>
          
          <div>
            <label className={styles.adminLabel}>About Title (EN)</label>
            <input
              type="text"
              name="aboutTitle_en"
              className={styles.adminInput}
              value={form.aboutTitle_en}
              onChange={handleChange}
              placeholder="e.g. When passion meets arts"
              required
            />
          </div>

          <div>
            <label className={styles.adminLabel}>About Subtitle (ID)</label>
            <input
              type="text"
              name="aboutSubtitle_id"
              className={styles.adminInput}
              value={form.aboutSubtitle_id}
              onChange={handleChange}
              placeholder="e.g. Gerbang Utama Anda Menuju Dunia Seniman"
              required
            />
          </div>
          
          <div>
            <label className={styles.adminLabel}>About Subtitle (EN)</label>
            <input
              type="text"
              name="aboutSubtitle_en"
              className={styles.adminInput}
              value={form.aboutSubtitle_en}
              onChange={handleChange}
              placeholder="e.g. Your Gateway to the World of Artists"
              required
            />
          </div>

          <div>
            <label className={styles.adminLabel}>About Description (ID)</label>
            <textarea
              name="aboutDescription_id"
              className={styles.adminTextarea}
              style={{ minHeight: '180px' }}
              value={form.aboutDescription_id}
              onChange={handleChange}
              placeholder="Masukkan cerita tentang Berseni..."
              required
            />
          </div>

          <div>
            <label className={styles.adminLabel}>About Description (EN)</label>
            <textarea
              name="aboutDescription_en"
              className={styles.adminTextarea}
              style={{ minHeight: '180px' }}
              value={form.aboutDescription_en}
              onChange={handleChange}
              placeholder="Enter story about Berseni in English..."
              required
            />
          </div>

          {/* Section 3: Visi & Misi */}
          <div className={styles.formGridFull} style={{ marginTop: '2rem' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--color-tosca)', marginBottom: '1.5rem', fontWeight: 800 }}>Visi & Misi</h3>
          </div>

          <div>
            <label className={styles.adminLabel}>Judul Visi (ID)</label>
            <input
              type="text"
              name="visiTitle_id"
              className={styles.adminInput}
              value={form.visiTitle_id}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <label className={styles.adminLabel}>Judul Visi (EN)</label>
            <input
              type="text"
              name="visiTitle_en"
              className={styles.adminInput}
              value={form.visiTitle_en}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className={styles.adminLabel}>Deskripsi Visi (ID)</label>
            <textarea
              name="visiDescription_id"
              className={styles.adminTextarea}
              value={form.visiDescription_id}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className={styles.adminLabel}>Deskripsi Visi (EN)</label>
            <textarea
              name="visiDescription_en"
              className={styles.adminTextarea}
              value={form.visiDescription_en}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGridFull}>
            <label className={styles.adminLabel} style={{ marginBottom: '1rem' }}>Misi List (Daftar Misi - ID & EN Berpasangan)</label>
            {form.misiList_id.map((misi, index) => (
              <div key={index} className={styles.misiInputGroup} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 42px', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <input
                  type="text"
                  className={styles.adminInput}
                  value={misi}
                  onChange={(e) => handleMisiChange(index, 'id', e.target.value)}
                  placeholder={`Misi ${index + 1} (Indonesian)`}
                  required
                />
                <input
                  type="text"
                  className={styles.adminInput}
                  value={form.misiList_en[index] || ''}
                  onChange={(e) => handleMisiChange(index, 'en', e.target.value)}
                  placeholder={`Mission ${index + 1} (English)`}
                  required
                />
                <button
                  type="button"
                  className={styles.misiRemoveBtn}
                  onClick={() => removeMisiItem(index)}
                  title="Hapus misi ini"
                  style={{ width: '42px', height: '100%' }}
                >
                  ✕
                </button>
              </div>
            ))}
            
            {/* Input untuk menambah misi baru */}
            <div className={styles.misiInputGroup} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '0.5rem', marginTop: '1rem' }}>
              <input
                type="text"
                className={styles.adminInput}
                value={newMisiId}
                onChange={(e) => setNewMisiId(e.target.value)}
                placeholder="Misi Baru (Bahasa Indonesia)..."
              />
              <input
                type="text"
                className={styles.adminInput}
                value={newMisiEn}
                onChange={(e) => setNewMisiEn(e.target.value)}
                placeholder="New Mission (English)..."
              />
              <button
                type="button"
                className="btn btn-secondary"
                style={{ padding: '0 1.5rem', borderRadius: '10px', height: '100%', whiteSpace: 'nowrap' }}
                onClick={addMisiItem}
              >
                + Tambah
              </button>
            </div>
          </div>

          {/* Section 4: Statistics */}
          <div className={styles.formGridFull} style={{ marginTop: '2rem' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--color-tosca)', marginBottom: '1.5rem', fontWeight: 800 }}>Statistik Utama</h3>
          </div>

          <div>
            <label className={styles.adminLabel}>Angka Statistik (Unified)</label>
            <input
              type="text"
              name="statsUsers"
              className={styles.adminInput}
              value={form.statsUsers}
              onChange={handleChange}
              placeholder="e.g. 20k+"
              required
            />
          </div>
          
          <div style={{ display: 'none' }}></div> {/* Spacer */}

          <div>
            <label className={styles.adminLabel}>Label Statistik (ID)</label>
            <input
              type="text"
              name="statsDescription_id"
              className={styles.adminInput}
              value={form.statsDescription_id}
              onChange={handleChange}
              placeholder="e.g. Pengguna Berseni"
              required
            />
          </div>

          <div>
            <label className={styles.adminLabel}>Label Statistik (EN)</label>
            <input
              type="text"
              name="statsDescription_en"
              className={styles.adminInput}
              value={form.statsDescription_en}
              onChange={handleChange}
              placeholder="e.g. Berseni Users"
              required
            />
          </div>
        </div>

        <div className={styles.formActions}>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ minWidth: '150px' }}
            disabled={saving}
          >
            {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </form>
    </div>
  );
}
