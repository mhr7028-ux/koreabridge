'use client';

import { useState } from 'react';

export default function AdminHomeworkClient({ initialHomework }: { initialHomework: any[] }) {
  const [homeworks, setHomeworks] = useState(initialHomework);

  const handleAction = async (id: string, action: 'APPROVE' | 'REJECT') => {
    if (!confirm(`이 과제를 ${action === 'APPROVE' ? '승인' : '거절'}하시겠습니까?`)) return;

    try {
      const res = await fetch(`/api/admin/homework/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      if (res.ok) {
        setHomeworks(prev => prev.filter(h => h.id !== id));
      } else {
        alert('처리 중 오류가 발생했습니다.');
      }
    } catch (e) {
      alert('네트워크 오류');
    }
  };

  if (homeworks.length === 0) {
    return (
      <div style={{ background: '#1f2937', padding: '50px', borderRadius: '12px', textAlign: 'center', color: '#9ca3af' }}>
        현재 검사 대기 중인 인스타그램 과제가 없습니다! 🎉
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gap: '20px' }}>
      {homeworks.map((hw) => (
        <div key={hw.id} style={{ background: '#1f2937', padding: '20px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {hw.user.image ? (
              <img src={hw.user.image} alt="Profile" style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
            ) : (
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>👤</div>
            )}
            <div>
              <strong style={{ color: '#fff', fontSize: '1.1rem' }}>{hw.user.name}</strong>
              <div style={{ color: '#9ca3af', fontSize: '0.9rem', marginTop: '5px' }}>
                제출일: {new Date(hw.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <a 
              href={hw.url} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ padding: '8px 16px', background: 'rgba(236, 72, 153, 0.1)', color: '#f472b6', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}
            >
              인스타 확인하기 📸
            </a>
            
            <button 
              onClick={() => handleAction(hw.id, 'APPROVE')}
              style={{ padding: '8px 16px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              승인 (+10P)
            </button>
            
            <button 
              onClick={() => handleAction(hw.id, 'REJECT')}
              style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '8px', cursor: 'pointer' }}
            >
              거절
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
