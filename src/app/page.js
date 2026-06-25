import { db } from '@/lib/db';
import LandingPageClient from '@/components/LandingPageClient';
import JsonLd from '@/components/JsonLd';

export const revalidate = 0;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://berseni.id';

export async function generateMetadata() {
  const content = await db.get('content') || {};
  const defaultLanguage = content.defaultLanguage || 'id';

  const seoPages = await db.get('seo_pages') || {};
  const pageSeo = seoPages['home'] || {};

  const title = defaultLanguage === 'en'
    ? (pageSeo.title_en || pageSeo.title_id || 'Berseni - A World of Art For Everyone')
    : (pageSeo.title_id || pageSeo.title_en || 'Berseni - Galeri Seni & Kelas Melukis Online');

  const description = defaultLanguage === 'en'
    ? (pageSeo.description_en || pageSeo.description_id || 'A platform connecting the public and Indonesian artists. Discover online painting classes, offline workshops, and the best artwork directly from the maestros.')
    : (pageSeo.description_id || pageSeo.description_en || 'Platform penghubung publik dan seniman Indonesia. Temukan kelas melukis online, workshop offline, dan karya seni terbaik langsung dari para maestro.');

  const keywords = defaultLanguage === 'en'
    ? (pageSeo.keywords_en || pageSeo.keywords_id || 'art, painting, online classes, offline workshops, indonesian painting, learn painting, berseni')
    : (pageSeo.keywords_id || pageSeo.keywords_en || 'seni, lukis, kelas online, workshop offline, lukisan indonesia, belajar melukis, berseni');

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
  const rawPosts = await db.get('posts') || [];

  // Sort posts descending by date (DD/MM/YYYY)
  const parseBlogDate = (dateStr) => {
    if (!dateStr) return new Date(0);
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      return new Date(year, month, day);
    }
    return new Date(dateStr);
  };
  const posts = [...rawPosts].sort((a, b) => parseBlogDate(b.date) - parseBlogDate(a.date));

  const seoPages = await db.get('seo_pages') || {};
  const pageSeo = seoPages['home'] || {};

  const brandFacts = (pageSeo.geo_facts_id || pageSeo.geo_facts_en) ? {
    "@type": "CreativeWork",
    "name": "Core Brand Facts & AI Citation Reference",
    "text": [
      { "@value": pageSeo.geo_facts_id || "", "@language": "id" },
      { "@value": pageSeo.geo_facts_en || "", "@language": "en" }
    ]
  } : null;

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
    "about": [
      { "@id": `${SITE_URL}/#organization` },
      ...(brandFacts ? [brandFacts] : [])
    ],
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
    "@id": `${SITE_URL}/#faq`,
    "mainEntity": faqList
  } : null;

  return (
    <>
      <JsonLd data={homePageJsonLd} />
      <JsonLd data={productListJsonLd} />
      {faqJsonLd && <JsonLd data={faqJsonLd} />}
      <LandingPageClient 
        initialContent={content} 
        initialProducts={products} 
        initialPosts={posts}
      />
    </>
  );
}



