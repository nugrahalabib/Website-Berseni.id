'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/components/LanguageContext';
import styles from '@/styles/Collaboration.module.css';

export default function CollaborationPageClient({ content }) {
  const { language, getTranslation, dbContent } = useLanguage();
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
          {extraProps.children}
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
          {extraProps.children}
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
        {extraProps.children}
      </Link>
    );
  };

  if (!mounted) return null;

  const getBrandWALink = () => {
    const textId = "Halo Berseni! Brand/Perusahaan kami tertarik untuk berkolaborasi kreatif dengan Berseni.";
    const textEn = "Hello Berseni! Our brand/company is interested in collaborating creatively with Berseni.";
    const text = language === 'id' ? encodeURIComponent(textId) : encodeURIComponent(textEn);
    return `https://wa.me/6281234567890?text=${text}`;
  };

  const getVenueWALink = () => {
    const textId = "Halo Berseni! Saya memiliki venue/tempat yang tertarik untuk berkolaborasi dengan komunitas Berseni.";
    const textEn = "Hello Berseni! I have a venue/space and I am interested in collaborating with the Berseni community.";
    const text = language === 'id' ? encodeURIComponent(textId) : encodeURIComponent(textEn);
    return `https://wa.me/6281234567890?text=${text}`;
  };

  return (
    <div className={styles.pageContainer}>
      <Navbar />

      <main className={styles.mainContent}>
        
        {/* 1. HERO SECTION */}
        <section className={styles.heroSection} style={{ backgroundColor: dbContent?.bg_collab_hero || content?.bg_collab_hero || '', backgroundImage: (dbContent?.bg_collab_hero || content?.bg_collab_hero) ? 'none' : '' }}>
          <div className={styles.heroGlowContainer}>
            <div className={`${styles.glowBlob} ${styles.glowTosca}`}></div>
            <div className={`${styles.glowBlob} ${styles.glowKunyit}`}></div>
            <div className={`${styles.glowBlob} ${styles.glowMaroon}`}></div>
          </div>
          
          <div className={styles.heroInner}>
            <span className={styles.heroSubtitle}>{getTranslation('collabHeroSubtitle')}</span>
            <h1 className={styles.heroTitle}>{getTranslation('collabHeroTitle')}<span>.</span></h1>
            <p className={styles.heroDesc}>
              {getTranslation('collabHeroDesc')}
            </p>
          </div>
        </section>

        {/* 2. BRAND COLLABORATION SECTION */}
        <section className={styles.collabSection} style={{ backgroundColor: dbContent?.bg_collab_brand || content?.bg_collab_brand || '' }}>
          <div className={styles.sectionInner}>
            <div className={styles.brandCollabGrid}>
              
              {/* Left Column: Brand Content */}
              <div className={styles.brandContent}>
                <div className={styles.brandHeader}>
                  <span className={styles.sectionBadge}>{getTranslation('collabBrandBadge')}</span>
                  <h2>{getTranslation('collabBrandTitle')}</h2>
                  <div className={styles.underline}></div>
                </div>
                
                <p className={styles.sectionIntro}>
                  {getTranslation('collabBrandIntro')}
                </p>
                
                <div className={styles.featuresList}>
                  {/* Feature 1 */}
                  <div className={styles.featureItem}>
                    <div className={`${styles.iconBox} ${styles.maroonIcon}`}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div className={styles.featureText}>
                      <h4>{getTranslation('collabBrandFeat1Title')}</h4>
                      <p>{getTranslation('collabBrandFeat1Desc')}</p>
                    </div>
                  </div>

                  {/* Feature 2 */}
                  <div className={styles.featureItem}>
                    <div className={`${styles.iconBox} ${styles.toscaIcon}`}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div className={styles.featureText}>
                      <h4>{getTranslation('collabBrandFeat2Title')}</h4>
                      <p>{getTranslation('collabBrandFeat2Desc')}</p>
                    </div>
                  </div>

                  {/* Feature 3 */}
                  <div className={styles.featureItem}>
                    <div className={`${styles.iconBox} ${styles.kunyitIcon}`}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div className={styles.featureText}>
                      <h4>{getTranslation('collabBrandFeat3Title')}</h4>
                      <p>{getTranslation('collabBrandFeat3Desc')}</p>
                    </div>
                  </div>

                  {/* Feature 4 */}
                  <div className={styles.featureItem}>
                    <div className={`${styles.iconBox} ${styles.maroonIcon}`}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                      </svg>
                    </div>
                    <div className={styles.featureText}>
                      <h4>{getTranslation('collabBrandFeat4Title')}</h4>
                      <p>{getTranslation('collabBrandFeat4Desc')}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right Column: Visual Poster Mockup */}
              <div className={styles.brandVisual}>
                <div className={styles.mockupContainer}>
                  {/* Decorative Elements */}
                  <div className={styles.mockupPattern}></div>
                  
                  {/* Main Canvas Representation */}
                  <div className={styles.canvasFrame}>
                    <div className={styles.canvasInner} style={{ backgroundImage: `url('${content?.collabCanvasImg || '/collage-1.jpg'}')` }}>
                      <div className={styles.canvasTitle}>Berseni Studio</div>
                    </div>
                  </div>
                  
                  {/* Floating Mockup items representing merchandise and materials */}
                  <div className={styles.floatingItems}>
                    {/* Tote bag representing "Create Connect Inspire" */}
                    <div className={`${styles.floatCard} ${styles.toteCard}`}>
                      <div className={styles.bagHandle}></div>
                      <span className={styles.toteTitle}>Create</span>
                      <span className={styles.toteTitle}>Connect</span>
                      <span className={styles.toteTitle}>Inspire</span>
                      <span className={styles.toteHeart}>🧡</span>
                    </div>
                    
                    {/* Coffee mug */}
                    <div className={`${styles.floatCard} ${styles.mugCard}`}>
                      <div className={styles.mugHandle}></div>
                      <span className={styles.mugBrand}>Berseni</span>
                    </div>
 
                    {/* Thank you card */}
                    <div className={`${styles.floatCard} ${styles.thanksCard}`}>
                      <p>Thank you for collaborating with us! 🧡</p>
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
            
            {/* Impact Callout Box */}
            <div className={styles.brandCalloutBox}>
              <p>{getTranslation('collabBrandCallout')}</p>
              {renderDynamicButton(
                getTranslation('collabBrandBtn'),
                getBrandWALink(),
                'collabBrandBtnLink',
                'collabBrandBtnStatus',
                'btn btn-primary',
                {
                  style: { backgroundColor: 'var(--color-maroon)', color: 'var(--color-white)', marginTop: '1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' },
                  children: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  )
                }
              )}
            </div>
            
          </div>
        </section>

        {/* 3. VENUE COLLABORATION SECTION */}
        <section className={`${styles.collabSection} ${styles.venueSectionBg}`} style={{ backgroundColor: dbContent?.bg_collab_venue || content?.bg_collab_venue || '' }}>
          <div className={styles.sectionInner}>
            <div className={styles.venueHeader}>
              <span className={styles.sectionBadge} style={{ backgroundColor: 'rgba(20, 120, 155, 0.1)', color: 'var(--color-tosca)' }}>{getTranslation('collabVenueBadge')}</span>
              <h2>{getTranslation('collabVenueTitle')}</h2>
              <div className={`${styles.underline} ${styles.toscaUnderline}`}></div>
              <p className={styles.venueSubtitle} dangerouslySetInnerHTML={{ __html: getTranslation('collabVenueSub') }}></p>
            </div>
            
            {/* Benefits Grid */}
            <div className={styles.venueBenefitsGrid}>
              
              {/* Benefit 1 */}
              <div className={styles.benefitCard}>
                <div className={`${styles.benefitIconBox} ${styles.toscaBg}`}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3>{getTranslation('collabVenueFeat1Title')}</h3>
                <p>{getTranslation('collabVenueFeat1Desc')}</p>
              </div>

              {/* Benefit 2 */}
              <div className={styles.benefitCard}>
                <div className={`${styles.benefitIconBox} ${styles.maroonBg}`}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                  </svg>
                </div>
                <h3>{getTranslation('collabVenueFeat2Title')}</h3>
                <p>{getTranslation('collabVenueFeat2Desc')}</p>
              </div>

              {/* Benefit 3 */}
              <div className={styles.benefitCard}>
                <div className={`${styles.benefitIconBox} ${styles.kunyitBg}`}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3>{getTranslation('collabVenueFeat3Title')}</h3>
                <p>{getTranslation('collabVenueFeat3Desc')}</p>
              </div>
              
            </div>
            
            {/* Let's Grow Together CTA Banner */}
            <div className={styles.venueCtaBanner}>
              <h3>{getTranslation('collabVenueCtaTitle')}</h3>
              <p>{getTranslation('collabVenueCtaDesc')}</p>
              {renderDynamicButton(
                getTranslation('collabVenueBtn'),
                getVenueWALink(),
                'collabVenueBtnLink',
                'collabVenueBtnStatus',
                'btn btn-secondary',
                {
                  style: { backgroundColor: 'var(--color-tosca)', color: 'var(--color-white)', padding: '0.8rem 2.2rem', fontSize: '1rem', marginTop: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' },
                  children: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  )
                }
              )}
            </div>
            
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
