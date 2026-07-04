'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function DashboardClient({ user, hasInsta, hasAI }: { user: any, hasInsta: boolean, hasAI: boolean }) {
  const [instaUrl, setInstaUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitInsta = async () => {
    if (!instaUrl) return alert('인스타그램 링크를 입력해주세요.');
    if (!instaUrl.includes('instagram.com')) return alert('올바른 인스타그램 링크를 입력해주세요.');

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/homework', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'INSTAGRAM', url: instaUrl })
      });
      const data = await res.json();
      if (data.success) {
        alert('과제가 제출되었습니다! 관리자 승인 후 점수가 지급됩니다.');
        window.location.reload();
      } else {
        alert('제출에 실패했습니다.');
      }
    } catch (e) {
      alert('오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isCombo = hasInsta && hasAI;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* Header Profile & Points */}
      <div className="glass-panel" style={{ padding: '30px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {user.image ? (
            <img src={user.image} alt="Profile" style={{ width: '80px', height: '80px', borderRadius: '50%' }} />
          ) : (
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#4b5563', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>👤</div>
          )}
          <div>
            <h1 style={{ color: '#fff', fontSize: '2rem', margin: '0 0 5px 0' }}>{user.name} 님</h1>
            <p style={{ color: '#9ca3af', margin: 0 }}>오늘도 즐거운 한국어 공부 되세요!</p>
          </div>
        </div>

        <div style={{ textAlign: 'center', background: 'rgba(255, 193, 7, 0.1)', border: '1px solid #ffc107', padding: '15px 30px', borderRadius: '12px' }}>
          <div style={{ color: '#fbbf24', fontSize: '0.9rem', marginBottom: '5px' }}>나의 총 점수</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#ffc107' }}>{user.points} <span style={{ fontSize: '1rem' }}>P</span></div>
        </div>
      </div>

      {/* Today's Missions */}
      <div className="glass-panel" style={{ padding: '30px', borderRadius: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: '#fff', fontSize: '1.5rem', margin: 0 }}>🔥 오늘의 AEB 미션</h2>
          {isCombo && (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              style={{ background: 'linear-gradient(45deg, #f43f5e, #8b5cf6)', padding: '5px 15px', borderRadius: '100px', color: '#fff', fontWeight: 'bold', fontSize: '0.9rem' }}
            >
              🎉 보너스 콤보 달성! (+30 P)
            </motion.div>
          )}
        </div>
        <p style={{ color: '#9ca3af', marginBottom: '30px' }}>하루 10분, 둘 중 편한 방법으로 오늘의 한국어 공부를 인증하세요! 둘 다 하면 보너스가 주어집니다.</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          
          {/* Mission A: AI Evaluation */}
          <div style={{ background: '#1f2937', border: hasAI ? '2px solid #10b981' : '1px solid #374151', borderRadius: '12px', padding: '20px', position: 'relative', overflow: 'hidden' }}>
            {hasAI && (
              <div style={{ position: 'absolute', top: '15px', right: '15px', color: '#10b981', fontSize: '1.5rem' }}>✅</div>
            )}
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🤖</div>
            <h3 style={{ color: '#fff', marginBottom: '10px' }}>미션 A: AI 발음 평가</h3>
            <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginBottom: '20px', lineHeight: '1.5' }}>
              AEB 페이지에서 10초 녹음하고 AI 성적표를 받으세요.
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#60a5fa', fontWeight: 'bold' }}>+10 P</span>
              {!hasAI ? (
                <a href="/study/aeb" className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem', textDecoration: 'none' }}>평가 받으러 가기</a>
              ) : (
                <span style={{ color: '#10b981', fontWeight: 'bold', padding: '8px 16px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px' }}>완료됨</span>
              )}
            </div>
          </div>

          {/* Mission B: Instagram */}
          <div style={{ background: '#1f2937', border: hasInsta ? '2px solid #10b981' : '1px solid #374151', borderRadius: '12px', padding: '20px', position: 'relative', overflow: 'hidden' }}>
            {hasInsta && (
              <div style={{ position: 'absolute', top: '15px', right: '15px', color: '#10b981', fontSize: '1.5rem' }}>✅</div>
            )}
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📸</div>
            <h3 style={{ color: '#fff', marginBottom: '10px' }}>미션 B: 인스타그램 과제</h3>
            <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginBottom: '20px', lineHeight: '1.5' }}>
              @korea.bridge 태그 후 릴스를 올리고 링크를 제출하세요.
            </p>
            {!hasInsta ? (
              <div style={{ display: 'flex', gap: '10px' }}>
                <input 
                  type="text" 
                  placeholder="인스타 링크 (https://...)" 
                  value={instaUrl}
                  onChange={(e) => setInstaUrl(e.target.value)}
                  style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', border: '1px solid #4b5563', background: '#374151', color: '#fff' }}
                />
                <button onClick={submitInsta} disabled={isSubmitting} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                  {isSubmitting ? '...' : '제출'}
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '38px' }}>
                <span style={{ color: '#60a5fa', fontWeight: 'bold' }}>+10 P</span>
                <span style={{ color: '#10b981', fontWeight: 'bold', padding: '8px 16px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px' }}>제출 완료 (심사 대기)</span>
              </div>
            )}
          </div>
          
        </div>
      </div>

    </div>
  );
}
