'use client';

import Link from 'next/link';
import SafeImage from '@/components/SafeImage';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/components/LanguageContext';
import RichText, { splitParagraphs } from '@/components/RichText';
import { getYouTubeId, getYouTubeThumbnail } from '@/lib/video';
import { textVars } from '@/lib/textColors';
import styles from '@/styles/Blog.module.css';

export default function BlogPostPageClient({ content, post }) {
  const { language, t, getTranslation, dbContent } = useLanguage();

  if (!post) return null;

  // Pisah jadi paragraf. splitParagraphs memaafkan baris kosong yang berisi
  // spasi/tab dan baris kosong beruntun — penulisan klien tidak selalu rapi.
  const paragraphs = splitParagraphs(t(post, 'content'));

  // Kalau tombol CTA mengarah ke YouTube, tampilkan thumbnail-nya.
  const ctaVideoId = getYouTubeId(post.ctaButtonLink);

  return (
    <div style={{ ...textVars(dbContent || content || initialContent, 'text_blog_detail_main'), backgroundColor: dbContent?.bg_blog_detail_main || content?.bg_blog_detail_main || 'var(--color-cream-bg)', minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      {/* Background Decorative Glow Blobs */}
      <div className={styles.blogGlowContainer}>
        <div className={`${styles.glowBlob} ${styles.glowTosca}`}></div>
        <div className={`${styles.glowBlob} ${styles.glowMaroon}`}></div>
        <div className={`${styles.glowBlob} ${styles.glowKunyit}`}></div>
      </div>

      <Navbar />
      
      <main id="main-content" className={styles.detailPage}>
        {/* Back navigation */}
        <Link href="/blog" className={styles.backBtn}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          {getTranslation('blogBackBtn')}
        </Link>
        
        <article className={styles.articleContainer}>
          {/* Post Header */}
          <header className={styles.postHeader}>
            <span className={styles.postCategory}>{getTranslation('blogHeaderTitleSpan')}</span>
            <h1 className={styles.postTitle}>{t(post, 'title')}</h1>
            <div className={styles.postMeta}>
              {getTranslation('publishedOn')} {post.date} <span>•</span> {getTranslation('writtenBy')} <strong>Tim Berseni</strong> <span>•</span> 3 {getTranslation('minRead')}
            </div>
            {t(post, 'excerpt') && (
              <p className={styles.postExcerptIntro} style={{ 
                fontSize: '1.25rem', 
                color: 'var(--color-text-muted)', 
                fontStyle: 'italic', 
                maxWidth: '700px', 
                margin: '1.5rem auto 0 auto',
                lineHeight: '1.6',
                borderLeft: '4px solid var(--color-tosca)',
                paddingLeft: '1.25rem',
                textAlign: 'left'
              }}>
                <RichText text={t(post, 'excerpt')} inline />
              </p>
            )}
          </header>
          
          {/* Hero Image */}
          <div className={styles.postImageWrapper}>
            <SafeImage
              src={post.image}
              alt={t(post, 'title')}
              className={styles.postImage}
              width={1200}
              height={700}
              sizes="100vw"
              priority
              fallbackSrc="https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=1200&auto=format&fit=crop"
            />
          </div>
          
          {/* Body Content */}
          <div className={styles.postContent}>
            {paragraphs.map((para, index) => {
              if (para.trim().startsWith('>')) {
                return (
                  <blockquote key={index}>
                    <RichText text={para.replace(/^>[ \t]?/gm, '').trim()} inline />
                  </blockquote>
                );
              }
              return <p key={index}><RichText text={para} inline /></p>;
            })}
          </div>

          {/* Call To Action (CTA) Section */}
          {post.ctaShow && (
            <div 
              className={styles.blogCtaBlock} 
              style={{ ...textVars(dbContent || content || initialContent, 'text_blog_detail_cta'), backgroundColor: dbContent?.bg_blog_detail_cta || content?.bg_blog_detail_cta || '',
                backgroundImage: (dbContent?.bg_blog_detail_cta || content?.bg_blog_detail_cta) ? 'none' : ''
              }}
            >
              <h2 className={styles.blogCtaTitle}>
                {t(post, 'ctaTitle') || (language === 'id' ? 'Tertarik Mencoba?' : 'Interested in Trying?')}
              </h2>
              {(post.ctaDesc_id || post.ctaDesc_en) && (
                <p className={styles.blogCtaDesc}><RichText text={t(post, 'ctaDesc')} inline /></p>
              )}
              {/* Link YouTube otomatis tampil sebagai kartu thumbnail yang bisa
                  diklik — jauh lebih menarik daripada sekadar tombol teks.
                  Admin tidak perlu setelan tambahan: cukup tempel link videonya. */}
              {ctaVideoId && post.ctaButtonLink && (
                <a
                  href={post.ctaButtonLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.blogCtaVideo}
                  aria-label={t(post, 'ctaButtonText') || (language === 'id' ? 'Tonton video' : 'Watch video')}
                >
                  <SafeImage
                    src={getYouTubeThumbnail(ctaVideoId)}
                    alt={t(post, 'ctaTitle') || (language === 'id' ? 'Tonton video' : 'Watch video')}
                    className={styles.blogCtaVideoThumb}
                    width={480}
                    height={360}
                    sizes="(max-width: 768px) 90vw, 480px"
                    fallbackSrc={`https://i.ytimg.com/vi/${ctaVideoId}/mqdefault.jpg`}
                  />
                  <span className={styles.blogCtaPlay} aria-hidden="true">
                    <svg width="34" height="34" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </a>
              )}

              {post.ctaShowButton && post.ctaButtonLink && (
                <a
                  href={post.ctaButtonLink}
                  className={styles.blogCtaBtn}
                  target={post.ctaButtonLink.startsWith('http') ? '_blank' : undefined}
                  rel={post.ctaButtonLink.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  {t(post, 'ctaButtonText') || (language === 'id' ? 'Pelajari Selengkapnya' : 'Learn More')}
                </a>
              )}
            </div>
          )}

          {/* Author/Community Bio Footer */}
          <footer className={styles.postFooter}>
            <div className={styles.authorCard}>
              <div className={styles.authorAvatar}>B</div>
              <div className={styles.authorInfo}>
                <h2>{getTranslation('blogAboutTitle')}</h2>
                <p><RichText text={getTranslation('blogAboutDesc')} inline /></p>
              </div>
            </div>
          </footer>
        </article>
      </main>
      
      <Footer />
    </div>
  );
}
