'use client';

import { useState, useEffect } from 'react';

type Mission = {
  id: string;
  title: string;
  location: string;
  description: string;
  rewardPoints: number;
  createdAt: string;
};

export default function AdminMissionsPage() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [rewardPoints, setRewardPoints] = useState(100);

  useEffect(() => {
    fetchMissions();
  }, []);

  const fetchMissions = async () => {
    const res = await fetch('/api/missions');
    const data = await res.json();
    if (data.success) {
      setMissions(data.missions);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/missions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, location, description, rewardPoints })
    });
    if (res.ok) {
      setTitle(''); setLocation(''); setDescription(''); setRewardPoints(100);
      fetchMissions();
    } else {
      alert("Failed to create mission");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this mission?')) return;
    const res = await fetch(`/api/missions/${id}`, { method: 'DELETE' });
    if (res.ok) fetchMissions();
  };

  return (
    <div>
      <h1 style={{ fontSize: '2rem', color: '#ffc107', marginBottom: '30px' }}>📍 Manage Missions</h1>

      <div style={{ background: '#1f2937', padding: '30px', borderRadius: '12px', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '20px', color: '#fff' }}>Add New Mission</h2>
        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input type="text" placeholder="Title (e.g. Barefoot Walk)" value={title} onChange={e => setTitle(e.target.value)} required style={{ padding: '12px', borderRadius: '8px', background: '#374151', color: 'white', border: 'none' }} />
          <input type="text" placeholder="Location (e.g. Gwangalli)" value={location} onChange={e => setLocation(e.target.value)} required style={{ padding: '12px', borderRadius: '8px', background: '#374151', color: 'white', border: 'none' }} />
          <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required style={{ padding: '12px', borderRadius: '8px', background: '#374151', color: 'white', border: 'none', minHeight: '80px' }} />
          <input type="number" placeholder="Reward Points" value={rewardPoints} onChange={e => setRewardPoints(Number(e.target.value))} required style={{ padding: '12px', borderRadius: '8px', background: '#374151', color: 'white', border: 'none' }} />
          
          <button type="submit" style={{ padding: '12px', borderRadius: '8px', background: '#3b82f6', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
            + Create Mission
          </button>
        </form>
      </div>

      <div style={{ overflowX: 'auto', background: '#1f2937', borderRadius: '12px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#374151', color: '#d1d5db' }}>
              <th style={{ padding: '15px' }}>Location</th>
              <th style={{ padding: '15px' }}>Title</th>
              <th style={{ padding: '15px' }}>Reward</th>
              <th style={{ padding: '15px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {missions.map(m => (
              <tr key={m.id} style={{ borderTop: '1px solid #374151' }}>
                <td style={{ padding: '15px', color: '#9ca3af' }}>{m.location}</td>
                <td style={{ padding: '15px', color: '#fff' }}>{m.title}</td>
                <td style={{ padding: '15px', color: '#10b981' }}>{m.rewardPoints} pts</td>
                <td style={{ padding: '15px' }}>
                  <button onClick={() => handleDelete(m.id)} style={{ background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer' }}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {missions.length === 0 && (
              <tr><td colSpan={4} style={{ padding: '30px', textAlign: 'center', color: '#9ca3af' }}>No missions found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
