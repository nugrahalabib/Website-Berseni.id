'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroCarousel from '@/components/HeroCarousel';
import ProductCard from '@/components/ProductCard';
import ProductModal from '@/components/ProductModal';
import ActivityModal from '@/components/ActivityModal';
import { useLanguage } from '@/components/LanguageContext';
import styles from '@/styles/Landing.module.css';

const activitiesData = [
  {
    id: "act-1",
    title_id: "Melukis Bersama di Studio Alam",
    title_en: "Painting Together in Nature Studio",
    category: "workshop",
    image: "/activity-outdoor.webp",
    summary_id: "Melukis lanskap alam bebas dipandu mentor profesional.",
    summary_en: "Painting open landscapes guided by professional mentors.",
    description_id: "Nikmati kesegaran udara pegunungan Ubud sembari mengekspresikan kreativitas Anda di atas kanvas. Dalam aktivitas ini, Anda akan diajarkan teknik menangkap cahaya alami, pencampuran warna cat akrilik, dan komposisi lanskap secara plein air (melukis di alam terbuka). Cocok untuk pemula maupun tingkat lanjut.",
    description_en: "Enjoy the fresh mountain air of Ubud while expressing your creativity on canvas. In this activity, you will be taught techniques of capturing natural light, blending acrylic colors, and plein air landscape composition. Perfect for beginners and advanced painters alike.",
    details_id: "Durasi: 3 Jam | Lokasi: Ubud, Bali | Termasuk: Kanvas, Cat, Kuas, & Snack",
    details_en: "Duration: 3 Hours | Location: Ubud, Bali | Includes: Canvas, Paint, Brushes, & Snacks",
    link: "https://lynk.id/berseni.id"
  },
  {
    id: "act-2",
    title_id: "Pameran Karya Komunitas Nusantara",
    title_en: "Nusantara Community Art Exhibition",
    category: "exhibition",
    image: "/activity-exhibition.webp",
    summary_id: "Galeri seni tahunan yang memajang karya kurasi terbaik komunitas.",
    summary_en: "An annual art gallery displaying the best curated works of the community.",
    description_id: "Berseni mewadahi para seniman lokal dan talenta baru dari komunitas kami untuk memamerkan karya mereka kepada publik dan kolektor. Pameran ini diadakan di galeri fisik dengan kurasi ketat dari kurator profesional, memberikan panggung apresiasi seni yang bermakna bagi semua orang.",
    description_en: "Berseni provides a platform for local artists and emerging talents from our community to exhibit their works to the public and collectors. This exhibition is held in a physical gallery with strict curation from professional curators, presenting a meaningful art appreciation stage for everyone.",
    details_id: "Durasi: 1 Minggu | Lokasi: Galeri Nasional, Jakarta | HTM: Gratis (Registrasi)",
    details_en: "Duration: 1 Week | Location: National Gallery, Jakarta | Ticket: Free (Registration)",
    link: "https://lynk.id/berseni.id"
  },
  {
    id: "act-3",
    title_id: "Workshop Canting & Lilin Malam",
    title_en: "Canting & Hot Wax Workshop",
    category: "workshop",
    image: "/activity-batik.webp",
    summary_id: "Belajar membatik tulis klasik canting secara tradisional.",
    summary_en: "Learn traditional hand-drawn batik using canting and hot wax.",
    description_id: "Selami warisan luhur budaya nusantara dengan belajar membatik tulis tradisional menggunakan canting, lilin malam, dan pewarna alami. Dapatkan bimbingan intim langkah-demi-langkah mulai dari menggambar pola di kain primissima hingga proses pelorodan lilin.",
    description_en: "Dive into the rich heritage of Indonesian culture by learning traditional hand-drawn batik using a canting, wax, and natural dyes. Receive intimate, step-by-step guidance starting from tracing patterns on primissima cloth to the wax removal process.",
    details_id: "Durasi: 4 Jam | Lokasi: Studio Berseni, Bandung | Bawa pulang hasil batik sendiri",
    details_en: "Duration: 4 Hours | Location: Berseni Studio, Bandung | Take home your own batik artwork",
    link: "https://lynk.id/berseni.id"
  },
  {
    id: "act-4",
    title_id: "Bincang Seniman & Sesi Sketsa",
    title_en: "Artist Talk & Sketching Session",
    category: "social",
    image: "/activity-talk.webp",
    summary_id: "Diskusi santai seputar seni rupa dibarengi sesi sketsa model.",
    summary_en: "Relaxed discussion around visual arts accompanied by a life model sketching session.",
    description_id: "Dapatkan wawasan mendalam mengenai industri kreatif dan proses berkarya langsung dari seniman profesional dalam sesi bincang-bincang santai. Acara kemudian dilanjutkan dengan sesi menggambar sketsa bersama model hidup (life drawing) menggunakan pensil charcoal.",
    description_en: "Gain deep insights into the creative industry and the process of creation directly from professional artists in a relaxed chat session. The event continues with a live figure sketching session using charcoal pencils.",
    details_id: "Durasi: 2.5 Jam | Lokasi: Berseni Hub, Yogyakarta | Alat gambar disediakan",
    details_en: "Duration: 2.5 Hours | Location: Berseni Hub, Yogyakarta | Drawing tools provided",
    link: "https://lynk.id/berseni.id"
  },
  {
    id: "act-5",
    title_id: "Festival Seni Lukis Anak Inklusif",
    title_en: "Inclusive Children's Painting Festival",
    category: "social",
    image: "/activity-children.webp",
    summary_id: "Festival mewarnai dan melukis kanvas raksasa kolaboratif anak.",
    summary_en: "A children's collaborative giant 50-meter canvas painting and coloring festival.",
    description_id: "Ruang gembira dan bebas berekspresi untuk anak-anak (termasuk anak berkebutuhan khusus) untuk melukis bersama di atas gulungan kanvas raksasa sepanjang 50 meter. Aktivitas sosial ini bertujuan memicu kreativitas motorik anak dan mengenalkan seni rupa sejak dini.",
    description_en: "A joyful and expressive space for children (including children with special needs) to paint together on a giant 50-meter canvas roll. This social activity aims to stimulate children's motor creativity and introduce visual arts from an early age.",
    details_id: "Durasi: 1 Hari Penuh | Lokasi: Taman Kota Jakarta | Terbuka untuk umum",
    details_en: "Duration: Full Day | Location: Jakarta City Park | Open for public",
    link: "https://lynk.id/berseni.id"
  }
];

