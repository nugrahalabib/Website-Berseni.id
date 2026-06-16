import { Montserrat, Dancing_Script } from "next/font/google";
import { LanguageProvider } from "@/components/LanguageContext";
import JsonLd from "@/components/JsonLd";
import "./globals.css";

import FloatingWhatsApp from "@/components/FloatingWhatsApp";

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

export const metadata = {
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
};

// JSON-LD Organization Schema — global untuk semua halaman
// Ini membuat AI generatif mengenali Berseni sebagai entitas organisasi
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "Berseni.id",
  alternateName: "Berseni",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description:
    "Platform edukasi seni rupa Indonesia yang menghubungkan masyarakat umum dengan seniman profesional melalui kelas online, workshop offline, dan karya seni orisinal.",
  foundingDate: "2026",
  sameAs: [
    "https://www.instagram.com/berseni.id",
    "https://www.tiktok.com/@berseni.id",
    "https://lynk.id/berseni.id",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    availableLanguage: ["Indonesian", "English"],
  },
  areaServed: {
    "@type": "Country",
    name: "Indonesia",
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
};

// JSON-LD WebSite Schema — memberi tahu AI bahwa ini adalah situs web resmi
const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: "Berseni.id",
  description:
    "Platform edukasi seni rupa Indonesia — kelas melukis online, workshop offline, dan galeri karya seni orisinal.",
  publisher: {
    "@id": `${SITE_URL}/#organization`,
  },
  inLanguage: ["id-ID", "en-US"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${montserrat.variable} ${dancingScript.variable}`}>
      <body>
        <LanguageProvider>
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
