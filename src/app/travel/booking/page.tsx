import { prisma } from '@/lib/prisma';
import BookingClient from './BookingClient';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function BookingPage() {
  const session = await getServerSession(authOptions);
  
  const rentalItems = await prisma.rentalItem.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', padding: '6px 16px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.9rem' }}>
          Rentals & Tours 🚲
        </span>
        <h1 style={{ fontSize: '2.5rem', color: '#fff', margin: '20px 0 10px' }}>Book Your Adventure</h1>
        <p style={{ color: '#9ca3af', fontSize: '1.1rem' }}>Reserve electric bikes, local tours, and more. Pay easily on site!</p>
      </div>

      <BookingClient 
        rentalItems={rentalItems} 
        isLoggedIn={!!session?.user} 
      />
    </div>
  );
}
