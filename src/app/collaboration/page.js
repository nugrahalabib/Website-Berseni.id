import { db } from '@/lib/db';
import CollaborationPageClient from '@/components/CollaborationPageClient';

// Ensure the page fetches latest content on request
export const revalidate = 0;

export const metadata = {
  title: "Collaboration - Berseni",
  description: "Buka peluang kolaborasi kreatif bersama Berseni. Kami terbuka untuk brand, komunitas, dan partner venue untuk menghadirkan pengalaman seni terbaik.",
  keywords: "kolaborasi, kerjasama, venue partner, brand collaboration, berseni, event seni",
};

export default async function CollaborationPage() {
  const content = await db.get('content') || {};

  return (
    <CollaborationPageClient 
      content={content} 
    />
  );
}
