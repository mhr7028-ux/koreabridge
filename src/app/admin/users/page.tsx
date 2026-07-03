import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

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

      <div style={{ overflowX: 'auto', background: '#1f2937', borderRadius: '12px', border: '1px solid #374151' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#374151', color: '#d1d5db' }}>
              <th style={{ padding: '15px', borderBottom: '1px solid #4b5563' }}>Name</th>
              <th style={{ padding: '15px', borderBottom: '1px solid #4b5563' }}>Email</th>
              <th style={{ padding: '15px', borderBottom: '1px solid #4b5563' }}>Role</th>
              <th style={{ padding: '15px', borderBottom: '1px solid #4b5563' }}>SNS Contact</th>
              <th style={{ padding: '15px', borderBottom: '1px solid #4b5563' }}>Joined At</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} style={{ borderBottom: '1px solid #374151', color: '#e5e7eb' }}>
                <td style={{ padding: '15px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {user.image ? (
                      <img src={user.image} alt={user.name || 'User'} style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                    ) : (
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#4b5563', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        👤
                      </div>
                    )}
                    {user.name || 'Unknown User'}
                  </div>
                </td>
                <td style={{ padding: '15px' }}>{user.email || 'N/A'}</td>
                <td style={{ padding: '15px' }}>
                  <span style={{
                    padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem',
                    background: user.role === 'admin' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                    color: user.role === 'admin' ? '#fca5a5' : '#93c5fd'
                  }}>
                    {user.role}
                  </span>
                </td>
                <td style={{ padding: '15px' }}>
                  {user.snsType && user.snsId ? (
                    <div>
                      <span style={{ fontSize: '0.85rem', color: '#9ca3af', marginRight: '6px' }}>[{user.snsType}]</span>
                      <strong>{user.snsId}</strong>
                    </div>
                  ) : (
                    <span style={{ color: '#6b7280', fontStyle: 'italic' }}>Not provided</span>
                  )}
                </td>
                <td style={{ padding: '15px', color: '#9ca3af', fontSize: '0.9rem' }}>
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: '30px', textAlign: 'center', color: '#6b7280' }}>
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
