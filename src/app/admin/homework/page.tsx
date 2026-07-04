import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import AdminHomeworkClient from './AdminHomeworkClient';

export default async function AdminHomeworkPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user || (session.user as any).role !== 'admin') {
    redirect('/auth/signin');
  }

  // Fetch pending instagram homeworks
  const pendingHomeworks = await prisma.homeworkSubmission.findMany({
    where: { 
      type: 'INSTAGRAM',
      status: 'PENDING'
    },
    include: {
      user: { select: { name: true, email: true, image: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: '#fff', margin: '0 0 10px 0' }}>인스타그램 과제 검사</h1>
          <p style={{ color: '#9ca3af', margin: 0 }}>
            학생들이 제출한 릴스 링크를 확인하고 승인(Approve)해 점수를 지급하세요.
          </p>
        </div>
      </div>
      
      <AdminHomeworkClient initialHomework={pendingHomeworks} />
    </div>
  );
}
