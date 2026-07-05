import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const missions = await prisma.mission.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ success: true, missions });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch missions' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, location, description, rewardPoints } = await request.json();

    if (!title || !location || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newMission = await prisma.mission.create({
      data: {
        title,
        location,
        description,
        rewardPoints: parseInt(rewardPoints, 10) || 100
      }
    });

    return NextResponse.json({ success: true, mission: newMission });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create mission' }, { status: 500 });
  }
}
