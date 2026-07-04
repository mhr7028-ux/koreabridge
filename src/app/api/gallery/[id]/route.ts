import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const params = await context.params;
    const { id } = params;

    const item = await prisma.homeworkGallery.findUnique({ where: { id } });
    if (!item) {
      return NextResponse.json({ error: 'Not Found' }, { status: 404 });
    }

    // Allow deletion if the user is the owner or an admin
    const isOwner = session.user.name === item.userName;
    const isAdmin = (session.user as any).role === 'admin';

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.homeworkGallery.delete({ where: { id } });
    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error) {
    console.error('Gallery delete error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const params = await context.params;
    const { id } = params;
    const { title } = await request.json();

    const item = await prisma.homeworkGallery.findUnique({ where: { id } });
    if (!item) {
      return NextResponse.json({ error: 'Not Found' }, { status: 404 });
    }

    const isOwner = session.user.name === item.userName;
    const isAdmin = (session.user as any).role === 'admin';

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updatedItem = await prisma.homeworkGallery.update({
      where: { id },
      data: { title },
    });
    
    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error('Gallery update error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
