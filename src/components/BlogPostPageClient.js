'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/components/LanguageContext';
import styles from '@/styles/Blog.module.css';

export default function BlogPostPageClient({ post }) {
  const { t, getTranslation } = useLanguage();

  if (!post) return null;

  // Split localized content text by newlines to render paragraphs
  const paragraphs = t(post, 'content').split('\n\n');

  return (
    <div style={{ backgroundColor: 'var(--color-cream-bg)', minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      {/* Background Decorative Glow Blobs */}
      <div className={styles.blogGlowContainer}>
        <div className={`${styles.glowBlob} ${styles.glowTosca}`}></div>
        <div className={`${styles.glowBlob} ${styles.glowMaroon}`}></div>
        <div className={`${styles.glowBlob} ${styles.glowKunyit}`}></div>
      </div>

      <Navbar />
      
      <main className={styles.detailPage}>
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
                {t(post, 'excerpt')}
              </p>
            )}
          </header>
          
          {/* Hero Image */}
          <div className={styles.postImageWrapper}>
            <img 
              src={post.image} 
              alt={t(post, 'title')} 
              className={styles.postImage}
            />
          </div>
          
          {/* Body Content */}
          <div className={styles.postContent}>
            {paragraphs.map((para, index) => {
              if (para.trim().startsWith('>')) {
                return (
                  <blockquote key={index}>
                    {para.replace('>', '').trim()}
                  </blockquote>
                );
              }
              return <p key={index}>{para}</p>;
            })}
          </div>

          {/* Author/Community Bio Footer */}
          <footer className={styles.postFooter}>
            <div className={styles.authorCard}>
              <div className={styles.authorAvatar}>B</div>
              <div className={styles.authorInfo}>
                <h4>{getTranslation('blogAboutTitle')}</h4>
                <p>{getTranslation('blogAboutDesc')}</p>
              </div>
            </div>
          </footer>
        </article>
      </main>
      
      <Footer />
    </div>
  );
}
