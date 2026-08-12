'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/components/LanguageContext';
import styles from '@/styles/Components.module.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileActive, setMobileActive] = useState(false);
  const pathname = usePathname();
  const { language, toggleLanguage, getTranslation, dbContent } = useLanguage();

  // Efek scroll navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileActive(!mobileActive);
  };

  const closeMobileMenu = () => {
    setMobileActive(false);
  };

  const navLinks = [
    { name: getTranslation('navHome'), path: '/' },
    { name: getTranslation('navStore'), path: '/store' },
    { name: getTranslation('navClasses'), path: '/classes' },
    { name: getTranslation('navAbout'), path: '/about' },
    { name: getTranslation('navCollab'), path: '/collaboration' },
    { name: getTranslation('navBlog'), path: '/blog' },
    { name: getTranslation('navGallery'), path: '/gallery' },
  ];

  const langSwitchLabel = `Switch language, currently ${language === 'id' ? 'Indonesian' : 'English'}`;

  const menuToggleLabel = mobileActive
    ? (language === 'id' ? 'Tutup menu navigasi' : 'Close navigation menu')
    : (language === 'id' ? 'Buka menu navigasi' : 'Open navigation menu');

  const navLayout = dbContent?.navLayout || 'floating';
  const navOpacity = dbContent?.navOpacity || '0.65';
  const bgNavbar = dbContent?.bg_navbar || '#FAF5EB';
  
  const baseOpacity = isNaN(parseFloat(navOpacity)) ? 0.65 : parseFloat(navOpacity);
  const currentOpacity = scrolled ? Math.min(1.0, baseOpacity + 0.23) : baseOpacity;
  
  // Helper to convert hex to rgba to preserve scrolled glassmorphic transparency
  const convertToRgba = (colorStr, opacity) => {
    if (!colorStr) return `rgba(250, 245, 235, ${opacity})`;
    let cleaned = colorStr.trim();
    if (cleaned.startsWith('var(') || cleaned.startsWith('rgb(') || cleaned.startsWith('rgba(')) {
      return cleaned;
    }
    if (cleaned.startsWith('#')) {
      let hex = cleaned.substring(1);
      if (hex.length === 3 || hex.length === 4) {
        hex = hex.split('').map(char => char + char).join('');
      }
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      if (isNaN(r) || isNaN(g) || isNaN(b)) {
        return `rgba(250, 245, 235, ${opacity})`;
      }
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    return cleaned;
  };

  const inlineStyle = {
    backgroundColor: convertToRgba(bgNavbar, currentOpacity)
  };
  
  if (navLayout === 'full') {
    inlineStyle.top = '0px';
    inlineStyle.left = '0px';
    inlineStyle.width = '100%';
    inlineStyle.maxWidth = '100%';
    inlineStyle.borderRadius = '0px';
    inlineStyle.transform = 'none';
    inlineStyle.borderLeft = 'none';
    inlineStyle.borderRight = 'none';
    inlineStyle.borderTop = 'none';
  }

  return (
    <nav 
      className={`${styles.navbar} ${scrolled ? styles.scrolled : ''} ${mobileActive ? styles.navbarExpanded : ''}`}
      style={inlineStyle}
    >
      <div className={styles.navInner}>
        {/* Brand Logo */}
        <Link
          href="/"
          className={styles.logo}
          aria-label={language === 'id' ? 'Berseni, kembali ke beranda' : 'Berseni, go to homepage'}
          onClick={(e) => {
            closeMobileMenu();
            if (pathname === '/') {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
        >
          <Image src="/logo.png" alt="Berseni Logo" className={styles.logoImage} width={160} height={48} priority />
          <div className={styles.logoTextContainer}>
            <span className={styles.logoTagline}>{getTranslation('footerTagline')}</span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className={styles.navLinks}>
          {navLinks.map((link) => {
            const isActive = pathname === link.path;

            return (
              <Link
                key={link.name}
                href={link.path}
                className={`${styles.navLink} ${isActive ? styles.activeLink : ''}`}
                onClick={(e) => {
                  if (link.path === '/' && pathname === '/') {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
              >
                {link.name}
              </Link>
            );
          })}
          
          {/* Language Switcher Desktop */}
          <button onClick={toggleLanguage} className={styles.langSwitchBtn} aria-label={langSwitchLabel}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-tosca)' }}>
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <span style={{ opacity: language === 'id' ? 1 : 0.3, transition: 'opacity 0.2s', display: 'inline-flex', alignItems: 'center', marginLeft: '2px' }}>
              <svg width="18" height="12" viewBox="0 0 3 2" style={{ borderRadius: '2px', border: '1px solid rgba(0,0,0,0.1)' }}>
                <rect width="3" height="1" fill="#e22a2b"/>
                <rect width="3" height="1" y="1" fill="#ffffff"/>
              </svg>
            </span>
            <span style={{ color: 'rgba(20, 120, 155, 0.25)', fontSize: '0.85rem' }}>|</span>
            <span style={{ opacity: language === 'en' ? 1 : 0.3, transition: 'opacity 0.2s', display: 'inline-flex', alignItems: 'center' }}>
              <svg width="18" height="12" viewBox="0 0 60 30" style={{ borderRadius: '2px', border: '1px solid rgba(0,0,0,0.1)' }}>
                <rect width="60" height="30" fill="#012169"/>
                <path d="M0 0 L60 30 M60 0 L0 30" stroke="#fff" strokeWidth="6"/>
                <path d="M0 0 L60 30 M60 0 L0 30" stroke="#C8102E" strokeWidth="4"/>
                <path d="M30 0 V30 M0 15 H60" stroke="#fff" strokeWidth="10"/>
                <path d="M30 0 V30 M0 15 H60" stroke="#C8102E" strokeWidth="6"/>
              </svg>
            </span>
          </button>
        </div>

        {/* Hamburger Menu Toggle (Mobile) */}
        <button
          type="button"
          className={`${styles.menuToggle} ${mobileActive ? styles.menuActive : ''}`}
          onClick={toggleMobileMenu}
          aria-expanded={mobileActive}
          aria-controls="mobile-menu"
          aria-label={menuToggleLabel}
          // Neutralize native button chrome; .menuToggle owns display/gap/cursor
          style={{ background: 'none', border: 'none', padding: 0, appearance: 'none' }}
        >
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
        </button>
      </div>

      {/* Mobile Dropdown Expanded Menu Links */}
      <div
        id="mobile-menu"
        className={`${styles.mobileMenuContent} ${mobileActive ? styles.mobileMenuVisible : ''}`}
      >
        {navLinks.map((link) => {
          return (
            <Link
              key={link.name}
              href={link.path}
              className={styles.mobileNavLink}
              onClick={(e) => {
                closeMobileMenu();
                if (link.path === '/' && pathname === '/') {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
            >
              {link.name}
            </Link>
          );
        })}

        {/* Language Switcher Mobile */}
        <button onClick={toggleLanguage} className={styles.mobileLangSwitchBtn} aria-label={langSwitchLabel}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-tosca)' }}>
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
          <span style={{ opacity: language === 'id' ? 1 : 0.3, transition: 'opacity 0.2s', display: 'inline-flex', alignItems: 'center', marginLeft: '4px' }}>
            <svg width="22" height="14" viewBox="0 0 3 2" style={{ borderRadius: '2px', border: '1px solid rgba(0,0,0,0.1)' }}>
              <rect width="3" height="1" fill="#e22a2b"/>
              <rect width="3" height="1" y="1" fill="#ffffff"/>
            </svg>
          </span>
          <span style={{ color: 'rgba(20, 120, 155, 0.3)', fontSize: '1rem' }}>|</span>
          <span style={{ opacity: language === 'en' ? 1 : 0.3, transition: 'opacity 0.2s', display: 'inline-flex', alignItems: 'center' }}>
            <svg width="22" height="14" viewBox="0 0 60 30" style={{ borderRadius: '2px', border: '1px solid rgba(0,0,0,0.1)' }}>
              <rect width="60" height="30" fill="#012169"/>
              <path d="M0 0 L60 30 M60 0 L0 30" stroke="#fff" strokeWidth="6"/>
              <path d="M0 0 L60 30 M60 0 L0 30" stroke="#C8102E" strokeWidth="4"/>
              <path d="M30 0 V30 M0 15 H60" stroke="#fff" strokeWidth="10"/>
              <path d="M30 0 V30 M0 15 H60" stroke="#C8102E" strokeWidth="6"/>
            </svg>
          </span>
        </button>
      </div>
    </nav>
  );
}
