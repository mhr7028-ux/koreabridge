import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import ReferralSection from './ReferralSection';

// Make this page dynamically rendered on request
export const dynamic = 'force-dynamic';

export default async function FestivalPromotionsPage() {
  const promotions = await prisma.promotion.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const activePromotions = promotions.filter(p => p.status === 'ACTIVE');
  const pastPromotions = promotions.filter(p => p.status === 'PAST');

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
      
      {/* 🚀 ACTIVE PROMOTIONS (The 3-Step Funnel) */}
      {activePromotions.length > 0 ? (
        activePromotions.map((promo) => (
          <div key={promo.id} style={{ marginBottom: '80px', background: 'linear-gradient(180deg, rgba(31,41,55,1) 0%, rgba(17,24,39,1) 100%)', borderRadius: '24px', overflow: 'hidden', border: '1px solid #374151' }}>
            <div style={{ padding: '40px', textAlign: 'center' }}>
              <span style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', padding: '6px 16px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.9rem' }}>
                Ongoing Festival 🔥
              </span>
              <h1 style={{ fontSize: '2.5rem', margin: '20px 0 10px', color: '#fff' }}>{promo.title}</h1>
              {promo.subtitle && <p style={{ fontSize: '1.2rem', color: '#9ca3af', marginBottom: '30px' }}>{promo.subtitle}</p>}
            </div>

            {/* YouTube Embed Area */}
            {promo.youtubeUrl && (
              <div style={{ padding: '0 40px', marginBottom: '40px' }}>
                <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
                  <iframe 
                    src={promo.youtubeUrl} 
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }} 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {/* The 3-Step Strategy Layout */}
            <div style={{ padding: '0 40px 40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
              
              {/* Step 1: Online Live Class */}
              <div style={{ background: '#374151', padding: '30px', borderRadius: '16px', borderTop: '4px solid #3b82f6' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>💻</div>
                <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '15px' }}>Step 1. Pre-visit Class</h3>
                <p style={{ color: '#d1d5db', lineHeight: '1.6', marginBottom: '20px', fontSize: '0.95rem' }}>
                  Learn survival Korean via Google Meet. Master how to navigate and order food at the festival booth!
                </p>
                {promo.pdfLink && (
                  <a href={promo.pdfLink} download target="_blank" style={{ display: 'inline-block', width: '100%', textAlign: 'center', background: '#2563eb', color: '#fff', padding: '12px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
                    📥 Download Guide PDF
                  </a>
                )}
              </div>

              {/* Step 2: Offline Guide */}
              <div style={{ background: '#374151', padding: '30px', borderRadius: '16px', borderTop: '4px solid #10b981' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>🤝</div>
                <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '15px' }}>Step 2. In-Busan Guide</h3>
                <p style={{ color: '#d1d5db', lineHeight: '1.6', marginBottom: '20px', fontSize: '0.95rem' }}>
                  Arrive in Busan and meet your local "Busan Buddy". Enjoy a safe and fun festival experience together!
                </p>
                <Link href="/travel/buddy" style={{ display: 'inline-block', width: '100%', textAlign: 'center', background: '#059669', color: '#fff', padding: '12px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
                  🔍 Find a Busan Buddy
                </Link>
              </div>

              {/* Step 3: Local Coupons */}
              <div style={{ background: '#374151', padding: '30px', borderRadius: '16px', borderTop: '4px solid #f59e0b' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>🎫</div>
                <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '15px' }}>Step 3. Local Coupons</h3>
                <p style={{ color: '#d1d5db', lineHeight: '1.6', marginBottom: '20px', fontSize: '0.95rem' }}>
                  Get exclusive discounts at affiliated accommodations, restaurants, and cafes near the festival venue.
                </p>
                {promo.couponImage ? (
                  <a href={promo.couponImage} target="_blank" style={{ display: 'inline-block', width: '100%', textAlign: 'center', background: '#d97706', color: '#fff', padding: '12px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
                    🎁 View QR Coupon
                  </a>
                ) : (
                  <div style={{ textAlign: 'center', color: '#9ca3af', padding: '12px', border: '1px dashed #6b7280', borderRadius: '8px' }}>
                    Coupons coming soon!
                  </div>
                )}
              </div>

            </div>
            
            {/* Referral System Box */}
            {promo.enableReferral && (
              <div style={{ padding: '0 40px 40px' }}>
                <ReferralSection promotionId={promo.id} rewardPoints={promo.referralReward} />
              </div>
            )}
          </div>
        ))
      ) : (
        <div style={{ textAlign: 'center', padding: '80px 20px', background: '#1f2937', borderRadius: '24px', marginBottom: '60px' }}>
          <h2 style={{ color: '#9ca3af' }}>No active festivals at the moment.</h2>
          <p style={{ color: '#6b7280', marginTop: '10px' }}>Check back later or view our past event history below!</p>
        </div>
      )}

      {/* 📚 PAST PROMOTIONS (History / Portfolio) */}
      {pastPromotions.length > 0 && (
        <div style={{ marginTop: '80px' }}>
          <h2 style={{ fontSize: '2rem', color: '#fff', marginBottom: '10px', textAlign: 'center' }}>Our Past Journeys 📸</h2>
          <p style={{ color: '#9ca3af', textAlign: 'center', marginBottom: '40px' }}>Discover the vibrant festivals and events we've explored with our students.</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {pastPromotions.map((promo) => (
              <div key={promo.id} style={{ background: '#1f2937', padding: '24px', borderRadius: '16px', border: '1px solid #374151', opacity: 0.8, transition: 'opacity 0.3s' }}>
                <span style={{ fontSize: '0.8rem', background: '#374151', color: '#9ca3af', padding: '4px 10px', borderRadius: '12px', display: 'inline-block', marginBottom: '12px' }}>
                  Completed
                </span>
                <h3 style={{ color: '#fff', fontSize: '1.2rem', margin: '0 0 10px' }}>{promo.title}</h3>
                {promo.subtitle && <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '15px' }}>{promo.subtitle}</p>}
                {promo.youtubeUrl && (
                  <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '8px' }}>
                    <iframe src={promo.youtubeUrl} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
