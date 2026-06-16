import { db } from '@/lib/db';
import StorePageClient from '@/components/StorePageClient';
import JsonLd from '@/components/JsonLd';

// Ensure the page fetches latest content from local json/DB on request
export const revalidate = 0;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://berseni.id';

export async function generateMetadata() {
  const seoPages = await db.get('seo_pages') || {};
  const pageSeo = seoPages['store'] || {};

  const title = pageSeo.title_id || "Galeri & Kelas Seni - Berseni Art Market";
  const description = pageSeo.description_id || "Jelajahi seluruh koleksi karya seni orisinal Indonesia, kelas melukis online (e-course), dan pendaftaran intimate workshop offline dari Berseni.";
  const keywords = pageSeo.keywords_id || "marketplace seni, karya seni, lukisan, kelas online, workshop offline, belajar melukis, berseni, indonesia";

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/store`,
      type: "website",
      images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE_URL}/og-image.jpg`],
    },
    alternates: {
      canonical: `${SITE_URL}/store`,
    },
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

  const seoPages = await db.get('seo_pages') || {};
  const pageSeo = seoPages['store'] || {};
  const title = pageSeo.title_id || "Galeri & Kelas Seni - Berseni Art Market";
  const description = pageSeo.description_id || "Jelajahi seluruh koleksi karya seni orisinal Indonesia, kelas melukis online (e-course), dan pendaftaran intimate workshop offline dari Berseni.";

  const storePageJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_URL}/store#webpage`,
    "url": `${SITE_URL}/store`,
    "name": title,
    "description": description,
    "isPartOf": {
      "@id": `${SITE_URL}/#website`
    },
    "about": {
      "@id": `${SITE_URL}/#organization`
    },
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": products.length,
      "itemListElement": products.map((prod, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Product",
          "name": prod.title_id || prod.title_en,
          "description": prod.description_id || prod.description_en,
          "image": prod.image.startsWith('http') ? prod.image : `${SITE_URL}${prod.image}`,
          "offers": {
            "@type": "Offer",
            "priceCurrency": "IDR",
            "price": prod.price,
            "availability": "https://schema.org/InStock",
            "url": prod.link || `${SITE_URL}/store`
          }
        }
      }))
    },
    "inLanguage": ["id-ID", "en-US"]
  };

  return (
    <>
      <JsonLd data={storePageJsonLd} />
      <StorePageClient 
        content={content} 
        initialProducts={products}
      />
    </>
  );
}

