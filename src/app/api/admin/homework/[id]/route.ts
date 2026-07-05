import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendPushNotification } from '@/lib/push';

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Await params for Next.js 15
    const { id } = await context.params;
    const body = await request.json();
    const { status, action } = body;

    const submission = await prisma.homeworkSubmission.findUnique({ where: { id } });
    if (!submission) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    if (action === 'APPROVE' && submission.status !== 'APPROVED') {
      // Approve and give 10 points
      await prisma.homeworkSubmission.update({
        where: { id },
        data: { status: 'APPROVED', pointsAwarded: 10 }
      });
      await prisma.user.update({
        where: { id: submission.userId },
        data: { points: { increment: 10 } }
      });
      
      // Bonus logic: Check if they had AI evaluation on the same day
      let totalPointsAwarded = 10;
      const dateStr = submission.createdAt.toISOString().split('T')[0];
      const allToday = await prisma.homeworkSubmission.findMany({
        where: {
          userId: submission.userId,
          createdAt: {
            gte: new Date(`${dateStr}T00:00:00.000Z`),
            lte: new Date(`${dateStr}T23:59:59.999Z`)
          }
        }
      });
      const hasAI = allToday.some(s => s.type === 'AI_EVALUATION');
      if (hasAI) {
        await prisma.user.update({
          where: { id: submission.userId },
          data: { points: { increment: 30 } }
        });
        totalPointsAwarded += 30;
      }

      await sendPushNotification(
        submission.userId,
        'Homework Approved! 🎉',
        `You earned ${totalPointsAwarded} points for your homework.`,
        '/dashboard'
      );

    } else if (action === 'REJECT') {
      await prisma.homeworkSubmission.update({
        where: { id },
        data: { status: 'REJECTED' }
      });
      await sendPushNotification(
        submission.userId,
        'Homework Status',
        'Your homework submission was rejected. Please check and try again.',
        '/dashboard'
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Homework admin API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