const reviewsRow1 = [
  {
    id: 1,
    name: "Ahmad Fauzi",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
    rating: 5,
    comment_id: "Kelas Basic Oil Realism sangat direkomendasikan! Penjelasan Mas Srinthil mudah dipahami bahkan untuk saya yang baru mulai melukis.",
    comment_en: "Basic Oil Realism class is highly recommended! Mas Srinthil's explanation is easy to understand even for me who just started painting.",
    borderColor: "var(--color-tosca)"
  },
  {
    id: 2,
    name: "Riana Lestari",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
    rating: 5,
    comment_id: "Puas banget ikutan workshop Meowna Lisa kemarin! Mentornya sabar, vibes studionya asyik, dan bisa bawa pulang lukisan kucing buatan sendiri.",
    comment_en: "Extremely satisfied with the Meowna Lisa workshop! The mentor was patient, the studio vibe was fun, and I could bring home my own cat painting.",
    borderColor: "var(--color-maroon)"
  },
  {
    id: 3,
    name: "Budi Santoso",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop",
    rating: 5,
    comment_id: "Karya lukis orisinalnya sangat indah dan bersertifikat COA resmi. Dipajang di ruang tamu langsung bikin suasana rumah jadi lebih estetik.",
    comment_en: "The original paintings are stunning and come with an official COA. Hanging it in the living room instantly makes the house look aesthetic.",
    borderColor: "var(--color-kunyit)"
  },
  {
    id: 4,
    name: "Siti Rahma",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop",
    rating: 4,
    comment_id: "Pendaftaran kelas online sangat mudah via Lynk.id. Video pembelajarannya HD dan aksesnya seumur hidup. Sangat worth it!",
    comment_en: "Registering for the online class was very easy via Lynk.id. The instructional videos are HD with lifetime access. Highly worth it!",
    borderColor: "var(--color-tosca)"
  }
];

