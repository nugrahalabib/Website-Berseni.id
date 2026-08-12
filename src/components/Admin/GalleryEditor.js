'use client';

import { useState, useEffect } from 'react';
import { uploadImage } from '@/lib/imageUpload';
import RichTextArea from '@/components/Admin/RichTextArea';
import styles from '@/styles/Admin.module.css';

const EMPTY_FORM = {
  id: '',
  image: '',
  title_id: '',
  title_en: '',
  caption_id: '',
  caption_en: '',
};

export default function GalleryEditor({ showToast, setIsDirty = () => {} }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [isEditing, setIsEditing] = useState(false);

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/gallery', { cache: 'no-store' });
      if (res.ok) setItems(await res.json());
    } catch (err) {
      console.error('Gagal memuat galeri:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
    setIsDirty(false);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setIsDirty(true);
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Upload memakai helper bersama: otomatis dikecilkan + diubah ke WebP,
  // jadi foto langsung dari kamera/HP pun tidak akan gagal.
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadImage(file);
      setIsDirty(true);
      setForm((prev) => ({ ...prev, image: url }));
      showToast('Foto berhasil diunggah dan dioptimasi!');
    } catch (err) {
      showToast(err.message || 'Gagal mengunggah foto.');
    } finally {
      setUploading(false);
      e.target.value = ''; // biar file yang sama bisa dipilih lagi
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.image) {
      showToast('Unggah fotonya dulu ya.');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/gallery', {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => null);
      if (res.ok) {
        showToast(isEditing ? 'Foto galeri diperbarui!' : 'Foto berhasil ditambahkan ke galeri!');
        handleCancel();
        fetchItems();
      } else {
        showToast((data && data.error) || 'Gagal menyimpan foto.');
      }
    } catch (err) {
      showToast('Koneksi bermasalah saat menyimpan.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item) => {
    setForm({ ...EMPTY_FORM, ...item });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setForm(EMPTY_FORM);
    setIsEditing(false);
    setIsDirty(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus foto ini dari galeri?')) return;
    try {
      const res = await fetch(`/api/gallery?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Foto dihapus.');
        fetchItems();
      } else {
        const data = await res.json().catch(() => null);
        showToast((data && data.error) || 'Gagal menghapus foto.');
      }
    } catch (err) {
      showToast('Koneksi bermasalah.');
    }
  };

  // Geser urutan tampil di halaman galeri
  const handleMove = async (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;

    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    setItems(next);

    try {
      const res = await fetch('/api/gallery', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(next),
      });
      if (res.ok) showToast('Urutan foto diperbarui!');
      else {
        showToast('Gagal menyimpan urutan.');
        fetchItems();
      }
    } catch (err) {
      showToast('Koneksi bermasalah saat mengubah urutan.');
      fetchItems();
    }
  };

  if (loading) {
    return (
      <div className={styles.tableCard} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '260px' }}>
        <div style={{ color: 'var(--color-tosca)', fontWeight: 'bold' }}>Memuat galeri...</div>
      </div>
    );
  }

  return (
    <div>
      {/* FORM TAMBAH / SUNTING */}
      <div className={styles.tableCard} style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1.25rem' }}>
          {isEditing ? 'Sunting Foto Galeri' : 'Tambah Foto Kegiatan'}
        </h3>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '1.5rem', alignItems: 'start' }}>
            {/* Kolom foto */}
            <div>
              <label className={styles.adminLabel}>Foto Kegiatan</label>
              <div
                style={{
                  width: '100%', aspectRatio: '4 / 3', borderRadius: '12px', overflow: 'hidden',
                  border: form.image ? '1px solid #CBD5E1' : '2px dashed #CBD5E1',
                  background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#94A3B8', fontSize: '0.8rem', marginBottom: '0.6rem',
                }}
              >
                {form.image ? (
                  <img src={form.image} alt="Pratinjau" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  'Belum ada foto'
                )}
              </div>

              <label className="btn btn-secondary" style={{ display: 'inline-block', cursor: 'pointer', fontSize: '0.78rem', padding: '0.45rem 0.9rem', borderRadius: '8px' }}>
                {uploading ? 'Mengunggah...' : 'Unggah Foto'}
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileUpload} disabled={uploading} />
              </label>
              <p style={{ fontSize: '0.7rem', color: '#64748B', marginTop: '0.4rem', lineHeight: 1.5 }}>
                Foto besar otomatis dikecilkan &amp; diubah ke WebP, jadi tidak akan gagal unggah.
              </p>
            </div>

            {/* Kolom teks */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label className={styles.adminLabel}>Judul Foto (ID)</label>
                <input type="text" name="title_id" value={form.title_id} onChange={handleChange}
                  placeholder="cth. Workshop Melukis di Kafe Senja" className={styles.adminInput} />
              </div>
              <div>
                <label className={styles.adminLabel}>Judul Foto (EN)</label>
                <input type="text" name="title_en" value={form.title_en} onChange={handleChange}
                  placeholder="e.g. Painting Workshop at Senja Cafe" className={styles.adminInput} />
              </div>
              <div>
                <label className={styles.adminLabel}>Keterangan (ID)</label>
                <RichTextArea name="caption_id" value={form.caption_id} onChange={handleChange}
                  placeholder="Ceritakan singkat momen ini..." />
              </div>
              <div>
                <label className={styles.adminLabel}>Keterangan (EN)</label>
                <RichTextArea name="caption_en" value={form.caption_en} onChange={handleChange}
                  placeholder="Briefly describe this moment..." />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
            {isEditing && (
              <button type="button" className="btn btn-outline" onClick={handleCancel} style={{ padding: '0.6rem 1.5rem', borderRadius: '10px' }}>
                Batal
              </button>
            )}
            <button type="submit" className="btn btn-primary" disabled={saving || uploading} style={{ padding: '0.6rem 1.8rem', borderRadius: '10px' }}>
              {saving ? 'Menyimpan...' : isEditing ? 'Simpan Perubahan' : 'Tambahkan ke Galeri'}
            </button>
          </div>
        </form>
      </div>

      {/* DAFTAR FOTO */}
      <div className={styles.tableCard}>
        <div className={styles.tableHeaderActions}>
          <h3>Foto di Galeri ({items.length})</h3>
        </div>

        {items.length === 0 ? (
          <p style={{ color: '#64748B', padding: '2rem 0', textAlign: 'center' }}>
            Belum ada foto. Tambahkan foto kegiatan pertama lewat form di atas.
          </p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' }}>
            {items.map((item, index) => (
              <div key={item.id} style={{ border: '1px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden', background: '#fff' }}>
                <div style={{ aspectRatio: '4 / 3', background: '#F1F5F9' }}>
                  <img src={item.image} alt={item.title_id || 'Foto galeri'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '0.75rem' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-text-dark)', marginBottom: '0.5rem', minHeight: '1.2rem' }}>
                    {item.title_id || <span style={{ color: '#94A3B8', fontWeight: 400 }}>(tanpa judul)</span>}
                  </div>
                  <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                    <button type="button" onClick={() => handleMove(index, -1)} disabled={index === 0}
                      title="Geser ke kiri/atas" style={btnSmall}>↑</button>
                    <button type="button" onClick={() => handleMove(index, 1)} disabled={index === items.length - 1}
                      title="Geser ke kanan/bawah" style={btnSmall}>↓</button>
                    <button type="button" onClick={() => handleEdit(item)} style={{ ...btnSmall, color: 'var(--color-tosca)' }}>Sunting</button>
                    <button type="button" onClick={() => handleDelete(item.id)} style={{ ...btnSmall, color: 'var(--color-maroon)' }}>Hapus</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const btnSmall = {
  padding: '0.3rem 0.6rem',
  fontSize: '0.72rem',
  fontWeight: 700,
  borderRadius: '7px',
  border: '1px solid #CBD5E1',
  background: '#fff',
  cursor: 'pointer',
};
