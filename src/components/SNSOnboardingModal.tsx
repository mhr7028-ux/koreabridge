'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const SNS_OPTIONS = [
  'WhatsApp',
  'Telegram',
  'LINE',
  'WeChat',
  'Instagram',
  'Facebook',
  'Other'
];

export default function SNSOnboardingModal() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [snsType, setSnsType] = useState(SNS_OPTIONS[0]);
  const [snsId, setSnsId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // If user is logged in but has no snsType, show the modal
    if (session?.user && !(session.user as any).snsType) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!snsType || !snsId.trim()) {
      alert('Please enter your SNS contact information.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/user/update-sns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ snsType, snsId: snsId.trim() }),
      });

      if (res.ok) {
        // Update local session
        await update();
        setIsOpen(false);
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to update contact info.');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999,
      display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#1f2937', padding: '30px', borderRadius: '16px',
        maxWidth: '400px', width: '100%', borderTop: '4px solid #3b82f6',
        color: 'white', textAlign: 'center'
      }}>
        <h2 style={{ marginBottom: '10px', color: '#60a5fa' }}>Welcome to KoreaBridge! 🎉</h2>
        <p style={{ color: '#9ca3af', marginBottom: '25px', fontSize: '0.9rem', lineHeight: '1.5' }}>
          To provide better communication and updates regarding your classes, please let us know your preferred messenger.
        </p>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', textAlign: 'left' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#d1d5db' }}>
              Primary Messenger
            </label>
            <select 
              value={snsType}
              onChange={(e) => setSnsType(e.target.value)}
              style={{
                width: '100%', padding: '12px', borderRadius: '8px',
                backgroundColor: '#374151', color: 'white', border: '1px solid #4b5563',
                outline: 'none'
              }}
            >
              {SNS_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#d1d5db' }}>
              ID or Phone Number
            </label>
            <input 
              type="text" 
              value={snsId}
              onChange={(e) => setSnsId(e.target.value)}
              placeholder="e.g., +1 234 567 8900"
              style={{
                width: '100%', padding: '12px', borderRadius: '8px',
                backgroundColor: '#374151', color: 'white', border: '1px solid #4b5563',
                outline: 'none'
              }}
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            style={{
              marginTop: '10px', padding: '14px', borderRadius: '8px',
              backgroundColor: '#3b82f6', color: 'white', border: 'none',
              fontWeight: 'bold', cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1
            }}
          >
            {isLoading ? 'Saving...' : 'Save & Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}
