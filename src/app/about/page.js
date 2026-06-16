import { db } from '@/lib/db';
import AboutPageClient from '@/components/AboutPageClient';

// Ensure the page fetches latest content from local json/DB on request
export const revalidate = 0;

export async function generateMetadata() {
  const seoPages = await db.get('seo_pages') || {};
  const pageSeo = seoPages['about'] || {};
  return {
    title: pageSeo.title_id || "Tentang Kami - Berseni",
    description: pageSeo.description_id || "Temukan kisah kami, visi misi, dan komitmen Berseni dalam menjadi jembatan global utama antara masyarakat umum dan seniman lokal Indonesia.",
    keywords: pageSeo.keywords_id || "tentang kami, berseni, visi misi, komunitas seni, indonesia, melukis",
    other: {
      "geo.region": pageSeo.geo_region || "ID-JK",
      "geo.placename": pageSeo.geo_placename || "Jakarta",
      "geo.position": pageSeo.geo_position || "-6.2088;106.8456",
      "ICBM": pageSeo.geo_icbm || "-6.2088, 106.8456"
    }
  };
}

export default async function AboutPage() {
  const content = await db.get('content');

  return (
    <AboutPageClient 
      content={content} 
    />
  );
}
