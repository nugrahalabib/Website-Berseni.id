'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroCarousel from '@/components/HeroCarousel';
import ProductCard from '@/components/ProductCard';
import ProductModal from '@/components/ProductModal';
import styles from '@/styles/Landing.module.css';

export default function LandingPageClient({ initialContent, initialProducts }) {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Hook untuk memantau progress scroll di Hero Section
  useEffect(() => {
    const handleScroll = () => {
      const heroEl = document.getElementById('hero-scroll-container');
      if (!heroEl) return;

      const rect = heroEl.getBoundingClientRect();
      const heroHeight = rect.height;
      const viewportHeight = window.innerHeight;

      // Hitung seberapa jauh area hero ter-scroll relatif terhadap viewport
      const scrollStart = window.scrollY;
      const containerTop = heroEl.offsetTop;
      const totalScrollable = heroHeight - viewportHeight;

      let progress = 0;
      if (totalScrollable > 0) {
        progress = (scrollStart - containerTop) / totalScrollable;
        progress = Math.max(0, Math.min(1, progress));
      }
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Jalankan sekali di awal untuk menetapkan state inisial
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  // Fallback konten jika database kosong / error
  const content = initialContent || {
    heroTitle: "Experience Art. Feel Indonesia.",
    heroSubtitle: "Learn. Create. Experience.",
    heroDescription: "Belajar langsung dari seniman profesional Indonesia melalui kelas online interaktif, workshop intim, dan festival seni imersif.",
    aboutTitle: "When passion meets arts",
    aboutSubtitle: "Gerbang Utama Anda Menuju Dunia Seniman",
    aboutDescription: "Berseni lahir dari kesadaran sederhana bahwa banyak orang ingin lebih dekat dengan dunia seni rupa, tetapi bingung harus mulai dari mana. Kami memutuskan untuk membuka jalan itu.",
    visiTitle: "Visi Kami",
    visiDescription: "Menjadi jembatan global utama antara masyarakat umum dan seniman lokal Indonesia.",
    misiTitle: "Misi Kami",
    misiList: [
      "Membuka akses langsung bagi publik untuk berinteraksi dan belajar dari seniman profesional.",
      "Mendukung pemberdayaan ekonomi seniman lokal.",
      "Membina komunitas pecinta seni yang inklusif di seluruh Indonesia."
    ],
    statsUsers: "20k+",
    statsDescription: "Pengguna Berseni"
  };

  // Filter produk berdasarkan kategori tab yang aktif
  const filteredProducts = selectedFilter === 'all'
    ? initialProducts
    : initialProducts.filter(p => p.category === selectedFilter);

  // Ambil beberapa produk unggulan untuk carousel 3D (maks 5 produk)
  const featuredProducts = initialProducts.slice(0, 5);

  const handleCardSelect = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  // Helper memisahkan teks tebal untuk aksen meliuk (cursive)
  const renderHeroTitle = (title) => {
    if (!title) return '';
    const parts = title.split('.');
    if (parts.length > 1) {
      return (
        <>
          {parts[0]}<span>.</span>
          {parts[1] && <div style={{ fontSize: '2.5rem', marginTop: '0.5rem', fontWeight: 500 }}>{parts[1]}</div>}
        </>
      );
    }
    return title;
  };

  // Hitung nilai animasi staggered berdasarkan scrollProgress (0 - 1)
  
  // 1. Intro Video Opacity (fades out from 0.1 to 0.22)
  const videoOpacity = scrollProgress < 0.1 
    ? 1 
    : scrollProgress < 0.22 
      ? 1 - (scrollProgress - 0.1) / 0.12 
      : 0;

  // 2. Sunset & Waves Transition (fades and slides up from 0.2 to 0.4)
  const sunsetOpacity = scrollProgress < 0.2 
    ? 0 
    : scrollProgress < 0.4 
      ? (scrollProgress - 0.2) / 0.2 
      : scrollProgress < 0.72 
        ? 1 
        : scrollProgress < 0.85 
          ? 1 - (scrollProgress - 0.72) / 0.13 
          : 0;

  const sunsetTranslateY = scrollProgress < 0.2 
    ? 120 
    : scrollProgress < 0.4 
      ? 120 - ((scrollProgress - 0.2) / 0.2) * 120 
      : 0;

  // 3. Birds Transition (fades and flies from left-bottom from 0.33 to 0.52)
  const birdsOpacity = scrollProgress < 0.33 
    ? 0 
    : scrollProgress < 0.52 
      ? (scrollProgress - 0.33) / 0.19 
      : scrollProgress < 0.75 
        ? 1 
        : scrollProgress < 0.85 
          ? 1 - (scrollProgress - 0.75) / 0.1 
          : 0;

  const birdsTranslateX = scrollProgress < 0.33 
    ? -200 
    : scrollProgress < 0.52 
      ? -200 - ((scrollProgress - 0.33) / 0.19) * -200 
      : 0;

  const birdsTranslateY = scrollProgress < 0.33 
    ? 80 
    : scrollProgress < 0.52 
      ? 80 - ((scrollProgress - 0.33) / 0.19) * 80 
      : 0;

  // 4. Experience Art Text Card (fades and scales in last, from 0.46 to 0.63)
  const textOpacity = scrollProgress < 0.46 
    ? 0 
    : scrollProgress < 0.63 
      ? (scrollProgress - 0.46) / 0.17 
      : scrollProgress < 0.76 
        ? 1 
        : scrollProgress < 0.86 
          ? 1 - (scrollProgress - 0.76) / 0.1 
          : 0;

  const textScale = scrollProgress < 0.46 
    ? 0.9 
    : scrollProgress < 0.63 
      ? 0.9 + ((scrollProgress - 0.46) / 0.17) * 0.1 
      : scrollProgress < 0.76 
        ? 1 
        : scrollProgress < 0.86 
          ? 1 - ((scrollProgress - 0.76) / 0.1) * 0.05 
          : 0.95;

  const textTranslateY = scrollProgress < 0.46 
    ? 40 
    : scrollProgress < 0.63 
      ? 40 - ((scrollProgress - 0.46) / 0.17) * 40 
      : scrollProgress < 0.76 
        ? 0 
        : scrollProgress < 0.86 
          ? -((scrollProgress - 0.76) / 0.1) * 30 
          : -30;

  const showcaseOpacity = scrollProgress < 0.7 
    ? 0 
    : Math.min(1, (scrollProgress - 0.7) / 0.2);

  const showcaseScale = scrollProgress < 0.7 
    ? 0.9 
    : 0.9 + Math.min(1, (scrollProgress - 0.7) / 0.2) * 0.1;

  const showcaseTranslateY = scrollProgress < 0.7 
    ? 60 
    : 60 - Math.min(1, (scrollProgress - 0.7) / 0.2) * 60;

  return (
    <div className={styles.page}>
      <Navbar />

      {/* 1. HERO SECTION (SCROLL-ZOOM STICKY CONTAINER) */}
      <section 
        id="hero-scroll-container" 
        className={styles.heroScrollContainer}
      >
        <div className={styles.heroStickyWrapper}>

          {/* Background Decorative Brush Accents */}
          <div className={styles.heroBrush1} style={{ transform: `translate(${-scrollProgress * 150}px, ${scrollProgress * 50}px)`, opacity: 0.1 * (1 - scrollProgress) }}>
            <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 80 C 40 10, 60 10, 100 80 C 130 150, 160 150, 190 80" stroke="var(--color-tosca)" strokeWidth="8" strokeLinecap="round"/>
            </svg>
          </div>
          <div className={styles.heroBrush2} style={{ transform: `translate(${scrollProgress * 150}px, ${-scrollProgress * 50}px)`, opacity: 0.1 * (1 - scrollProgress) }}>
            <svg width="250" height="250" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 20 C 80 180, 120 180, 180 20" stroke="var(--color-kunyit)" strokeWidth="6" strokeLinecap="round" strokeDasharray="5,5"/>
            </svg>
          </div>

          {/* TAHAP 1 & 2: ZOOM BINGKAI LUKISAN & VIDEO INTRO */}
          {scrollProgress < 0.65 && (
            <div 
              className={styles.frameContainer}
              style={{
                transform: `translate(-50%, -50%) scale(${1 + scrollProgress * 18})`,
                opacity: scrollProgress < 0.25 ? 1 : Math.max(0, 1 - (scrollProgress - 0.25) / 0.35),
                pointerEvents: scrollProgress > 0.45 ? 'none' : 'auto',
              }}
            >
              <div className={styles.frameWrapper}>
                {/* 4 Pojok Bingkai Responsif */}
                <img 
                  src="/hero-corner-tl.png" 
                  alt="Corner Top Left" 
                  className={`${styles.frameCorner} ${styles.cornerTl}`}
                />
                <img 
                  src="/hero-corner-tr.png" 
                  alt="Corner Top Right" 
                  className={`${styles.frameCorner} ${styles.cornerTr}`}
                />
                <img 
                  src="/hero-corner-bl.png" 
                  alt="Corner Bottom Left" 
                  className={`${styles.frameCorner} ${styles.cornerBl}`}
                />
                <img 
                  src="/hero-corner-br.png" 
                  alt="Corner Bottom Right" 
                  className={`${styles.frameCorner} ${styles.cornerBr}`}
                />
                
                {/* Video Intro Logo di Tengah Bingkai (Fades out smoothly) */}
                <div 
                  className={styles.frameLogoOverlay}
                  style={{
                    opacity: videoOpacity,
                    pointerEvents: videoOpacity < 0.1 ? 'none' : 'auto',
                  }}
                >
                  <video
                    className={styles.introVideo}
                    src="/video-intro-logo.mp4"
                    autoPlay
                    muted
                    playsInline
                    preload="auto"
                  />
                  <img
                    src="/logo.png"
                    alt="Berseni Logo"
                    className={styles.frameLogo}
                  />
                </div>
              </div>
            </div>
          )}

          {/* BACKGROUND UNTUK TAHAP 3 (HERO TEXT) - STAGGERED ACCENTS */}
          <div 
            className={styles.heroStage3Bg}
            style={{
              pointerEvents: 'none',
              display: scrollProgress < 0.15 || scrollProgress > 0.9 ? 'none' : 'block',
            }}
          >
            {/* Latar Belakang Ombak Sunset (Slides up and fades in) */}
            <div 
              className={styles.sunsetParallaxWrapper}
              style={{
                opacity: sunsetOpacity,
                transform: `scale(${1.02 + scrollProgress * 0.03}) translate(${scrollProgress * -8}px, ${sunsetTranslateY - scrollProgress * 4}px)`,
              }}
            >
              <div className={styles.bgSunset} />
            </div>

            {/* Overlay Burung-Burung Terbang (Slides from left-bottom and fades in) */}
            <div 
              className={styles.birdsParallaxWrapper}
              style={{
                opacity: birdsOpacity,
                transform: `scale(${1 + scrollProgress * 0.1}) translate(${birdsTranslateX + scrollProgress * 20}px, ${birdsTranslateY - scrollProgress * 12}px)`,
              }}
            >
              <div className={styles.bgBirds} />
            </div>
          </div>

          {/* TAHAP 3: HERO TEXT CONTENT */}
          <div 
            className={styles.heroContent}
            style={{
              opacity: textOpacity,
              transform: `translate(-50%, -50%) translateY(${textTranslateY}px) scale(${textScale})`,
              pointerEvents: textOpacity < 0.3 ? 'none' : 'auto',
              display: scrollProgress > 0.92 ? 'none' : 'block',
            }}
          >
            <span className={styles.heroSubtitle}>{content.heroSubtitle}</span>
            <h1 className={styles.heroTitle}>{renderHeroTitle(content.heroTitle)}</h1>
            <p className={styles.heroDesc}>{content.heroDescription}</p>
            <div className={styles.heroCTAs}>
              <a href="#products" className="btn btn-primary">Lihat Galeri & Kelas</a>
              <a href="#about" className="btn btn-outline">Tentang Kami</a>
            </div>
          </div>

          {/* TAHAP 4: SHOWCASE CAROUSEL & ELEMEN KOLASE FLYER */}
          <div 
            className={styles.showcaseWrapper}
            style={{
              opacity: showcaseOpacity,
              transform: `translateY(${showcaseTranslateY}px) scale(${showcaseScale})`,
              pointerEvents: showcaseOpacity < 0.3 ? 'none' : 'auto',
            }}
          >
            {/* Background floating collage flyer kiri */}
            <div className={`${styles.floatingFlyer} ${styles.flyerLeft}`}>
              <img src="/collage-1.jpg" alt="Artwork flyer" />
            </div>

            {/* Background floating collage flyer kanan */}
            <div className={`${styles.floatingFlyer} ${styles.flyerRight}`}>
              <img src="/collage-2.jpg" alt="Artwork flyer" />
            </div>

            {/* Carousel Karya 3D Utama */}
            {featuredProducts.length > 0 && (
              <div className={styles.carouselShowcaseContainer}>
                <div className={styles.carouselShowcaseHeader}>
                  <h3>Karya & Kelas Unggulan Kami<span>.</span></h3>
                  <p>Geser atau klik kartu untuk melihat detail kelas dan lukisan Berseni</p>
                </div>
                <HeroCarousel 
                  items={featuredProducts} 
                  onCardClick={handleCardSelect} 
                />
              </div>
            )}
          </div>
        </div>
      </section>


      {/* 2. PROGRAMS SECTION (DARK INTERFACE) */}
      <section id="programs" className={styles.programs}>
        <div className={styles.sectionHeader}>
          <h2>Program Kami<span>.</span></h2>
          <p>Tiga pilar utama Berseni dalam menghadirkan pengalaman eksplorasi seni rupa yang mendalam dan mudah diakses bagi siapa saja.</p>
        </div>

        <div className={styles.programsGrid}>
          {/* Card 1: Offline */}
          <div className={`${styles.programCard} glass-dark`}>
            <div className={styles.iconWrapper}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3>Workshop & Event Offline</h3>
            <p>Hadiri kelas tatap muka intim, festival lukis tahunan, dan sesi "Meet Your Tutor" langsung di kota-kota Anda. Pengalaman praktek yang interaktif dan bersosialisasi.</p>
            <a href="#products" onClick={() => setSelectedFilter('offline')} className={styles.learnMoreBtn}>
              Lihat Jadwal
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          {/* Card 2: Online */}
          <div className={`${styles.programCard} glass-dark`}>
            <div className={styles.iconWrapper}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 00-2 2z" />
              </svg>
            </div>
            <h3>Kelas Video Online</h3>
            <p>Akses ratusan materi video-on-demand eksklusif yang diajarkan oleh para pelukis andal Indonesia. Belajar secara bertahap, kapan saja, dan dari mana saja.</p>
            <a href="#products" onClick={() => setSelectedFilter('online')} className={styles.learnMoreBtn}>
              Mulai Belajar
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          {/* Card 3: Supplies */}
          <div className={`${styles.programCard} glass-dark`}>
            <div className={styles.iconWrapper}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3>Karya Seni & Perlengkapan</h3>
            <p>Miliki lukisan orisinal berkelas hasil kurasi seniman Nusantara serta perlengkapan melukis premium untuk melengkapi perjalanan kreativitas Anda.</p>
            <a href="#products" onClick={() => setSelectedFilter('artwork')} className={styles.learnMoreBtn}>
              Beli Karya
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* 3. PRODUCT & WORKSHOP GALLERY SECTION */}
      <section id="products" className={styles.gallery}>
        <div className={styles.sectionHeader}>
          <h2 style={{ color: 'var(--color-text-dark)' }}>Koleksi & Kelas Seni<span>.</span></h2>
          <p style={{ color: 'var(--color-text-muted)' }}>Mulai langkah kreasi Anda. Pilih karya lukisan fisik orisinal untuk koleksi pribadi atau ikuti kelas melukis terpopuler kami.</p>
        </div>

        {/* Filter Navigation Tabs */}
        <div className={styles.filterTabs}>
          <button 
            className={`${styles.filterTab} ${selectedFilter === 'all' ? styles.activeFilterTab : ''}`}
            onClick={() => setSelectedFilter('all')}
          >
            Semua Koleksi
          </button>
          <button 
            className={`${styles.filterTab} ${selectedFilter === 'artwork' ? styles.activeFilterTab : ''}`}
            onClick={() => setSelectedFilter('artwork')}
          >
            Karya Lukis
          </button>
          <button 
            className={`${styles.filterTab} ${selectedFilter === 'offline' ? styles.activeFilterTab : ''}`}
            onClick={() => setSelectedFilter('offline')}
          >
            Workshop Offline
          </button>
          <button 
            className={`${styles.filterTab} ${selectedFilter === 'online' ? styles.activeFilterTab : ''}`}
            onClick={() => setSelectedFilter('online')}
          >
            Kelas E-Course
          </button>
        </div>

        {/* Dynamic Products Grid */}
        <div className={styles.galleryGrid}>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={handleCardSelect}
              />
            ))
          ) : (
            <div className={styles.emptyGallery}>
              <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ margin: '0 auto 1rem auto', opacity: 0.5 }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.008 1.24l.885 1.77a2.25 2.25 0 002.007 1.24h1.98a2.25 2.25 0 002.007-1.24l.885-1.77a2.25 2.25 0 012.007-1.24h3.86m-18 0h18a2.25 2.25 0 012.25 2.25v4.5A2.25 2.25 0 0118 21H6a2.25 2.25 0 01-2.25-2.25v-4.5a2.25 2.25 0 012.25-2.25zM6 7.5h12M6 10.5h12" />
              </svg>
              Belum ada item untuk kategori ini. Hubungi admin via WhatsApp untuk melakukan request khusus.
            </div>
          )}
        </div>
      </section>

      {/* 4. ABOUT & VISION MISSION SECTION */}
      <section id="about" className={styles.about}>
        <div className={styles.aboutGrid}>
          {/* Column 1: Visi, Misi & Stats */}
          <div>
            <div className={styles.visiMisiBox}>
              <div className={styles.visiMisiCol}>
                <h3>
                  <svg width="24" height="24" fill="none" stroke="var(--color-maroon)" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {content.visiTitle}
                </h3>
                <p>{content.visiDescription}</p>
              </div>

              <div className={styles.visiMisiCol}>
                <h3>
                  <svg width="24" height="24" fill="none" stroke="var(--color-tosca)" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  {content.misiTitle}
                </h3>
                <ul className={styles.misiList}>
                  {content.misiList && content.misiList.map((misi, index) => (
                    <li key={index}>{misi}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Dynamic Stats Box */}
            <div className={styles.statsContainer}>
              <div className={styles.statItem}>
                <span className={styles.statNum}>{content.statsUsers}</span>
                <span className={styles.statLabel}>{content.statsDescription}</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNum}>100%</span>
                <span className={styles.statLabel}>Karya Orisinal</span>
              </div>
            </div>
          </div>

          {/* Column 2: The Story */}
          <div className={styles.aboutContent}>
            <h2>Tentang <span>Berseni.</span></h2>
            <div className={styles.aboutSubtitle}>{content.aboutSubtitle}</div>
            <p className={styles.aboutDesc}>{content.aboutDescription}</p>
          </div>
        </div>
      </section>

      {/* 5. CTA SECTION */}
      <section className={styles.cta}>
        {/* Background light effects */}
        <div style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', background: 'radial-gradient(circle, rgba(250,164,51,0.08) 0%, transparent 60%)', pointerEvents: 'none' }}></div>
        
        <div className={styles.ctaInner}>
          <h2>Ingin Mulai Berkarya Bersama?</h2>
          <p>Daftarkan diri Anda sebagai early supporter komunitas seni kami. Dapatkan penawaran eksklusif, rilis lukisan terbaru, dan undangan workshop terbatas langsung di email atau WhatsApp Anda.</p>
          <a 
            href="https://lynk.id/berseni.id"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            style={{ backgroundColor: 'var(--color-kunyit)', color: 'var(--color-black)', boxShadow: '0 4px 14px rgba(250, 164, 51, 0.4)' }}
          >
            Hubungi via Lynk.id
          </a>
        </div>
      </section>

      <Footer />

      {/* Product Details overlay modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
