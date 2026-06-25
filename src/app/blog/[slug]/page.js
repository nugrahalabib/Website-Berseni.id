import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import BlogPostPageClient from '@/components/BlogPostPageClient';
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

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const posts = await db.get('posts') || [];
  const post = posts.find((p) => p.slug === slug);

  const content = await db.get('content') || {};
  const defaultLanguage = content.content?.defaultLanguage || content.defaultLanguage || 'id';

  if (!post) {
    return {
      title: defaultLanguage === 'en' ? "Article Not Found | Berseni Blog" : "Artikel Tidak Ditemukan | Berseni Blog"
    };
  }

  const title = defaultLanguage === 'en'
    ? (post.seoTitle_en || post.title_en || post.seoTitle_id || post.title_id)
    : (post.seoTitle_id || post.title_id || post.seoTitle_en || post.title_en);

  const description = defaultLanguage === 'en'
    ? (post.seoDescription_en || post.excerpt_en || post.seoDescription_id || post.excerpt_id)
    : (post.seoDescription_id || post.excerpt_id || post.seoDescription_en || post.excerpt_en);

  const keywords = defaultLanguage === 'en'
    ? (post.seoKeywords_en || "blog, article, berseni")
    : (post.seoKeywords_id || "blog, artikel, berseni");
  const postImage = post.image ? (post.image.startsWith('http') ? post.image : `${SITE_URL}${post.image}`) : `${SITE_URL}/og-image.jpg`;

  return {
    title: `${title} | Berseni Blog`,
    description: description,
    keywords: keywords,
    openGraph: {
      title: `${title} | Berseni Blog`,
      description: description,
      url: `${SITE_URL}/blog/${slug}`,
      type: "article",
      publishedTime: post.date ? convertDate(post.date) : undefined,
      authors: ["Berseni.id"],
      images: [{ url: postImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Berseni Blog`,
      description: description,
      images: [postImage],
    },
    alternates: {
      canonical: `${SITE_URL}/blog/${slug}`,
    },
    other: {
      "geo.region": "ID-JK",
      "geo.placename": "Jakarta",
      "geo.position": "-6.2088;106.8456",
      "ICBM": "-6.2088, 106.8456"
    }
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const posts = await db.get('posts') || [];
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const content = await db.get('content') || {};
  const postImage = post.image ? (post.image.startsWith('http') ? post.image : `${SITE_URL}${post.image}`) : `${SITE_URL}/og-image.jpg`;

  const blogPostJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${SITE_URL}/blog/${slug}#post`,
    "isPartOf": {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${slug}`
    },
    "headline": [
      { "@value": post.title_id || post.title_en, "@language": "id" },
      { "@value": post.title_en || post.title_id, "@language": "en" }
    ],
    "description": [
      { "@value": post.excerpt_id || post.excerpt_en, "@language": "id" },
      { "@value": post.excerpt_en || post.excerpt_id, "@language": "en" }
    ],
    "image": postImage,
    "datePublished": post.date ? convertDate(post.date) : undefined,
    "author": {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      "name": "Berseni"
    },
    "publisher": {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      "name": "Berseni"
    },
    "mainEntityOfPage": `${SITE_URL}/blog/${slug}`,
    "articleBody": [
      { "@value": post.content_id || post.content_en, "@language": "id" },
      { "@value": post.content_en || post.content_id, "@language": "en" }
    ],
    "inLanguage": ["id-ID", "en-US"]
  };

  return (
    <>
      <JsonLd data={blogPostJsonLd} />
      <BlogPostPageClient content={content} post={post} />
    </>
  );
}



