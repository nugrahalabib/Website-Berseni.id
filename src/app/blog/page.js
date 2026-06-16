import { db } from '@/lib/db';
import BlogPageClient from '@/components/BlogPageClient';

export const revalidate = 0;

export async function generateMetadata() {
  const seoPages = await db.get('seo_pages') || {};
  const pageSeo = seoPages['blog'] || {};
  return {
    title: pageSeo.title_id || "Artikel & Catatan Seni - Berseni Blog",
    description: pageSeo.description_id || "Wawasan seputar teknik melukis, sejarah seni rupa, dan proses kreatif dari para seniman Indonesia.",
    keywords: pageSeo.keywords_id || "blog seni, teknik melukis, sejarah seni, proses kreatif, seniman indonesia, cat air, akrilik",
    other: {
      "geo.region": pageSeo.geo_region || "ID-JK",
      "geo.placename": pageSeo.geo_placename || "Jakarta",
      "geo.position": pageSeo.geo_position || "-6.2088;106.8456",
      "ICBM": pageSeo.geo_icbm || "-6.2088, 106.8456"
    }
  };
}

export default async function BlogPage() {
  const posts = await db.get('posts') || [];

  return <BlogPageClient initialPosts={posts} />;
}

