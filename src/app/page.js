import { db } from '@/lib/db';
import LandingPageClient from '@/components/LandingPageClient';

export const revalidate = 0;

export async function generateMetadata() {
  const seoPages = await db.get('seo_pages') || {};
  const pageSeo = seoPages['home'] || {};
  return {
    title: pageSeo.title_id || "Berseni - A World of Art For Everyone",
    description: pageSeo.description_id || "Platform penghubung publik dan seniman Indonesia.",
    keywords: pageSeo.keywords_id || "seni, lukis, berseni",
    other: {
      "geo.region": pageSeo.geo_region || "ID-JK",
      "geo.placename": pageSeo.geo_placename || "Jakarta",
      "geo.position": pageSeo.geo_position || "-6.2088;106.8456",
      "ICBM": pageSeo.geo_icbm || "-6.2088, 106.8456"
    }
  };
}

export default async function Home() {
  const content = await db.get('content');
  const products = await db.get('products') || [];
  const posts = await db.get('posts') || [];

  return (
    <LandingPageClient 
      initialContent={content} 
      initialProducts={products} 
      initialPosts={posts}
    />
  );
}
