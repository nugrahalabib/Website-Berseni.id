import { db } from '@/lib/db';
import CollaborationPageClient from '@/components/CollaborationPageClient';
import JsonLd from '@/components/JsonLd';

// Ensure the page fetches latest content on request
export const revalidate = 0;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://berseni.id';

export async function generateMetadata() {
  const seoPages = await db.get('seo_pages') || {};
  const pageSeo = seoPages['collaboration'] || {};

  const title = pageSeo.title_id || "Kolaborasi Kemitraan - Berseni";
  const description = pageSeo.description_id || "Buka peluang kolaborasi kreatif bersama Berseni. Kami terbuka untuk brand, komunitas, dan partner venue untuk menghadirkan pengalaman seni terbaik.";
  const keywords = pageSeo.keywords_id || "kolaborasi, kerjasama, venue partner, brand collaboration, berseni, event seni";

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

  const collaborationPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE_URL}/collaboration#webpage`,
    "url": `${SITE_URL}/collaboration`,
    "name": [
      { "@value": pageSeo.title_id || "Kolaborasi Kemitraan - Berseni", "@language": "id" },
      { "@value": pageSeo.title_en || "Partnership Collaboration - Berseni", "@language": "en" }
    ],
    "description": [
      { "@value": pageSeo.description_id || "Buka peluang kolaborasi kreatif bersama Berseni. Kami terbuka untuk brand, komunitas, dan partner venue untuk menghadirkan pengalaman seni terbaik.", "@language": "id" },
      { "@value": pageSeo.description_en || "Open creative collaboration opportunities with Berseni. We are open for brands, communities, and venue partners to bring the best art experiences.", "@language": "en" }
    ],
    "isPartOf": {
      "@id": `${SITE_URL}/#website`
    },
    "about": {
      "@id": `${SITE_URL}/#organization`
    },
    "inLanguage": ["id-ID", "en-US"]
  };

  return (
    <>
      <JsonLd data={collaborationPageJsonLd} />
      <CollaborationPageClient 
        content={content} 
      />
    </>
  );
}


