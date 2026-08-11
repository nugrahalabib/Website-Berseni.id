'use client';

import { useEffect, useRef } from 'react';
import SafeImage from '@/components/SafeImage';
import { useLanguage } from '@/components/LanguageContext';
import RichText from '@/components/RichText';
import styles from '@/styles/Components.module.css';

const FOCUSABLE_SELECTOR = 'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])';

export default function ProductModal({ product, onClose }) {
  const { language, t, getTranslation } = useLanguage();
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);
  const isOpen = Boolean(product);

  // Kunci scroll body + kelola fokus selama modal terbuka
  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused = document.activeElement;
    const scrollY = window.scrollY;

    // Posisi fixed dipakai (bukan overflow:hidden) agar scroll lock tetap bekerja di iOS Safari
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';

    if (closeButtonRef.current) closeButtonRef.current.focus();

    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollY);
      if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
        previouslyFocused.focus();
      }
    };
  }, [isOpen]);

  // Tutup modal dengan Escape + jebak fokus (Tab / Shift+Tab) di dalam modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;

      const modal = modalRef.current;
      if (!modal) return;

      const focusable = Array.from(modal.querySelectorAll(FOCUSABLE_SELECTOR))
        .filter((el) => !el.hasAttribute('disabled'));
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      const isOutside = !modal.contains(active);

      if (e.shiftKey && (active === first || isOutside)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || isOutside)) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

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
      <div
        ref={modalRef}
        className={styles.modalContent}
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
        onClick={handleContentClick}
      >
        {/* Close button */}
        <button ref={closeButtonRef} className={styles.modalClose} onClick={onClose} aria-label={getTranslation('closeBtn')}>
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Modal Layout Grid */}
        <div className={styles.modalGrid}>
          {/* Column 1: Image */}
          <div className={styles.modalImageCol}>
            <SafeImage
              src={product.image}
              alt={t(product, 'title')}
              className={styles.modalImage}
              width={1000}
              height={1000}
              sizes="(max-width: 768px) 90vw, 600px"
              fallbackSrc="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=600&auto=format&fit=crop"
            />
          </div>

          {/* Column 2: Details */}
          <div className={styles.modalInfoCol}>
            <span className={styles.modalCategory}>{getCategoryLabel(product.category)}</span>
            <h2 id="product-modal-title" className={styles.modalTitle}>{t(product, 'title')}</h2>
            <div className={styles.modalPriceContainer}>
              {product.originalPrice && (
                <span className={styles.modalOriginalPrice}>{formatPrice(product.originalPrice)}</span>
              )}
              <span className={styles.modalPrice}>{formatPrice(product.price)}</span>
            </div>

            <h4 className={styles.modalDescTitle}>{language === 'id' ? 'Deskripsi' : 'Description'}</h4>
            <p className={styles.modalDesc}><RichText text={t(product, 'description')} inline /></p>

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
