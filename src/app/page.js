import { db } from '@/lib/db';
import LandingPageClient from '@/components/LandingPageClient';

// Memaksa Next.js untuk selalu mengambil data terbaru (bukan static cache) saat dideploy
export const revalidate = 0;

export default async function Home() {
  // Ambil teks halaman dan daftar produk dari database (Vercel KV / local json fallback)
  const content = await db.get('content');
  const products = await db.get('products') || [];

  return (
    <LandingPageClient 
      initialContent={content} 
      initialProducts={products} 
    />
  );
}
