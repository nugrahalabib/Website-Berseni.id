import { db } from '@/lib/db';
import BlogPageClient from '@/components/BlogPageClient';
import JsonLd from '@/components/JsonLd';

export const revalidate = 0;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://berseni.id';

function convertDate(dateStr) {
  if (!dateStr) return undefined;
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    const [day, month, year] = parts;
    return `${year}-${month}-${day}`;
  }
  return dateStr;
}

export async function generateMetadata() {
  const content = await db.get('content') || {};
  const defaultLanguage = content.content?.defaultLanguage || content.defaultLanguage || 'id';

  const seoPages = await db.get('seo_pages') || {};
  const pageSeo = seoPages['blog'] || {};

  const title = defaultLanguage === 'en'
    ? (pageSeo.title_en || pageSeo.title_id || "Articles & Art Notes - Berseni Blog")
    : (pageSeo.title_id || pageSeo.title_en || "Artikel & Catatan Seni - Berseni Blog");

  const description = defaultLanguage === 'en'
    ? (pageSeo.description_en || pageSeo.description_id || "Insights around painting techniques, art history, and creative processes of Indonesian artists.")
    : (pageSeo.description_id || pageSeo.description_en || "Wawasan seputar teknik melukis, sejarah seni rupa, dan proses kreatif dari para seniman Indonesia.");

  const keywords = defaultLanguage === 'en'
    ? (pageSeo.keywords_en || pageSeo.keywords_id || "art blog, painting techniques, art history, creative process, indonesian artists, watercolor, acrylic")
    : (pageSeo.keywords_id || pageSeo.keywords_en || "blog seni, teknik melukis, sejarah seni, proses kreatif, seniman indonesia, cat air, akrilik");

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/blog`,
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
      canonical: `${SITE_URL}/blog`,
    },
    other: {
      "geo.region": pageSeo.geo_region || "ID-JK",
      "geo.placename": pageSeo.geo_placename || "Jakarta",
      "geo.position": pageSeo.geo_position || "-6.2088;106.8456",
      "ICBM": pageSeo.geo_icbm || "-6.2088, 106.8456"
    }
  };
}

export default async function BlogPage() {
  const content = await db.get('content') || {};
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
  const pageSeo = seoPages['blog'] || {};

  const brandFacts = (pageSeo.geo_facts_id || pageSeo.geo_facts_en) ? {
    "@type": "CreativeWork",
    "name": "Core Blog Facts & AI Citation Reference",
    "text": [
      { "@value": pageSeo.geo_facts_id || "", "@language": "id" },
      { "@value": pageSeo.geo_facts_en || "", "@language": "en" }
    ]
  } : null;

  const blogPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${SITE_URL}/blog#blog`,
    "url": `${SITE_URL}/blog`,
    "name": [
      { "@value": pageSeo.title_id || "Artikel & Catatan Seni - Berseni Blog", "@language": "id" },
      { "@value": pageSeo.title_en || "Articles & Art Notes - Berseni Blog", "@language": "en" }
    ],
    "description": [
      { "@value": pageSeo.description_id || "Wawasan seputar teknik melukis, sejarah seni rupa, dan proses kreatif dari para seniman Indonesia.", "@language": "id" },
      { "@value": pageSeo.description_en || "Insights around painting techniques, art history, and creative processes of Indonesian artists.", "@language": "en" }
    ],
    "isPartOf": {
      "@id": `${SITE_URL}/#website`
    },
    "publisher": {
      "@id": `${SITE_URL}/#organization`
    },
    "about": brandFacts ? [brandFacts] : undefined,
    "blogPost": posts.map((post) => ({
      "@type": "BlogPosting",
      "headline": [
        { "@value": post.title_id || post.title_en, "@language": "id" },
        { "@value": post.title_en || post.title_id, "@language": "en" }
      ],
      "description": [
        { "@value": post.excerpt_id || post.excerpt_en, "@language": "id" },
        { "@value": post.excerpt_en || post.excerpt_id, "@language": "en" }
      ],
      "datePublished": post.date ? convertDate(post.date) : undefined,
      "image": post.image.startsWith('http') ? post.image : `${SITE_URL}${post.image}`,
      "url": `${SITE_URL}/blog/${post.slug}`
    })),
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
    "@id": `${SITE_URL}/blog#faq`,
    "mainEntity": faqList
  } : null;

  return (
    <>
      <JsonLd data={blogPageJsonLd} />
      {faqJsonLd && <JsonLd data={faqJsonLd} />}
      <BlogPageClient content={content} initialPosts={posts} />
    </>
  );
}




