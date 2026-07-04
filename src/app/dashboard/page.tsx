import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    redirect('/auth/signin');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      homeworks: {
        orderBy: { createdAt: 'desc' },
        take: 10
      }
    }
  });

  if (!user) {
    redirect('/auth/signin');
  }

  // Calculate today's missions
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const submissionsToday = user.homeworks.filter(h => new Date(h.createdAt) >= today);
  
  const hasInsta = submissionsToday.some(h => h.type === 'INSTAGRAM');
  const hasAI = submissionsToday.some(h => h.type === 'AI_EVALUATION');

  return (
    <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px' }}>
      <DashboardClient 
        user={user} 
        hasInsta={hasInsta} 
        hasAI={hasAI} 
      />
    </div>
  );
}
