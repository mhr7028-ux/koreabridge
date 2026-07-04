'use client';

import { useState, useEffect } from 'react';

type Inquiry = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
};

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const res = await fetch('/api/inquiries');
      const data = await res.json();
      if (data.success) {
        setInquiries(data.inquiries);
      }
    } catch (error) {
      console.error('Failed to fetch inquiries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'PENDING' ? 'RESOLVED' : 'PENDING';
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) fetchInquiries();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) return;
    try {
      const res = await fetch(`/api/inquiries/${id}`, { method: 'DELETE' });
      if (res.ok) fetchInquiries();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2rem', color: '#ffc107', margin: 0 }}>📞 Customer Inquiries</h1>
        <div style={{ background: 'rgba(239, 68, 68, 0.2)', padding: '10px 20px', borderRadius: '8px', color: '#fca5a5' }}>
          Pending: <strong>{inquiries.filter(i => i.status === 'PENDING').length}</strong>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {inquiries.map(inquiry => (
          <div key={inquiry.id} style={{ 
            background: '#1f2937', padding: '30px', borderRadius: '16px', 
            borderLeft: `6px solid ${inquiry.status === 'PENDING' ? '#ef4444' : '#10b981'}` 
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', color: '#fff', margin: '0 0 10px' }}>{inquiry.subject}</h2>
                <div style={{ fontSize: '0.95rem', color: '#9ca3af', display: 'flex', gap: '15px' }}>
                  <span>👤 {inquiry.name}</span>
                  <span>📧 <a href={`mailto:${inquiry.email}`} style={{ color: '#60a5fa', textDecoration: 'none' }}>{inquiry.email}</a></span>
                  <span>⏰ {new Date(inquiry.createdAt).toLocaleString()}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => handleStatusChange(inquiry.id, inquiry.status)}
                  style={{
                    padding: '8px 16px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 'bold', border: 'none', cursor: 'pointer',
                    background: inquiry.status === 'PENDING' ? '#3b82f6' : '#374151',
                    color: '#fff'
                  }}
                >
                  {inquiry.status === 'PENDING' ? 'Mark as Resolved ✔️' : 'Mark as Pending'}
                </button>
                <button 
                  onClick={() => handleDelete(inquiry.id)}
                  style={{ background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}
                >
                  Delete
                </button>
              </div>
            </div>
            
            <div style={{ background: '#374151', padding: '20px', borderRadius: '12px', color: '#e5e7eb', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
              {inquiry.message}
            </div>
          </div>
        ))}

        {inquiries.length === 0 && !isLoading && (
          <div style={{ textAlign: 'center', padding: '60px', color: '#9ca3af', background: '#1f2937', borderRadius: '16px' }}>
            No inquiries yet. Good job! 🎉
          </div>
        )}
      </div>
    </div>
  );
}
