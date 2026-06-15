import Link from 'next/link';
import styles from '@/styles/Components.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerGrid}>
          {/* Brand & About */}
          <div className={styles.footerCol}>
            <div className={styles.footerBrandText}>Berseni</div>
            <div className={styles.footerTagline}>A World of Art for Everyone</div>
            <p className={styles.footerDesc}>
              Menghubungkan publik dengan seniman Indonesia secara nyata. Temukan keindahan budaya Nusantara melalui kelas online, workshop offline, dan koleksi karya seni pilihan.
            </p>
          </div>

          {/* Quick Links */}
          <div className={styles.footerCol}>
            <h4>Navigasi</h4>
            <ul className={styles.footerLinks}>
              <li>
                <Link href="/" className={styles.footerLink}>
                  Home
                </Link>
              </li>
              <li>
                <a href="#about" className={styles.footerLink}>
                  About Us
                </a>
              </li>
              <li>
                <a href="#programs" className={styles.footerLink}>
                  Programs
                </a>
              </li>
              <li>
                <a href="#products" className={styles.footerLink}>
                  Works & Classes
                </a>
              </li>
              <li>
                <Link href="/blog" className={styles.footerLink}>
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect & Socials */}
          <div className={styles.footerCol}>
            <h4>Hubungi Kami</h4>
            <p className={styles.footerDesc} style={{ marginBottom: '1rem' }}>
              Punya pertanyaan seputar workshop, lukisan, atau kelas? Jangan ragu untuk menghubungi kami.
            </p>
            <div className={styles.socials}>
              {/* WhatsApp */}
              <a
                href="https://wa.me/6281234567890" 
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className={`${styles.socialIcon} ${styles.whatsapp}`}
              >
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.464L0 24zm6.59-4.846c1.6.95 3.198 1.451 4.938 1.453 5.4 0 9.794-4.39 9.798-9.789.002-2.614-1.012-5.074-2.861-6.924C16.63 2.052 14.17 1.04 11.56 1.04c-5.39 0-9.78 4.39-9.784 9.788-.001 1.737.459 3.43 1.398 4.987l-.997 3.637 3.88-.988z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/berseni.id/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className={`${styles.socialIcon} ${styles.instagram}`}
              >
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>

              {/* TikTok */}
              <a
                href="https://www.tiktok.com/@berseni.id"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className={`${styles.socialIcon} ${styles.tiktok}`}
              >
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="https://www.youtube.com/@berseni"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className={`${styles.socialIcon} ${styles.youtube}`}
              >
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.507a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11c1.87.508 9.388.508 9.388.508s7.518 0 9.388-.508a3.002 3.002 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className={styles.footerDivider}></div>

        <div className={styles.footerBottom}>
          <p>&copy; {currentYear} Berseni. All rights reserved.</p>
          <p>
            Powered by <span className={styles.rainbowText}>Semesta Indonesia</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