const reviewsRow2 = [
  {
    id: 5,
    name: "Dewi Kartika",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop",
    rating: 5,
    comment_id: "Workshop Summer in Pink di Yello Hotel kemarin seru banget! Dapet snack enak, alat lukis lengkap, dan dapet kenalan baru sesama pencinta seni.",
    comment_en: "The Summer in Pink workshop at Yello Hotel was so much fun! Got delicious snacks, complete painting tools, and met new friends who love art.",
    borderColor: "var(--color-maroon)"
  },
  {
    id: 6,
    name: "Hendra Wijaya",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=150&auto=format&fit=crop",
    rating: 5,
    comment_id: "Lukisan 'It's OK Offline' yang saya beli kualitas cat dan detail kanvasnya luar biasa. Pengirimannya aman menggunakan packing kayu.",
    comment_en: "The quality of the paint and canvas detail on the 'It's OK Offline' painting I bought is amazing. Shipping was safe using a wooden crate.",
    borderColor: "var(--color-kunyit)"
  },
  {
    id: 7,
    name: "Linda Permata",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop",
    rating: 4,
    comment_id: "Baru pertama kali melukis di workshop Tweet your Heart, ternyata menyenangkan sekali. Step-by-step-nya dipandu telaten oleh seniman.",
    comment_en: "First time painting at the Tweet your Heart workshop, and it turned out to be super fun. The artist guided us step-by-step with patience.",
    borderColor: "var(--color-tosca)"
  },
  {
    id: 8,
    name: "Rico Pratama",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150&auto=format&fit=crop",
    rating: 5,
    comment_id: "Suka sekali dengan konsep komunitas Berseni. Bisa sharing progress lukisan di grup WhatsApp dan dapet arahan langsung dari tutor profesional.",
    comment_en: "Love the concept of the Berseni community. We can share painting progress in the WhatsApp group and get direct feedback from professional tutors.",
    borderColor: "var(--color-maroon)"
  }
];

