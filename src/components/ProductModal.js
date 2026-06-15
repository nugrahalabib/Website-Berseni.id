'use client';

import { useEffect } from 'react';
import styles from '@/styles/Components.module.css';

export default function ProductModal({ product, onClose }) {
  // Tutup modal dengan menekan tombol Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!product) return null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getCategoryLabel = (cat) => {
    switch (cat) {
      case 'artwork': return 'Karya Seni Lukis';
      case 'online': return 'Kelas Video Online';
      case 'offline': return 'Workshop Offline / Event';
      default: return 'Koleksi Berseni';
    }
  };

  const getCTAText = (cat) => {
    switch (cat) {
      case 'artwork': return 'Beli Karya di Shopee';
      case 'online': return 'Daftar Kelas (Lynk.id)';
      case 'offline': return 'Pesan Tiket (Lynk.id)';
      default: return 'Beli Sekarang';
    }
  };

  // Mencegah klik di dalam konten modal menutup modal
  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={handleContentClick}>
        {/* Close button */}
        <button className={styles.modalClose} onClick={onClose} aria-label="Tutup">
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Modal Layout Grid */}
        <div className={styles.modalGrid}>
          {/* Column 1: Image */}
          <div className={styles.modalImageCol}>
            <img
              src={product.image}
              alt={product.title}
              className={styles.modalImage}
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=600&auto=format&fit=crop';
              }}
            />
          </div>

          {/* Column 2: Details */}
          <div className={styles.modalInfoCol}>
            <span className={styles.modalCategory}>{getCategoryLabel(product.category)}</span>
            <h2 className={styles.modalTitle}>{product.title}</h2>
            <div className={styles.modalPrice}>{formatPrice(product.price)}</div>

            <h4 className={styles.modalDescTitle}>Deskripsi</h4>
            <p className={styles.modalDesc}>{product.description}</p>

            {product.specs && (
              <>
                <h4 className={styles.modalDescTitle}>Spesifikasi / Detail</h4>
                <div className={styles.modalSpecs}>{product.specs}</div>
              </>
            )}

            {/* Action CTA Button */}
            <div className={styles.modalCTA}>
              <a
                href={product.link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ width: '100%', padding: '1rem 0' }}
              >
                {getCTAText(product.category)}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
