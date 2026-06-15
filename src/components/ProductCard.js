'use client';

import styles from '@/styles/Components.module.css';

export default function ProductCard({ product, onClick }) {
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
    <div className={styles.card} onClick={() => onClick && onClick(product)}>
      {/* Image & Badge */}
      <div className={styles.cardImageWrapper}>
        <span 
          className={styles.cardCategoryBadge}
          style={{ backgroundColor: getCategoryColor(product.category) }}
        >
          {getCategoryLabel(product.category)}
        </span>
        <img
          src={product.image}
          alt={product.title}
          className={styles.cardImage}
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=600&auto=format&fit=crop';
          }}
        />
      </div>

      {/* Info Body */}
      <div className={styles.cardBody}>
        <h3 className={styles.cardTitle}>{product.title}</h3>
        <p className={styles.cardDesc}>{product.description}</p>
        
        <div className={styles.cardFooter}>
          <span className={styles.cardPrice}>{formatPrice(product.price)}</span>
          <span className={styles.cardDetailBtn}>
            Detail
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
}
