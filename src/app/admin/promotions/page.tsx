'use client';

import { useState, useEffect } from 'react';

type Promotion = {
  id: string;
  title: string;
  subtitle: string | null;
  youtubeUrl: string | null;
  pdfLink: string | null;
  couponImage: string | null;
  status: string;
  createdAt: string;
};

export default function AdminPromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [pdfLink, setPdfLink] = useState('');
  const [couponImage, setCouponImage] = useState('');

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      const res = await fetch('/api/promotions');
      const data = await res.json();
      if (data.success) {
        setPromotions(data.promotions);
      }
    } catch (error) {
      console.error('Failed to fetch promotions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return alert('Title is required');

    try {
      const res = await fetch('/api/promotions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title, subtitle, youtubeUrl, pdfLink, couponImage
        })
      });
      if (res.ok) {
        setTitle('');
        setSubtitle('');
        setYoutubeUrl('');
        setPdfLink('');
        setCouponImage('');
        fetchPromotions();
      }
    } catch (error) {
      console.error(error);
      alert('Failed to create promotion');
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'PAST' : 'ACTIVE';
    try {
      const res = await fetch(`/api/promotions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchPromotions();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this promotion?')) return;
    try {
      const res = await fetch(`/api/promotions/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchPromotions();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: '2rem', color: '#ffc107', marginBottom: '30px' }}>🎉 Promotion Management</h1>

      <div style={{ background: '#1f2937', padding: '30px', borderRadius: '12px', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '20px', color: '#fff' }}>Add New Festival / Promotion</h2>
        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input 
            type="text" placeholder="Title (e.g. International Barefoot Walking Festival 👣)" 
            value={title} onChange={e => setTitle(e.target.value)} required
            style={{ padding: '12px', borderRadius: '8px', background: '#374151', color: 'white', border: 'none' }}
          />
          <input 
            type="text" placeholder="Subtitle (Optional)" 
            value={subtitle} onChange={e => setSubtitle(e.target.value)}
            style={{ padding: '12px', borderRadius: '8px', background: '#374151', color: 'white', border: 'none' }}
          />
          <input 
            type="text" placeholder="YouTube Embed URL (Optional, e.g. https://www.youtube.com/embed/...)" 
            value={youtubeUrl} onChange={e => setYoutubeUrl(e.target.value)}
            style={{ padding: '12px', borderRadius: '8px', background: '#374151', color: 'white', border: 'none' }}
          />
          <div style={{ display: 'flex', gap: '15px' }}>
            <input 
              type="text" placeholder="PDF File Link for Step 1 (Optional)" 
              value={pdfLink} onChange={e => setPdfLink(e.target.value)}
              style={{ flex: 1, padding: '12px', borderRadius: '8px', background: '#374151', color: 'white', border: 'none' }}
            />
            <input 
              type="text" placeholder="Coupon Image Link for Step 3 (Optional)" 
              value={couponImage} onChange={e => setCouponImage(e.target.value)}
              style={{ flex: 1, padding: '12px', borderRadius: '8px', background: '#374151', color: 'white', border: 'none' }}
            />
          </div>
          <button type="submit" style={{ padding: '12px', borderRadius: '8px', background: '#3b82f6', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
            + Create Promotion
          </button>
        </form>
      </div>

      <div style={{ overflowX: 'auto', background: '#1f2937', borderRadius: '12px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#374151', color: '#d1d5db' }}>
              <th style={{ padding: '15px' }}>Title</th>
              <th style={{ padding: '15px' }}>Status</th>
              <th style={{ padding: '15px' }}>Date Added</th>
              <th style={{ padding: '15px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {promotions.map(promo => (
              <tr key={promo.id} style={{ borderTop: '1px solid #374151' }}>
                <td style={{ padding: '15px', color: '#fff' }}>
                  <strong>{promo.title}</strong>
                  <div style={{ fontSize: '0.85rem', color: '#9ca3af', marginTop: '4px' }}>{promo.subtitle}</div>
                </td>
                <td style={{ padding: '15px' }}>
                  <button 
                    onClick={() => toggleStatus(promo.id, promo.status)}
                    style={{
                      padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem', border: 'none', cursor: 'pointer',
                      background: promo.status === 'ACTIVE' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(107, 114, 128, 0.2)',
                      color: promo.status === 'ACTIVE' ? '#34d399' : '#9ca3af'
                    }}
                  >
                    {promo.status}
                  </button>
                </td>
                <td style={{ padding: '15px', color: '#9ca3af' }}>{new Date(promo.createdAt).toLocaleDateString()}</td>
                <td style={{ padding: '15px' }}>
                  <button onClick={() => handleDelete(promo.id)} style={{ background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer' }}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {promotions.length === 0 && !isLoading && (
              <tr>
                <td colSpan={4} style={{ padding: '30px', textAlign: 'center', color: '#9ca3af' }}>No promotions found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
