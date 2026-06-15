import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { db } from '@/lib/db';
import styles from '@/styles/Blog.module.css';

export const revalidate = 0;

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const posts = await db.get('posts') || [];
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  // Pisahkan teks dengan baris baru untuk merender paragraf
  const paragraphs = post.content.split('\n\n');

  return (
    <div style={{ backgroundColor: 'var(--color-cream-bg)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <main className={styles.detailPage}>
        {/* Back navigation */}
        <Link href="/blog" className={styles.backBtn}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Kembali ke Blog
        </Link>
        
        <article>
          {/* Post Header */}
          <header className={styles.postHeader}>
            <span className={styles.postCategory}>Catatan Seni</span>
            <h1 className={styles.postTitle}>{post.title}</h1>
            <div className={styles.postMeta}>
              Diterbitkan pada {post.date} <span>•</span> Ditulis oleh Tim Berseni
            </div>
          </header>
          
          {/* Hero Image */}
          <div className={styles.postImageWrapper}>
            <img 
              src={post.image} 
              alt={post.title} 
              className={styles.postImage}
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=1200&auto=format&fit=crop';
              }}
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
        </article>
      </main>
      
      <Footer />
    </div>
  );
}
