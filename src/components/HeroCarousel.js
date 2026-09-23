'use client';

import { useState, useEffect } from 'react';
import SafeImage from '@/components/SafeImage';
import { useLanguage } from '@/components/LanguageContext';
import styles from '@/styles/Components.module.css';

const AUTO_ADVANCE_MS = 5000;

// Berapa kartu yang TERLIHAT bersamaan di tumpukan 3D — bukan berapa item yang
// ada di dalamnya. Carousel ini memang berputar melingkar melewati SELURUH item;
// yang jauh dari kartu aktif hanya memudar sampai tak terlihat. Jadi katalog 50
// produk tetap terputar semuanya walau hanya 5 kartu yang tampak sekaligus.
const DEFAULT_VISIBLE = 5;

export default function HeroCarousel({ items = [], onCardClick, visibleCount = DEFAULT_VISIBLE }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const [isTabHidden, setIsTabHidden] = useState(false);
  const { t, language } = useLanguage();

  // Hook to check viewport size for responsive 3D card layout
  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    setIsMobile(mediaQuery.matches);
    
    const handler = (e) => setIsMobile(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Don't advance while the tab is in the background
  useEffect(() => {
    const handleVisibilityChange = () => setIsTabHidden(document.hidden);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Auto slide — skipped entirely while the user interacts, while the tab is
  // hidden, or when the user prefers reduced motion.
  useEffect(() => {
    if (items.length <= 1) return;
    if (isInteracting || isTabHidden) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(interval);
  }, [items.length, isInteracting, isTabHidden]);

  if (!items || items.length === 0) {
    return <div className={styles.carouselContainer}>Loading gallery...</div>;
  }

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % items.length);
  };

  const handleCardClick = (index) => {
    if (index === activeIndex) {
      if (onCardClick) onCardClick(items[index]);
    } else {
      setActiveIndex(index);
    }
  };

  const handleCardKeyDown = (e, index) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    if (e.key === ' ') e.preventDefault(); // stop page scroll on Space
    handleCardClick(index);
  };

  // Jumlah kartu di SATU sisi kartu aktif. visibleCount 5 -> 2 di kiri, 2 di
  // kanan. Dengan 5 item, jarak melingkar maksimum memang 2, jadi nilai bawaan
  // ini menghasilkan tampilan yang sama persis seperti sebelum ada pengaturan.
  const sideCount = Math.max(1, Math.floor(((Number(visibleCount) || DEFAULT_VISIBLE) - 1) / 2));

  // Jarak melingkar terpendek dari kartu aktif.
  const circularDiff = (index) => {
    const total = items.length;
    let diff = index - activeIndex;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return diff;
  };

  const getCardStyle = (index) => {
    const diff = circularDiff(index);
    const absDiff = Math.abs(diff);

    // Responsive card metrics
    const spacing = isMobile ? 110 : 190;
    const depth = isMobile ? 50 : 80;
    const rotateYVal = isMobile ? -20 : -25;

    // Position
    let translateX = diff * spacing;
    let translateZ = -absDiff * depth;
    let rotateY = diff * rotateYVal;
    
    // Kartu di luar jangkauan tampil disembunyikan penuh. Tanpa ini, katalog
    // panjang membuat kartu-kartu jauh menumpuk samar di belakang tumpukan.
    let opacity = absDiff > sideCount ? 0 : 1 - absDiff * 0.22;
    let zIndex = 100 - absDiff;

    // Active card focus styling
    if (diff === 0) {
      translateZ = isMobile ? 30 : 50;
      rotateY = 0;
      opacity = 1;
    }

    return {
      transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg)`,
      opacity,
      zIndex,
      // JANGAN paksa 'auto' di sini. pointer-events itu inherited, dan induknya
      // (.showcaseWrapper) sengaja men-set 'none' selama showcase belum terlihat
      // (opacity 0 di awal hero). Memaksa 'auto' membatalkan 'none' induk itu,
      // sehingga kartu yang TAK TERLIHAT (z-index 30) menutupi tombol CTA hero
      // (z-index 20) dan memakan semua klik. undefined = warisi induk.
      pointerEvents: absDiff > sideCount ? 'none' : undefined
    };
  };

  // Katalog bisa panjang. Kartu yang jauh di belakang tumpukan sudah opacity 0,
  // jadi tidak ada gunanya menaruhnya di DOM beserta gambarnya. Disisakan satu
  // cadangan di tiap sisi supaya kartu yang masuk sudah siap saat bergeser dan
  // transisinya tidak berkedip. Daftar pendek tidak terpengaruh sama sekali.
  const renderRadius = sideCount + 1;
  const shouldWindow = items.length > renderRadius * 2 + 1;

  const formatPrice = (price) => {
    if (price === undefined || price === null) return '';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'artwork': return 'var(--color-maroon)';
      case 'online': return 'var(--color-tosca)';
      case 'offline': return 'var(--color-kunyit)';
      case 'workshop': return 'var(--color-maroon)';
      case 'exhibition': return 'var(--color-tosca)';
      case 'social': return 'var(--color-kunyit)';
      default: return 'var(--color-text-dark)';
    }
  };

  // Warna teks badge mengikuti latarnya: putih di atas kunyit (#FAA433) hanya
  // 1.98:1 (WCAG 1.4.3 butuh 4.5:1). Maroon/tosca aman dengan teks putih.
  const getCategoryTextColor = (cat) =>
    (cat === 'offline' || cat === 'social')
      ? 'var(--color-badge-kunyit-text)'
      : 'var(--color-white)';

  const getCategoryLabel = (cat) => {
    const labels = {
      artwork: { id: 'Lukisan', en: 'Artwork' },
      online: { id: 'Kelas Online', en: 'Online Class' },
      offline: { id: 'Workshop Offline', en: 'Offline Workshop' },
      workshop: { id: 'Workshop', en: 'Workshop' },
      exhibition: { id: 'Pameran', en: 'Exhibition' },
      social: { id: 'Kegiatan', en: 'Community Event' }
    };
    const currentLang = language || 'id';
    return (labels[cat] && labels[cat][currentLang]) || (labels[cat] ? labels[cat].id : cat);
  };

  return (
    <div
      className={styles.carouselContainer}
      onMouseEnter={() => setIsInteracting(true)}
      onMouseLeave={() => setIsInteracting(false)}
      onFocus={() => setIsInteracting(true)}
      onBlur={() => setIsInteracting(false)}
      onPointerDown={() => setIsInteracting(true)}
    >
      <div className={styles.carouselTrack}>
        {items.map((item, idx) => {
          if (shouldWindow && Math.abs(circularDiff(idx)) > renderRadius) return null;
          const isActive = idx === activeIndex;
          return (
            <div
              key={item.id || idx}
              className={`${styles.carouselCard} ${isActive ? styles.activeCard : ''}`}
              style={getCardStyle(idx)}
              role="button"
              tabIndex={isActive ? 0 : -1}
              aria-current={isActive ? 'true' : undefined}
              onClick={() => handleCardClick(idx)}
              onKeyDown={(e) => handleCardKeyDown(e, idx)}
            >
              {/* Category Badge */}
              <span 
                className={styles.carouselBadge}
                style={{
                  backgroundColor: getCategoryColor(item.category),
                  color: getCategoryTextColor(item.category),
                }}
              >
                {getCategoryLabel(item.category)}
              </span>

              {/* Image */}
              <div className={styles.carouselImageWrapper}>
                <SafeImage
                  src={item.image}
                  alt={t(item, 'title')}
                  className={styles.carouselImage}
                  width={900}
                  height={1100}
                  sizes="(max-width: 768px) 80vw, 500px"
                  fallbackSrc="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=600&auto=format&fit=crop"
                />
              </div>

              {/* Info Body */}
              <div className={styles.carouselInfo}>
                <h3 className={styles.carouselTitle}>{t(item, 'title')}</h3>
                <div className={styles.carouselFooter}>
                  {item.price !== undefined && item.price !== null ? (
                    <span className={styles.carouselPrice}>{formatPrice(item.price)}</span>
                  ) : (
                    <span className={styles.carouselSummary}>{t(item, 'summary')}</span>
                  )}
                  <span className={styles.carouselBtn}>
                    Detail 
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Controls */}
      <div className={styles.carouselControls}>
        <button className={styles.controlBtn} onClick={handlePrev} aria-label="Sebelumnya">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <button className={styles.controlBtn} onClick={handleNext} aria-label="Selanjutnya">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

