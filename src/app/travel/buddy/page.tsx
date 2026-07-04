'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

type Buddy = {
  id: string;
  name: string;
  image: string | null;
  languages: string;
  description: string;
  isActive: boolean;
};

export default function BusanBuddyPage() {
  const { data: session } = useSession();
  const [buddies, setBuddies] = useState<Buddy[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Chat Action
  const handleChatMatch = (buddyName: string) => {
    if (!session) {
      alert('Please log in first to request a buddy match!');
      return;
    }
    const message = encodeURIComponent(`Hello! I want to request a match with Busan Buddy [${buddyName}].`);
    // Example WhatsApp link (Admin should replace with their actual WA or Kakao link)
    const chatUrl = `https://wa.me/1234567890?text=${message}`;
    window.open(chatUrl, '_blank');
  };

  useEffect(() => {
    fetchBuddies();
  }, []);

  const fetchBuddies = async () => {
    try {
      const res = await fetch('/api/buddies?activeOnly=true');
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

    // We no longer use handleRequestMatch since we redirect to chat

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 style={{ fontSize: '3rem', color: '#fff', marginBottom: '20px' }}>🤝 Meet Your Busan Buddy</h1>
        <p style={{ fontSize: '1.2rem', color: '#9ca3af', maxWidth: '600px', margin: '0 auto' }}>
          Practice your Korean in real life! Connect with our verified local crew to guide you safely and enjoyably through Busan's festivals and hot spots.
        </p>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', color: '#9ca3af', padding: '100px 0' }}>Loading buddies...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
          {buddies.map((buddy) => (
            <div key={buddy.id} style={{ background: '#1f2937', borderRadius: '24px', overflow: 'hidden', border: '1px solid #374151', transition: 'transform 0.3s', cursor: 'pointer' }}
                 onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                 onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ height: '250px', background: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem', position: 'relative' }}>
                {buddy.image ? (
                  <img src={buddy.image} alt={buddy.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  '👤'
                )}
                <div style={{ position: 'absolute', bottom: '15px', right: '15px', background: 'rgba(0,0,0,0.6)', padding: '5px 12px', borderRadius: '12px', color: '#fff', fontSize: '0.85rem' }}>
                  🗣️ {buddy.languages}
                </div>
              </div>
              <div style={{ padding: '30px' }}>
                <h2 style={{ fontSize: '1.8rem', color: '#fff', margin: '0 0 15px' }}>{buddy.name}</h2>
                <p style={{ color: '#d1d5db', lineHeight: '1.6', fontSize: '1.05rem', marginBottom: '25px', minHeight: '60px' }}>
                  "{buddy.description}"
                </p>
                <button 
                  onClick={() => handleChatMatch(buddy.name)}
                  style={{ width: '100%', padding: '14px', borderRadius: '12px', background: '#3b82f6', color: '#fff', border: 'none', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.3s' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#2563eb'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#3b82f6'}
                >
                  💬 Chat to Match
                </button>
              </div>
            </div>
          ))}
          {buddies.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px', color: '#9ca3af', background: '#1f2937', borderRadius: '24px' }}>
              No buddies are currently available. Please check back later!
            </div>
          )}
        </div>
      )}
    </div>
  );
}
