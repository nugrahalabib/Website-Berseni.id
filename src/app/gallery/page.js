import { db } from '@/lib/db';
import GalleryPageClient from '@/components/GalleryPageClient';
import JsonLd from '@/components/JsonLd';

export const revalidate = 0;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://berseni.id';

export async function generateMetadata() {
  const content = await db.get('content') || {};
  const defaultLanguage = content.defaultLanguage || 'id';

  const seoPages = await db.get('seo_pages') || {};
  const pageSeo = seoPages['gallery'] || {};

  const title = defaultLanguage === 'en'
    ? (pageSeo.title_en || pageSeo.title_id || 'Activity Gallery - Berseni Workshops & Events')
    : (pageSeo.title_id || pageSeo.title_en || 'Galeri Kegiatan - Workshop & Acara Berseni');

  const description = defaultLanguage === 'en'
    ? (pageSeo.description_en || pageSeo.description_id || 'Photo documentation of Berseni painting workshops, art classes, and community activities across Indonesia.')
    : (pageSeo.description_id || pageSeo.description_en || 'Dokumentasi foto workshop melukis, kelas seni, dan kegiatan komunitas Berseni di berbagai kota di Indonesia.');

  const keywords = defaultLanguage === 'en'
    ? (pageSeo.keywords_en || pageSeo.keywords_id || 'berseni gallery, painting workshop photos, art community indonesia, art event documentation')
    : (pageSeo.keywords_id || pageSeo.keywords_en || 'galeri berseni, foto workshop melukis, kegiatan seni, dokumentasi acara seni, komunitas seni indonesia');

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/gallery`,
      type: 'website',
      images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${SITE_URL}/og-image.jpg`],
    },
    alternates: { canonical: `${SITE_URL}/gallery` },
    other: {
      'geo.region': pageSeo.geo_region || 'ID-JK',
      'geo.placename': pageSeo.geo_placename || 'Jakarta',
      'geo.position': pageSeo.geo_position || '-6.2088;106.8456',
      ICBM: pageSeo.geo_icbm || '-6.2088, 106.8456',
    },
  };
}

export default async function GalleryPage() {
  const content = await db.get('content') || {};
  const items = await db.get('gallery') || [];
  const seoPages = await db.get('seo_pages') || {};
  const pageSeo = seoPages['gallery'] || {};

  const defaultLanguage = content?.defaultLanguage || 'id';
  const pick = (id, en) => (defaultLanguage === 'en' ? (en || id) : (id || en));

  const galleryJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    '@id': `${SITE_URL}/gallery#webpage`,
    url: `${SITE_URL}/gallery`,
    name: pick(
      pageSeo.title_id || 'Galeri Kegiatan Berseni',
      pageSeo.title_en || 'Berseni Activity Gallery'
    ),
    description: pick(
      pageSeo.description_id || 'Dokumentasi foto workshop melukis dan kegiatan komunitas Berseni.',
      pageSeo.description_en || 'Photo documentation of Berseni painting workshops and community activities.'
    ),
    isPartOf: { '@id': `${SITE_URL}/#website` },
    about: { '@id': `${SITE_URL}/#organization` },
    image: items.slice(0, 20).map((item) => ({
      '@type': 'ImageObject',
      contentUrl: item.image?.startsWith('http') ? item.image : `${SITE_URL}${item.image}`,
      name: pick(item.title_id || item.title_en || '', item.title_en || item.title_id || ''),
      description: pick(item.caption_id || item.caption_en || '', item.caption_en || item.caption_id || ''),
    })),
    inLanguage: ['id-ID', 'en-US'],
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: defaultLanguage === 'en' ? 'Home' : 'Beranda', item: `${SITE_URL}/` },
      {
        '@type': 'ListItem',
        position: 2,
        name: pick(pageSeo.title_id || 'Galeri Kegiatan', pageSeo.title_en || 'Activity Gallery'),
        item: `${SITE_URL}/gallery`,
      },
    ],
  };

  return (
    <>
      <JsonLd data={galleryJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <GalleryPageClient content={content} initialItems={items} />
    </>
  );
}
