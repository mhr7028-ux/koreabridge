'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';

export default function ReferralSection({ promotionId, rewardPoints }: { promotionId: string, rewardPoints: number }) {
  const { data: session, status } = useSession();
  const [myCode, setMyCode] = useState('');
  const [referredBy, setReferredBy] = useState<string | null>(null);
  const [friendCodeInput, setFriendCodeInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    if (session?.user) {
      fetchMyCode();
    }
  }, [session]);

  const fetchMyCode = async () => {
    try {
      const res = await fetch('/api/user/referral');
      const data = await res.json();
      if (data.success) {
        setMyCode(data.referralCode);
        setReferredBy(data.referredBy);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const submitFriendCode = async () => {
    if (!friendCodeInput.trim()) return;
    setIsLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const res = await fetch('/api/user/referral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ friendCode: friendCodeInput.trim(), promotionId })
      });
      const data = await res.json();
      
      if (data.success) {
        setMessage({ text: `Success! You earned ${data.rewardPoints} points!`, type: 'success' });
        setReferredBy(friendCodeInput.trim());
      } else {
        setMessage({ text: data.error || 'Failed to submit code', type: 'error' });
      }
    } catch (e) {
      setMessage({ text: 'Something went wrong.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(myCode);
    setMessage({ text: 'Code copied to clipboard!', type: 'success' });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  if (status === 'loading') return null;

  return (
    <div style={{ marginTop: '40px', background: 'linear-gradient(135deg, #1e3a8a 0%, #312e81 100%)', borderRadius: '16px', padding: '30px', border: '2px solid #3b82f6', boxShadow: '0 10px 30px rgba(59, 130, 246, 0.2)' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '10px' }}>🎁 Invite & Earn {rewardPoints} Points!</h2>
        <p style={{ color: '#bfdbfe', fontSize: '1.1rem' }}>Bring a friend to this festival and both of you get {rewardPoints} points!</p>
      </div>

      {!session?.user ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <button 
            onClick={() => signIn()}
            style={{ background: '#3b82f6', color: '#fff', padding: '12px 30px', borderRadius: '30px', border: 'none', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)' }}
          >
            Sign In to Get Your Link
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginTop: '30px' }}>
          
          {/* My Code Section */}
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: '12px' }}>
            <h3 style={{ color: '#fff', marginBottom: '15px' }}>Your Referral Code</h3>
            {myCode ? (
              <div style={{ display: 'flex', gap: '10px' }}>
                <code style={{ flex: 1, background: '#111827', color: '#60a5fa', padding: '12px', borderRadius: '8px', fontSize: '1.2rem', textAlign: 'center', letterSpacing: '2px' }}>
                  {myCode}
                </code>
                <button onClick={copyCode} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', padding: '0 20px', cursor: 'pointer', fontWeight: 'bold' }}>
                  Copy
                </button>
              </div>
            ) : (
              <p style={{ color: '#9ca3af' }}>Loading your code...</p>
            )}
          </div>

          {/* Submit Friend's Code Section */}
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: '12px' }}>
            <h3 style={{ color: '#fff', marginBottom: '15px' }}>Have a Friend's Code?</h3>
            {referredBy ? (
              <div style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', padding: '12px', borderRadius: '8px', textAlign: 'center', fontWeight: 'bold' }}>
                ✅ You already claimed a code ({referredBy})
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '10px' }}>
                <input 
                  type="text" 
                  placeholder="Enter 6-char code" 
                  value={friendCodeInput}
                  onChange={e => setFriendCodeInput(e.target.value.toUpperCase())}
                  maxLength={6}
                  style={{ flex: 1, background: '#111827', color: '#fff', padding: '12px', borderRadius: '8px', border: '1px solid #374151', fontSize: '1.1rem', textTransform: 'uppercase' }}
                />
                <button 
                  onClick={submitFriendCode} 
                  disabled={isLoading}
                  style={{ background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', padding: '0 20px', cursor: 'pointer', fontWeight: 'bold', opacity: isLoading ? 0.7 : 1 }}
                >
                  {isLoading ? '...' : 'Claim'}
                </button>
              </div>
            )}
          </div>

        </div>
      )}

      {message.text && (
        <div style={{ marginTop: '20px', textAlign: 'center', padding: '12px', borderRadius: '8px', background: message.type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)', color: message.type === 'success' ? '#34d399' : '#f87171', fontWeight: 'bold' }}>
          {message.text}
        </div>
      )}
    </div>
  );
}
