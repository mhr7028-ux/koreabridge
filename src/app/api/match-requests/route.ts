import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const requests = await prisma.matchRequest.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, requests });
  } catch (error) {
    console.error('Error fetching match requests:', error);
    return NextResponse.json({ error: 'Failed to fetch match requests' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'You must be logged in to request a buddy match' }, { status: 401 });
    }

    const { buddyId, visitDate, message, contactInfo } = await request.json();

    if (!buddyId || !visitDate || !contactInfo) {
      return NextResponse.json({ error: 'Buddy ID, Visit Date, and Contact Info are required' }, { status: 400 });
    }

    const newRequest = await prisma.matchRequest.create({
      data: {
        userName: session.user.name || 'Unknown User',
        userEmail: session.user.email || 'No email',
        contactInfo,
        buddyId,
        visitDate,
        message,
        status: 'PENDING',
      },
    });

    return NextResponse.json({ success: true, request: newRequest });
  } catch (error) {
    console.error('Error creating match request:', error);
    return NextResponse.json({ error: 'Failed to create match request' }, { status: 500 });
  }
}
