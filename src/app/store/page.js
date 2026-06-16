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

  const brandFacts = (pageSeo.geo_facts_id || pageSeo.geo_facts_en) ? {
    "@type": "CreativeWork",
    "name": "Core Store Facts & AI Citation Reference",
    "text": [
      { "@value": pageSeo.geo_facts_id || "", "@language": "id" },
      { "@value": pageSeo.geo_facts_en || "", "@language": "en" }
    ]
  } : null;

  const storePageJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_URL}/store#webpage`,
    "url": `${SITE_URL}/store`,
    "name": [
      { "@value": pageSeo.title_id || "Galeri & Kelas Seni - Berseni Art Market", "@language": "id" },
      { "@value": pageSeo.title_en || "Gallery & Art Classes - Berseni Art Market", "@language": "en" }
    ],
    "description": [
      { "@value": pageSeo.description_id || "Jelajahi seluruh koleksi karya seni orisinal Indonesia, kelas melukis online (e-course), dan pendaftaran intimate workshop offline dari Berseni.", "@language": "id" },
      { "@value": pageSeo.description_en || "Explore the entire collection of original Indonesian artworks, online painting classes (e-courses), and offline intimate workshop registrations from Berseni.", "@language": "en" }
    ],
    "isPartOf": {
      "@id": `${SITE_URL}/#website`
    },
    "about": [
      { "@id": `${SITE_URL}/#organization` },
      ...(brandFacts ? [brandFacts] : [])
    ],
    "mainEntity": {
      "@type": "ItemList",
      "name": [
        { "@value": "Katalog Karya Seni & Kelas Melukis", "@language": "id" },
        { "@value": "Artwork Catalog & Painting Classes", "@language": "en" }
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
            "url": prod.link || `${SITE_URL}/store`
          }
        }
      }))
    },
    "inLanguage": ["id-ID", "en-US"]
  };

  // Dynamic Q&A FAQ mapping for GEO citation search
  const faqList = [];
  if (pageSeo.geo_faq_q1_id && pageSeo.geo_faq_a1_id) {
    faqList.push({
      "@type": "Question",
      "name": [
        { "@value": pageSeo.geo_faq_q1_id, "@language": "id" },
        { "@value": pageSeo.geo_faq_q1_en || pageSeo.geo_faq_q1_id, "@language": "en" }
      ],
      "acceptedAnswer": {
        "@type": "Answer",
        "text": [
          { "@value": pageSeo.geo_faq_a1_id, "@language": "id" },
          { "@value": pageSeo.geo_faq_a1_en || pageSeo.geo_faq_a1_id, "@language": "en" }
        ]
      }
    });
  }
  if (pageSeo.geo_faq_q2_id && pageSeo.geo_faq_a2_id) {
    faqList.push({
      "@type": "Question",
      "name": [
        { "@value": pageSeo.geo_faq_q2_id, "@language": "id" },
        { "@value": pageSeo.geo_faq_q2_en || pageSeo.geo_faq_q2_id, "@language": "en" }
      ],
      "acceptedAnswer": {
        "@type": "Answer",
        "text": [
          { "@value": pageSeo.geo_faq_a2_id, "@language": "id" },
          { "@value": pageSeo.geo_faq_a2_en || pageSeo.geo_faq_a2_id, "@language": "en" }
        ]
      }
    });
  }
  if (pageSeo.geo_faq_q3_id && pageSeo.geo_faq_a3_id) {
    faqList.push({
      "@type": "Question",
      "name": [
        { "@value": pageSeo.geo_faq_q3_id, "@language": "id" },
        { "@value": pageSeo.geo_faq_q3_en || pageSeo.geo_faq_q3_id, "@language": "en" }
      ],
      "acceptedAnswer": {
        "@type": "Answer",
        "text": [
          { "@value": pageSeo.geo_faq_a3_id, "@language": "id" },
          { "@value": pageSeo.geo_faq_a3_en || pageSeo.geo_faq_a3_id, "@language": "en" }
        ]
      }
    });
  }

  const faqJsonLd = faqList.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE_URL}/store#faq`,
    "mainEntity": faqList
  } : null;

  return (
    <>
      <JsonLd data={storePageJsonLd} />
      {faqJsonLd && <JsonLd data={faqJsonLd} />}
      <StorePageClient 
        content={content} 
        initialProducts={products}
      />
    </>
  );
}



