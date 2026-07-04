import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { isActive } = await request.json();
    const updatedBuddy = await prisma.buddy.update({
      where: { id: params.id },
      data: { isActive },
    });

    return NextResponse.json({ success: true, buddy: updatedBuddy });
  } catch (error) {
    console.error('Error updating buddy:', error);
    return NextResponse.json({ error: 'Failed to update buddy' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.buddy.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting buddy:', error);
    return NextResponse.json({ error: 'Failed to delete buddy' }, { status: 500 });
  }
}
