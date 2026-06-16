import { db } from '@/lib/db';
import StorePageClient from '@/components/StorePageClient';

// Ensure the page fetches latest content from local json/DB on request
export const revalidate = 0;

export const metadata = {
  title: "Galeri & Kelas Seni - Berseni Art Market",
  description: "Jelajahi seluruh koleksi karya seni orisinal Indonesia, kelas melukis online (e-course), dan pendaftaran intimate workshop offline dari Berseni.",
  keywords: "marketplace seni, karya seni, lukisan, kelas online, workshop offline, belajar melukis, berseni, indonesia",
};

export default async function StorePage() {
  const content = await db.get('content') || {};
  const products = await db.get('products') || [];

  return (
    <StorePageClient 
      content={content} 
      initialProducts={products}
    />
  );
}
