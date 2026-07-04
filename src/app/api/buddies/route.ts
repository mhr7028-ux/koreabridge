import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('activeOnly') === 'true';

    const buddies = await prisma.buddy.findMany({
      where: activeOnly ? { isActive: true } : undefined,
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, buddies });
  } catch (error) {
    console.error('Error fetching buddies:', error);
    return NextResponse.json({ error: 'Failed to fetch buddies' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, image, languages, description } = await request.json();

    if (!name || !languages || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newBuddy = await prisma.buddy.create({
      data: {
        name,
        image,
        languages,
        description,
        isActive: true,
      },
    });

    return NextResponse.json({ success: true, buddy: newBuddy });
  } catch (error) {
    console.error('Error creating buddy:', error);
    return NextResponse.json({ error: 'Failed to create buddy' }, { status: 500 });
  }
}
