import { db } from '@/lib/db';
import BlogPageClient from '@/components/BlogPageClient';

export const revalidate = 0;

export default async function BlogPage() {
  const posts = await db.get('posts') || [];

  return <BlogPageClient initialPosts={posts} />;
}

