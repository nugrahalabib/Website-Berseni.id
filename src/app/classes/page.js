import { db } from '@/lib/db';
import ClassesPageClient from '@/components/ClassesPageClient';
import JsonLd from '@/components/JsonLd';

// Ensure page fetches latest data on request
export const revalidate = 0;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://berseni.id';

export async function generateMetadata() {
  const content = await db.get('content') || {};
  const defaultLanguage = content.content?.defaultLanguage || content.defaultLanguage || 'id';

  const seoPages = await db.get('seo_pages') || {};
  const pageSeo = seoPages['classes'] || {};

  const title = defaultLanguage === 'en'
    ? (pageSeo.title_en || pageSeo.title_id || "Art & Painting Classes - Berseni Art Academy")
    : (pageSeo.title_id || pageSeo.title_en || "Kelas & Akademi Seni - Berseni Art Academy");

  const description = defaultLanguage === 'en'
    ? (pageSeo.description_en || pageSeo.description_id || "Register for online painting classes and offline intimate workshops from Berseni. Learn directly from Nusantara painting maestros.")
    : (pageSeo.description_id || pageSeo.description_en || "Daftar kelas melukis online dan intimate workshop offline dari Berseni. Belajar langsung dari maestro pelukis Nusantara.");

  const keywords = defaultLanguage === 'en'
    ? (pageSeo.keywords_en || pageSeo.keywords_id || "art classes, painting class, offline workshop, learn painting, online painting class, berseni, indonesia")
    : (pageSeo.keywords_id || pageSeo.keywords_en || "kelas seni, kelas melukis, workshop offline, belajar melukis, kelas online melukis, berseni, indonesia");

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/classes`,
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
      canonical: `${SITE_URL}/classes`,
    },
    other: {
      "geo.region": pageSeo.geo_region || "ID-JK",
      "geo.placename": pageSeo.geo_placename || "Jakarta",
      "geo.position": pageSeo.geo_position || "-6.2088;106.8456",
      "ICBM": pageSeo.geo_icbm || "-6.2088, 106.8456"
    }
  };
}

export default async function ClassesPage() {
  const content = await db.get('content') || {};
  const allProducts = await db.get('products') || [];
  const products = allProducts.filter(p => p.category === 'offline' || p.category === 'online');

  const seoPages = await db.get('seo_pages') || {};
  const pageSeo = seoPages['classes'] || {};

  const brandFacts = (pageSeo.geo_facts_id || pageSeo.geo_facts_en) ? {
    "@type": "CreativeWork",
    "name": "Core Classes Facts & AI Citation Reference",
    "text": [
      { "@value": pageSeo.geo_facts_id || "", "@language": "id" },
      { "@value": pageSeo.geo_facts_en || "", "@language": "en" }
    ]
  } : null;

  const classesPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_URL}/classes#webpage`,
    "url": `${SITE_URL}/classes`,
    "name": [
      { "@value": pageSeo.title_id || "Kelas & Akademi Seni - Berseni Art Academy", "@language": "id" },
      { "@value": pageSeo.title_en || "Art & Painting Classes - Berseni Art Academy", "@language": "en" }
    ],
    "description": [
      { "@value": pageSeo.description_id || "Daftar kelas melukis online dan intimate workshop offline dari Berseni. Belajar langsung dari maestro pelukis Nusantara.", "@language": "id" },
      { "@value": pageSeo.description_en || "Register for online painting classes and offline intimate workshops from Berseni. Learn directly from Nusantara painting maestros.", "@language": "en" }
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
        { "@value": "Katalog Kelas Melukis & Workshop", "@language": "id" },
        { "@value": "Painting Classes & Workshops Catalog", "@language": "en" }
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
            "url": prod.link || `${SITE_URL}/classes`
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
    "@id": `${SITE_URL}/classes#faq`,
    "mainEntity": faqList
  } : null;

  return (
    <>
      <JsonLd data={classesPageJsonLd} />
      {faqJsonLd && <JsonLd data={faqJsonLd} />}
      <ClassesPageClient 
        content={content} 
        initialProducts={products}
      />
    </>
  );
}
