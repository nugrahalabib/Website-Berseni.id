'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PageContentEditor from './PageContentEditor';
import ProductEditor from './ProductEditor';
import BlogEditor from './BlogEditor';
import SeoEditor from './SeoEditor';
import AccountEditor from './AccountEditor';
import styles from '@/styles/Admin.module.css';

export default function DashboardClient() {
  const [activeTab, setActiveTab] = useState('overview');
  const [toastMessage, setToastMessage] = useState('');
  const [stats, setStats] = useState({ products: 0, posts: 0 });
  const router = useRouter();

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage('');
    }, 4000);
  };

  // Fetch count stats on mount/tab change to overview
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const prodRes = await fetch('/api/products');
        const postRes = await fetch('/api/posts');
        if (prodRes.ok && postRes.ok) {
          const prods = await prodRes.json();
          const posts = await postRes.json();
          setStats({
            products: prods.length || 0,
            posts: posts.length || 0
          });
        }
      } catch (err) {
        console.error("Gagal memuat statistik:", err);
      }
    };
    fetchStats();
  }, [activeTab]);

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth', {
        method: 'DELETE',
      });
      if (res.ok) {
        showToast('Berhasil logout!');
        router.push('/admin/login');
        router.refresh();
      }
    } catch (err) {
      alert('Gagal melakukan logout.');
    }
  };

  // Render content depending on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Quick Stats Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
              
              <div className={styles.editorCard} style={{ borderLeft: '4px solid var(--color-tosca)', padding: '1.5rem 2rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 'bold', textTransform: 'uppercase' }}>Total Koleksi & Kelas</span>
                <h3 style={{ fontSize: '2.5rem', fontWeight: 800, margin: '0.5rem 0', color: 'var(--color-text-dark)' }}>{stats.products}</h3>
                <button onClick={() => setActiveTab('products')} style={{ color: 'var(--color-tosca)', border: 'none', background: 'transparent', padding: 0, cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}>
                  Kelola Katalog →
                </button>
              </div>

              <div className={styles.editorCard} style={{ borderLeft: '4px solid var(--color-kunyit)', padding: '1.5rem 2rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 'bold', textTransform: 'uppercase' }}>Artikel Terbit (Blog)</span>
                <h3 style={{ fontSize: '2.5rem', fontWeight: 800, margin: '0.5rem 0', color: 'var(--color-text-dark)' }}>{stats.posts}</h3>
                <button onClick={() => setActiveTab('blog')} style={{ color: 'var(--color-kunyit)', border: 'none', background: 'transparent', padding: 0, cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}>
                  Kelola Blog →
                </button>
              </div>

              <div className={styles.editorCard} style={{ borderLeft: '4px solid var(--color-maroon)', padding: '1.5rem 2rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 'bold', textTransform: 'uppercase' }}>Dukungan Bahasa</span>
                <h3 style={{ fontSize: '2.5rem', fontWeight: 800, margin: '0.5rem 0', color: 'var(--color-text-dark)' }}>2</h3>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>ID (Indonesia) & EN (English)</span>
              </div>

              <div className={styles.editorCard} style={{ borderLeft: '4px solid #10B981', padding: '1.5rem 2rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 'bold', textTransform: 'uppercase' }}>Status Keamanan</span>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '1rem 0 0.8rem 0', color: '#10B981' }}>TERPROTEKSI</h3>
                <button onClick={() => setActiveTab('account')} style={{ color: '#10B981', border: 'none', background: 'transparent', padding: 0, cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}>
                  Ubah Kata Sandi →
                </button>
              </div>

            </div>

            {/* Quick Actions Panel */}
            <div className={styles.editorCard}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1.25rem', color: 'var(--color-text-dark)' }}>Pintasan Aksi Cepat</h3>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button className="btn btn-primary" onClick={() => setActiveTab('page-content')} style={{ fontSize: '0.85rem' }}>
                  Edit Konten Website
                </button>
                <button className="btn btn-secondary" onClick={() => setActiveTab('seo')} style={{ fontSize: '0.85rem' }}>
                  Optimasi SEO & GEO (AI)
                </button>
                <a href="/api/backup" download className="btn btn-outline" style={{ fontSize: '0.85rem', borderColor: 'var(--color-tosca)', color: 'var(--color-tosca)' }}>
                  📥 Ekspor Backup Database (JSON)
                </a>
                <a href="/" target="_blank" className="btn btn-outline" style={{ fontSize: '0.85rem' }}>
                  Kunjungi Landing Page ↗
                </a>
              </div>
            </div>
          </div>
        );
      case 'page-content':
        return <PageContentEditor showToast={showToast} />;
      case 'products':
        return <ProductEditor showToast={showToast} />;
      case 'blog':
        return <BlogEditor showToast={showToast} />;
      case 'seo':
        return <SeoEditor showToast={showToast} />;
      case 'account':
        return <AccountEditor showToast={showToast} />;
      default:
        return null;
    }
  };

  const getSubTitleText = () => {
    switch (activeTab) {
      case 'overview':
        return 'Ringkasan statistik dan kelola shortcut pengaturan situs.';
      case 'page-content':
        return 'Edit teks sambutan, deskripsi, dan isi section landing page, about, dan collaboration.';
      case 'products':
        return 'Kelola karya lukisan fisik, workshop offline, atau kelas online untuk dijual.';
      case 'blog':
        return 'Kelola artikel blog kreatif, catatan seni, dan parameter SEO masing-masing tulisan.';
      case 'seo':
        return 'Konfigurasi metadata penelusuran (SEO) dan Optimasi AI Generatif (GEO) tiap halaman.';

      case 'account':
        return 'Ubah password admin demi keamanan portal web.';
      default:
        return '';
    }
  };

  return (
    <div className={styles.dashboard}>
      {/* Sidebar Navigation */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div style={{ 
            backgroundColor: 'var(--color-cream-bg)', 
            padding: '8px 14px', 
            borderRadius: '10px', 
            display: 'inline-block', 
            width: 'fit-content', 
            marginBottom: '1rem',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <img 
              src="/logo.png" 
              alt="Berseni Logo" 
              style={{ height: '36px', width: 'auto', display: 'block', objectFit: 'contain' }}
            />
          </div>
          <span className={styles.sidebarSubtitle} style={{ display: 'block', marginTop: '0.25rem' }}>Admin Dashboard</span>
        </div>

        <nav style={{ flexGrow: 1 }}>
          <ul className={styles.menuList}>
            <li
              className={`${styles.menuItem} ${activeTab === 'overview' ? styles.menuItemActive : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
              </svg>
              Overview
            </li>
            <li
              className={`${styles.menuItem} ${activeTab === 'page-content' ? styles.menuItemActive : ''}`}
              onClick={() => setActiveTab('page-content')}
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Konten Halaman
            </li>
            <li
              className={`${styles.menuItem} ${activeTab === 'products' ? styles.menuItemActive : ''}`}
              onClick={() => setActiveTab('products')}
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Katalog Produk
            </li>
            <li
              className={`${styles.menuItem} ${activeTab === 'blog' ? styles.menuItemActive : ''}`}
              onClick={() => setActiveTab('blog')}
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              Kelola Blog
            </li>
            <li
              className={`${styles.menuItem} ${activeTab === 'seo' ? styles.menuItemActive : ''}`}
              onClick={() => setActiveTab('seo')}
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Optimasi SEO & GEO (AI)
            </li>
            <li
              className={`${styles.menuItem} ${activeTab === 'account' ? styles.menuItemActive : ''}`}
              onClick={() => setActiveTab('account')}
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Keamanan Akun
            </li>
          </ul>
        </nav>

        {/* Logout Button */}
        <button className={styles.logoutBtn} onClick={handleLogout}>
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Keluar Portal
        </button>
      </aside>

      {/* Main Dashboard Content */}
      <main className={styles.mainContent}>
        <div className={styles.contentHeader}>
          <div>
            <h1 style={{ textTransform: 'capitalize' }}>
              {activeTab === 'page-content' ? 'Konten Halaman' : activeTab === 'account' ? 'Keamanan Akun' : activeTab}
            </h1>
            <p>{getSubTitleText()}</p>
          </div>
          <div>
            <a href="/" target="_blank" className="btn btn-outline" style={{ fontSize: '0.85rem', padding: '0.5rem 1.25rem' }}>
              Lihat Website ↗
            </a>
          </div>
        </div>

        {/* Dynamic Tab Panels */}
        {renderTabContent()}
      </main>

      {/* Auto-dismissing Toast notification popup */}
      {toastMessage && (
        <div className={styles.toast}>
          {toastMessage}
        </div>
      )}
    </div>
  );
}
