'use client';

import { useState, useEffect } from 'react';
import styles from '@/styles/Admin.module.css';

export default function ContentEditor({ showToast }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    heroTitle: '',
    heroSubtitle: '',
    heroDescription: '',
    aboutTitle: '',
    aboutSubtitle: '',
    aboutDescription: '',
    visiTitle: '',
    visiDescription: '',
    misiTitle: '',
    misiList: [],
    statsUsers: '',
    statsDescription: ''
  });

  const [newMisi, setNewMisi] = useState('');

  // Muat data teks awal
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch('/api/content');
        if (res.ok) {
          const data = await res.json();
          setForm({
            heroTitle: data.heroTitle || '',
            heroSubtitle: data.heroSubtitle || '',
            heroDescription: data.heroDescription || '',
            aboutTitle: data.aboutTitle || '',
            aboutSubtitle: data.aboutSubtitle || '',
            aboutDescription: data.aboutDescription || '',
            visiTitle: data.visiTitle || '',
            visiDescription: data.visiDescription || '',
            misiTitle: data.misiTitle || '',
            misiList: data.misiList || [],
            statsUsers: data.statsUsers || '',
            statsDescription: data.statsDescription || ''
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

  const handleMisiChange = (index, value) => {
    const list = [...form.misiList];
    list[index] = value;
    setForm(prev => ({ ...prev, misiList: list }));
  };

  const addMisiItem = () => {
    if (newMisi.trim() === '') return;
    setForm(prev => ({
      ...prev,
      misiList: [...prev.misiList, newMisi.trim()]
    }));
    setNewMisi('');
  };

  const removeMisiItem = (index) => {
    const list = form.misiList.filter((_, idx) => idx !== index);
    setForm(prev => ({ ...prev, misiList: list }));
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
      <h2 className={styles.editorTitle}>Edit Teks Landing Page</h2>
      
      <form onSubmit={handleSubmit}>
        <div className={styles.formGrid}>
          {/* Section 1: Hero Section */}
          <div className={styles.formGridFull}>
            <h3 style={{ fontSize: '1rem', color: 'var(--color-tosca)', marginBottom: '1rem', fontWeight: 800 }}>Hero Banner</h3>
          </div>
          
          <div>
            <label className={styles.adminLabel}>Hero Subtitle / Overline</label>
            <input
              type="text"
              name="heroSubtitle"
              className={styles.adminInput}
              value={form.heroSubtitle}
              onChange={handleChange}
              placeholder="e.g. Learn. Create. Experience."
            />
          </div>

          <div>
            <label className={styles.adminLabel}>Hero Title (Gunakan tanda titik '.' untuk pemisah cursive)</label>
            <input
              type="text"
              name="heroTitle"
              className={styles.adminInput}
              value={form.heroTitle}
              onChange={handleChange}
              placeholder="e.g. Experience Art. Feel Indonesia."
              required
            />
          </div>

          <div className={styles.formGridFull}>
            <label className={styles.adminLabel}>Hero Description</label>
            <textarea
              name="heroDescription"
              className={styles.adminTextarea}
              value={form.heroDescription}
              onChange={handleChange}
              placeholder="Masukkan teks paragraf penyambut..."
              required
            />
          </div>

          {/* Section 2: About Us */}
          <div className={styles.formGridFull} style={{ marginTop: '2rem' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--color-tosca)', marginBottom: '1rem', fontWeight: 800 }}>Tentang Kami (Story)</h3>
          </div>

          <div>
            <label className={styles.adminLabel}>About Title</label>
            <input
              type="text"
              name="aboutTitle"
              className={styles.adminInput}
              value={form.aboutTitle}
              onChange={handleChange}
              placeholder="e.g. When passion meets arts"
            />
          </div>

          <div>
            <label className={styles.adminLabel}>About Subtitle</label>
            <input
              type="text"
              name="aboutSubtitle"
              className={styles.adminInput}
              value={form.aboutSubtitle}
              onChange={handleChange}
              placeholder="e.g. Gerbang Utama Anda Menuju Dunia Seniman"
            />
          </div>

          <div className={styles.formGridFull}>
            <label className={styles.adminLabel}>About Description</label>
            <textarea
              name="aboutDescription"
              className={styles.adminTextarea}
              style={{ minHeight: '180px' }}
              value={form.aboutDescription}
              onChange={handleChange}
              placeholder="Masukkan cerita tentang Berseni..."
            />
          </div>

          {/* Section 3: Visi & Misi */}
          <div className={styles.formGridFull} style={{ marginTop: '2rem' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--color-tosca)', marginBottom: '1rem', fontWeight: 800 }}>Visi & Misi</h3>
          </div>

          <div>
            <label className={styles.adminLabel}>Judul Visi</label>
            <input
              type="text"
              name="visiTitle"
              className={styles.adminInput}
              value={form.visiTitle}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className={styles.adminLabel}>Deskripsi Visi</label>
            <textarea
              name="visiDescription"
              className={styles.adminTextarea}
              value={form.visiDescription}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGridFull}>
            <label className={styles.adminLabel}>Misi List (Daftar Misi)</label>
            {form.misiList.map((misi, index) => (
              <div key={index} className={styles.misiInputGroup}>
                <input
                  type="text"
                  className={styles.adminInput}
                  value={misi}
                  onChange={(e) => handleMisiChange(index, e.target.value)}
                  placeholder={`Misi ${index + 1}`}
                />
                <button
                  type="button"
                  className={styles.misiRemoveBtn}
                  onClick={() => removeMisiItem(index)}
                  title="Hapus misi ini"
                >
                  ✕
                </button>
              </div>
            ))}
            
            {/* Input untuk menambah misi baru */}
            <div className={styles.misiInputGroup} style={{ marginTop: '1rem' }}>
              <input
                type="text"
                className={styles.adminInput}
                value={newMisi}
                onChange={(e) => setNewMisi(e.target.value)}
                placeholder="Tambahkan misi baru..."
              />
              <button
                type="button"
                className="btn btn-secondary"
                style={{ padding: '0 1.5rem', borderRadius: '10px' }}
                onClick={addMisiItem}
              >
                + Tambah
              </button>
            </div>
          </div>

          {/* Section 4: Statistics */}
          <div className={styles.formGridFull} style={{ marginTop: '2rem' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--color-tosca)', marginBottom: '1rem', fontWeight: 800 }}>Statistik Utama</h3>
          </div>

          <div>
            <label className={styles.adminLabel}>Angka Statistik</label>
            <input
              type="text"
              name="statsUsers"
              className={styles.adminInput}
              value={form.statsUsers}
              onChange={handleChange}
              placeholder="e.g. 20k+"
            />
          </div>

          <div>
            <label className={styles.adminLabel}>Label Statistik</label>
            <input
              type="text"
              name="statsDescription"
              className={styles.adminInput}
              value={form.statsDescription}
              onChange={handleChange}
              placeholder="e.g. Pengguna Berseni"
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
