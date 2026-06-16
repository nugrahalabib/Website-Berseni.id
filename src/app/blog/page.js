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
  const seoPages = await db.get('seo_pages') || {};
  const pageSeo = seoPages['blog'] || {};

  const title = pageSeo.title_id || "Artikel & Catatan Seni - Berseni Blog";
  const description = pageSeo.description_id || "Wawasan seputar teknik melukis, sejarah seni rupa, dan proses kreatif dari para seniman Indonesia.";
  const keywords = pageSeo.keywords_id || "blog seni, teknik melukis, sejarah seni, proses kreatif, seniman indonesia, cat air, akrilik";

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
  const posts = await db.get('posts') || [];

  const seoPages = await db.get('seo_pages') || {};
  const pageSeo = seoPages['blog'] || {};
  const title = pageSeo.title_id || "Artikel & Catatan Seni - Berseni Blog";
  const description = pageSeo.description_id || "Wawasan seputar teknik melukis, sejarah seni rupa, dan proses kreatif dari para seniman Indonesia.";

  const blogPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${SITE_URL}/blog#blog`,
    "url": `${SITE_URL}/blog`,
    "name": title,
    "description": description,
    "isPartOf": {
      "@id": `${SITE_URL}/#website`
    },
    "publisher": {
      "@id": `${SITE_URL}/#organization`
    },
    "blogPost": posts.map((post) => ({
      "@type": "BlogPosting",
      "headline": post.title_id || post.title_en,
      "description": post.excerpt_id || post.excerpt_en,
      "datePublished": post.date ? convertDate(post.date) : undefined,
      "image": post.image.startsWith('http') ? post.image : `${SITE_URL}${post.image}`,
      "url": `${SITE_URL}/blog/${post.slug}`
    })),
    "inLanguage": ["id-ID", "en-US"]
  };

  return (
    <>
      <JsonLd data={blogPageJsonLd} />
      <BlogPageClient initialPosts={posts} />
    </>
  );
}


