import { db } from '@/lib/db';
import CollaborationPageClient from '@/components/CollaborationPageClient';

// Ensure the page fetches latest content on request
export const revalidate = 0;

export async function generateMetadata() {
  const seoPages = await db.get('seo_pages') || {};
  const pageSeo = seoPages['collaboration'] || {};
  return {
    title: pageSeo.title_id || "Kolaborasi Kemitraan - Berseni",
    description: pageSeo.description_id || "Buka peluang kolaborasi kreatif bersama Berseni. Kami terbuka untuk brand, komunitas, dan partner venue untuk menghadirkan pengalaman seni terbaik.",
    keywords: pageSeo.keywords_id || "kolaborasi, kerjasama, venue partner, brand collaboration, berseni, event seni",
    other: {
      "geo.region": pageSeo.geo_region || "ID-JK",
      "geo.placename": pageSeo.geo_placename || "Jakarta",
      "geo.position": pageSeo.geo_position || "-6.2088;106.8456",
      "ICBM": pageSeo.geo_icbm || "-6.2088, 106.8456"
    }
  };
}

export default async function CollaborationPage() {
  const content = await db.get('content') || {};

  return (
    <CollaborationPageClient 
      content={content} 
    />
  );
}
