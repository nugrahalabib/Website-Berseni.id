'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('id');
  const [dbContent, setDbContent] = useState({});

  const fetchDbContent = async () => {
    try {
      const res = await fetch('/api/content');
      if (res.ok) {
        const data = await res.json();
        setDbContent(data);
      }
    } catch (e) {
      console.error("Gagal memuat dynamic content overrides:", e);
    }
  };

  // Load language preference on mount
  useEffect(() => {
    const savedLang = localStorage.getItem('berseni_lang');
    if (savedLang === 'id' || savedLang === 'en') {
      setLanguage(savedLang);
    }
    fetchDbContent();
  }, []);

  const toggleLanguage = () => {
    const newLang = language === 'id' ? 'en' : 'id';
    setLanguage(newLang);
    localStorage.setItem('berseni_lang', newLang);
  };

  const setLang = (lang) => {
    if (lang === 'id' || lang === 'en') {
      setLanguage(lang);
      localStorage.setItem('berseni_lang', lang);
    }
  };

  // Helper function to extract translation from bilingual database properties (e.g. title_id or title_en)
  const t = (obj, field) => {
    if (!obj) return '';
    const localizedField = `${field}_${language}`;
    if (obj[localizedField] !== undefined) {
      return obj[localizedField];
    }
    return obj[field] || '';
  };

  // Static strings translation dictionary
  const dict = {
    // Navbar
    navHome: { id: 'Home', en: 'Home' },
    navStore: { id: 'Store', en: 'Store' },
    navAbout: { id: 'About Us', en: 'About Us' },
    navCollab: { id: 'Colaboration', en: 'Collaboration' },
    navBlog: { id: 'Blog', en: 'Blog' },
    langToggle: { id: 'EN', en: 'ID' },

    // Footer
    footerTagline: { id: 'A World of Art for Everyone', en: 'A World of Art for Everyone' },
    footerDesc: {
      id: 'Platform penghubung publik dan seniman Indonesia. Temukan kelas melukis online, workshop offline, dan karya seni terbaik langsung dari para maestro.',
      en: 'A platform connecting the public and Indonesian artists. Discover online painting classes, offline workshops, and the best artwork directly from the maestros.'
    },
    footerNavTitle: { id: 'Navigasi', en: 'Navigation' },
    footerContactTitle: { id: 'Hubungi Kami', en: 'Contact Us' },
    footerCopyright: { id: 'Hak Cipta © 2026 Berseni. Powered by AgentBuff.', en: 'Copyright © 2026 Berseni. Powered by AgentBuff.' },

    // Landing Homepage
    trustedBy: { id: 'Dipercaya Oleh', en: 'Trusted By' },
    ourPrograms: { id: 'Program Kami', en: 'Our Programs' },
    programsSubtitle: {
      id: 'Tiga pilar utama Berseni dalam menghadirkan pengalaman eksplorasi seni rupa yang mendalam dan mudah diakses bagi siapa saja.',
      en: 'Three main pillars of Berseni in bringing a deep and accessible visual art experience for everyone.'
    },
    prog1Title: { id: 'Workshop & Event Offline', en: 'Offline Workshops & Events' },
    prog1Desc: {
      id: 'Hadiri kelas tatap muka intim, festival lukis tahunan, dan sesi "Meet Your Tutor" langsung di kota-kota Anda. Pengalaman praktek yang interaktif dan bersosialisasi.',
      en: 'Attend intimate face-to-face classes, annual art festivals, and "Meet Your Tutor" sessions directly in your cities. Interactive hands-on experience and socializing.'
    },
    prog1Btn: { id: 'Lihat Jadwal', en: 'View Schedule' },
    prog2Title: { id: 'Kelas Video Online', en: 'Online Video Classes' },
    prog2Desc: {
      id: 'Akses ratusan materi video-on-demand eksklusif yang diajarkan oleh para pelukis andal Indonesia. Belajar secara bertahap, kapan saja, dan dari mana saja.',
      en: 'Access hundreds of exclusive video-on-demand materials taught by skilled Indonesian painters. Learn step-by-step, anytime, and from anywhere.'
    },
    prog2Btn: { id: 'Mulai Belajar', en: 'Start Learning' },
    prog3Title: { id: 'Karya Seni & Perlengkapan', en: 'Artworks & Supplies' },
    prog3Desc: {
      id: 'Miliki lukisan orisinal berkelas hasil kurasi seniman Nusantara serta perlengkapan melukis premium untuk melengkapi perjalanan kreativitas Anda.',
      en: 'Own classy original paintings curated from Indonesian artists and premium painting supplies to complement your creative journey.'
    },
    prog3Btn: { id: 'Beli Karya', en: 'Buy Artwork' },

    galleryTitle: { id: 'Koleksi & Kelas Seni', en: 'Collections & Art Classes' },
    gallerySubtitle: {
      id: 'Mulai langkah kreasi Anda. Pilih karya lukisan fisik orisinal untuk koleksi pribadi atau ikuti kelas melukis terpopuler kami.',
      en: 'Start your creative journey. Select original physical paintings for personal collection or join our popular painting classes.'
    },
    promoTitle: { id: 'Penawaran Terbatas Koleksi Orisinal!', en: 'Limited Offer on Original Collections!' },
    promoSubtitle: {
      id: 'Miliki karya seni Nusantara bersertifikat resmi dengan harga diskon khusus.',
      en: 'Own official certified Nusantara art pieces with special discount prices.'
    },
    promoEnds: { id: 'Berakhir Dalam:', en: 'Ends In:' },
    minutes: { id: 'Menit', en: 'Minutes' },
    seconds: { id: 'Detik', en: 'Seconds' },

    tabAll: { id: 'Semua Koleksi', en: 'All Collections' },
    tabArtwork: { id: 'Karya Seni', en: 'Artworks' },
    tabOffline: { id: 'Workshop Offline', en: 'Offline Workshops' },
    tabOnline: { id: 'Kelas E-Course', en: 'E-Course Classes' },
    viewAll: { id: 'Lihat Selengkapnya', en: 'View More' },
    emptyGallery: {
      id: 'Belum ada item untuk kategori ini. Hubungi admin via WhatsApp untuk melakukan request khusus.',
      en: 'No items for this category yet. Contact admin via WhatsApp to make a custom request.'
    },

    testimonialsTitle: { id: 'Apa Kata Mereka', en: 'What They Say' },
    testimonialsSubtitle: {
      id: 'Cerita dan kesan jujur dari para pecinta seni, pemula, dan kolektor yang telah bergabung dalam komunitas Berseni.',
      en: 'Honest reviews and impressions from art lovers, beginners, and collectors who have joined the Berseni community.'
    },

    blogHeaderTitle: { id: 'Artikel & Catatan Seni', en: 'Articles & Art Notes' },
    blogHeaderSubtitle: {
      id: 'Temukan wawasan terbaru, panduan teknik melukis, serta kisah inspiratif dari dunia seni rupa Indonesia.',
      en: 'Discover the latest insights, painting techniques, and inspiring stories from the Indonesian art world.'
    },
    readArticle: { id: 'Baca Artikel', en: 'Read Article' },
    viewAllArticles: { id: 'Lihat Semua Artikel', en: 'View All Articles' },
    emptyBlog: { id: 'Belum ada artikel blog yang tersedia.', en: 'No blog articles available yet.' },

    ctaTitle: { id: 'Ingin Mulai Berkarya Bersama?', en: 'Want to Start Creating Together?' },
    ctaSubtitle: {
      id: 'Daftarkan diri Anda sebagai early supporter komunitas seni kami. Dapatkan penawaran eksklusif, rilis lukisan terbaru, dan undangan workshop terbatas langsung di email atau WhatsApp Anda.',
      en: 'Register yourself as an early supporter of our art community. Get exclusive offers, latest painting releases, and limited workshop invitations directly in your email or WhatsApp.'
    },
    ctaBtn: { id: 'Hubungi Kami Sekarang', en: 'Contact Us Now' },

    // Modals
    specsLabel: { id: 'Spesifikasi / Detail:', en: 'Specifications / Details:' },
    categoryLabel: { id: 'Kategori:', en: 'Category:' },
    priceLabel: { id: 'Harga:', en: 'Price:' },
    buyNowBtn: { id: 'Beli / Daftar Sekarang', en: 'Buy / Register Now' },
    closeBtn: { id: 'Tutup', en: 'Close' },
    activityDetailsLabel: { id: 'Detail Kegiatan:', en: 'Activity Details:' },
    registerWhatsAppBtn: { id: 'Daftar Sekarang via WhatsApp', en: 'Register Now via WhatsApp' },

    // Store Page
    storeTitle: { id: 'Koleksi & Kelas Seni Berseni.', en: 'Berseni Collections & Art Classes.' },
    storeSearchPlaceholder: { id: 'Cari karya seni atau kelas...', en: 'Search artworks or classes...' },
    sortByLabel: { id: 'Urutkan berdasarkan:', en: 'Sort by:' },
    sortLatest: { id: 'Terbaru', en: 'Latest' },
    sortPriceAsc: { id: 'Harga: Rendah ke Tinggi', en: 'Price: Low to High' },
    sortPriceDesc: { id: 'Harga: Tinggi ke Rendah', en: 'Price: High to Low' },

    // About Page
    aboutHeroLabel: { id: 'Tentang Berseni', en: 'About Us' },
    aboutHeroTitle: { id: 'Menghubungkan Jiwa, Karya, dan Cerita ', en: 'Connecting Souls, Works, and Stories of ' },
    aboutHeroTitleSpan: { id: 'Seniman.', en: 'Artists.' },
    aboutHeroDesc: {
      id: 'Kami adalah wadah kreatif yang berdedikasi untuk melestarikan warisan seni rupa Indonesia, memberdayakan seniman lokal, dan menghadirkan edukasi seni yang inklusif bagi semua orang.',
      en: 'We are a creative hub dedicated to preserving Indonesian art heritage, empowering local artists, and bringing inclusive art education to everyone.'
    },
    aboutCommitmentLabel: { id: 'Komitmen Kami', en: 'Our Commitment' },
    aboutCommitmentTitle: {
      id: 'Kami memastikan setiap karya & edukasi seni tersampaikan dengan hati.',
      en: 'We make sure every artwork & art education is delivered with heart.'
    },
    aboutCommitmentDesc: {
      id: 'Berseni melangkah lebih jauh dari sekadar platform transaksi. Kami merancang setiap kurikulum kelas melukis, memilih seniman pendamping, dan mengurasi lukisan orisinal secara cermat untuk memastikan nilai estetika dan cerita Nusantara tersalurkan secara utuh.',
      en: 'Berseni goes beyond a mere transaction platform. We carefully design every painting class curriculum, select mentor artists, and curate original paintings to ensure aesthetic values and stories of Nusantara are fully conveyed.'
    },
    aboutCommitBtn: { id: 'Jelajahi Program', en: 'Explore Programs' },
    aboutCommit1Title: { id: 'Karya Orisinal Terkurasi', en: 'Curated Original Artworks' },
    aboutCommit1Desc: {
      id: 'Semua lukisan dan merchandise seni kami dilengkapi dengan sertifikat keaslian resmi (COA) langsung dari seniman.',
      en: 'All our paintings and art merchandise are equipped with official certificate of authenticity (COA) directly from the artist.'
    },
    aboutCommit2Title: { id: 'Belajar Bersama Maestro', en: 'Learn with the Maestro' },
    aboutCommit2Desc: {
      id: 'Kelas dirancang dan dipandu secara intensif oleh seniman profesional serta praktisi seni rupa berpengalaman.',
      en: 'Classes are intensively designed and guided by professional artists and experienced visual art practitioners.'
    },
    aboutCommit3Title: { id: 'Akses Seni yang Inklusif', en: 'Inclusive Art Access' },
    aboutCommit3Desc: {
      id: 'Mendukung kelas sosial ramah difabel, anak-anak berkebutuhan khusus, serta pemula dewasa yang ingin memulai dari nol.',
      en: 'Supporting difable-friendly social classes, special needs children, and adult beginners who want to start from scratch.'
    },
    aboutQuote: {
      id: '"Seni adalah jembatan rasa yang menyatukan perbedaan, menghidupkan ruang, dan mengabadikan kisah Nusantara."',
      en: '"Art is a bridge of feelings that unites differences, enlivens spaces, and immortalizes stories of Nusantara."'
    },
    aboutQuoteAuthor: { id: 'Tim Kreatif Berseni', en: 'Creative Team Berseni' },
    aboutQuoteLocation: { id: 'Studio Ubud, Bali', en: 'Studio Ubud, Bali' },
    aboutPillarsTitle: { id: 'Tiga Pilar ', en: 'Three Main ' },
    aboutPillarsTitleSpan: { id: 'Utama.', en: 'Pillars.' },
    aboutPillarsSubtitle: {
      id: 'Nilai-nilai dasar yang memandu setiap langkah gerakan komunitas seni rupa Berseni.',
      en: 'Basic values guiding every step of the Berseni art community movement.'
    },
    aboutPillar1Title: { id: 'Seni Untuk Semua', en: 'Art For Everyone' },
    aboutPillar1Desc: {
      id: 'Kami meruntuhkan batasan eksklusivitas seni. Siapa pun, mulai dari anak-anak inklusif hingga dewasa amatir, berhak berkarya dan diapresiasi.',
      en: 'We tear down the barriers of art exclusivity. Anyone, from inclusive children to amateur adults, has the right to create and be appreciated.'
    },
    aboutPillar2Title: { id: 'Pemberdayaan Seniman', en: 'Empowering Artists' },
    aboutPillar2Desc: {
      id: 'Menjadi roda ekonomi yang menyokong kehidupan para seniman lokal Indonesia melalui komisi langsung, eksposur pameran, dan kurasi kelas.',
      en: 'Becoming an economic wheel supporting the livelihood of local Indonesian artists through direct commissions, exhibition exposure, and class curation.'
    },
    aboutPillar3Title: { id: 'Pelestarian Budaya', en: 'Preserving Culture' },
    aboutPillar3Desc: {
      id: 'Membawa warisan adiluhung Nusantara (seperti membatik tulis dan melukis lanskap klasik) ke dalam kemasan edukasi digital modern.',
      en: 'Bringing the noble heritage of Nusantara (such as hand-drawn batik and classical landscape painting) into modern digital educational packaging.'
    },
    aboutStats1Label: { id: 'Pengguna Berseni', en: 'Berseni Users' },
    aboutStats2Label: { id: 'Karya Orisinal Nusantara', en: 'Original Nusantara Works' },
    aboutStats3Label: { id: 'Maestro Seniman Mitra', en: 'Partner Maestro Artists' },
    aboutStats4Label: { id: 'Program & Aktivitas Komunitas', en: 'Community Programs & Activities' },
    aboutCtaTitle: { id: 'Mari Mulai Menjelajahi Seni Rupa', en: "Let's Start Exploring Visual Arts" },
    aboutCtaDesc: {
      id: 'Bergabunglah dengan kelas melukis maestro kami atau miliki lukisan klasik terkurasi langsung dari galeri kami.',
      en: 'Join our maestro painting classes or own curated classical paintings directly from our gallery.'
    },
    aboutCtaBtn1: { id: 'Buka Kelas & Galeri', en: 'Open Classes & Gallery' },
    aboutCtaBtn2: { id: 'Lihat Aktivitas', en: 'See Activities' },

    // Collaboration Page
    collabHeroSubtitle: { id: 'KEMITRAAN BERSENI', en: 'BERSENI PARTNERSHIP' },
    collabHeroTitle: { id: 'Collaboration Opportunities', en: 'Collaboration Opportunities' },
    collabHeroDesc: {
      id: 'Mari jalin kemitraan kreatif bersama Berseni. Kami membuka peluang kolaborasi dengan brand, komunitas, dan partner venue untuk menghadirkan pengalaman seni rupa yang berkesan bagi semua orang.',
      en: "Let's build a creative partnership with Berseni. We open collaboration opportunities with brands, communities, and space partners to bring a memorable visual art experience for everyone."
    },
    collabBrandBadge: { id: 'Brand & Korporat', en: 'Brand & Corporate' },
    collabBrandTitle: { id: 'Brand Collaboration', en: 'Brand Collaboration' },
    collabBrandIntro: {
      id: 'Berseni terbuka untuk berkolaborasi dengan brand, komunitas, dan perusahaan untuk menghadirkan pengalaman seni yang inspiratif dan berkesan. 🧡',
      en: 'Berseni is open to collaborate with brands, communities, and companies to bring inspiring and memorable art experiences. 🧡'
    },
    collabBrandFeat1Title: { id: 'Kolaborasi Kreatif', en: 'Creative Collaboration' },
    collabBrandFeat1Desc: { id: 'Kolaborasi kreatif yang disesuaikan dengan nilai dan tujuan brandmu.', en: 'Creative collaborations tailored to your brand values and goals.' },
    collabBrandFeat2Title: { id: 'Berpengalaman', en: 'Experienced' },
    collabBrandFeat2Desc: { id: 'Berpengalaman dalam berbagai event & kampanye bersama berbagai partner.', en: 'Experienced in various events & campaigns with various partners.' },
    collabBrandFeat3Title: { id: 'Produk Eksklusif', en: 'Exclusive Products' },
    collabBrandFeat3Desc: { id: 'Produk seni eksklusif, workshop, & aktivitas bermakna bagi audiens.', en: 'Exclusive art products, workshops, & meaningful activities for audiences.' },
    collabBrandFeat4Title: { id: 'Konten Visual', en: 'Visual Content' },
    collabBrandFeat4Desc: { id: 'Konten visual menarik untuk mendukung brand awareness produk Anda.', en: 'Attractive visual content to support your product\'s brand awareness.' },
    collabBrandCallout: { id: '"Mari ciptakan cerita, koneksi, dan karya yang berdampak bersama!"', en: '"Let\'s create stories, connections, and impactful works together!"' },
    collabBrandBtn: { id: 'Mulai Kolaborasi Brand', en: 'Start Brand Collaboration' },
    collabVenueBadge: { id: 'Host & Mitra Ruang', en: 'Host & Space Partners' },
    collabVenueTitle: { id: 'Call for Venue Collaboration', en: 'Call for Venue Collaboration' },
    collabVenueSub: {
      id: 'Kami sedang mencari venue yang ingin berkolaborasi dengan kami. Anda menyediakan tempat, kami bawa traffic & pengalaman seni!',
      en: 'We are looking for space partners that want to collaborate with us. You provide the venue, we bring the traffic & art experience!'
    },
    collabVenueFeat1Title: { id: 'Tingkatkan Traffic', en: 'Increase Traffic' },
    collabVenueFeat1Desc: { id: 'Dapatkan eksposur dan datangkan banyak pengunjung baru potensial ke lokasi Anda secara masif.', en: 'Get exposure and bring many massive new potential visitors to your location.' },
    collabVenueFeat2Title: { id: 'Promosi Bersama', en: 'Co-Promotion' },
    collabVenueFeat2Desc: { id: 'Kolaborasi kampanye media sosial dan pemasaran digital yang saling menguntungkan (*win-win*).', en: 'Mutual (win-win) social media campaigns and digital marketing collaborations.' },
    collabVenueFeat3Title: { id: 'Hadirkan Pengalaman', en: 'Bring Experience' },
    collabVenueFeat3Desc: { id: 'Ciptakan aktivitas kreatif berkesan, pameran seni, atau workshop melukis yang hidup di lokasi Anda.', en: 'Create memorable creative activities, art exhibitions, or live painting workshops at your location.' },
    collabVenueCtaTitle: { id: "Let's Grow Together!", en: "Let's Grow Together!" },
    collabVenueCtaDesc: {
      id: 'Punya cafe, resto, coworking space, atau hotel dengan area kosong yang berseni? Hubungi tim kami via WhatsApp sekarang juga untuk berdiskusi menjalin kerjasama yang seru ini!',
      en: 'Have a cafe, restaurant, coworking space, or hotel with an artistic empty area? Contact our team via WhatsApp right now to discuss this exciting collaboration!'
    },
    collabVenueBtn: { id: 'Daftarkan Venue Anda', en: 'Register Your Venue' },

    // Blog Pages
    blogHeaderTitleText: { id: 'Artikel & ', en: 'Articles & ' },
    blogHeaderTitleSpan: { id: 'Catatan Seni.', en: 'Art Notes.' },
    blogHeaderDesc: {
      id: 'Wawasan seputar teknik melukis, sejarah seni rupa, dan proses kreatif dari para seniman Indonesia.',
      en: 'Insights around painting techniques, visual art history, and the creative process of Indonesian artists.'
    },
    blogFeaturedTag: { id: 'Artikel Utama', en: 'Featured Article' },
    blogLatestTitle: { id: 'Artikel Terbaru', en: 'Latest Articles' },
    blogReadFullBtn: { id: 'Baca Artikel Lengkap', en: 'Read Full Article' },
    blogEmpty: {
      id: 'Belum ada artikel blog yang diterbitkan. Hubungi admin untuk menulis artikel baru.',
      en: 'No blog articles published yet. Contact admin to write a new article.'
    },
    blogBackBtn: { id: 'Kembali ke Blog', en: 'Back to Blog' },
    blogReadMeta: { id: 'Ditulis oleh', en: 'Written by' },
    blogReadTime: { id: 'Menit Baca', en: 'Min Read' },
    blogAboutTitle: { id: 'Tentang Berseni', en: 'About Berseni' },
    blogAboutDesc: {
      id: 'Berseni adalah platform kolaboratif dan komunitas seni rupa terbesar di Indonesia, menjembatani seniman lokal dan masyarakat umum untuk saling belajar, berkarya, dan mengapresiasi keindahan seni bersama-sama.',
      en: 'Berseni is a collaborative platform and the largest visual art community in Indonesia, bridging local artists and the general public to learn, create, and appreciate the beauty of art together.'
    },
    // Extra Landing Page keys
    heroBtnGallery: { id: 'Lihat Galeri & Kelas', en: 'View Gallery & Classes' },
    heroBtnAbout: { id: 'Tentang Kami', en: 'About Us' },
    activitiesHeaderTitle: { id: 'Aktivitas Berseni', en: 'Berseni Activities' },
    activitiesHeaderSubtitle: { id: 'Intip berbagai keseruan program seni rupa dan kegiatan kreatif komunitas Berseni', en: 'A sneak peek into the excitement of Berseni\'s visual art programs and creative community events' },
    scrollingText: { id: 'SCROLL', en: 'SCROLL' },
    detailLabel: { id: 'Detail', en: 'Details' },
    waFloatTooltip: { id: 'Tanya Kami!', en: 'Ask Us!' },
    waFloatAria: { id: 'Hubungi WhatsApp Kami', en: 'Contact Our WhatsApp' },
    waFloatMessage: {
      id: 'Halo Berseni! Saya ingin tahu lebih lanjut mengenai karya seni, kelas, atau pilar Berseni.',
      en: 'Hello Berseni! I would like to know more about the artworks, classes, or pillars of Berseni.'
    },
    
    // Product & Activity CTA Modals
    buyArtworkBtn: { id: 'Beli Karya Sekarang', en: 'Buy Artwork Now' },
    registerClassBtn: { id: 'Daftar Kelas Sekarang', en: 'Register Class Now' },
    registerTicketBtn: { id: 'Pesan Tiket Sekarang', en: 'Book Tickets Now' },
    buyNowBtnDefault: { id: 'Beli Sekarang', en: 'Buy Now' },
    activityRegisterBtn: { id: 'Daftar Workshop Sekarang', en: 'Register Workshop Now' },
    activityExhibitBtn: { id: 'Registrasi Kunjungan', en: 'Visit Registration' },
    activitySocialBtn: { id: 'Gabung Kegiatan Sekarang', en: 'Join Activity Now' },
    activityDefaultBtn: { id: 'Ikuti Keseruan Sekarang', en: 'Join the Fun Now' },
    
    // Store Page keys
    resultsCount: { id: 'Menampilkan {count} produk / kelas seni', en: 'Showing {count} products / art classes' },
    resetFilters: { id: 'Reset Filter', en: 'Reset Filters' },
    emptyStoreTitle: { id: 'Tidak ada produk yang cocok', en: 'No matching products' },
    emptyStoreDesc: { id: 'Coba gunakan kata kunci pencarian lain atau pilih kategori yang berbeda.', en: 'Try using other search keywords or choose a different category.' },
    showAllProducts: { id: 'Tampilkan Semua Produk', en: 'Show All Products' },
    loadingStore: { id: 'Memuat Art Market...', en: 'Loading Art Market...' },
    publishedOn: { id: 'Diterbitkan pada', en: 'Published on' },
    writtenBy: { id: 'Ditulis oleh', en: 'Written by' },
    minRead: { id: 'Menit Baca', en: 'Min Read' }
  };

  const getTranslation = (key) => {
    // 1. Cek override spesifik bahasa dari DB (misal: key_id atau key_en)
    const localizedKey = `${key}_${language}`;
    if (dbContent[localizedKey] !== undefined) {
      return dbContent[localizedKey];
    }
    // 2. Cek override global dari DB (misal: key)
    if (dbContent[key] !== undefined) {
      return dbContent[key];
    }
    // 3. Fallback ke dictionary statis
    if (dict[key] && dict[key][language] !== undefined) {
      return dict[key][language];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, setLang, t, getTranslation, dbContent, refreshContent: fetchDbContent }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
