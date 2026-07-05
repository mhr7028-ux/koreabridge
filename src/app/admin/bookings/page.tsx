'use client';

import { useState, useEffect } from 'react';

type RentalItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string | null;
  createdAt: string;
};

export default function AdminBookingsPage() {
  const [items, setItems] = useState<RentalItem[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(10000);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const res = await fetch('/api/rental-items');
    const data = await res.json();
    if (data.success) {
      setItems(data.items);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/rental-items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description, price, imageUrl })
    });
    if (res.ok) {
      setName(''); setDescription(''); setPrice(10000); setImageUrl('');
      fetchItems();
    } else {
      alert("Failed to create item");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this item?')) return;
    const res = await fetch(`/api/rental-items/${id}`, { method: 'DELETE' });
    if (res.ok) fetchItems();
  };

  return (
    <div>
      <h1 style={{ fontSize: '2rem', color: '#ffc107', marginBottom: '30px' }}>🚲 Manage Rentals & Tours</h1>

      <div style={{ background: '#1f2937', padding: '30px', borderRadius: '12px', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '20px', color: '#fff' }}>Add New Rental Item</h2>
        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input type="text" placeholder="Name (e.g. Electric Bike)" value={name} onChange={e => setName(e.target.value)} required style={{ padding: '12px', borderRadius: '8px', background: '#374151', color: 'white', border: 'none' }} />
          <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required style={{ padding: '12px', borderRadius: '8px', background: '#374151', color: 'white', border: 'none', minHeight: '80px' }} />
          <input type="number" placeholder="Price (KRW)" value={price} onChange={e => setPrice(Number(e.target.value))} required style={{ padding: '12px', borderRadius: '8px', background: '#374151', color: 'white', border: 'none' }} />
          <input type="text" placeholder="Image URL (Optional)" value={imageUrl} onChange={e => setImageUrl(e.target.value)} style={{ padding: '12px', borderRadius: '8px', background: '#374151', color: 'white', border: 'none' }} />
          
          <button type="submit" style={{ padding: '12px', borderRadius: '8px', background: '#3b82f6', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
            + Create Item
          </button>
        </form>
      </div>

      <div style={{ overflowX: 'auto', background: '#1f2937', borderRadius: '12px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#374151', color: '#d1d5db' }}>
              <th style={{ padding: '15px' }}>Name</th>
              <th style={{ padding: '15px' }}>Price</th>
              <th style={{ padding: '15px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} style={{ borderTop: '1px solid #374151' }}>
                <td style={{ padding: '15px', color: '#fff' }}>
                  <strong>{item.name}</strong>
                  <div style={{ fontSize: '0.85rem', color: '#9ca3af', marginTop: '4px' }}>{item.description.substring(0, 50)}...</div>
                </td>
                <td style={{ padding: '15px', color: '#10b981' }}>₩{item.price.toLocaleString()}</td>
                <td style={{ padding: '15px' }}>
                  <button onClick={() => handleDelete(item.id)} style={{ background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer' }}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={3} style={{ padding: '30px', textAlign: 'center', color: '#9ca3af' }}>No rental items found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
