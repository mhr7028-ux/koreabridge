import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const items = await prisma.homeworkGallery.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch gallery items' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, mediaUrl, mediaType, score, feedback, transcript } = await request.json();

    if (!title || !mediaUrl) {
      return NextResponse.json({ error: 'Title and mediaUrl are required' }, { status: 400 });
    }

    const item = await prisma.homeworkGallery.create({
      data: {
        userName: session.user.name || '익명',
        userImage: session.user.image || null,
        title,
        mediaUrl,
        mediaType: mediaType || 'youtube',
        score: score ?? 100,
        feedback: feedback || '학생분께서 훌륭한 한국어 말하기를 공유해 주셨습니다! 정말 잘하셨어요!',
        transcript: transcript || '영상으로 한국어 연습을 공유해 주셔서 감사합니다.',
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create gallery item' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Only admins can delete for now, or we can check if it belongs to the user
    if ((session?.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await prisma.homeworkGallery.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete gallery item' }, { status: 500 });
  }
}
