import { db } from '@/lib/db';
import CollaborationPageClient from '@/components/CollaborationPageClient';
import JsonLd from '@/components/JsonLd';

// Ensure the page fetches latest content on request
export const revalidate = 0;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://berseni.id';

export async function generateMetadata() {
  const content = await db.get('content') || {};
  const defaultLanguage = content.content?.defaultLanguage || content.defaultLanguage || 'id';

  const seoPages = await db.get('seo_pages') || {};
  const pageSeo = seoPages['collaboration'] || {};

  const title = defaultLanguage === 'en'
    ? (pageSeo.title_en || pageSeo.title_id || "Partnership Collaboration - Berseni")
    : (pageSeo.title_id || pageSeo.title_en || "Kolaborasi Kemitraan - Berseni");

  const description = defaultLanguage === 'en'
    ? (pageSeo.description_en || pageSeo.description_id || "Open creative collaboration opportunities with Berseni. We are open for brands, communities, and venue partners to bring the best art experiences.")
    : (pageSeo.description_id || pageSeo.description_en || "Buka peluang kolaborasi kreatif bersama Berseni. Kami terbuka untuk brand, komunitas, dan partner venue untuk menghadirkan pengalaman seni terbaik.");

  const keywords = defaultLanguage === 'en'
    ? (pageSeo.keywords_en || pageSeo.keywords_id || "collaboration, partnership, venue partner, brand collaboration, berseni, art event")
    : (pageSeo.keywords_id || pageSeo.keywords_en || "kolaborasi, kerjasama, venue partner, brand collaboration, berseni, event seni");

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/collaboration`,
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
      canonical: `${SITE_URL}/collaboration`,
    },
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

  const seoPages = await db.get('seo_pages') || {};
  const pageSeo = seoPages['collaboration'] || {};

  const defaultLanguage = content?.content?.defaultLanguage || content?.defaultLanguage || 'id';
  const pick = (id, en) => (defaultLanguage === 'en' ? (en || id) : (id || en));

  const brandFacts = (pageSeo.geo_facts_id || pageSeo.geo_facts_en) ? {
    "@type": "CreativeWork",
    "name": "Core Collaboration Facts & AI Citation Reference",
    "text": pick(pageSeo.geo_facts_id || "", pageSeo.geo_facts_en || "")
  } : null;

  const collaborationPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE_URL}/collaboration#webpage`,
    "url": `${SITE_URL}/collaboration`,
    "name": pick(pageSeo.title_id || "Kolaborasi Kemitraan - Berseni", pageSeo.title_en || "Partnership Collaboration - Berseni"),
    "description": pick(pageSeo.description_id || "Buka peluang kolaborasi kreatif bersama Berseni. Kami terbuka untuk brand, komunitas, dan partner venue untuk menghadirkan pengalaman seni terbaik.", pageSeo.description_en || "Open creative collaboration opportunities with Berseni. We are open for brands, communities, and venue partners to bring the best art experiences."),
    "isPartOf": {
      "@id": `${SITE_URL}/#website`
    },
    "about": [
      { "@id": `${SITE_URL}/#organization` },
      ...(brandFacts ? [brandFacts] : [])
    ],
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
    "@id": `${SITE_URL}/collaboration#faq`,
    "mainEntity": faqList
  } : null;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": defaultLanguage === 'en' ? "Home" : "Beranda", "item": `${SITE_URL}/` },
      { "@type": "ListItem", "position": 2, "name": pick(pageSeo.title_id || "Kolaborasi Kemitraan - Berseni", pageSeo.title_en || "Partnership Collaboration - Berseni"), "item": `${SITE_URL}/collaboration` }
    ]
  };

  return (
    <>
      <JsonLd data={collaborationPageJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      {faqJsonLd && <JsonLd data={faqJsonLd} />}
      <CollaborationPageClient 
        content={content} 
      />
    </>
  );
}



