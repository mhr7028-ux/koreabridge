import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const methods = await prisma.studyMethod.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(methods);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch study methods' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Only admins can post study methods
    if ((session?.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, content, videoUrl, pdfUrl, audioUrl, pptUrl } = await request.json();

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    const method = await prisma.studyMethod.create({
      data: {
        title,
        content,
        videoUrl: videoUrl || null,
        pdfUrl: pdfUrl || null,
        audioUrl: audioUrl || null,
        pptUrl: pptUrl || null,
      },
    });

    return NextResponse.json(method, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create study method' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Only admins can delete
    if ((session?.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await prisma.studyMethod.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete study method' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Only admins can update
    if ((session?.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, title, content, videoUrl, pdfUrl, audioUrl, pptUrl } = await request.json();

    if (!id || !title || !content) {
      return NextResponse.json({ error: 'ID, Title and content are required' }, { status: 400 });
    }

    const method = await prisma.studyMethod.update({
      where: { id },
      data: {
        title,
        content,
        videoUrl: videoUrl || null,
        pdfUrl: pdfUrl || null,
        audioUrl: audioUrl || null,
        pptUrl: pptUrl || null,
      },
    });

    return NextResponse.json(method, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update study method' }, { status: 500 });
  }
}
