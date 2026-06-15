'use client';

import { useState, useEffect, useRef } from 'react';
import styles from '@/styles/Admin.module.css';

export default function ProductEditor({ showToast }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // State untuk form tambah/edit
  const [form, setForm] = useState({
    id: '', // Kosong jika tambah baru
    title: '',
    category: 'artwork',
    price: '',
    image: '',
    description: '',
    specs: '',
    link: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);

  // Load daftar produk dari database
  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error("Gagal mengambil produk:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Logika kompresi gambar klien ke WebP sebelum upload
  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1200; // Resolusi maks 1200px lebar
          let width = img.width;
          let height = img.height;

          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              // Ganti ekstensi file asli menjadi .webp
              const cleanName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
              const compressedFile = new File([blob], cleanName, {
                type: 'image/webp',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            },
            'image/webp',
            0.8 // Kualitas kompresi 80% (sangat hemat berkas)
          );
        };
      };
    });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      // 1. Kompres gambar di sisi klien terlebih dahulu
      const optimizedFile = await compressImage(file);

      // 2. Kirim berkas terkompresi ke endpoint upload
      const formData = new FormData();
      formData.append('file', optimizedFile);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setForm(prev => ({ ...prev, image: data.url }));
        showToast('Gambar berhasil diunggah dan dioptimasi!');
      } else {
        alert(data.error || 'Gagal mengunggah gambar.');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat mengunggah.');
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (product) => {
    setForm({
      id: product.id,
      title: product.title,
      category: product.category,
      price: product.price,
      image: product.image,
      description: product.description || '',
      specs: product.specs || '',
      link: product.link
    });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus item ini?')) return;

    try {
      const res = await fetch(`/api/products?id=${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        showToast('Item berhasil dihapus!');
        fetchProducts();
      } else {
        const data = await res.json();
        alert(data.error || 'Gagal menghapus item.');
      }
    } catch (err) {
      alert('Koneksi bermasalah.');
    }
  };

  const handleCancel = () => {
    setForm({
      id: '',
      title: '',
      category: 'artwork',
      price: '',
      image: '',
      description: '',
      specs: '',
      link: ''
    });
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const method = isEditing ? 'PUT' : 'POST';

    try {
      const res = await fetch('/api/products', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (res.ok) {
        showToast(isEditing ? 'Data produk berhasil diperbarui!' : 'Produk baru berhasil ditambahkan!');
        handleCancel();
        fetchProducts();
      } else {
        const data = await res.json();
        alert(data.error || 'Gagal menyimpan data.');
      }
    } catch (err) {
      alert('Koneksi bermasalah saat menyimpan.');
    } finally {
      setSaving(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getCategoryLabel = (cat) => {
    switch (cat) {
      case 'artwork': return 'Lukisan';
      case 'online': return 'Kelas Online';
      case 'offline': return 'Workshop Offline';
      default: return cat;
    }
  };

  if (loading) {
    return <div className={styles.tableCard}>Memuat data produk...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      
      {/* 1. Form Editor Tambah/Edit */}
      <div className={styles.editorCard}>
        <h2 className={styles.editorTitle}>
          {isEditing ? `Edit Item: ${form.title}` : 'Tambah Karya Seni / Kelas Baru'}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            <div>
              <label className={styles.adminLabel}>Nama Karya / Nama Kelas</label>
              <input
                type="text"
                name="title"
                className={styles.adminInput}
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Workshop Melukis Bersama"
                required
              />
            </div>

            <div>
              <label className={styles.adminLabel}>Kategori</label>
              <select
                name="category"
                className={styles.adminSelect}
                value={form.category}
                onChange={handleChange}
              >
                <option value="artwork">Karya Seni (Lukisan)</option>
                <option value="offline">Workshop Offline (Event)</option>
                <option value="online">Kelas Online (Video)</option>
              </select>
            </div>

            <div>
              <label className={styles.adminLabel}>Harga (IDR / Rupiah)</label>
              <input
                type="number"
                name="price"
                className={styles.adminInput}
                value={form.price}
                onChange={handleChange}
                placeholder="e.g. 350000"
                required
              />
            </div>

            <div>
              <label className={styles.adminLabel}>Tautan Shopee / Lynk.id</label>
              <input
                type="url"
                name="link"
                className={styles.adminInput}
                value={form.link}
                onChange={handleChange}
                placeholder="e.g. https://lynk.id/berseni.id/..."
                required
              />
            </div>

            <div className={styles.formGridFull}>
              <label className={styles.adminLabel}>Deskripsi Singkat</label>
              <textarea
                name="description"
                className={styles.adminTextarea}
                value={form.description}
                onChange={handleChange}
                placeholder="Tuliskan latar belakang, makna karya, atau silabus kelas..."
              />
            </div>

            <div>
              <label className={styles.adminLabel}>Spesifikasi / Detail Teknis</label>
              <input
                type="text"
                name="specs"
                className={styles.adminInput}
                value={form.specs}
                onChange={handleChange}
                placeholder="e.g. Canvas 60x60cm / 5 Modul Video"
              />
            </div>

            {/* Upload Area */}
            <div>
              <label className={styles.adminLabel}>Gambar Karya / Banner Kelas</label>
              {form.image ? (
                <div className={styles.uploadPreview}>
                  <img src={form.image} alt="Preview" />
                  <button 
                    type="button" 
                    className={styles.uploadRemove}
                    onClick={() => setForm(prev => ({ ...prev, image: '' }))}
                    title="Hapus gambar"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div 
                  className={styles.uploadArea}
                  onClick={() => fileInputRef.current.click()}
                >
                  <svg width="24" height="24" fill="none" stroke="#64748B" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{uploading ? 'Mengunggah & Mengompres...' : 'Klik untuk Pilih Gambar (Maks 5MB)'}</span>
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploading}
                  />
                </div>
              )}
            </div>
          </div>

          <div className={styles.formActions}>
            {isEditing && (
              <button
                type="button"
                className="btn btn-outline"
                onClick={handleCancel}
                style={{ marginRight: '0.5rem' }}
              >
                Batal
              </button>
            )}
            <button
              type="submit"
              className="btn btn-primary"
              style={{ minWidth: '150px' }}
              disabled={saving || uploading}
            >
              {saving ? 'Menyimpan...' : 'Simpan Item'}
            </button>
          </div>
        </form>
      </div>

      {/* 2. Tabel Daftar Produk (CRUD List) */}
      <div className={styles.tableCard}>
        <div className={styles.tableHeaderActions}>
          <h3>Daftar Karya & Kelas Terbit</h3>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Gambar</th>
                <th>Nama</th>
                <th>Kategori</th>
                <th>Harga</th>
                <th>Tautan</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id} className={styles.tableRow}>
                    <td>
                      <img 
                        src={product.image} 
                        alt="" 
                        className={styles.tableThumb} 
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=600&auto=format&fit=crop';
                        }}
                      />
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--color-text-dark)' }}>{product.title}</td>
                    <td>
                      <span className={`${styles.tableBadge} ${
                        product.category === 'artwork' ? styles.badgeArtwork :
                        product.category === 'offline' ? styles.badgeOffline : styles.badgeOnline
                      }`}>
                        {getCategoryLabel(product.category)}
                      </span>
                    </td>
                    <td style={{ fontWeight: 800, color: 'var(--color-maroon)' }}>{formatPrice(product.price)}</td>
                    <td style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <a href={product.link} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-tosca)', textDecoration: 'underline', fontSize: '0.85rem' }}>
                        Tautan Shopee/Lynk
                      </a>
                    </td>
                    <td>
                      <div className={styles.tableActions}>
                        <button 
                          className={`${styles.actionBtn} ${styles.actionEdit}`}
                          onClick={() => handleEdit(product)}
                          title="Edit produk"
                        >
                          ✎
                        </button>
                        <button 
                          className={`${styles.actionBtn} ${styles.actionDelete}`}
                          onClick={() => handleDelete(product.id)}
                          title="Hapus produk"
                        >
                          ✕
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '2rem' }}>
                    Belum ada item yang terdaftar. Gunakan form di atas untuk menambahkan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
