import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check the session
  const session = await getServerSession(authOptions);

  // If not logged in, or not an admin, kick them to the home page
  if (!session || (session.user as any).role !== 'admin') {
    redirect('/');
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0a0b10' }}>
      <aside style={{ width: '250px', borderRight: '1px solid #1f2937', padding: '20px' }}>
        <h2 style={{ color: '#ffc107', marginBottom: '30px' }}>🛡️ Admin Panel</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <Link href="/admin" style={{ color: '#e5e7eb', textDecoration: 'none' }}>Dashboard</Link>
          <Link href="/admin/classes" style={{ color: '#e5e7eb', textDecoration: 'none' }}>Manage Classes & Materials</Link>
          <Link href="/admin/users" style={{ color: '#e5e7eb', textDecoration: 'none' }}>User Management</Link>
          <Link href="/admin/buddies" style={{ color: '#e5e7eb', textDecoration: 'none' }}>🤝 Busan Buddy Management</Link>
          <Link href="/admin/promotions" style={{ color: '#e5e7eb', textDecoration: 'none' }}>🎉 Promotions (Festivals)</Link>
          <Link href="/admin/homework" style={{ color: '#e5e7eb', textDecoration: 'none' }}>📸 Instagram Homework</Link>
          <Link href="/admin/inquiries" style={{ color: '#e5e7eb', textDecoration: 'none' }}>📞 Customer Inquiries</Link>
          <Link href="/" style={{ color: '#9ca3af', textDecoration: 'none', marginTop: '30px' }}>← Back to Website</Link>
        </nav>
      </aside>
      <main style={{ flex: 1, padding: '40px' }}>
        {children}
      </main>
    </div>
  );
}
