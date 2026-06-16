import { db } from '@/lib/db';
import AboutPageClient from '@/components/AboutPageClient';
import JsonLd from '@/components/JsonLd';

// Ensure the page fetches latest content from local json/DB on request
export const revalidate = 0;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://berseni.id';

export async function generateMetadata() {
  const seoPages = await db.get('seo_pages') || {};
  const pageSeo = seoPages['about'] || {};

  const title = pageSeo.title_id || "Tentang Kami - Berseni";
  const description = pageSeo.description_id || "Temukan kisah kami, visi misi, dan komitmen Berseni dalam menjadi jembatan global utama antara masyarakat umum dan seniman lokal Indonesia.";
  const keywords = pageSeo.keywords_id || "tentang kami, berseni, visi misi, komunitas seni, indonesia, melukis";

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/about`,
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
      canonical: `${SITE_URL}/about`,
    },
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

  const seoPages = await db.get('seo_pages') || {};
  const pageSeo = seoPages['about'] || {};

  const brandFacts = (pageSeo.geo_facts_id || pageSeo.geo_facts_en) ? {
    "@type": "CreativeWork",
    "name": "Core About Facts & AI Citation Reference",
    "text": [
      { "@value": pageSeo.geo_facts_id || "", "@language": "id" },
      { "@value": pageSeo.geo_facts_en || "", "@language": "en" }
    ]
  } : null;

  const aboutPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${SITE_URL}/about#webpage`,
    "url": `${SITE_URL}/about`,
    "name": [
      { "@value": pageSeo.title_id || "Tentang Kami - Berseni", "@language": "id" },
      { "@value": pageSeo.title_en || "About Us - Berseni", "@language": "en" }
    ],
    "description": [
      { "@value": pageSeo.description_id || "Temukan kisah kami, visi misi, dan komitmen Berseni dalam menjadi jembatan global utama antara masyarakat umum dan seniman lokal Indonesia.", "@language": "id" },
      { "@value": pageSeo.description_en || "Discover our story, vision, mission, and commitment in becoming the primary global bridge between the general public and local Indonesian artists.", "@language": "en" }
    ],
    "isPartOf": {
      "@id": `${SITE_URL}/#website`
    },
    "about": [
      { "@id": `${SITE_URL}/#organization` },
      ...(brandFacts ? [brandFacts] : [])
    ],
    "mainEntity": {
      "@id": `${SITE_URL}/#organization`
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
    "@id": `${SITE_URL}/about#faq`,
    "mainEntity": faqList
  } : null;

  return (
    <>
      <JsonLd data={aboutPageJsonLd} />
      {faqJsonLd && <JsonLd data={faqJsonLd} />}
      <AboutPageClient 
        content={content} 
      />
    </>
  );
}



