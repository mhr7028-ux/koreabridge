import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Await params for Next.js 15
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json({ error: 'Missing user ID' }, { status: 400 });
    }

    const body = await request.json();
    const { role } = body;

    if (!role || (role !== 'admin' && role !== 'user')) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Failed to update user role:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
