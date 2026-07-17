import { cookies } from "next/headers";
import { Montserrat, Dancing_Script } from "next/font/google";
import { LanguageProvider } from "@/components/LanguageContext";
import JsonLd from "@/components/JsonLd";
import "./globals.css";

import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { db } from "@/lib/db";
import MetaPixelTracker from "@/components/MetaPixelTracker";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
});

const dancingScript = Dancing_Script({
  variable: "--font-dancing-script",
  subsets: ["latin"],
  weight: ["700"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://berseni.id";

export async function generateMetadata() {
  const seoPages = await db.get('seo_pages') || {};
  const globalSettings = seoPages.global || {};
  const googleVerification = globalSettings.google_site_verification || '';

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: "Berseni - A World of Art For Everyone",
      template: "%s | Berseni.id",
    },
    description:
      "Platform penghubung publik dan seniman Indonesia. Temukan kelas melukis online, workshop offline, dan karya seni orisinal terbaik langsung dari para maestro.",
    keywords: [
      "seni", "lukis", "kelas online", "workshop offline",
      "lukisan indonesia", "belajar melukis", "berseni",
      "art class indonesia", "painting workshop jakarta",
    ],
    authors: [{ name: "Berseni.id", url: SITE_URL }],
    creator: "Berseni.id",
    publisher: "Berseni.id",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: "id_ID",
      alternateLocale: "en_US",
      url: SITE_URL,
      siteName: "Berseni.id",
      title: "Berseni - A World of Art For Everyone",
      description:
        "Platform penghubung publik dan seniman Indonesia. Temukan kelas melukis online, workshop offline, dan karya seni orisinal terbaik.",
      images: [
        {
          url: `${SITE_URL}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: "Berseni - A World of Art For Everyone",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Berseni - A World of Art For Everyone",
      description:
        "Platform penghubung publik dan seniman Indonesia. Kelas melukis online, workshop offline, dan karya seni orisinal.",
      images: [`${SITE_URL}/og-image.jpg`],
    },
    alternates: {
      canonical: SITE_URL,
    },
    other: {
      "geo.region": "ID-JK",
      "geo.placename": "Jakarta, Indonesia",
      "geo.position": "-6.2088;106.8456",
      "ICBM": "-6.2088, 106.8456",
    },
    verification: {
      google: googleVerification || undefined,
    }
  };
}

// JSON-LD Organization Schema — global untuk semua halaman
// Ini membuat AI generatif mengenali Berseni sebagai entitas organisasi
const buildOrganizationJsonLd = (pick) => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "Berseni.id",
  alternateName: "Berseni",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description: pick("Platform edukasi seni rupa Indonesia yang menghubungkan masyarakat umum dengan seniman profesional melalui kelas online, workshop offline, dan karya seni orisinal.", "Indonesian visual art education platform connecting the general public with professional artists through online classes, offline workshops, and original artwork."),
  foundingDate: "2026",
  sameAs: [
    "https://www.instagram.com/berseni.id",
    "https://www.tiktok.com/@berseni.id",
    "https://lynk.id/berseni.id",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "availableLanguage": ["Indonesian", "English"],
  },
  areaServed: {
    "@type": "Country",
    "name": "Indonesia",
  },
  knowsAbout: [
    "Seni Lukis",
    "Painting Classes",
    "Art Workshops",
    "Indonesian Art",
    "Acrylic Painting",
    "Oil Painting",
    "Art Education",
  ],
});

// JSON-LD WebSite Schema — memberi tahu AI bahwa ini adalah situs web resmi
const buildWebsiteJsonLd = (pick) => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: "Berseni.id",
  description: pick("Platform edukasi seni rupa Indonesia — kelas melukis online, workshop offline, dan galeri karya seni orisinal.", "Indonesian visual art education platform — online painting classes, offline workshops, and original art gallery."),
  publisher: {
    "@id": `${SITE_URL}/#organization`,
  },
  inLanguage: ["id-ID", "en-US"],
});

// Ubah hex admin -> "r, g, b" untuk varian --color-*-rgb (dipakai di rgba()).
function hexToRgbParts(hex) {
  if (typeof hex !== 'string') return null;
  const m = hex.trim().replace(/^#/, '');
  if (!/^[0-9a-fA-F]{6}$/.test(m)) return null;
  return `${parseInt(m.slice(0, 2), 16)}, ${parseInt(m.slice(2, 4), 16)}, ${parseInt(m.slice(4, 6), 16)}`;
}

// Bangun override CSS variable dari warna brand yang di-set admin. HANYA hex 6-digit
// yang lolos regex yang di-inject (mencegah CSS/HTML injection lewat field admin).
// Meng-override --color-<name> DAN --color-<name>-rgb agast token & rgba() konsisten.
function buildThemeStyle(content) {
  const brand = [
    ['tosca', content?.theme_tosca],
    ['maroon', content?.theme_maroon],
    ['kunyit', content?.theme_kunyit],
  ];
  let vars = '';
  for (const [name, value] of brand) {
    if (typeof value === 'string' && /^#[0-9a-fA-F]{6}$/.test(value.trim())) {
      const hex = value.trim();
      vars += `--color-${name}:${hex};`;
      const rgb = hexToRgbParts(hex);
      if (rgb) vars += `--color-${name}-rgb:${rgb};`;
    }
  }
  return vars ? `:root{${vars}}` : '';
}

export default async function RootLayout({ children }) {
  const seoPages = await db.get('seo_pages') || {};
  const globalSettings = seoPages.global || {};
  const pixelId = (globalSettings.meta_pixel_enabled === 'true' || globalSettings.meta_pixel_enabled === true) ? globalSettings.meta_pixel_id : '';

  const content = await db.get('content') || {};

  // Bahasa ditentukan di SERVER dari cookie pengunjung, bukan localStorage yang
  // baru terbaca setelah hydration. Ini menghilangkan flash/kedip bahasa dan
  // membuat <html lang> benar sejak paint pertama. Crawler (tanpa cookie) tetap
  // mendapat bahasa default situs.
  const cookieStore = await cookies();
  const cookieLang = cookieStore.get('berseni_lang')?.value;
  const defaultLanguage = (cookieLang === 'id' || cookieLang === 'en')
    ? cookieLang
    : (content.defaultLanguage || 'id');

  const pick = (id, en) => (defaultLanguage === 'en' ? (en || id) : (id || en));

  const organizationJsonLd = buildOrganizationJsonLd(pick);
  const websiteJsonLd = buildWebsiteJsonLd(pick);

  // Override warna brand dari admin (kosong = pakai default globals.css).
  const themeStyle = buildThemeStyle(content);

  return (
    <html lang={defaultLanguage} className={`${montserrat.variable} ${dancingScript.variable}`}>
      <body>
        {themeStyle ? <style dangerouslySetInnerHTML={{ __html: themeStyle }} /> : null}
        <a href="#main-content" className="skip-link">
          {pick('Lewati ke konten utama', 'Skip to main content')}
        </a>
        <LanguageProvider defaultLanguage={defaultLanguage} initialContent={content}>
          {pixelId && <MetaPixelTracker pixelId={pixelId} />}
          {/* Global JSON-LD Structured Data untuk SEO + GEO */}
          <JsonLd data={organizationJsonLd} />
          <JsonLd data={websiteJsonLd} />
          {children}
          <FloatingWhatsApp />
        </LanguageProvider>
      </body>
    </html>
  );
}

