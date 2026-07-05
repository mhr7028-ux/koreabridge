import { prisma } from '@/lib/prisma';
import AdventureClient from './AdventureClient';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function AdventurePage() {
  const session = await getServerSession(authOptions);
  
  // Fetch active missions
  const missions = await prisma.mission.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' }
  });

  // If user is logged in, fetch their existing proofs to show status
  let userProofs: any[] = [];
  if (session?.user?.email) {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    });
    if (user) {
      userProofs = await prisma.missionProof.findMany({
        where: { userId: user.id }
      });
    }
  }

  // Extract unique locations for filtering
  const locations = Array.from(new Set(missions.map(m => m.location)));

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <span style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', padding: '6px 16px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.9rem' }}>
          Explore Busan 🌊
        </span>
        <h1 style={{ fontSize: '2.5rem', color: '#fff', margin: '20px 0 10px' }}>Busan Adventure Missions</h1>
        <p style={{ color: '#9ca3af', fontSize: '1.1rem' }}>Complete offline missions at beautiful locations, earn points, and make friends!</p>
      </div>

      <AdventureClient 
        missions={missions} 
        locations={locations} 
        userProofs={userProofs} 
        isLoggedIn={!!session?.user} 
      />
    </div>
  );
}
