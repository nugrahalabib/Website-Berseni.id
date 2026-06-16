'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import ProductModal from '@/components/ProductModal';
import { useLanguage } from '@/components/LanguageContext';
import styles from '@/styles/Store.module.css';

export default function StorePageClient({ content, initialProducts }) {
  const { language, t, getTranslation } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [products, setProducts] = useState(initialProducts || []);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter and Sort Logic
  const getFilteredAndSortedProducts = () => {
    let result = [...products];

    // 1. Filter by Category
    if (selectedFilter !== 'all') {
      result = result.filter(p => p.category === selectedFilter);
    }

    // 2. Filter by Search Query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        t(p, 'title').toLowerCase().includes(query) || 
        (t(p, 'description') && t(p, 'description').toLowerCase().includes(query)) ||
        (t(p, 'specs') && t(p, 'specs').toLowerCase().includes(query))
      );
    }

    // 3. Sort
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'discount') {
      result.sort((a, b) => {
        const discountA = a.originalPrice ? (a.originalPrice - a.price) / a.originalPrice : 0;
        const discountB = b.originalPrice ? (b.originalPrice - b.price) / b.originalPrice : 0;
        return discountB - discountA;
      });
    }

    return result;
  };

  const filteredProducts = getFilteredAndSortedProducts();

  if (!mounted) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>{getTranslation('loadingStore')}</p>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      {/* Shared Header Navigation */}
      <Navbar />

      <main className={styles.storeMain}>
        {/* Ambient Gradient Blobs for premium atmosphere */}
        <div className={styles.storeGlowContainer}>
          <div className={`${styles.glowBlob} ${styles.glowTosca}`}></div>
          <div className={`${styles.glowBlob} ${styles.glowMaroon}`}></div>
        </div>

        {/* Hero Header Section */}
        <section className={styles.heroSection}>
          <div className={styles.heroInner}>
            <span className={styles.heroSubtitle}>Berseni Art Market & Hub</span>
            <h1 className={styles.heroTitle}>
              {getTranslation('storeTitle')}
            </h1>
            <p className={styles.heroDesc}>
              {getTranslation('gallerySubtitle')}
            </p>
          </div>
        </section>

        {/* Marketplace Toolbar (Search, Filter, Sort) */}
        <section className={styles.toolbarSection}>
          <div className={styles.toolbarInner}>
            {/* Search Input Box */}
            <div className={styles.searchWrapper}>
              <svg className={styles.searchIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.3-4.3" />
              </svg>
              <input 
                type="text" 
                placeholder={getTranslation('storeSearchPlaceholder')}
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  className={styles.clearSearch} 
                  onClick={() => setSearchQuery('')}
                  aria-label="Hapus Pencarian"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Controls Row (Filters & Sorter) */}
            <div className={styles.controlsRow}>
              {/* Category Filters */}
              <div className={styles.filterTabs}>
                <button 
                  className={`${styles.filterTab} ${selectedFilter === 'all' ? styles.activeFilterTab : ''}`}
                  onClick={() => setSelectedFilter('all')}
                >
                  {getTranslation('tabAll')}
                </button>
                <button 
                  className={`${styles.filterTab} ${selectedFilter === 'artwork' ? styles.activeFilterTab : ''}`}
                  onClick={() => setSelectedFilter('artwork')}
                >
                  {getTranslation('tabArtwork')}
                </button>
                <button 
                  className={`${styles.filterTab} ${selectedFilter === 'offline' ? styles.activeFilterTab : ''}`}
                  onClick={() => setSelectedFilter('offline')}
                >
                  {getTranslation('tabOffline')}
                </button>
                <button 
                  className={`${styles.filterTab} ${selectedFilter === 'online' ? styles.activeFilterTab : ''}`}
                  onClick={() => setSelectedFilter('online')}
                >
                  {getTranslation('tabOnline')}
                </button>
              </div>

              {/* Sorter Selector */}
              <div className={styles.sortWrapper}>
                <label htmlFor="sortBy">{getTranslation('sortByLabel')}</label>
                <select 
                  id="sortBy"
                  className={styles.sortSelect}
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="default">{getTranslation('sortLatest')}</option>
                  <option value="price-asc">{getTranslation('sortPriceAsc')}</option>
                  <option value="price-desc">{getTranslation('sortPriceDesc')}</option>
                  <option value="discount">{language === 'id' ? 'Diskon Terbesar' : 'Biggest Discount'}</option>
                </select>
              </div>
            </div>

            {/* Results Count Summary */}
            <div className={styles.resultsSummary}>
              <span>{getTranslation('resultsCount').replace('{count}', filteredProducts.length)}</span>
              {(selectedFilter !== 'all' || searchQuery || sortBy !== 'default') && (
                <button 
                  className={styles.resetFilters}
                  onClick={() => {
                    setSelectedFilter('all');
                    setSearchQuery('');
                    setSortBy('default');
                  }}
                >
                  {getTranslation('resetFilters')}
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Marketplace Grid Section */}
        <section className={styles.gridSection}>
          <div className={styles.gridInner}>
            {filteredProducts.length > 0 ? (
              <div className={styles.productsGrid}>
                {filteredProducts.map((product) => (
                  <div key={product.id} className={styles.gridItem}>
                    <ProductCard 
                      product={product}
                      onClick={setSelectedProduct}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyStore}>
                <svg width="64" height="64" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                <h3>{getTranslation('emptyStoreTitle')}</h3>
                <p>{getTranslation('emptyStoreDesc')}</p>
                <button 
                  className="btn btn-secondary" 
                  style={{ marginTop: '1.5rem' }}
                  onClick={() => {
                    setSelectedFilter('all');
                    setSearchQuery('');
                    setSortBy('default');
                  }}
                >
                  {getTranslation('showAllProducts')}
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Dynamic Product Detail Modal overlay */}
      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}

      {/* Shared Footer navigation */}
      <Footer />
    </div>
  );
}
