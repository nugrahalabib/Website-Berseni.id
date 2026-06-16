'use client';

import { useEffect } from 'react';
import { useLanguage } from '@/components/LanguageContext';
import styles from '@/styles/Components.module.css';

export default function ProductModal({ product, onClose }) {
  const { language, t, getTranslation } = useLanguage();

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
      case 'artwork': return language === 'id' ? 'Karya Seni' : 'Artwork';
      case 'online': return language === 'id' ? 'Kelas Video Online' : 'Online Video Class';
      case 'offline': return language === 'id' ? 'Workshop Offline / Event' : 'Offline Workshop / Event';
      default: return language === 'id' ? 'Koleksi Berseni' : 'Berseni Collection';
    }
  };

  const getCTAText = (cat) => {
    switch (cat) {
      case 'artwork': return language === 'id' ? 'Beli Karya Sekarang' : 'Buy Artwork Now';
      case 'online': return language === 'id' ? 'Daftar Kelas Sekarang' : 'Register Class Now';
      case 'offline': return language === 'id' ? 'Pesan Tiket Sekarang' : 'Book Tickets Now';
      default: return language === 'id' ? 'Beli Sekarang' : 'Buy Now';
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
        <button className={styles.modalClose} onClick={onClose} aria-label={getTranslation('closeBtn')}>
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
              alt={t(product, 'title')}
              className={styles.modalImage}
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=600&auto=format&fit=crop';
              }}
            />
          </div>

          {/* Column 2: Details */}
          <div className={styles.modalInfoCol}>
            <span className={styles.modalCategory}>{getCategoryLabel(product.category)}</span>
            <h2 className={styles.modalTitle}>{t(product, 'title')}</h2>
            <div className={styles.modalPriceContainer}>
              {product.originalPrice && (
                <span className={styles.modalOriginalPrice}>{formatPrice(product.originalPrice)}</span>
              )}
              <span className={styles.modalPrice}>{formatPrice(product.price)}</span>
            </div>

            <h4 className={styles.modalDescTitle}>{language === 'id' ? 'Deskripsi' : 'Description'}</h4>
            <p className={styles.modalDesc}>{t(product, 'description')}</p>

            {t(product, 'specs') && (
              <>
                <h4 className={styles.modalDescTitle}>{language === 'id' ? 'Spesifikasi / Detail' : 'Specifications / Details'}</h4>
                <div className={styles.modalSpecs}>{t(product, 'specs')}</div>
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
