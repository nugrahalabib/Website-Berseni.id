'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import styles from '@/styles/Components.module.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileActive, setMobileActive] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Efek scroll navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cek apakah user adalah admin
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await fetch('/api/auth');
        const data = await res.json();
        if (data.authenticated) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (err) {
        setIsAdmin(false);
      }
    };
    checkAdmin();
  }, [pathname]); // Cek ulang setiap pindah halaman

  const toggleMobileMenu = () => {
    setMobileActive(!mobileActive);
  };

  const closeMobileMenu = () => {
    setMobileActive(false);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '#about' },
    { name: 'Programs', path: '#programs' },
    { name: 'Works & Classes', path: '#products' },
    { name: 'Blog', path: '/blog' },
  ];

  return (
    <>
      <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
        <div className={styles.navInner}>
          {/* Brand Logo */}
          <div className={styles.logo} onClick={() => { closeMobileMenu(); router.push('/'); }}>
            <div className={styles.logoFrame}>
              {/* Batik frame representation */}
            </div>
            <div className={styles.logoTextContainer}>
              <span className={styles.logoText}>Berseni</span>
              <span className={styles.logoTagline}>A World of Art for Everyone</span>
            </div>
          </div>




          {/* Desktop Links */}
          <div className={styles.navLinks}>
            {navLinks.map((link) => {
              const isAnchor = link.path.startsWith('#');
              const isActive = pathname === '/' && isAnchor ? false : pathname === link.path;
              
              if (isAnchor) {
                return (
                  <a
                    key={link.name}
                    href={pathname === '/' ? link.path : `/${link.path}`}
                    className={styles.navLink}
                  >
                    {link.name}
                  </a>
                );
              }
              
              return (
                <Link
                  key={link.name}
                  href={link.path}
                  className={`${styles.navLink} ${isActive ? styles.activeLink : ''}`}
                >
                  {link.name}
                </Link>
              );
            })}

            {/* Admin/Dashboard Button */}
            {isAdmin ? (
              <Link href="/admin" className={styles.adminBtn}>
                Dashboard
              </Link>
            ) : (
              <Link href="/admin/login" className={styles.navLink} style={{ fontSize: '0.8rem', opacity: 0.6 }}>
                Admin
              </Link>
            )}
          </div>

          {/* Hamburger Menu Toggle (Mobile) */}
          <div 
            className={`${styles.menuToggle} ${mobileActive ? styles.menuActive : ''}`}
            onClick={toggleMobileMenu}
          >
            <span className={styles.bar}></span>
            <span className={styles.bar}></span>
            <span className={styles.bar}></span>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      <div className={`${styles.mobileDrawer} ${mobileActive ? styles.mobileDrawerActive : ''}`}>
        {navLinks.map((link) => {
          const isAnchor = link.path.startsWith('#');
          return (
            <a
              key={link.name}
              href={pathname === '/' ? link.path : `/${link.path}`}
              className={styles.mobileLink}
              onClick={closeMobileMenu}
            >
              {link.name}
            </a>
          );
        })}
        {isAdmin ? (
          <Link href="/admin" className={styles.adminBtn} style={{ textAlign: 'center', marginTop: '1rem' }} onClick={closeMobileMenu}>
            Dashboard Admin
          </Link>
        ) : (
          <Link href="/admin/login" className={styles.mobileLink} onClick={closeMobileMenu}>
            Login Admin
          </Link>
        )}
      </div>
    </>
  );
}