export default function LandingPageClient({ initialContent, initialProducts, initialPosts = [] }) {
  const { language, t, getTranslation } = useLanguage();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [videoEnded, setVideoEnded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ minutes: 59, seconds: 59 });
  const galleryTrackRef = useRef(null);
  const [scrollPct, setScrollPct] = useState(0);

  const blogTrackRef = useRef(null);
  const [blogScrollPct, setBlogScrollPct] = useState(0);

  const handleScroll = (e) => {
    const { scrollLeft, scrollWidth, clientWidth } = e.target;
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll > 0) {
      setScrollPct(scrollLeft / maxScroll);
    }
  };

  const scrollGallery = (direction) => {
    const track = galleryTrackRef.current;
    if (!track) return;
    const cardWidth = 350 + 32; // card width + gap
    const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
    track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const handleBlogScroll = (e) => {
    const { scrollLeft, scrollWidth, clientWidth } = e.target;
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll > 0) {
      setBlogScrollPct(scrollLeft / maxScroll);
    }
  };

  const scrollBlog = (direction) => {
    const track = blogTrackRef.current;
    if (!track) return;
    const cardWidth = 350 + 32; // card width + gap
    const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
    track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  // Countdown timer logic (resets to 1hr on refresh or end)
  useEffect(() => {
    const targetTime = Date.now() + 60 * 60 * 1000;
    const interval = setInterval(() => {
      const difference = targetTime - Date.now();
      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft({ minutes: 59, seconds: 59 });
      } else {
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ minutes, seconds });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Hook untuk memantau apakah layar berukuran mobile
  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    setIsMobile(mediaQuery.matches);
    
    const handler = (e) => setIsMobile(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

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
    heroTitle_id: "Experience Art. Feel Indonesia.",
    heroTitle_en: "Experience Art. Feel Indonesia.",
    heroSubtitle_id: "Learn. Create. Experience.",
    heroSubtitle_en: "Learn. Create. Experience.",
    heroDescription_id: "Belajar langsung dari seniman profesional Indonesia melalui kelas online interaktif, workshop intim, dan festival seni imersif.",
    heroDescription_en: "Learn directly from professional Indonesian artists through interactive online classes, intimate workshops, and immersive art festivals.",
    aboutTitle_id: "When passion meets arts",
    aboutTitle_en: "When passion meets arts",
    aboutSubtitle_id: "Gerbang Utama Anda Menuju Dunia Seniman",
    aboutSubtitle_en: "Your Gateway to the World of Artists",
    aboutDescription_id: "Berseni lahir dari kesadaran sederhana bahwa banyak orang ingin lebih dekat dengan dunia seni rupa, tetapi bingung harus mulai dari mana. Kami memutuskan untuk membuka jalan itu.",
    aboutDescription_en: "Berseni was born from a simple realization that many people want to get closer to the visual art world, but are confused about where to start. We decided to open that path.",
    visiTitle_id: "Visi Kami",
    visiTitle_en: "Our Vision",
    visiDescription_id: "Menjadi jembatan global utama antara masyarakat umum dan seniman lokal Indonesia.",
    visiDescription_en: "To become the primary global bridge between the general public and local Indonesian artists.",
    misiTitle_id: "Misi Kami",
    misiTitle_en: "Our Mission",
    misiList_id: [
      "Membuka akses langsung bagi publik untuk berinteraksi dan belajar dari seniman profesional.",
      "Mendukung pemberdayaan ekonomi seniman lokal.",
      "Membina komunitas pecinta seni yang inklusif di seluruh Indonesia."
    ],
    misiList_en: [
      "Opening direct access for the public to interact and learn from professional artists.",
      "Supporting the economic empowerment of local artists.",
      "Nurturing an inclusive community of art lovers across Indonesia."
    ],
    statsUsers: "20k+",
    statsDescription_id: "Pengguna Berseni",
    statsDescription_en: "Berseni Users"
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

  const handleActivitySelect = (activity) => {
    setSelectedActivity(activity);
  };

  const handleCloseActivityModal = () => {
    setSelectedActivity(null);
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

  // 2. Sunset & Waves Transition (fades/slides up 0.2 to 0.4, slides down/fades out 0.74 to 0.82)
  const sunsetOpacity = scrollProgress < 0.20 
    ? 0 
    : scrollProgress < 0.40 
      ? (scrollProgress - 0.20) / 0.20 
      : scrollProgress < 0.74 
        ? 1 
        : scrollProgress < 0.82 
          ? 1 - (scrollProgress - 0.74) / 0.08 
          : 0;

  const sunsetTranslateY = scrollProgress < 0.20 
    ? 120 
    : scrollProgress < 0.40 
      ? 120 - ((scrollProgress - 0.20) / 0.20) * 120 
      : scrollProgress < 0.74 
        ? 0 
        : ((scrollProgress - 0.74) / 0.08) * 120;

  // 3. Birds Transition (fades/flies from left-top 0.33 to 0.52, flies right-top/fades out 0.70 to 0.78)
  const birdsOpacity = scrollProgress < 0.33 
    ? 0 
    : scrollProgress < 0.52 
      ? (scrollProgress - 0.33) / 0.19 
      : scrollProgress < 0.70 
        ? 1 
        : scrollProgress < 0.78 
          ? 1 - (scrollProgress - 0.70) / 0.08 
          : 0;

  const birdsTranslateX = scrollProgress < 0.33 
    ? -200 
    : scrollProgress < 0.52 
      ? -200 - ((scrollProgress - 0.33) / 0.19) * -200 
      : scrollProgress < 0.70 
        ? 0 
        : scrollProgress < 0.78 
          ? ((scrollProgress - 0.70) / 0.08) * 300 
          : 300;

  const birdsTranslateY = scrollProgress < 0.33 
    ? -60 
    : scrollProgress < 0.52 
      ? -60 - ((scrollProgress - 0.33) / 0.19) * -60 
      : scrollProgress < 0.70 
        ? 0 
        : -((scrollProgress - 0.70) / 0.08) * 80;

  // 4. Experience Art Text Card (fades/scales in 0.46 to 0.60, fades/slides up out first 0.65 to 0.72)
  const textOpacity = scrollProgress < 0.46 
    ? 0 
    : scrollProgress < 0.60 
      ? (scrollProgress - 0.46) / 0.14 
      : scrollProgress < 0.65 
        ? 1 
        : scrollProgress < 0.72 
          ? 1 - (scrollProgress - 0.65) / 0.07 
          : 0;

  const textScale = scrollProgress < 0.46 
    ? 0.9 
    : scrollProgress < 0.60 
      ? 0.9 + ((scrollProgress - 0.46) / 0.14) * 0.1 
      : scrollProgress < 0.65 
        ? 1 
        : scrollProgress < 0.72 
          ? 1 - ((scrollProgress - 0.65) / 0.07) * 0.05 
          : 0.95;

  const textTranslateY = scrollProgress < 0.46 
    ? 40 
    : scrollProgress < 0.60 
      ? 40 - ((scrollProgress - 0.46) / 0.14) * 40 
      : scrollProgress < 0.65 
        ? 0 
        : -((scrollProgress - 0.65) / 0.07) * 30;

  const showcaseOpacity = scrollProgress < 0.80 
    ? 0 
    : Math.min(1, (scrollProgress - 0.80) / 0.12);

  const showcaseScale = scrollProgress < 0.80 
    ? 0.92 
    : 0.92 + Math.min(1, (scrollProgress - 0.80) / 0.12) * 0.08;

  const showcaseTranslateY = scrollProgress < 0.80 
    ? 40 
    : 40 - Math.min(1, (scrollProgress - 0.80) / 0.12) * 40;

  const showScrollButton = (isMobile || videoEnded);
  
  const scrollButtonOpacity = showScrollButton
    ? (scrollProgress < 0.05 
        ? 1 
        : scrollProgress < 0.15 
          ? 1 - (scrollProgress - 0.05) / 0.1 
          : 0)
    : 0;

  const handleScrollDown = () => {
    window.scrollTo({
      top: window.innerHeight * 0.8,
      behavior: 'smooth'
    });
  };

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
                    onEnded={() => setVideoEnded(true)}
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
            <span className={styles.heroSubtitle}>{t(content, 'heroSubtitle')}</span>
            <h1 className={styles.heroTitle}>{renderHeroTitle(t(content, 'heroTitle'))}</h1>
            <p className={styles.heroDesc}>{t(content, 'heroDescription')}</p>
            <div className={styles.heroCTAs}>
              <a href="#products" className="btn btn-primary">{getTranslation('heroBtnGallery')}</a>
              <a href="#about" className="btn btn-outline">{getTranslation('heroBtnAbout')}</a>
            </div>
          </div>

          {/* TAHAP 4: SHOWCASE CAROUSEL (AKTIVITAS BERSENI) */}
          <div 
            className={styles.showcaseWrapper}
            style={{
              opacity: showcaseOpacity,
              transform: `translateY(${showcaseTranslateY}px) scale(${showcaseScale})`,
              pointerEvents: showcaseOpacity < 0.3 ? 'none' : 'auto',
            }}
          >
            {/* Background Trees on Left and Right */}
            <div className={styles.showcaseTreeLeft} />
            <div className={styles.showcaseTreeRight} />
            
            {/* Carousel Aktivitas Berseni */}
            {activitiesData.length > 0 && (
              <div className={styles.carouselShowcaseContainer}>
                <div className={styles.carouselShowcaseHeader}>
                  <h3>{getTranslation('activitiesHeaderTitle')}<span>.</span></h3>
                  <p>{getTranslation('activitiesHeaderSubtitle')}</p>
                </div>
                <HeroCarousel 
                  items={activitiesData} 
                  onCardClick={handleActivitySelect} 
                />
              </div>
            )}
          </div>
          
          {/* Scroll Indicator (Fades out dynamically on scroll) */}
          {showScrollButton && (
            <div 
              className={styles.scrollIndicator}
              style={{
                opacity: scrollButtonOpacity,
                pointerEvents: scrollButtonOpacity < 0.2 ? 'none' : 'auto',
              }}
              onClick={handleScrollDown}
            >
              <span className={styles.scrollText}>{getTranslation('scrollingText')}</span>
              <svg className={styles.scrollArrow} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M19 12l-7 7-7-7" />
              </svg>
            </div>
          )}
        </div>
      </section>
 
      {/* SPONSOR & PARTNER LOGOS LOOP (DI PERCAYA OLEH) */}
      <section className={styles.partnersSection}>
        <div className={styles.partnersInner}>
          <h4 className={styles.partnersTitle}>{getTranslation('trustedBy')}</h4>
          <div className={styles.partnersMarquee}>
            <div className={styles.partnersTrack}>
              {/* Render the logo set 3 times for a seamless loop */}
              {Array.from({ length: 3 }).map((_, loopIdx) => (
                <div key={loopIdx} className={styles.partnersGroup}>
                  {Array.from({ length: 8 }).map((_, imgIdx) => (
                    <img 
                      key={`${loopIdx}-${imgIdx}`} 
                      src={`/support/${imgIdx + 1}.png`} 
                      alt={`Partner ${imgIdx + 1}`} 
                      className={styles.partnerLogo} 
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
 
      {/* 2. PROGRAMS SECTION (DARK INTERFACE) */}
      <section id="programs" className={styles.programs}>
        {/* Glow backgrounds */}
        <div className={styles.programsGlowContainer}>
          <div className={`${styles.glowBlob} ${styles.glowMaroon}`}></div>
          <div className={`${styles.glowBlob} ${styles.glowTosca}`}></div>
          <div className={`${styles.glowBlob} ${styles.glowKunyit}`}></div>
        </div>
        
        {/* Abstract path decor */}
        <div className={styles.programsLineDecor}>
          <svg width="100%" height="100%" viewBox="0 0 1440 600" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.06, stroke: 'var(--color-tosca)', strokeWidth: '1.5' }}>
            <path d="M-100 100 C 300 300, 700 0, 1100 400 C 1300 500, 1500 200, 1600 300" strokeLinecap="round" />
          </svg>
        </div>
 
        <div className={styles.sectionHeader}>
          <h2>{getTranslation('ourPrograms')}<span>.</span></h2>
          <p>{getTranslation('programsSubtitle')}</p>
        </div>
 
        <div className={styles.programsGrid}>
          {/* Card 1: Offline */}
          <div className={styles.programCard}>
            <div className={styles.cardImageBg} style={{ backgroundImage: "url('/activity-outdoor.webp')" }}></div>
            <div className={styles.cardOverlayGradient}></div>
            <div className={styles.cardAccentLine}></div>
            <span className={styles.cardIndicator}>01</span>
 
            <div className={styles.cardContent}>
              <div className={styles.iconWrapper}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3>{getTranslation('prog1Title')}</h3>
              <p>{getTranslation('prog1Desc')}</p>
              <a href="#products" onClick={() => setSelectedFilter('offline')} className={styles.learnMoreBtn}>
                {getTranslation('prog1Btn')}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
 
          {/* Card 2: Online */}
          <div className={styles.programCard}>
            <div className={styles.cardImageBg} style={{ backgroundImage: "url('/activity-talk.webp')" }}></div>
            <div className={styles.cardOverlayGradient}></div>
            <div className={styles.cardAccentLine}></div>
            <span className={styles.cardIndicator}>02</span>
 
            <div className={styles.cardContent}>
              <div className={styles.iconWrapper}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 00-2 2z" />
                </svg>
              </div>
              <h3>{getTranslation('prog2Title')}</h3>
              <p>{getTranslation('prog2Desc')}</p>
              <a href="#products" onClick={() => setSelectedFilter('online')} className={styles.learnMoreBtn}>
                {getTranslation('prog2Btn')}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
 
          {/* Card 3: Supplies */}
          <div className={styles.programCard}>
            <div className={styles.cardImageBg} style={{ backgroundImage: "url('/collage-1.jpg')" }}></div>
            <div className={styles.cardOverlayGradient}></div>
            <div className={styles.cardAccentLine}></div>
            <span className={styles.cardIndicator}>03</span>
 
            <div className={styles.cardContent}>
              <div className={styles.iconWrapper}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3>{getTranslation('prog3Title')}</h3>
              <p>{getTranslation('prog3Desc')}</p>
              <a href="#products" onClick={() => setSelectedFilter('artwork')} className={styles.learnMoreBtn}>
                {getTranslation('prog3Btn')}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PRODUCT & WORKSHOP GALLERY SECTION */}
      <section id="products" className={styles.gallery}>
        <div className={styles.sectionHeader}>
          <h2 style={{ color: 'var(--color-text-dark)' }}>{getTranslation('galleryTitle')}<span>.</span></h2>
          <p style={{ color: 'var(--color-text-muted)' }}>{getTranslation('gallerySubtitle')}</p>
        </div>

        {/* Promo Countdown Banner */}
        <div className={styles.promoBanner}>
          <div className={styles.promoBannerInner}>
            <div className={styles.promoIcon}>⚡</div>
            <div className={styles.promoTextCol}>
              <h4>{getTranslation('promoTitle')}</h4>
              <p>{getTranslation('promoSubtitle')}</p>
            </div>
            <div className={styles.countdownBox}>
              <span className={styles.countdownLabel}>{getTranslation('promoEnds')}</span>
              <div className={styles.countdownTimer}>
                <div className={styles.timerDigit}>
                  <span>{String(timeLeft.minutes).padStart(2, '0')}</span>
                  <label>{getTranslation('minutes')}</label>
                </div>
                <span className={styles.timerColon}>:</span>
                <div className={styles.timerDigit}>
                  <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
                  <label>{getTranslation('seconds')}</label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Navigation Tabs */}
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

        {/* Dynamic Products Horizontal Slider */}
        {filteredProducts.length > 0 ? (
          <>
            <div className={styles.gallerySliderWrapper}>
              {/* Left Arrow Button */}
              <button 
                className={`${styles.gallerySliderBtn} ${styles.gallerySliderBtnLeft}`} 
                onClick={() => scrollGallery('left')}
                aria-label="Geser Kiri"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Scrollable Track */}
              <div 
                ref={galleryTrackRef}
                className={styles.galleryScrollTrack}
                onScroll={handleScroll}
              >
                {filteredProducts.map((product) => (
                  <div key={product.id} className={styles.galleryScrollItem}>
                    <ProductCard
                      product={product}
                      onClick={handleCardSelect}
                    />
                  </div>
                ))}
              </div>

              {/* Right Arrow Button */}
              <button 
                className={`${styles.gallerySliderBtn} ${styles.gallerySliderBtnRight}`} 
                onClick={() => scrollGallery('right')}
                aria-label="Geser Kanan"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Customized Scroll Indicator Thumb Track */}
            <div className={styles.scrollIndicatorTrack}>
              <div 
                className={styles.scrollIndicatorThumb}
                style={{ transform: `translateX(${scrollPct * 110}px)` }}
              ></div>
            </div>

            {/* View All Button to navigate to Store */}
            <div className={styles.viewAllContainer}>
              <Link href="/store" className="btn btn-secondary">
                {getTranslation('viewAll')}
              </Link>
            </div>
          </>
        ) : (
          <div className={styles.emptyGallery}>
            <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ margin: '0 auto 1rem auto', opacity: 0.5 }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.008 1.24l.885 1.77a2.25 2.25 0 002.007 1.24h1.98a2.25 2.25 0 002.007-1.24l.885-1.77a2.25 2.25 0 012.007-1.24h3.86m-18 0h18a2.25 2.25 0 012.25 2.25v4.5A2.25 2.25 0 0118 21H6a2.25 2.25 0 01-2.25-2.25v-4.5a2.25 2.25 0 012.25-2.25zM6 7.5h12M6 10.5h12" />
            </svg>
            {getTranslation('emptyGallery')}
          </div>
        )}
      </section>

      {/* TESTIMONIALS / REVIEWS SECTION */}
      <section className={styles.testimonials}>
        <div className={styles.sectionHeader}>
          <h2 style={{ color: 'var(--color-text-dark)' }}>{getTranslation('testimonialsTitle')}<span>.</span></h2>
          <p style={{ color: 'var(--color-text-muted)' }}>{getTranslation('testimonialsSubtitle')}</p>
        </div>

        {/* Row 1: Left to Right movement */}
        <div className={styles.marqueeWrapper}>
          <div className={styles.marqueeTrackLeft}>
            {reviewsRow1.concat(reviewsRow1).concat(reviewsRow1).map((review, idx) => (
              <div 
                key={`row1-${review.id}-${idx}`} 
                className={styles.reviewCard}
                style={{ borderTop: `4px solid ${review.borderColor}` }}
              >
                <div className={styles.reviewHeader}>
                  <img src={review.avatar} alt={review.name} className={styles.reviewAvatar} />
                  <div className={styles.reviewMeta}>
                    <span className={styles.reviewName}>{review.name}</span>
                    <div className={styles.reviewStars}>
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="var(--color-kunyit)">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <p className={styles.reviewComment}>"{t(review, 'comment')}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2: Right to Left movement */}
        <div className={styles.marqueeWrapper}>
          <div className={styles.marqueeTrackRight}>
            {reviewsRow2.concat(reviewsRow2).concat(reviewsRow2).map((review, idx) => (
              <div 
                key={`row2-${review.id}-${idx}`} 
                className={styles.reviewCard}
                style={{ borderTop: `4px solid ${review.borderColor}` }}
              >
                <div className={styles.reviewHeader}>
                  <img src={review.avatar} alt={review.name} className={styles.reviewAvatar} />
                  <div className={styles.reviewMeta}>
                    <span className={styles.reviewName}>{review.name}</span>
                    <div className={styles.reviewStars}>
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="var(--color-kunyit)">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <p className={styles.reviewComment}>"{t(review, 'comment')}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOG SECTION */}
      <section id="blog" className={styles.blogSliderSection}>
        <div className={styles.sectionHeader}>
          <h2 style={{ color: 'var(--color-text-dark)' }}>{getTranslation('blogHeaderTitleText')}<span>{getTranslation('blogHeaderTitleSpan')}</span></h2>
          <p style={{ color: 'var(--color-text-muted)' }}>{getTranslation('blogHeaderSubtitle')}</p>
        </div>

        {initialPosts.length > 0 ? (
          <>
            <div className={styles.blogSliderWrapper}>
              {/* Left Arrow Button */}
              <button 
                className={`${styles.blogSliderBtn} ${styles.blogSliderBtnLeft}`} 
                onClick={() => scrollBlog('left')}
                aria-label="Geser Kiri"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Scrollable Track */}
              <div 
                ref={blogTrackRef}
                className={styles.blogScrollTrack}
                onScroll={handleBlogScroll}
              >
                {initialPosts.map((post) => (
                  <div key={post.slug} className={styles.blogScrollItem}>
                    <article className={styles.blogSlideCard}>
                      <div className={styles.blogSlideImageWrapper}>
                        <img 
                          src={post.image} 
                          alt={t(post, 'title')} 
                          className={styles.blogSlideImage}
                          loading="lazy"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=600&auto=format&fit=crop';
                          }}
                        />
                        <span className={styles.blogSlideTag}>{getTranslation('blogHeaderTitleSpan')}</span>
                      </div>
                      <div className={styles.blogSlideBody}>
                        <span className={styles.blogSlideDate}>{post.date}</span>
                        <h3 className={styles.blogSlideTitle}>
                          <Link href={`/blog/${post.slug}`}>
                            {t(post, 'title')}
                          </Link>
                        </h3>
                        <p className={styles.blogSlideExcerpt}>{t(post, 'excerpt')}</p>
                        <Link href={`/blog/${post.slug}`} className={styles.blogSlideBtn}>
                          {getTranslation('readArticle')}
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </div>
                    </article>
                  </div>
                ))}
              </div>

              {/* Right Arrow Button */}
              <button 
                className={`${styles.blogSliderBtn} ${styles.blogSliderBtnRight}`} 
                onClick={() => scrollBlog('right')}
                aria-label="Geser Kanan"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Customized Scroll Indicator Thumb Track */}
            <div className={styles.blogScrollIndicatorTrack}>
              <div 
                className={styles.blogScrollIndicatorThumb}
                style={{ transform: `translateX(${blogScrollPct * 110}px)` }}
              ></div>
            </div>

            {/* View All Button to navigate to Blog page */}
            <div className={styles.viewAllBlogContainer}>
              <Link href="/blog" className="btn btn-secondary">
                {getTranslation('viewAllArticles')}
              </Link>
            </div>
          </>
        ) : (
          <div className={styles.emptyBlog}>
            {getTranslation('emptyBlog')}
          </div>
        )}
      </section>

      {/* 5. CTA SECTION */}
      <section className={styles.cta}>
        {/* Background light effects */}
        <div style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', background: 'radial-gradient(circle, rgba(250,164,51,0.08) 0%, transparent 60%)', pointerEvents: 'none' }}></div>
        
        <div className={styles.ctaInner}>
          <h2>{getTranslation('ctaTitle')}</h2>
          <p>{getTranslation('ctaSubtitle')}</p>
          <a 
            href={
              language === 'id'
                ? "https://wa.me/6281234567890?text=Halo%20Berseni%21%20Saya%20tertarik%20untuk%20bergabung%20sebagai%20early%20supporter%20dan%20ingin%20mendapatkan%20info%20terbaru%20mengenai%20karya%20seni%20dan%20workshop."
                : "https://wa.me/6281234567890?text=Hello%20Berseni%21%20I%20am%20interested%20in%20joining%20as%20an%20early%20supporter%20and%20want%20to%20get%20the%20latest%20info%20about%20artworks%20and%20workshops."
            }
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            style={{ backgroundColor: 'var(--color-kunyit)', color: 'var(--color-black)', boxShadow: '0 4px 14px rgba(250, 164, 51, 0.4)' }}
          >
            {getTranslation('ctaBtn')}
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

      {/* Activity Details overlay modal */}
      {selectedActivity && (
        <ActivityModal
          activity={selectedActivity}
          onClose={handleCloseActivityModal}
        />
      )}
    </div>
  );
}
