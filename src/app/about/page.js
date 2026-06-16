import { db } from '@/lib/db';
import AboutPageClient from '@/components/AboutPageClient';

// Ensure the page fetches latest content from local json/DB on request
export const revalidate = 0;

export const metadata = {
  title: "About Us - Berseni",
  description: "Temukan kisah kami, visi misi, dan komitmen Berseni dalam menjadi jembatan global utama antara masyarakat umum dan seniman lokal Indonesia.",
  keywords: "tentang kami, berseni, visi misi, komunitas seni, indonesia, melukis",
};

export default async function AboutPage() {
  const content = await db.get('content');

  return (
    <AboutPageClient 
      content={content} 
    />
  );
}
