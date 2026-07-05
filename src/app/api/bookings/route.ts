import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendDiscordNotification } from '@/lib/discord';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { rentalItemId, bookingDate } = await request.json();

    if (!rentalItemId || !bookingDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const item = await prisma.rentalItem.findUnique({
      where: { id: rentalItemId }
    });

    if (!item || !item.isActive) {
      return NextResponse.json({ error: 'Item not available' }, { status: 400 });
    }

    const newBooking = await prisma.booking.create({
      data: {
        userId: user.id,
        rentalItemId,
        bookingDate,
        status: 'PENDING'
      }
    });

    // Notify Discord Admin
    try {
      await sendDiscordNotification({
        title: "📅 New Rental Booking!",
        description: `**${user.name}** just booked **${item.name}**!`,
        color: 0x10b981,
        fields: [
          { name: "Date", value: bookingDate, inline: true },
          { name: "Price", value: `₩${item.price.toLocaleString()} (Pay on site)`, inline: true },
          { name: "User Email", value: user.email, inline: false }
        ]
      });
    } catch (e) {
      console.error(e);
    }

    return NextResponse.json({ success: true, booking: newBooking });

  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}
