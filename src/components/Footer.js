'use client';

import Link from 'next/link';
import { useLanguage } from '@/components/LanguageContext';
import RichText from '@/components/RichText';
import CustomIcon from '@/components/CustomIcon';
import SocialIcon from '@/components/SocialIcon';
import { getFooterSocials, resolveSocialHref, isExternalHref } from '@/lib/footerSocials';
import styles from '@/styles/Components.module.css';

// Warna footer yang diatur admin. Caranya sama dengan lib/textColors.js:
// menimpa CSS VARIABLE di elemen <footer>, bukan menempelkan warna ke tiap
// elemen satu per satu. CSS footer sudah memakai token-token ini, jadi satu
// override langsung mengubah semua yang memakainya. Field kosong = warna tema
// bawaan tetap dipakai.
const PEMETAAN_WARNA = [
  ['--footer-bg', 'bg_footer'],
  ['--footer-heading', 'text_footer_title'],
  ['--footer-body', 'text_footer_body'],
  ['--footer-brand', 'text_footer_brand'],
  ['--footer-accent', 'footerAccentColor'],
];

function bangunWarnaFooter(content) {
  const vars = {};
  for (const [variabel, field] of PEMETAAN_WARNA) {
    const nilai = content?.[field];
    if (typeof nilai === 'string' && nilai.trim()) vars[variabel] = nilai.trim();
  }
  return vars;
}

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { language, getTranslation, dbContent, t } = useLanguage();

  const warnaFooter = bangunWarnaFooter(dbContent);

  // Daftar medsos sepenuhnya dikelola admin. Entri tanpa tujuan yang sah
  // dilewati supaya tidak ada ikon yang diklik lalu tidak membawa ke mana-mana.
  const medsos = getFooterSocials(dbContent)
    .map((item) => ({ item, href: resolveSocialHref(item, dbContent) }))
    .filter(({ href }) => href);

  const namaBrand = (dbContent?.footerBrandText || '').trim() || 'Berseni';

  const teksCopyright = (t(dbContent, 'footerCopyright') || '').trim()
    || (language === 'id'
      ? `Hak Cipta © ${currentYear} ${namaBrand}. Hak cipta dilindungi undang-undang.`
      : `Copyright © ${currentYear} ${namaBrand}. All rights reserved.`);

  const poweredTeks = dbContent?.footerPoweredByText !== undefined
    ? dbContent.footerPoweredByText
    : 'Powered by';
  const poweredNama = dbContent?.footerPoweredByName !== undefined
    ? dbContent.footerPoweredByName
    : 'AgentBuff';
  const poweredLink = (dbContent?.footerPoweredByLink || '').trim();

  return (
    <footer className={styles.footer} style={warnaFooter}>
      <div className={styles.footerInner}>
        <div className={styles.footerGrid}>
          {/* Brand & About */}
          <div className={styles.footerCol}>
            <div className={styles.footerBrandText}>{namaBrand}</div>
            {(getTranslation('footerTagline') || '').trim() ? (
              <div className={styles.footerTagline}>{getTranslation('footerTagline')}</div>
            ) : null}
            <p className={styles.footerDesc}>
              <RichText text={t(dbContent, 'footerDesc') || getTranslation('footerDesc')} inline />
            </p>
          </div>

          {/* Quick Links */}
          <div className={styles.footerCol}>
            <h3>{getTranslation('footerNavTitle')}</h3>
            <ul className={styles.footerLinks}>
              <li>
                <Link href="/" className={styles.footerLink}>
                  {getTranslation('navHome')}
                </Link>
              </li>
              <li>
                <Link href="/store" className={styles.footerLink}>
                  {getTranslation('navStore')}
                </Link>
              </li>
              <li>
                <Link href="/classes" className={styles.footerLink}>
                  {getTranslation('navClasses')}
                </Link>
              </li>
              <li>
                <Link href="/about" className={styles.footerLink}>
                  {getTranslation('navAbout')}
                </Link>
              </li>
              <li>
                <Link href="/collaboration" className={styles.footerLink}>
                  {getTranslation('navCollab')}
                </Link>
              </li>
              <li>
                <Link href="/blog" className={styles.footerLink}>
                  {getTranslation('navBlog')}
                </Link>
              </li>
              <li>
                <Link href="/gallery" className={styles.footerLink}>
                  {getTranslation('navGallery')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect & Socials */}
          <div className={styles.footerCol}>
            <h3>{getTranslation('footerContactTitle')}</h3>
            <p className={styles.footerDesc} style={{ marginBottom: '1rem' }}>
              <RichText
                text={t(dbContent, 'footerContactDesc') || (language === 'id'
                  ? 'Punya pertanyaan seputar workshop, lukisan, atau kelas? Jangan ragu untuk menghubungi kami.'
                  : 'Have questions about workshops, paintings, or classes? Do not hesitate to contact us.')}
                inline
              />
            </p>
            {medsos.length > 0 && (
              <div className={styles.socials}>
                {medsos.map(({ item, href }) => {
                  const label = (t(item, 'label') || '').trim() || item.preset || 'Tautan';
                  const eksternal = isExternalHref(href);
                  return (
                    <a
                      key={item.id || href}
                      href={href}
                      {...(eksternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      aria-label={label}
                      title={label}
                      className={styles.socialIcon}
                    >
                      <CustomIcon src={item.icon} size={20} alt="">
                        <SocialIcon preset={item.preset} size={20} />
                      </CustomIcon>
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className={styles.footerDivider}></div>

        <div className={styles.footerBottom}>
          <p>{teksCopyright}</p>
          {(poweredTeks || poweredNama) && (
            <p>
              {poweredTeks}
              {poweredTeks && poweredNama ? ' ' : ''}
              {poweredNama && (
                poweredLink ? (
                  <a
                    href={poweredLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.rainbowText}
                  >
                    {poweredNama}
                  </a>
                ) : (
                  <span className={styles.rainbowText}>{poweredNama}</span>
                )
              )}
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
