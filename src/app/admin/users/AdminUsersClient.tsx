'use client';

import { useState } from 'react';

export default function AdminUsersClient({ initialUsers }: { initialUsers: any[] }) {
  const [users, setUsers] = useState(initialUsers);

  const toggleRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    if (!confirm(`사용자의 권한을 ${newRole}로 변경하시겠습니까?`)) return;

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      });
      
      if (res.ok) {
        setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
        alert('권한이 성공적으로 변경되었습니다.');
      } else {
        alert('권한 변경에 실패했습니다.');
      }
    } catch (error) {
      alert('오류가 발생했습니다.');
    }
  };

  return (
    <div style={{ overflowX: 'auto', background: '#1f2937', borderRadius: '12px', border: '1px solid #374151' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ background: '#374151', color: '#d1d5db' }}>
            <th style={{ padding: '15px', borderBottom: '1px solid #4b5563' }}>이름 (Name)</th>
            <th style={{ padding: '15px', borderBottom: '1px solid #4b5563' }}>이메일 (Email)</th>
            <th style={{ padding: '15px', borderBottom: '1px solid #4b5563' }}>권한 (Role)</th>
            <th style={{ padding: '15px', borderBottom: '1px solid #4b5563' }}>SNS 연락처</th>
            <th style={{ padding: '15px', borderBottom: '1px solid #4b5563' }}>가입일</th>
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
                <button 
                  onClick={() => toggleRole(user.id, user.role)}
                  style={{
                    padding: '4px 10px', borderRadius: '4px', fontSize: '0.85rem', cursor: 'pointer', border: '1px solid',
                    background: user.role === 'admin' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                    borderColor: user.role === 'admin' ? '#ef4444' : '#3b82f6',
                    color: user.role === 'admin' ? '#fca5a5' : '#93c5fd',
                    transition: 'all 0.2s'
                  }}
                  title="클릭하여 권한 변경"
                >
                  {user.role} 🔄
                </button>
              </td>
              <td style={{ padding: '15px' }}>
                {user.snsType && user.snsId ? (
                  <div>
                    <span style={{ fontSize: '0.85rem', color: '#9ca3af', marginRight: '6px' }}>[{user.snsType}]</span>
                    <strong>{user.snsId}</strong>
                  </div>
                ) : (
                  <span style={{ color: '#6b7280', fontStyle: 'italic' }}>미입력</span>
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
  );
}
