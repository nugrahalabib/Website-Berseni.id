'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/components/LanguageContext';
import styles from '@/styles/Blog.module.css';

export default function BlogPageClient({ initialPosts }) {
  const { t, getTranslation } = useLanguage();
  
  const posts = initialPosts || [];
  const featuredPost = posts.length > 0 ? posts[0] : null;
  const remainingPosts = posts.length > 1 ? posts.slice(1) : [];

  return (
    <div style={{ backgroundColor: 'var(--color-cream-bg)', minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      {/* Background Glow Blobs for Artistic Aesthetic */}
      <div className={styles.blogGlowContainer}>
        <div className={`${styles.glowBlob} ${styles.glowTosca}`}></div>
        <div className={`${styles.glowBlob} ${styles.glowMaroon}`}></div>
        <div className={`${styles.glowBlob} ${styles.glowKunyit}`}></div>
      </div>

      <Navbar />
      
      <main className={styles.blogPage}>
        {/* Page Header */}
        <div className={styles.blogHeader}>
          <h1 className={styles.blogTitle}>
            {getTranslation('blogHeaderTitleText')}<span>{getTranslation('blogHeaderTitleSpan')}</span>
          </h1>
          <p className={styles.blogSubtitle}>
            {getTranslation('blogHeaderDesc')}
          </p>
        </div>

        {/* Featured Post (Highlighted) */}
        {featuredPost && (
          <section className={styles.featuredSection}>
            <div className={styles.featuredCard}>
              <div className={styles.featuredImageWrapper}>
                <img 
                  src={featuredPost.image} 
                  alt={t(featuredPost, 'title')} 
                  className={styles.featuredImage}
                />
                <span className={styles.featuredTag}>{getTranslation('blogFeaturedTag')}</span>
              </div>
              <div className={styles.featuredContent}>
                <span className={styles.featuredDate}>
                  {featuredPost.date} • {getTranslation('writtenBy')} Tim Berseni
                </span>
                <h2 className={styles.featuredTitle}>
                  <Link href={`/blog/${featuredPost.slug}`}>
                    {t(featuredPost, 'title')}
                  </Link>
                </h2>
                <p className={styles.featuredExcerpt}>{t(featuredPost, 'excerpt')}</p>
                <Link href={`/blog/${featuredPost.slug}`} className={styles.featuredBtn}>
                  {getTranslation('blogReadFullBtn')}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Grid of Remaining Posts */}
        {posts.length > 0 ? (
          <div className={styles.blogGridSection}>
            {remainingPosts.length > 0 && <h3 className={styles.gridSectionTitle}>{getTranslation('blogLatestTitle')}</h3>}
            <div className={styles.blogGrid}>
              {(remainingPosts.length > 0 ? remainingPosts : posts).map((post) => (
                <article key={post.slug} className={styles.blogCard}>
                  <div className={styles.blogCardImageWrapper}>
                    <img 
                      src={post.image} 
                      alt={t(post, 'title')} 
                      className={styles.blogCardImage}
                      loading="lazy"
                    />
                    <span className={styles.blogCardTag}>{getTranslation('blogHeaderTitleSpan')}</span>
                  </div>
                  <div className={styles.blogCardBody}>
                    <span className={styles.blogCardDate}>{post.date}</span>
                    <h2 className={styles.blogCardTitle}>
                      <Link href={`/blog/${post.slug}`}>
                        {t(post, 'title')}
                      </Link>
                    </h2>
                    <p className={styles.blogCardExcerpt}>{t(post, 'excerpt')}</p>
                    <Link href={`/blog/${post.slug}`} className={styles.blogCardBtn}>
                      {getTranslation('readArticle')}
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : (
          <div className={styles.emptyGrid}>
            <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ margin: '0 auto 1.5rem auto', opacity: 0.5 }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            {getTranslation('blogEmpty')}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
