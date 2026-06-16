import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import BlogPostPageClient from '@/components/BlogPostPageClient';

export const revalidate = 0;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const posts = await db.get('posts') || [];
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    return {
      title: "Artikel Tidak Ditemukan | Berseni Blog"
    };
  }

  const title = post.seoTitle_id || post.title_id || post.title_en;
  const description = post.seoDescription_id || post.excerpt_id || post.excerpt_en;
  const keywords = post.seoKeywords_id || "blog, artikel, berseni";

  return {
    title: `${title} | Berseni Blog`,
    description: description,
    keywords: keywords,
    other: {
      "geo.region": "ID-JK",
      "geo.placename": "Jakarta",
      "geo.position": "-6.2088;106.8456",
      "ICBM": "-6.2088, 106.8456"
    }
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const posts = await db.get('posts') || [];
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return <BlogPostPageClient post={post} />;
}

