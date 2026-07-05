import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const items = await prisma.rentalItem.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ success: true, items });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, description, price, imageUrl } = await request.json();

    if (!name || !description || !price) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newItem = await prisma.rentalItem.create({
      data: {
        name,
        description,
        price: parseInt(price, 10),
        imageUrl
      }
    });

    return NextResponse.json({ success: true, item: newItem });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create item' }, { status: 500 });
  }
}
