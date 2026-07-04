'use client';

import { useState, useEffect } from 'react';

type Buddy = {
  id: string;
  name: string;
  image: string | null;
  languages: string;
  description: string;
  isActive: boolean;
  createdAt: string;
};

export default function AdminBuddiesPage() {
  const [buddies, setBuddies] = useState<Buddy[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [languages, setLanguages] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchBuddies();
  }, []);

  const fetchBuddies = async () => {
    try {
      const res = await fetch('/api/buddies');
      const data = await res.json();
      if (data.success) {
        setBuddies(data.buddies);
      }
    } catch (error) {
      console.error('Failed to fetch buddies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !languages || !description) return alert('Please fill in all required fields');

    try {
      const res = await fetch('/api/buddies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, image, languages, description })
      });
      if (res.ok) {
        setName('');
        setImage('');
        setLanguages('');
        setDescription('');
        fetchBuddies();
      }
    } catch (error) {
      console.error(error);
      alert('Failed to create buddy');
    }
  };

  const toggleStatus = async (id: string, isActive: boolean) => {
    try {
      const res = await fetch(`/api/buddies/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive })
      });
      if (res.ok) fetchBuddies();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this buddy?')) return;
    try {
      const res = await fetch(`/api/buddies/${id}`, { method: 'DELETE' });
      if (res.ok) fetchBuddies();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: '2rem', color: '#ffc107', marginBottom: '30px' }}>🤝 Busan Buddy Management</h1>

      <div style={{ background: '#1f2937', padding: '30px', borderRadius: '12px', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '20px', color: '#fff' }}>Register New Buddy</h2>
        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ display: 'flex', gap: '15px' }}>
            <input 
              type="text" placeholder="Name / Nickname *" 
              value={name} onChange={e => setName(e.target.value)} required
              style={{ flex: 1, padding: '12px', borderRadius: '8px', background: '#374151', color: 'white', border: 'none' }}
            />
            <input 
              type="text" placeholder="Languages (e.g. English, Japanese) *" 
              value={languages} onChange={e => setLanguages(e.target.value)} required
              style={{ flex: 1, padding: '12px', borderRadius: '8px', background: '#374151', color: 'white', border: 'none' }}
            />
          </div>
          <input 
            type="text" placeholder="Profile Image URL (Optional)" 
            value={image} onChange={e => setImage(e.target.value)}
            style={{ padding: '12px', borderRadius: '8px', background: '#374151', color: 'white', border: 'none' }}
          />
          <textarea 
            placeholder="Short Description (e.g. Haeundae local food master!) *" 
            value={description} onChange={e => setDescription(e.target.value)} required
            style={{ padding: '12px', borderRadius: '8px', background: '#374151', color: 'white', border: 'none', minHeight: '80px' }}
          />
          <button type="submit" style={{ padding: '12px', borderRadius: '8px', background: '#3b82f6', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
            + Register Buddy
          </button>
        </form>
      </div>

      <div style={{ overflowX: 'auto', background: '#1f2937', borderRadius: '12px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#374151', color: '#d1d5db' }}>
              <th style={{ padding: '15px' }}>Buddy Profile</th>
              <th style={{ padding: '15px' }}>Languages</th>
              <th style={{ padding: '15px' }}>Status</th>
              <th style={{ padding: '15px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {buddies.map(buddy => (
              <tr key={buddy.id} style={{ borderTop: '1px solid #374151' }}>
                <td style={{ padding: '15px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#4b5563', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                    {buddy.image ? <img src={buddy.image} alt={buddy.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '👤'}
                  </div>
                  <div>
                    <strong style={{ color: '#fff', display: 'block' }}>{buddy.name}</strong>
                    <span style={{ fontSize: '0.85rem', color: '#9ca3af' }}>{buddy.description.substring(0, 30)}...</span>
                  </div>
                </td>
                <td style={{ padding: '15px', color: '#e5e7eb' }}>{buddy.languages}</td>
                <td style={{ padding: '15px' }}>
                  <button 
                    onClick={() => toggleStatus(buddy.id, buddy.isActive)}
                    style={{
                      padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem', border: 'none', cursor: 'pointer',
                      background: buddy.isActive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                      color: buddy.isActive ? '#34d399' : '#fca5a5'
                    }}
                  >
                    {buddy.isActive ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td style={{ padding: '15px' }}>
                  <button onClick={() => handleDelete(buddy.id)} style={{ background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer' }}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {buddies.length === 0 && !isLoading && (
              <tr>
                <td colSpan={4} style={{ padding: '30px', textAlign: 'center', color: '#9ca3af' }}>No buddies registered yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
