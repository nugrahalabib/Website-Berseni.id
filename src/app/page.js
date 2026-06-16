import { db } from '@/lib/db';
import LandingPageClient from '@/components/LandingPageClient';
import JsonLd from '@/components/JsonLd';

export const revalidate = 0;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://berseni.id';

export async function generateMetadata() {
  const seoPages = await db.get('seo_pages') || {};
  const pageSeo = seoPages['home'] || {};

  const title = pageSeo.title_id || 'Berseni - Galeri Seni & Kelas Melukis Online';
  const description = pageSeo.description_id || 'Platform penghubung publik dan seniman Indonesia. Temukan kelas melukis online, workshop offline, dan karya seni terbaik langsung dari para maestro.';
  const keywords = pageSeo.keywords_id || 'seni, lukis, kelas online, workshop offline, lukisan indonesia, belajar melukis, berseni';

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url: SITE_URL,
      type: 'website',
      images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${SITE_URL}/og-image.jpg`],
    },
    alternates: {
      canonical: SITE_URL,
    },
    other: {
      "geo.region": pageSeo.geo_region || "ID-JK",
      "geo.placename": pageSeo.geo_placename || "Jakarta",
      "geo.position": pageSeo.geo_position || "-6.2088;106.8456",
      "ICBM": pageSeo.geo_icbm || "-6.2088, 106.8456",
    },
  };
}

export default async function Home() {
  const content = await db.get('content');
  const products = await db.get('products') || [];
  const posts = await db.get('posts') || [];

  const seoPages = await db.get('seo_pages') || {};
  const pageSeo = seoPages['home'] || {};

  const homePageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE_URL}/#webpage`,
    "url": SITE_URL,
    "name": [
      { "@value": pageSeo.title_id || "Berseni - Galeri Seni & Kelas Melukis Online", "@language": "id" },
      { "@value": pageSeo.title_en || "Berseni - Art Gallery & Online Painting Classes", "@language": "en" }
    ],
    "description": [
      { "@value": pageSeo.description_id || "Platform penghubung publik dan seniman Indonesia. Temukan kelas melukis online, workshop offline, dan karya seni terbaik langsung dari para maestro.", "@language": "id" },
      { "@value": pageSeo.description_en || "A platform connecting the public and Indonesian artists. Discover online painting classes, offline workshops, and the best artwork directly from the maestros.", "@language": "en" }
    ],
    "isPartOf": {
      "@id": `${SITE_URL}/#website`
    },
    "about": {
      "@id": `${SITE_URL}/#organization`
    },
    "inLanguage": ["id-ID", "en-US"]
  };

  const productListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": [
      { "@value": "Koleksi Karya & Kelas Seni Pilihan", "@language": "id" },
      { "@value": "Featured Artworks & Painting Classes", "@language": "en" }
    ],
    "numberOfItems": products.length,
    "itemListElement": products.map((prod, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Product",
        "name": [
          { "@value": prod.title_id || prod.title_en, "@language": "id" },
          { "@value": prod.title_en || prod.title_id, "@language": "en" }
        ],
        "description": [
          { "@value": prod.description_id || prod.description_en, "@language": "id" },
          { "@value": prod.description_en || prod.description_id, "@language": "en" }
        ],
        "image": prod.image.startsWith('http') ? prod.image : `${SITE_URL}${prod.image}`,
        "offers": {
          "@type": "Offer",
          "priceCurrency": "IDR",
          "price": prod.price,
          "availability": "https://schema.org/InStock",
          "url": prod.link || SITE_URL
        }
      }
    }))
  };

  return (
    <>
      <JsonLd data={homePageJsonLd} />
      <JsonLd data={productListJsonLd} />
      <LandingPageClient 
        initialContent={content} 
        initialProducts={products} 
        initialPosts={posts}
      />
    </>
  );
}


