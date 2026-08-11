'use client';

import { useEffect, useRef } from 'react';
import SafeImage from '@/components/SafeImage';
import { useLanguage } from '@/components/LanguageContext';
import RichText from '@/components/RichText';
import styles from '@/styles/Components.module.css';

const FOCUSABLE_SELECTOR = 'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])';

export default function ActivityModal({ activity, onClose }) {
  const { language, t, getTranslation } = useLanguage();
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);
  const isOpen = Boolean(activity);

  // Lock body scroll + manage focus while the modal is open
  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused = document.activeElement;
    const scrollY = window.scrollY;

    // Fixed positioning (not overflow:hidden) so the scroll lock also holds on iOS Safari
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

  // Close on Escape + trap focus (Tab / Shift+Tab) inside the modal
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

  if (!activity) return null;

  const getCategoryLabel = (cat) => {
    switch (cat) {
      case 'workshop': return language === 'id' ? 'Workshop Kreatif' : 'Creative Workshop';
      case 'exhibition': return language === 'id' ? 'Pameran & Galeri' : 'Exhibition & Gallery';
      case 'social': return language === 'id' ? 'Kegiatan Sosial & Komunitas' : 'Social & Community Activity';
      default: return language === 'id' ? 'Aktivitas Berseni' : 'Berseni Activity';
    }
  };

  const getCTAText = (cat) => {
    switch (cat) {
      case 'workshop': return language === 'id' ? 'Daftar Workshop Sekarang' : 'Register for Workshop Now';
      case 'exhibition': return language === 'id' ? 'Registrasi Kunjungan' : 'Visit Registration';
      case 'social': return language === 'id' ? 'Gabung Kegiatan Sekarang' : 'Join Activity Now';
      default: return language === 'id' ? 'Ikuti Keseruan Sekarang' : 'Join the Fun Now';
    }
  };

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
        aria-labelledby="activity-modal-title"
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
              src={activity.image}
              alt={t(activity, 'title')}
              className={styles.modalImage}
              width={1000}
              height={1000}
              sizes="(max-width: 768px) 90vw, 600px"
              fallbackSrc="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=600&auto=format&fit=crop"
            />
          </div>

          {/* Column 2: Details */}
          <div className={styles.modalInfoCol}>
            <span className={styles.modalCategory}>{getCategoryLabel(activity.category)}</span>
            <h2 id="activity-modal-title" className={styles.modalTitle}>{t(activity, 'title')}</h2>
            
            <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', fontStyle: 'italic', marginBottom: '1.25rem' }}>
              "{t(activity, 'summary')}"
            </div>

            <h4 className={styles.modalDescTitle}>{language === 'id' ? 'Keseruan Aktivitas' : 'Activity Experience'}</h4>
            <p className={styles.modalDesc}><RichText text={t(activity, 'description')} inline /></p>

            {t(activity, 'details') && (
              <>
                <h4 className={styles.modalDescTitle}>{language === 'id' ? 'Informasi Kegiatan' : 'Activity Information'}</h4>
                <div className={styles.modalSpecs}>{t(activity, 'details')}</div>
              </>
            )}

            {/* Action CTA Button */}
            <div className={styles.modalCTA}>
              <a
                href={activity.link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ width: '100%', padding: '1rem 0' }}
              >
                {getCTAText(activity.category)}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
