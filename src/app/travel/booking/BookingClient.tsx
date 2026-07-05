'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';

type RentalItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string | null;
};

export default function BookingClient({ rentalItems, isLoggedIn }: { rentalItems: RentalItem[], isLoggedIn: boolean }) {
  const [selectedItem, setSelectedItem] = useState<RentalItem | null>(null);
  const [bookingDate, setBookingDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBookClick = (item: RentalItem) => {
    if (!isLoggedIn) {
      alert("Please sign in to make a booking.");
      signIn();
      return;
    }
    setSelectedItem(item);
    setBookingDate('');
  };

  const submitBooking = async () => {
    if (!bookingDate) return alert("Please select a date.");
    if (!selectedItem) return;
    
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rentalItemId: selectedItem.id,
          bookingDate
        })
      });
      if (res.ok) {
        alert("Booking confirmed! Please pay on site.");
        setSelectedItem(null);
      } else {
        alert("Failed to create booking");
      }
    } catch (e) {
      alert("Error creating booking");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Items Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
        {rentalItems.map(item => (
          <div key={item.id} style={{ background: '#1f2937', borderRadius: '16px', overflow: 'hidden', border: '1px solid #374151', display: 'flex', flexDirection: 'column' }}>
            {item.imageUrl ? (
              <div style={{ height: '200px', backgroundImage: `url(${item.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
            ) : (
              <div style={{ height: '200px', background: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>No Image</div>
            )}
            <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ color: '#fff', fontSize: '1.4rem', marginBottom: '10px' }}>{item.name}</h3>
              <p style={{ color: '#d1d5db', fontSize: '0.95rem', marginBottom: '20px', lineHeight: '1.5', flex: 1 }}>
                {item.description}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #374151', paddingTop: '20px' }}>
                <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '1.2rem' }}>
                  ₩{item.price.toLocaleString()}
                </span>
                <button 
                  onClick={() => handleBookClick(item)}
                  style={{ background: '#3b82f6', color: '#fff', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {rentalItems.length === 0 && (
        <div style={{ textAlign: 'center', color: '#9ca3af', padding: '40px' }}>
          No rental items available at the moment.
        </div>
      )}

      {/* Booking Modal */}
      {selectedItem && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#1f2937', padding: '40px', borderRadius: '20px', maxWidth: '500px', width: '100%', border: '1px solid #374151' }}>
            <h2 style={{ color: '#fff', marginBottom: '10px' }}>Book {selectedItem.name}</h2>
            <p style={{ color: '#d1d5db', marginBottom: '30px', fontSize: '0.95rem' }}>
              Select a date for your reservation. Payment (₩{selectedItem.price.toLocaleString()}) will be collected on site.
            </p>
            
            <input 
              type="date" 
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
              style={{ width: '100%', padding: '15px', borderRadius: '10px', background: '#374151', border: 'none', color: '#fff', marginBottom: '20px', colorScheme: 'dark' }}
            />
            
            <div style={{ display: 'flex', gap: '15px' }}>
              <button 
                onClick={() => setSelectedItem(null)}
                style={{ flex: 1, padding: '15px', background: 'transparent', border: '1px solid #6b7280', color: '#d1d5db', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Cancel
              </button>
              <button 
                onClick={submitBooking}
                disabled={isSubmitting}
                style={{ flex: 1, padding: '15px', background: '#10b981', border: 'none', color: '#fff', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', opacity: isSubmitting ? 0.7 : 1 }}
              >
                {isSubmitting ? 'Confirming...' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
