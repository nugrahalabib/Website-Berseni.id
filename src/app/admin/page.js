import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { decryptSession } from '@/lib/auth';
import DashboardClient from '@/components/Admin/DashboardClient';

export const metadata = {
  title: 'Dashboard Admin | Berseni.id',
  description: 'Halaman dashboard admin Berseni.id untuk mengelola produk dan konten.',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('berseni_session')?.value;
  const session = decryptSession(token);

  // Jika session tidak valid atau bukan admin, redirect ke halaman login
  if (!session || session.role !== 'admin') {
    redirect('/admin/login');
  }

  return <DashboardClient />;
}
