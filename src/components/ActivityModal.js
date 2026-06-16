'use client';

import { useEffect } from 'react';
import { useLanguage } from '@/components/LanguageContext';
import styles from '@/styles/Components.module.css';

export default function ActivityModal({ activity, onClose }) {
  const { language, t, getTranslation } = useLanguage();

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

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
              src={activity.image}
              alt={t(activity, 'title')}
              className={styles.modalImage}
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=600&auto=format&fit=crop';
              }}
            />
          </div>

          {/* Column 2: Details */}
          <div className={styles.modalInfoCol}>
            <span className={styles.modalCategory}>{getCategoryLabel(activity.category)}</span>
            <h2 className={styles.modalTitle}>{t(activity, 'title')}</h2>
            
            <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', fontStyle: 'italic', marginBottom: '1.25rem' }}>
              "{t(activity, 'summary')}"
            </div>

            <h4 className={styles.modalDescTitle}>{language === 'id' ? 'Keseruan Aktivitas' : 'Activity Experience'}</h4>
            <p className={styles.modalDesc}>{t(activity, 'description')}</p>

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
