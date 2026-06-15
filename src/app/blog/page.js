import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { db } from '@/lib/db';
import styles from '@/styles/Blog.module.css';

export const revalidate = 0;

export default async function BlogPage() {
  const posts = await db.get('posts') || [];

  return (
    <div style={{ backgroundColor: 'var(--color-cream-bg)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <main className={styles.blogPage}>
        <h1 className={styles.blogTitle}>Artikel & <span>Catatan Seni.</span></h1>
        <p className={styles.blogSubtitle}>Wawasan seputar teknik melukis, sejarah seni rupa, dan proses kreatif dari para seniman Indonesia.</p>
        
        <div className={styles.blogGrid}>
          {posts.length > 0 ? (
            posts.map((post) => (
              <article key={post.slug} className={styles.blogCard}>
                <div className={styles.blogCardImageWrapper}>
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className={styles.blogCardImage}
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=600&auto=format&fit=crop';
                    }}
                  />
                </div>
                <div className={styles.blogCardBody}>
                  <span className={styles.blogCardDate}>{post.date}</span>
                  <h2 className={styles.blogCardTitle}>
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h2>
                  <p className={styles.blogCardExcerpt}>{post.excerpt}</p>
                  <Link href={`/blog/${post.slug}`} className={styles.blogCardBtn}>
                    Baca Artikel
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </article>
            ))
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--color-text-muted)', padding: '4rem 0' }}>
              Belum ada artikel blog yang diterbitkan. Hubungi admin untuk menulis artikel baru.
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
