import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import BlogPostPageClient from '@/components/BlogPostPageClient';

export const revalidate = 0;

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const posts = await db.get('posts') || [];
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return <BlogPostPageClient post={post} />;
}

