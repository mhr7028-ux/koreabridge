import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import AdminUsersClient from './AdminUsersClient';

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);

  // Security check: Only allow admins
  if (!session || (session.user as any).role !== 'admin') {
    redirect('/');
  }

  // Fetch all users, sorted by latest registration
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2rem', color: '#ffc107', margin: 0 }}>👥 User Management</h1>
        <div style={{ background: 'rgba(59, 130, 246, 0.2)', padding: '10px 20px', borderRadius: '8px', color: '#60a5fa' }}>
          Total Users: <strong>{users.length}</strong>
        </div>
      </div>

      <AdminUsersClient initialUsers={users} />
    </div>
  );
}
