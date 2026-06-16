'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageContext';
import styles from '@/styles/About.module.css';

export default function AboutPageClient({ content }) {
  const { language, t, getTranslation, dbContent } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const renderDynamicButton = (text, defaultLink, linkKey, statusKey, className, extraProps = {}) => {
    const link = dbContent?.[linkKey] !== undefined ? dbContent[linkKey] : defaultLink;
    const status = dbContent?.[statusKey] || 'active';

    if (status === 'hidden') return null;

    const isDisabled = status === 'disabled';
    const finalStyle = isDisabled 
      ? { ...(extraProps.style || {}), opacity: 0.5, cursor: 'not-allowed', pointerEvents: 'none' }
      : (extraProps.style || {});

    const onClickHandler = (e) => {
      if (isDisabled) {
        e.preventDefault();
        return;
      }
      if (extraProps.onClick) {
        extraProps.onClick(e);
      }
    };

    if (isDisabled) {
      return (
        <span className={className} style={finalStyle}>
          {text}
        </span>
      );
    }

    const isExternal = link.startsWith('http') || link.startsWith('mailto') || link.startsWith('tel') || link.startsWith('https://wa.me');

    if (isExternal) {
      return (
        <a 
          href={link} 
          target="_blank" 
          rel="noopener noreferrer" 
          className={className} 
          style={finalStyle}
          onClick={onClickHandler}
        >
          {text}
        </a>
      );
    }

    return (
      <Link 
        href={link} 
        className={className} 
        style={finalStyle}
        onClick={onClickHandler}
      >
        {text}
      </Link>
    );
  };

  // Content fallbacks
  const data = content || {
    aboutTitle_id: "When passion meets arts",
    aboutTitle_en: "When passion meets arts",
    aboutSubtitle_id: "Gerbang Utama Anda Menuju Dunia Seniman",
    aboutSubtitle_en: "Your Gateway to the World of Artists",
    aboutDescription_id: "Berseni lahir dari kesadaran sederhana bahwa banyak orang ingin lebih dekat dengan dunia seni rupa, tetapi bingung harus mulai dari mana. Akses ke seniman profesional seringkali terasa eksklusif dan berjarak.\n\nKami memutuskan untuk membuka jalan itu. Di Berseni, Anda tidak hanya belajar teknik melukis dasar, tetapi juga berinteraksi langsung dengan seniman praktisi. Memahami proses kreatif, cerita, serta perjalanan karya mereka.\n\nKami percaya seni tidak hanya milik segelintir orang. Seni adalah ruang inklusif untuk semua orang belajar, tumbuh, dan terhubung satu sama lain.",
    aboutDescription_en: "Berseni was born from a simple realization that many people want to get closer to the visual art world, but are confused about where to start. Access to professional artists often feels exclusive and distant.\n\nWe decided to open that path. At Berseni, you do not only learn basic painting techniques, but also interact directly with practicing artists. Understand their creative processes, stories, and the journey of their works.\n\nWe believe art does not only belong to a select few. Art is an inclusive space for everyone to learn, grow, and connect with one another.",
    visiTitle_id: "Visi Kami",
    visiTitle_en: "Our Vision",
    visiDescription_id: "Menjadi jembatan global utama antara masyarakat umum dan seniman lokal Indonesia, menumbuhkan ekosistem ekonomi seni yang berkelanjutan dan apresiasi seni yang bermakna.",
    visiDescription_en: "To become the primary global bridge between the general public and local Indonesian artists, nurturing a sustainable art economy ecosystem and meaningful art appreciation.",
    misiTitle_id: "Misi Kami",
    misiTitle_en: "Our Mission",
    misiList_id: [
      "Membuka akses langsung bagi publik untuk berinteraksi dan belajar dari seniman profesional.",
      "Mendukung pemberdayaan ekonomi seniman lokal melalui eksposur, kolaborasi, dan apresiasi karya.",
      "Membina komunitas pecinta seni yang inklusif, suportif, dan berkelanjutan di seluruh Indonesia."
    ],
    misiList_en: [
      "Opening direct access for the public to interact and learn from professional artists.",
      "Supporting the economic empowerment of local artists through exposure, collaboration, and work appreciation.",
      "Nurturing an inclusive, supportive, and sustainable community of art lovers across Indonesia."
    ],
    statsUsers: "20k+",
    statsDescription_id: "Pengguna Berseni",
    statsDescription_en: "Berseni Users"
  };

  const aboutDescriptionVal = t(data, 'aboutDescription');
  const paragraphs = aboutDescriptionVal ? aboutDescriptionVal.split('\n\n') : [];

  const getMisiList = () => {
    const listKey = `misiList_${language}`;
    if (data[listKey] !== undefined) {
      return data[listKey];
    }
    return data.misiList || [];
  };

  if (!mounted) return null;

  return (
    <div className={styles.pageContainer}>
      <Navbar />

      <main className={styles.aboutMain}>
        
        {/* 1. HERO HEADER SECTION (Lighter background with elegant curves) */}
        <section className={styles.heroSection}>
          <div className={styles.heroBgDecor}>
            {/* Sparkles / star accents */}
            <div className={`${styles.sparkle} ${styles.sp1}`}>✦</div>
            <div className={`${styles.sparkle} ${styles.sp2}`}>✦</div>
            <div className={`${styles.bubbleDecor} ${styles.bb1}`}></div>
            <div className={`${styles.bubbleDecor} ${styles.bb2}`}></div>
          </div>
          
          <div className={styles.container}>
            <div className={styles.heroContent}>
              <span className={styles.heroLabel}>{getTranslation('aboutHeroLabel')}</span>
              <h1 className={styles.heroTitle}>
                {getTranslation('aboutHeroTitle')}<span>{getTranslation('aboutHeroTitleSpan')}</span>
              </h1>
              <p className={styles.heroDesc}>
                {getTranslation('aboutHeroDesc')}
              </p>
            </div>

            {/* 4 Photo Grid Collage */}
            <div className={styles.collageGrid}>
              <div className={styles.collageCard}>
                <img src={data.aboutCollage1 || "/activity-outdoor.webp"} alt="Melukis di Luar Ruangan" />
                <div className={styles.collageOverlay}>
                  <span>Outdoor Painting</span>
                </div>
              </div>
              <div className={styles.collageCard}>
                <img src={data.aboutCollage2 || "/activity-batik.webp"} alt="Workshop Membatik Tulis" />
                <div className={styles.collageOverlay}>
                  <span>Batik Workshop</span>
                </div>
              </div>
              <div className={styles.collageCard}>
                <img src={data.aboutCollage3 || "/activity-talk.webp"} alt="Talkshow Apresiasi Seni" />
                <div className={styles.collageOverlay}>
                  <span>Art Appreciation</span>
                </div>
              </div>
              <div className={styles.collageCard}>
                <img src={data.aboutCollage4 || "/activity-children.webp"} alt="Kelas Seni Anak Inklusi" />
                <div className={styles.collageOverlay}>
                  <span>Inclusion Art Class</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. QUALITY & EDUCATION SECTION (Checklist Section) */}
        <section className={styles.featureSection}>
          <div className={styles.container}>
            <div className={styles.featureGrid}>
              
              {/* Left Column: Heading & Text */}
              <div className={styles.featureTextCol}>
                <span className={styles.sectionTag}>{getTranslation('aboutCommitmentLabel')}</span>
                <h2 className={styles.sectionTitle}>
                  {getTranslation('aboutCommitmentTitle')}
                </h2>
                <p className={styles.sectionDesc}>
                  {getTranslation('aboutCommitmentDesc')}
                </p>
                <div className={styles.featureButtons}>
                  {renderDynamicButton(getTranslation('aboutCommitBtn'), '/#products', 'aboutCommitBtnLink', 'aboutCommitBtnStatus', 'btn btn-secondary')}
                </div>
              </div>

              {/* Right Column: Key Checklist Points */}
              <div className={styles.checklistCol}>
                <div className={styles.checkCard}>
                  <div className={styles.checkIcon}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className={styles.checkInfo}>
                    <h3>{getTranslation('aboutCommit1Title')}</h3>
                    <p>{getTranslation('aboutCommit1Desc')}</p>
                  </div>
                </div>

                <div className={styles.checkCard}>
                  <div className={styles.checkIcon}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className={styles.checkInfo}>
                    <h3>{getTranslation('aboutCommit2Title')}</h3>
                    <p>{getTranslation('aboutCommit2Desc')}</p>
                  </div>
                </div>

                <div className={styles.checkCard}>
                  <div className={styles.checkIcon}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className={styles.checkInfo}>
                    <h3>{getTranslation('aboutCommit3Title')}</h3>
                    <p>{getTranslation('aboutCommit3Desc')}</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 3. EMPOWERMENT & VISION-MISSION (Founder Quote & Story Grid) */}
        <section className={styles.empowerSection}>
          <div className={styles.container}>
            <div className={styles.empowerGrid}>
              
              {/* Left Column: Studio Portrait + Floating Quote */}
              <div className={styles.empowerVisualCol}>
                <div className={styles.visualFrame}>
                  {/* Decorative corners */}
                  <span className={`${styles.frameCorner} ${styles.topL}`}></span>
                  <span className={`${styles.frameCorner} ${styles.topR}`}></span>
                  <span className={`${styles.frameCorner} ${styles.botL}`}></span>
                  <span className={`${styles.frameCorner} ${styles.botR}`}></span>

                  <img 
                    src={data.aboutStudioImg || "/about-studio.webp"} 
                    alt="Berseni Art Studio Ubud" 
                    className={styles.visualImage}
                  />
                  
                  {/* Play/Interact Badge overlay */}
                  <div className={styles.playBadge}>
                    <div className={styles.playPulse}></div>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>

                {/* Floating Testimonial/Quote Card */}
                <div className={styles.floatingQuoteCard}>
                  <p className={styles.quoteText}>
                    {getTranslation('aboutQuote')}
                  </p>
                  <div className={styles.quoteAuthor}>
                    <span className={styles.authorName}>{getTranslation('aboutQuoteAuthor')}</span>
                    <span className={styles.authorRole}>{getTranslation('aboutQuoteLocation')}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Story & Visi Misi */}
              <div className={styles.empowerTextCol}>
                <span className={styles.sectionTag}>{t(data, 'aboutTitle')}</span>
                <h2 className={styles.sectionTitle}>
                  {t(data, 'aboutSubtitle')}
                </h2>
                
                <div className={styles.storyParagraphs}>
                  {paragraphs.map((p, idx) => (
                    <p key={idx} className={styles.storyPara}>
                      {idx === 0 ? <span className={styles.dropCapText}>{p.charAt(0)}</span> : null}
                      {idx === 0 ? p.slice(1) : p}
                    </p>
                  ))}
                </div>

                {/* Vision & Mission Box */}
                <div className={styles.visionCard}>
                  <div className={styles.visionTitleRow}>
                    <span className={styles.visionIcon}>👁️</span>
                    <h3>{t(data, 'visiTitle')}</h3>
                  </div>
                  <p>{t(data, 'visiDescription')}</p>
                  
                  <div className={styles.visionTitleRow} style={{ marginTop: '2rem' }}>
                    <span className={styles.visionIcon}>🎯</span>
                    <h3>{t(data, 'misiTitle')}</h3>
                  </div>
                  <ul style={{ listStyleType: 'disc', paddingLeft: '1.25rem', color: 'var(--color-text-muted)', fontSize: '0.95rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                    {getMisiList().map((misi, index) => (
                      <li key={index}>{misi}</li>
                    ))}
                  </ul>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 4. THREE PILLARS VALUES SECTION (3-Card Bottom Section) */}
        <section className={styles.pillarsSection}>
          <div className={styles.container}>
            <div className={styles.pillarsHeader}>
              <h2 className={styles.pillarsTitle}>{getTranslation('aboutPillarsTitle')}<span>{getTranslation('aboutPillarsTitleSpan')}</span></h2>
              <p className={styles.pillarsSubtitle}>{getTranslation('aboutPillarsSubtitle')}</p>
            </div>

            <div className={styles.pillarsGrid}>
              {/* Card 1 */}
              <div className={`${styles.pillarCard} glass`}>
                <div className={`${styles.pillarCardIcon} ${styles.iconTosca}`}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </div>
                <h3>{getTranslation('aboutPillar1Title')}</h3>
                <p>{getTranslation('aboutPillar1Desc')}</p>
              </div>

              {/* Card 2 */}
              <div className={`${styles.pillarCard} glass`}>
                <div className={`${styles.pillarCardIcon} ${styles.iconMaroon}`}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3>{getTranslation('aboutPillar2Title')}</h3>
                <p>{getTranslation('aboutPillar2Desc')}</p>
              </div>

              {/* Card 3 */}
              <div className={`${styles.pillarCard} glass`}>
                <div className={`${styles.pillarCardIcon} ${styles.iconKunyit}`}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3>{getTranslation('aboutPillar3Title')}</h3>
                <p>{getTranslation('aboutPillar3Desc')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. ACHIEVEMENTS & STATS (Stats Bar) */}
        <section className={styles.statsSection}>
          <div className={styles.container}>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <span className={styles.statNumber}>{data.statsUsers}</span>
                <span className={styles.statLabel}>{t(data, 'statsDescription')}</span>
              </div>
              
              <div className={styles.statCard}>
                <span className={styles.statNumber}>100%</span>
                <span className={styles.statLabel}>{getTranslation('aboutStats2Label')}</span>
              </div>
              
              <div className={styles.statCard}>
                <span className={styles.statNumber}>15+</span>
                <span className={styles.statLabel}>{getTranslation('aboutStats3Label')}</span>
              </div>

              <div className={styles.statCard}>
                <span className={styles.statNumber}>50+</span>
                <span className={styles.statLabel}>{getTranslation('aboutStats4Label')}</span>
              </div>
            </div>
          </div>
        </section>

        {/* 6. CALL TO ACTION SECTION (CTA Section) */}
        <section className={styles.ctaSection}>
          <div className={styles.ctaCard}>
            <h2 className={styles.ctaTitle}>{getTranslation('aboutCtaTitle')}</h2>
            <p className={styles.ctaDesc}>
              {getTranslation('aboutCtaDesc')}
            </p>
            <div className={styles.ctaButtons}>
              {renderDynamicButton(
                getTranslation('aboutCtaBtn1'),
                '/#products',
                'aboutCtaBtn1Link',
                'aboutCtaBtn1Status',
                'btn btn-primary',
                { style: { backgroundColor: 'var(--color-kunyit)', color: 'var(--color-black)' } }
              )}
              {renderDynamicButton(
                getTranslation('aboutCtaBtn2'),
                '/#programs',
                'aboutCtaBtn2Link',
                'aboutCtaBtn2Status',
                'btn btn-outline',
                { style: { borderColor: 'var(--color-white)', color: 'var(--color-white)' } }
              )}
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
