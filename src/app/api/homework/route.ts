import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const { type, url } = await request.json();

    if (type === 'INSTAGRAM' && !url) {
      return NextResponse.json({ error: 'Missing URL' }, { status: 400 });
    }

    // Create a homework submission
    const submission = await prisma.homeworkSubmission.create({
      data: {
        userId: user.id,
        type,
        url,
        status: type === 'INSTAGRAM' ? 'PENDING' : 'APPROVED', // INSTA needs admin check, AI is auto-approved
        pointsAwarded: type === 'INSTAGRAM' ? 0 : 10,
      }
    });

    // If AI evaluation, automatically add 10 points
    if (type === 'AI_EVALUATION') {
      await prisma.user.update({
        where: { id: user.id },
        data: { points: { increment: 10 } }
      });
      
      // Bonus combo logic check (Did they do both today?)
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const submissionsToday = await prisma.homeworkSubmission.findMany({
        where: {
          userId: user.id,
          createdAt: { gte: today }
        }
      });

      const hasInsta = submissionsToday.some(s => s.type === 'INSTAGRAM');
      const hasAI = submissionsToday.some(s => s.type === 'AI_EVALUATION');

      if (hasInsta && hasAI) {
         await prisma.user.update({
            where: { id: user.id },
            data: { points: { increment: 30 } } // Bonus points!
         });
         return NextResponse.json({ success: true, submission, comboBonus: true });
      }
    }

    return NextResponse.json({ success: true, submission, comboBonus: false });
  } catch (error) {
    console.error('Homework submit error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
