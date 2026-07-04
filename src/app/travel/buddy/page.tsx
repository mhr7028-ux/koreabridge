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

  // Modal State
  const [selectedBuddy, setSelectedBuddy] = useState<Buddy | null>(null);
  const [visitDate, setVisitDate] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);

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

  const handleRequestMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      alert('Please log in first to request a buddy match!');
      return;
    }
    if (!selectedBuddy || !visitDate) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/match-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buddyId: selectedBuddy.id,
          visitDate,
          message,
        })
      });
      if (res.ok) {
        setRequestSuccess(true);
      } else {
        const errorData = await res.json();
        alert(errorData.error || 'Failed to submit request');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setSelectedBuddy(null);
    setVisitDate('');
    setMessage('');
    setRequestSuccess(false);
  };

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
                  onClick={() => setSelectedBuddy(buddy)}
                  style={{ width: '100%', padding: '14px', borderRadius: '12px', background: '#3b82f6', color: '#fff', border: 'none', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.3s' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#2563eb'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#3b82f6'}
                >
                  Request Match
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

      {/* Match Request Modal */}
      {selectedBuddy && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#1f2937', padding: '40px', borderRadius: '24px', width: '100%', maxWidth: '500px', border: '1px solid #374151', position: 'relative' }}>
            <button onClick={closeModal} style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: '#9ca3af', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
            
            {!requestSuccess ? (
              <>
                <h2 style={{ color: '#fff', marginBottom: '10px' }}>Match with {selectedBuddy.name}</h2>
                <p style={{ color: '#9ca3af', marginBottom: '30px' }}>Fill out the form below to request a guide.</p>
                
                <form onSubmit={handleRequestMatch} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', color: '#d1d5db', marginBottom: '8px' }}>Date of Visit in Busan *</label>
                    <input 
                      type="date" required
                      value={visitDate} onChange={e => setVisitDate(e.target.value)}
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', background: '#374151', color: '#fff', border: '1px solid #4b5563' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', color: '#d1d5db', marginBottom: '8px' }}>Message / Places you want to go</label>
                    <textarea 
                      placeholder="e.g. I want to visit the Barefoot Festival!" 
                      value={message} onChange={e => setMessage(e.target.value)}
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', background: '#374151', color: '#fff', border: '1px solid #4b5563', minHeight: '100px' }}
                    />
                  </div>
                  <button 
                    type="submit" disabled={isSubmitting}
                    style={{ width: '100%', padding: '14px', borderRadius: '12px', background: isSubmitting ? '#4b5563' : '#10b981', color: '#fff', border: 'none', fontSize: '1.1rem', fontWeight: 'bold', cursor: isSubmitting ? 'not-allowed' : 'pointer', marginTop: '10px' }}
                  >
                    {isSubmitting ? 'Submitting...' : 'Send Request'}
                  </button>
                </form>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🎉</div>
                <h2 style={{ color: '#10b981', marginBottom: '15px' }}>Request Sent!</h2>
                <p style={{ color: '#d1d5db', lineHeight: '1.6' }}>
                  Your match request for <strong>{selectedBuddy.name}</strong> has been successfully submitted.<br/>
                  Our admin will contact you via your registered email/SNS shortly!
                </p>
                <button 
                  onClick={closeModal}
                  style={{ width: '100%', padding: '14px', borderRadius: '12px', background: '#374151', color: '#fff', border: 'none', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', marginTop: '30px' }}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
