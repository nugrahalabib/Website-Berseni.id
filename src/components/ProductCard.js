'use client';

import SafeImage from '@/components/SafeImage';
import { useLanguage } from '@/components/LanguageContext';
import RichText from '@/components/RichText';
import styles from '@/styles/Components.module.css';

export default function ProductCard({ product, onClick }) {
  const { language, t, getTranslation } = useLanguage();

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

  // Warna teks badge harus mengikuti latarnya: putih di atas kunyit (#FAA433)
  // hanya 1.98:1 (WCAG 1.4.3 butuh 4.5:1). Maroon/tosca aman dengan teks putih.
  const getCategoryTextColor = (cat) =>
    cat === 'offline' ? 'var(--color-badge-kunyit-text)' : 'var(--color-white)';

  const getCategoryLabel = (cat) => {
    switch (cat) {
      case 'artwork': return language === 'id' ? 'Karya Seni' : 'Artwork';
      case 'online': return language === 'id' ? 'Kelas Online' : 'Online Class';
      case 'offline': return language === 'id' ? 'Workshop Offline' : 'Offline Workshop';
      default: return 'Karya';
    }
  };

  const handleActivate = () => {
    if (onClick) onClick(product);
  };

  // Keyboard parity for the card: Enter and Space activate, like a native button
  const handleKeyDown = (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    if (e.key === ' ') e.preventDefault(); // stop page scroll on Space
    handleActivate();
  };

  const detailsAriaLabel = language === 'id'
    ? `Lihat detail untuk ${t(product, 'title')}`
    : `View details for ${t(product, 'title')}`;

  return (
    <div
      className={styles.card}
      role="button"
      tabIndex={0}
      aria-label={detailsAriaLabel}
      onClick={handleActivate}
      onKeyDown={handleKeyDown}
    >
      {/* Image & Badge */}
      <div className={styles.cardImageWrapper}>
        <span 
          className={styles.cardCategoryBadge}
          style={{
            backgroundColor: getCategoryColor(product.category),
            color: getCategoryTextColor(product.category),
          }}
        >
          {getCategoryLabel(product.category)}
        </span>
        <SafeImage
          src={product.image}
          alt={t(product, 'title')}
          className={styles.cardImage}
          width={600}
          height={750}
          sizes="(max-width: 768px) 80vw, 380px"
          fallbackSrc="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=600&auto=format&fit=crop"
        />
      </div>

      {/* Info Body */}
      <div className={styles.cardBody}>
        <h3 className={styles.cardTitle}>{t(product, 'title')}</h3>
        <p className={styles.cardDesc}><RichText text={t(product, 'description')} inline /></p>
        
        <div className={styles.cardFooter}>
          <div className={styles.priceContainer}>
            {product.originalPrice && (
              <span className={styles.cardOriginalPrice}>{formatPrice(product.originalPrice)}</span>
            )}
            <span className={styles.cardPrice}>{formatPrice(product.price)}</span>
          </div>
          <span className={styles.cardDetailBtn}>
            {getTranslation('detailLabel')}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
}
