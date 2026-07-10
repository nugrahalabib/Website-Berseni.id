import { db } from '@/lib/db';
import StorePageClient from '@/components/StorePageClient';
import JsonLd from '@/components/JsonLd';

// Ensure the page fetches latest content from local json/DB on request
export const revalidate = 0;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://berseni.id';

export async function generateMetadata() {
  const content = await db.get('content') || {};
  const defaultLanguage = content.content?.defaultLanguage || content.defaultLanguage || 'id';

  const seoPages = await db.get('seo_pages') || {};
  const pageSeo = seoPages['store'] || {};

  const title = defaultLanguage === 'en'
    ? (pageSeo.title_en || pageSeo.title_id || "Art Gallery & Collections - Berseni Art Market")
    : (pageSeo.title_id || pageSeo.title_en || "Galeri & Koleksi Seni - Berseni Art Market");

  const description = defaultLanguage === 'en'
    ? (pageSeo.description_en || pageSeo.description_id || "Explore the entire collection of original physical paintings and curated artworks from Berseni's local Indonesian artists.")
    : (pageSeo.description_id || pageSeo.description_en || "Jelajahi seluruh koleksi lukisan fisik orisinal dan karya seni terkurasi dari seniman lokal Indonesia di Berseni.");

  const keywords = defaultLanguage === 'en'
    ? (pageSeo.keywords_en || pageSeo.keywords_id || "art gallery, artwork, painting, original art, physical painting, buy artwork, berseni, indonesia")
    : (pageSeo.keywords_id || pageSeo.keywords_en || "galeri seni, karya seni, lukisan fisik, lukisan orisinal, beli lukisan, berseni, indonesia");

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
  const allProducts = await db.get('products') || [];
  const products = allProducts.filter(p => p.category === 'artwork');

  const seoPages = await db.get('seo_pages') || {};
  const pageSeo = seoPages['store'] || {};

  const defaultLanguage = content?.content?.defaultLanguage || content?.defaultLanguage || 'id';
  const pick = (id, en) => (defaultLanguage === 'en' ? (en || id) : (id || en));

  const brandFacts = (pageSeo.geo_facts_id || pageSeo.geo_facts_en) ? {
    "@type": "CreativeWork",
    "name": "Core Store Facts & AI Citation Reference",
    "text": pick(pageSeo.geo_facts_id || "", pageSeo.geo_facts_en || "")
  } : null;

  const storePageJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_URL}/store#webpage`,
    "url": `${SITE_URL}/store`,
    "name": pick(pageSeo.title_id || "Galeri & Kelas Seni - Berseni Art Market", pageSeo.title_en || "Gallery & Art Classes - Berseni Art Market"),
    "description": pick(pageSeo.description_id || "Jelajahi seluruh koleksi karya seni orisinal Indonesia, kelas melukis online (e-course), dan pendaftaran intimate workshop offline dari Berseni.", pageSeo.description_en || "Explore the entire collection of original Indonesian artworks, online painting classes (e-courses), and offline intimate workshop registrations from Berseni."),
    "isPartOf": {
      "@id": `${SITE_URL}/#website`
    },
    "about": [
      { "@id": `${SITE_URL}/#organization` },
      ...(brandFacts ? [brandFacts] : [])
    ],
    "mainEntity": {
      "@type": "ItemList",
      "name": pick("Katalog Karya Seni & Kelas Melukis", "Artwork Catalog & Painting Classes"),
      "numberOfItems": products.length,
      "itemListElement": products.map((prod, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Product",
          "name": pick(prod.title_id || prod.title_en, prod.title_en || prod.title_id),
          "description": pick(prod.description_id || prod.description_en, prod.description_en || prod.description_id),
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
      "name": pick(pageSeo.geo_faq_q1_id, pageSeo.geo_faq_q1_en || pageSeo.geo_faq_q1_id),
      "acceptedAnswer": {
        "@type": "Answer",
        "text": pick(pageSeo.geo_faq_a1_id, pageSeo.geo_faq_a1_en || pageSeo.geo_faq_a1_id)
      }
    });
  }
  if (pageSeo.geo_faq_q2_id && pageSeo.geo_faq_a2_id) {
    faqList.push({
      "@type": "Question",
      "name": pick(pageSeo.geo_faq_q2_id, pageSeo.geo_faq_q2_en || pageSeo.geo_faq_q2_id),
      "acceptedAnswer": {
        "@type": "Answer",
        "text": pick(pageSeo.geo_faq_a2_id, pageSeo.geo_faq_a2_en || pageSeo.geo_faq_a2_id)
      }
    });
  }
  if (pageSeo.geo_faq_q3_id && pageSeo.geo_faq_a3_id) {
    faqList.push({
      "@type": "Question",
      "name": pick(pageSeo.geo_faq_q3_id, pageSeo.geo_faq_q3_en || pageSeo.geo_faq_q3_id),
      "acceptedAnswer": {
        "@type": "Answer",
        "text": pick(pageSeo.geo_faq_a3_id, pageSeo.geo_faq_a3_en || pageSeo.geo_faq_a3_id)
      }
    });
  }

  const faqJsonLd = faqList.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE_URL}/store#faq`,
    "mainEntity": faqList
  } : null;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": defaultLanguage === 'en' ? "Home" : "Beranda", "item": `${SITE_URL}/` },
      { "@type": "ListItem", "position": 2, "name": pick(pageSeo.title_id || "Galeri & Kelas Seni - Berseni Art Market", pageSeo.title_en || "Gallery & Art Classes - Berseni Art Market"), "item": `${SITE_URL}/store` }
    ]
  };

  return (
    <>
      <JsonLd data={storePageJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      {faqJsonLd && <JsonLd data={faqJsonLd} />}
      <StorePageClient 
        content={content} 
        initialProducts={products}
      />
    </>
  );
}



