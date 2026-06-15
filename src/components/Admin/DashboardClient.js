'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ContentEditor from './ContentEditor';
import ProductEditor from './ProductEditor';
import styles from '@/styles/Admin.module.css';

export default function DashboardClient() {
  const [activeTab, setActiveTab] = useState('products');
  const [toastMessage, setToastMessage] = useState('');
  const router = useRouter();

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage('');
    }, 4000);
  };

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


        <nav>
          <ul className={styles.menuList}>
            <li
              className={`${styles.menuItem} ${activeTab === 'products' ? styles.menuItemActive : ''}`}
              onClick={() => setActiveTab('products')}
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ marginRight: '4px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Koleksi & Kelas
            </li>
            <li
              className={`${styles.menuItem} ${activeTab === 'content' ? styles.menuItemActive : ''}`}
              onClick={() => setActiveTab('content')}
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ marginRight: '4px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Teks Web
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
            <h1>Dashboard Berseni</h1>
            <p>
              {activeTab === 'products'
                ? 'Kelola karya lukisan fisik, workshop offline, atau e-course online untuk dijual.'
                : 'Ubah teks sambutan, visi, misi, deskripsi, dan statistik landing page.'}
            </p>
          </div>
          <div>
            <a href="/" target="_blank" className="btn btn-outline" style={{ fontSize: '0.85rem', padding: '0.5rem 1.25rem' }}>
              Lihat Website ↗
            </a>
          </div>
        </div>

        {/* Dynamic Tab Panels */}
        {activeTab === 'products' ? (
          <ProductEditor showToast={showToast} />
        ) : (
          <ContentEditor showToast={showToast} />
        )}
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
