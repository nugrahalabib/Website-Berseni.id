'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import SafeImage from '@/components/SafeImage';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/components/LanguageContext';
import SplitTitle from '@/components/SplitTitle';
import RichText from '@/components/RichText';
import styles from '@/styles/Gallery.module.css';

export default function GalleryPageClient({ content, initialItems }) {
  const { t, getTranslation, dbContent } = useLanguage();
  const items = initialItems || [];

  const [activeIndex, setActiveIndex] = useState(null);
  const overlayRef = useRef(null);
  const lastFocusedRef = useRef(null);

  const close = useCallback(() => setActiveIndex(null), []);
  const showPrev = useCallback(
    () => setActiveIndex((i) => (i === null ? i : (i - 1 + items.length) % items.length)),
    [items.length]
  );
  const showNext = useCallback(
    () => setActiveIndex((i) => (i === null ? i : (i + 1) % items.length)),
    [items.length]
  );

  // Keyboard: Esc menutup, panah kiri/kanan berpindah foto.
  useEffect(() => {
    if (activeIndex === null) return;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') showPrev();
      else if (e.key === 'ArrowRight') showNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeIndex, close, showPrev, showNext]);

  // Kunci scroll latar + kembalikan fokus ke tombol asal saat ditutup (a11y).
  useEffect(() => {
    if (activeIndex === null) return;
    lastFocusedRef.current = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    overlayRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
      if (lastFocusedRef.current instanceof HTMLElement) lastFocusedRef.current.focus();
    };
  }, [activeIndex]);

  const active = activeIndex === null ? null : items[activeIndex];
  const bg = (key, fallback = '') => dbContent?.[key] || content?.[key] || fallback;
  const textColor = (key) => dbContent?.[key] || content?.[key] || undefined;

  return (
    <div className={styles.pageContainer} style={{ backgroundColor: bg('bg_gallery_main') }}>
      <Navbar />

      <main id="main-content" className={styles.galleryPage}>
        <header className={styles.header} style={{ backgroundColor: bg('bg_gallery_header') }}>
          <span className={styles.headerLabel} style={{ color: textColor('text_gallery_label') }}>
            {getTranslation('galleryHeaderLabel')}
          </span>
          <h1 className={styles.headerTitle} style={{ color: textColor('text_gallery_title') }}>
            <SplitTitle
              text={getTranslation('galleryHeaderTitle')}
              highlight={getTranslation('galleryHeaderTitleSpan')}
              layout={dbContent?.galleryHeaderTitleLayout}
            />
          </h1>
          <p className={styles.headerDesc} style={{ color: textColor('text_gallery_desc') }}>
            <RichText text={getTranslation('galleryHeaderDesc')} inline />
          </p>
        </header>

        {items.length > 0 ? (
          <section className={styles.grid} aria-label={getTranslation('galleryHeaderTitle')}>
            {items.map((item, index) => {
              const title = t(item, 'title');
              const caption = t(item, 'caption');
              return (
                <button
                  key={item.id}
                  type="button"
                  className={styles.card}
                  onClick={() => setActiveIndex(index)}
                  aria-label={title || getTranslation('galleryOpenPhoto')}
                >
                  <span className={styles.cardMedia}>
                    <SafeImage
                      src={item.image}
                      alt={title || getTranslation('galleryOpenPhoto')}
                      className={styles.cardImage}
                      width={800}
                      height={800}
                      sizes="(max-width: 600px) 90vw, (max-width: 1024px) 45vw, 30vw"
                      fallbackSrc="/activity-outdoor.webp"
                    />
                  </span>

                  {(title || caption) && (
                    <span className={styles.cardOverlay}>
                      {title && <span className={styles.cardTitle}>{title}</span>}
                      {caption && (
                        <span className={styles.cardCaption}>
                          <RichText text={caption} inline />
                        </span>
                      )}
                    </span>
                  )}

                  <span className={styles.cardZoom} aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <circle cx="11" cy="11" r="7" />
                      <path d="M21 21l-4.3-4.3M11 8v6M8 11h6" />
                    </svg>
                  </span>
                </button>
              );
            })}
          </section>
        ) : (
          <div className={styles.empty}>
            <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
            <p>{getTranslation('galleryEmpty')}</p>
          </div>
        )}
      </main>

      {/* Lightbox */}
      {active && (
        <div
          className={styles.lightbox}
          role="dialog"
          aria-modal="true"
          aria-label={t(active, 'title') || getTranslation('galleryOpenPhoto')}
          tabIndex={-1}
          ref={overlayRef}
          onClick={(e) => { if (e.target === e.currentTarget) close(); }}
        >
          <button type="button" className={styles.lightboxClose} onClick={close} aria-label={getTranslation('galleryClose')}>
            ✕
          </button>

          {items.length > 1 && (
            <button type="button" className={`${styles.lightboxNav} ${styles.navPrev}`} onClick={showPrev} aria-label={getTranslation('galleryPrev')}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6" /></svg>
            </button>
          )}

          <figure className={styles.lightboxFigure}>
            <SafeImage
              src={active.image}
              alt={t(active, 'title') || getTranslation('galleryOpenPhoto')}
              className={styles.lightboxImage}
              width={1600}
              height={1200}
              sizes="90vw"
              fallbackSrc="/activity-outdoor.webp"
            />
            {(t(active, 'title') || t(active, 'caption')) && (
              <figcaption className={styles.lightboxCaption}>
                {t(active, 'title') && <strong>{t(active, 'title')}</strong>}
                {t(active, 'caption') && <span><RichText text={t(active, 'caption')} inline /></span>}
                {items.length > 1 && (
                  <span className={styles.lightboxCounter}>{activeIndex + 1} / {items.length}</span>
                )}
              </figcaption>
            )}
          </figure>

          {items.length > 1 && (
            <button type="button" className={`${styles.lightboxNav} ${styles.navNext}`} onClick={showNext} aria-label={getTranslation('galleryNext')}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6" /></svg>
            </button>
          )}
        </div>
      )}

      <Footer />
    </div>
  );
}
