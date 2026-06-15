'use client';

import { useState, useEffect } from 'react';
import styles from '@/styles/Components.module.css';

export default function HeroCarousel({ items = [], onCardClick }) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto slide
  useEffect(() => {
    if (items.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [items.length]);

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

  const getCardStyle = (index) => {
    const total = items.length;
    // Hitung jarak terpendek melingkar
    let diff = index - activeIndex;
    
    // Sesuaikan agar berputar melingkar
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;

    const absDiff = Math.abs(diff);

    // Hitung posisi
    let translateX = diff * 190; // Jarak horizontal antar kartu
    let translateZ = -absDiff * 80; // Dorong ke belakang untuk depth 3D
    let rotateY = diff * -25; // Putar arah Y untuk melengkung ke dalam
    let opacity = absDiff > 2 ? 0 : 1 - absDiff * 0.35; // Semakin jauh semakin transparan
    let zIndex = 100 - absDiff; // Kartu tengah paling depan

    // Khusus kartu aktif (tengah)
    if (diff === 0) {
      translateZ = 50;
      rotateY = 0;
      opacity = 1;
    }

    return {
      transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg)`,
      opacity,
      zIndex,
      pointerEvents: absDiff > 2 ? 'none' : 'auto'
    };
  };

  const formatPrice = (price) => {
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
      default: return 'var(--color-text-dark)';
    }
  };

  const getCategoryLabel = (cat) => {
    switch (cat) {
      case 'artwork': return 'Lukisan';
      case 'online': return 'Kelas Online';
      case 'offline': return 'Workshop Offline';
      default: return 'Karya';
    }
  };

  return (
    <div className={styles.carouselContainer}>
      <div className={styles.carouselTrack}>
        {items.map((item, idx) => {
          const isActive = idx === activeIndex;
          return (
            <div
              key={item.id || idx}
              className={`${styles.carouselCard} ${isActive ? styles.activeCard : ''}`}
              style={getCardStyle(idx)}
              onClick={() => handleCardClick(idx)}
            >
              {/* Category Badge */}
              <span 
                className={styles.carouselBadge}
                style={{ backgroundColor: getCategoryColor(item.category) }}
              >
                {getCategoryLabel(item.category)}
              </span>

              {/* Image */}
              <div className={styles.carouselImageWrapper}>
                <img
                  src={item.image}
                  alt={item.title}
                  className={styles.carouselImage}
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=600&auto=format&fit=crop';
                  }}
                />
              </div>

              {/* Info Body */}
              <div className={styles.carouselInfo}>
                <h3 className={styles.carouselTitle}>{item.title}</h3>
                <div className={styles.carouselFooter}>
                  <span className={styles.carouselPrice}>{formatPrice(item.price)}</span>
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
