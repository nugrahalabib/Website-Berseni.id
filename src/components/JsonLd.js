'use client';

/**
 * Komponen untuk merender JSON-LD Structured Data di <head>.
 * Digunakan untuk SEO klasik dan GEO (Generative Engine Optimization).
 * AI generatif (Google AI Overview, ChatGPT, Perplexity) akan membaca
 * structured data ini untuk memahami entitas, konteks, dan hubungan konten.
 */
export default function JsonLd({ data }) {
  if (!data) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
