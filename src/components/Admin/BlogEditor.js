'use client';

import { useState, useEffect } from 'react';
import styles from '@/styles/Admin.module.css';

export default function BlogEditor({ showToast }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState(null); // null means listing mode, 'new' means creating, { ... } means editing
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form states
  const [form, setForm] = useState({
    originalSlug: '',
    slug: '',
    title_id: '',
    title_en: '',
    date: '',
    image: '',
    excerpt_id: '',
    excerpt_en: '',
    content_id: '',
    content_en: '',
    seoTitle_id: '',
    seoTitle_en: '',
    seoDescription_id: '',
    seoDescription_en: '',
    seoKeywords_id: '',
    seoKeywords_en: ''
  });

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/posts');
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (err) {
      console.error("Gagal memuat artikel blog:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Set form when edit button clicked
  const handleEditClick = (post) => {
    setEditingPost(post);
    setForm({
      originalSlug: post.slug,
      slug: post.slug,
      title_id: post.title_id || '',
      title_en: post.title_en || '',
      date: post.date || new Date().toLocaleDateString('id-ID'),
      image: post.image || '',
      excerpt_id: post.excerpt_id || '',
      excerpt_en: post.excerpt_en || '',
      content_id: post.content_id || '',
      content_en: post.content_en || '',
      seoTitle_id: post.seoTitle_id || '',
      seoTitle_en: post.seoTitle_en || '',
      seoDescription_id: post.seoDescription_id || '',
      seoDescription_en: post.seoDescription_en || '',
      seoKeywords_id: post.seoKeywords_id || '',
      seoKeywords_en: post.seoKeywords_en || ''
    });
  };

  // Set form when adding new post
  const handleAddNewClick = () => {
    setEditingPost('new');
    setForm({
      originalSlug: '',
      slug: '',
      title_id: '',
      title_en: '',
      date: new Date().toLocaleDateString('id-ID'),
      image: '',
      excerpt_id: '',
      excerpt_en: '',
      content_id: '',
      content_en: '',
      seoTitle_id: '',
      seoTitle_en: '',
      seoDescription_id: '',
      seoDescription_en: '',
      seoKeywords_id: '',
      seoKeywords_en: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => {
      const updated = { ...prev, [name]: value };
      
      // Auto-generate slug from title_id if user edits title and is creating a new post
      if (name === 'title_id' && editingPost === 'new') {
        updated.slug = value
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-');
      }
      return updated;
    });
  };

  // Image Upload handler
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        setForm(prev => ({ ...prev, image: data.url }));
        showToast('Gambar artikel berhasil diunggah!');
      } else {
        const errData = await res.json();
        alert(errData.error || 'Gagal mengunggah gambar');
      }
    } catch (err) {
      alert('Terjadi kesalahan koneksi saat mengunggah.');
    } finally {
      setUploading(false);
    }
  };

  // Submit Handler
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const isNew = editingPost === 'new';
    const endpoint = '/api/posts';
    const method = isNew ? 'POST' : 'PUT';

    try {
      const res = await fetch(endpoint, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (res.ok) {
        showToast(isNew ? 'Artikel baru berhasil diterbitkan!' : 'Artikel berhasil diperbarui!');
        setEditingPost(null);
        fetchPosts();
      } else {
        const errData = await res.json();
        alert(errData.error || 'Gagal memproses artikel.');
      }
    } catch (err) {
      alert('Terjadi kesalahan koneksi.');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Handler
  const handleDeleteClick = async (slug) => {
    if (!confirm('Apakah Anda yakin ingin menghapus artikel ini? Tindakan ini tidak bisa dibatalkan.')) {
      return;
    }

    try {
      const res = await fetch(`/api/posts?slug=${slug}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        showToast('Artikel berhasil dihapus!');
        fetchPosts();
      } else {
        const errData = await res.json();
        alert(errData.error || 'Gagal menghapus artikel.');
      }
    } catch (err) {
      alert('Terjadi kesalahan koneksi.');
    }
  };

  if (loading && posts.length === 0) {
    return (
      <div className={styles.tableCard} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
        <div style={{ color: 'var(--color-tosca)', fontWeight: 'bold' }}>Memuat database blog...</div>
      </div>
    );
  }

  return (
    <div>
      {/* 1. LIST VIEW */}
      {editingPost === null ? (
        <div className={styles.tableCard}>
          <div className={styles.tableHeaderActions}>
            <h3>Daftar Artikel Blog ({posts.length})</h3>
            <button className="btn btn-primary" onClick={handleAddNewClick}>
              + Tulis Artikel Baru
            </button>
          </div>

          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Gambar</th>
                  <th>Judul Artikel (ID)</th>
                  <th>Slug / URL</th>
                  <th>Tanggal Terbit</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.slug} className={styles.tableRow}>
                    <td>
                      <img
                        src={post.image || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=600&auto=format&fit=crop'}
                        alt={post.title_id}
                        className={styles.tableThumb}
                      />
                    </td>
                    <td>
                      <div style={{ fontWeight: 'bold', color: 'var(--color-text-dark)' }}>{post.title_id}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>EN: {post.title_en}</div>
                    </td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>/blog/{post.slug}</td>
                    <td>{post.date}</td>
                    <td>
                      <div className={styles.tableActions}>
                        <button
                          className={`${styles.actionBtn} ${styles.actionEdit}`}
                          onClick={() => handleEditClick(post)}
                          title="Edit Artikel"
                        >
                          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          className={`${styles.actionBtn} ${styles.actionDelete}`}
                          onClick={() => handleDeleteClick(post.slug)}
                          title="Hapus Artikel"
                        >
                          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {posts.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '2rem' }}>
                      Belum ada artikel blog yang terbit. Klik "+ Tulis Artikel Baru" di atas untuk memulai.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* 2. FORM VIEW (ADD / EDIT) */
        <div className={styles.editorCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px dashed #E2E8F0', paddingBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-dark)' }}>
              {editingPost === 'new' ? '📝 Tulis Artikel Baru' : '✏️ Sunting Artikel'}
            </h3>
            <button className="btn btn-outline" onClick={() => setEditingPost(null)} style={{ fontSize: '0.85rem' }}>
              Kembali ke Daftar
            </button>
          </div>

          <form onSubmit={handleFormSubmit}>
            <div className={styles.formGrid}>
              
              {/* Kolom Kiri: Data Utama */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <h4 style={{ color: 'var(--color-tosca)', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.5rem', fontWeight: 'bold' }}>Informasi Utama</h4>
                
                <div>
                  <label className={styles.adminLabel}>Judul Artikel (Bahasa Indonesia)</label>
                  <input
                    type="text"
                    name="title_id"
                    value={form.title_id}
                    onChange={handleInputChange}
                    placeholder="Masukkan judul artikel..."
                    className={styles.adminInput}
                    required
                  />
                </div>

                <div>
                  <label className={styles.adminLabel}>Judul Artikel (English)</label>
                  <input
                    type="text"
                    name="title_en"
                    value={form.title_en}
                    onChange={handleInputChange}
                    placeholder="Enter article title in English..."
                    className={styles.adminInput}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className={styles.adminLabel}>Slug URL unik</label>
                    <input
                      type="text"
                      name="slug"
                      value={form.slug}
                      onChange={handleInputChange}
                      placeholder="e.g. pentingnya-kuas-cat"
                      className={styles.adminInput}
                      required
                    />
                  </div>
                  <div>
                    <label className={styles.adminLabel}>Tanggal Terbit</label>
                    <input
                      type="text"
                      name="date"
                      value={form.date}
                      onChange={handleInputChange}
                      placeholder="e.g. 15/03/2026"
                      className={styles.adminInput}
                    />
                  </div>
                </div>

                <div>
                  <label className={styles.adminLabel}>Gambar Thumbnail Artikel</label>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <input
                      type="text"
                      name="image"
                      value={form.image}
                      onChange={handleInputChange}
                      placeholder="URL gambar (http://...) atau unggah di sebelah kanan"
                      className={styles.adminInput}
                      style={{ flexGrow: 1 }}
                    />
                    <div style={{ position: 'relative' }}>
                      <input
                        type="file"
                        accept="image/*"
                        id="blog-image-file"
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                      />
                      <label htmlFor="blog-image-file" className="btn btn-secondary" style={{ display: 'inline-block', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                        {uploading ? 'Mengunggah...' : 'Unggah File'}
                      </label>
                    </div>
                  </div>
                  {form.image && (
                    <div style={{ marginTop: '0.75rem', position: 'relative', width: '220px', height: '130px', borderRadius: '10px', overflow: 'hidden', border: '1px solid #E2E8F0' }}>
                      <img src={form.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button
                        type="button"
                        onClick={() => setForm(prev => ({ ...prev, image: '' }))}
                        className={styles.uploadRemove}
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className={styles.adminLabel}>Excerpt / Ringkasan Singkat (ID)</label>
                  <textarea
                    name="excerpt_id"
                    value={form.excerpt_id}
                    onChange={handleInputChange}
                    placeholder="Masukkan ringkasan artikel singkat untuk kartu preview..."
                    className={styles.adminTextarea}
                    style={{ minHeight: '80px' }}
                  />
                </div>

                <div>
                  <label className={styles.adminLabel}>Excerpt / Ringkasan Singkat (EN)</label>
                  <textarea
                    name="excerpt_en"
                    value={form.excerpt_en}
                    onChange={handleInputChange}
                    placeholder="Enter short article excerpt for card preview in English..."
                    className={styles.adminTextarea}
                    style={{ minHeight: '80px' }}
                  />
                </div>
              </div>

              {/* Kolom Kanan: Konten Utama & SEO */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <h4 style={{ color: 'var(--color-tosca)', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.5rem', fontWeight: 'bold' }}>Konten Utama & SEO Tags</h4>

                <div>
                  <label className={styles.adminLabel}>Konten Lengkap Artikel (ID)</label>
                  <textarea
                    name="content_id"
                    value={form.content_id}
                    onChange={handleInputChange}
                    placeholder="Tulis seluruh paragraf artikel di sini..."
                    className={styles.adminTextarea}
                    style={{ minHeight: '160px' }}
                    required
                  />
                </div>

                <div>
                  <label className={styles.adminLabel}>Konten Lengkap Artikel (EN)</label>
                  <textarea
                    name="content_en"
                    value={form.content_en}
                    onChange={handleInputChange}
                    placeholder="Write whole article paragraphs in English here..."
                    className={styles.adminTextarea}
                    style={{ minHeight: '160px' }}
                    required
                  />
                </div>

                <div style={{ border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.25rem', backgroundColor: '#F8FAFC', marginTop: '0.5rem' }}>
                  <h5 style={{ fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '1rem', color: 'var(--color-text-dark)' }}>⚙️ Metadata SEO & GEO Khusus Artikel</h5>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div>
                      <label className={styles.adminLabel} style={{ fontSize: '0.75rem' }}>SEO Title Custom (ID)</label>
                      <input
                        type="text"
                        name="seoTitle_id"
                        value={form.seoTitle_id}
                        onChange={handleInputChange}
                        placeholder="Default menggunakan judul artikel"
                        className={styles.adminInput}
                        style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                      />
                    </div>
                    <div>
                      <label className={styles.adminLabel} style={{ fontSize: '0.75rem' }}>SEO Title Custom (EN)</label>
                      <input
                        type="text"
                        name="seoTitle_en"
                        value={form.seoTitle_en}
                        onChange={handleInputChange}
                        placeholder="Default menggunakan english title"
                        className={styles.adminInput}
                        style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                      />
                    </div>
                    <div>
                      <label className={styles.adminLabel} style={{ fontSize: '0.75rem' }}>SEO Description (ID)</label>
                      <textarea
                        name="seoDescription_id"
                        value={form.seoDescription_id}
                        onChange={handleInputChange}
                        placeholder="Default menggunakan ringkasan / excerpt"
                        className={styles.adminTextarea}
                        style={{ minHeight: '60px', padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                      />
                    </div>
                    <div>
                      <label className={styles.adminLabel} style={{ fontSize: '0.75rem' }}>SEO Description (EN)</label>
                      <textarea
                        name="seoDescription_en"
                        value={form.seoDescription_en}
                        onChange={handleInputChange}
                        placeholder="Default menggunakan english excerpt"
                        className={styles.adminTextarea}
                        style={{ minHeight: '60px', padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                      />
                    </div>
                    <div>
                      <label className={styles.adminLabel} style={{ fontSize: '0.75rem' }}>SEO Keywords (ID)</label>
                      <input
                        type="text"
                        name="seoKeywords_id"
                        value={form.seoKeywords_id}
                        onChange={handleInputChange}
                        placeholder="e.g. lukisan sejarah, cat minyak, berseni blog"
                        className={styles.adminInput}
                        style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                      />
                    </div>
                    <div>
                      <label className={styles.adminLabel} style={{ fontSize: '0.75rem' }}>SEO Keywords (EN)</label>
                      <input
                        type="text"
                        name="seoKeywords_en"
                        value={form.seoKeywords_en}
                        onChange={handleInputChange}
                        placeholder="e.g. history painting, oil brush, berseni blog"
                        className={styles.adminInput}
                        style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                      />
                    </div>
                  </div>
                </div>

              </div>
            </div>

            <div className={styles.formActions} style={{ marginTop: '2.5rem' }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setEditingPost(null)}
                style={{ marginRight: '1rem' }}
              >
                Batal
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
                style={{ minWidth: '150px' }}
              >
                {submitting ? 'Menyimpan...' : (editingPost === 'new' ? 'Terbitkan Artikel' : 'Simpan Perubahan')}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
