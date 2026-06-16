import { db } from '@/lib/db';
import StorePageClient from '@/components/StorePageClient';

// Ensure the page fetches latest content from local json/DB on request
export const revalidate = 0;

export async function generateMetadata() {
  const seoPages = await db.get('seo_pages') || {};
  const pageSeo = seoPages['store'] || {};
  return {
    title: pageSeo.title_id || "Galeri & Kelas Seni - Berseni Art Market",
    description: pageSeo.description_id || "Jelajahi seluruh koleksi karya seni orisinal Indonesia, kelas melukis online (e-course), dan pendaftaran intimate workshop offline dari Berseni.",
    keywords: pageSeo.keywords_id || "marketplace seni, karya seni, lukisan, kelas online, workshop offline, belajar melukis, berseni, indonesia",
    other: {
      "geo.region": pageSeo.geo_region || "ID-JK",
      "geo.placename": pageSeo.geo_placename || "Jakarta",
      "geo.position": pageSeo.geo_position || "-6.2088;106.8456",
      "ICBM": pageSeo.geo_icbm || "-6.2088, 106.8456"
    }
  };
}

export default async function StorePage() {
  const content = await db.get('content') || {};
  const products = await db.get('products') || [];

  return (
    <StorePageClient 
      content={content} 
      initialProducts={products}
    />
  );
}
