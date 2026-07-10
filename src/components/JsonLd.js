'use client';

/**
 * Komponen untuk merender JSON-LD Structured Data di <head>.
 * Digunakan untuk SEO klasik dan GEO (Generative Engine Optimization).
 * AI generatif (Google AI Overview, ChatGPT, Perplexity) akan membaca
 * structured data ini untuk memahami entitas, konteks, dan hubungan konten.
 */
export default function JsonLd({ data }) {
  if (!data) return null;

  // Cegah breakout </script> / injeksi HTML dari field admin (stored XSS):
  // escape <, >, & menjadi escape-unicode yang aman di dalam <script>.
  const json = JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
