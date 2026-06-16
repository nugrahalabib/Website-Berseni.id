import { db } from '@/lib/db';

export default async function sitemap() {
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://berseni.id';

  // Static pages
  const staticPages = [
    '',
    '/about',
    '/collaboration',
    '/store',
    '/blog',
  ].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Dynamic blog post pages from database
  let posts = [];
  try {
    posts = await db.get('posts') || [];
  } catch (e) {
    console.error("Gagal memuat posts untuk sitemap:", e);
  }

  const blogPages = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticPages, ...blogPages];
}
