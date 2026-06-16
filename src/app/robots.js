export default function robots() {
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://berseni.id';
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
