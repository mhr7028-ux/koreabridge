'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global Error Boundary caught:', error);
  }, [error]);

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      minHeight: '60vh', padding: '2rem', textAlign: 'center'
    }}>
      <h2 style={{ fontSize: '2rem', color: '#ef4444', marginBottom: '1rem' }}>
        Oops! Something went wrong.
      </h2>
      <p style={{ color: '#9ca3af', marginBottom: '2rem' }}>
        We are sorry, but an unexpected error occurred. Our team has been notified.
      </p>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button
          onClick={() => reset()}
          style={{
            padding: '10px 20px', borderRadius: '8px', background: '#3b82f6',
            color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold'
          }}
        >
          Try again
        </button>
        <Link href="/" style={{
          padding: '10px 20px', borderRadius: '8px', background: '#374151',
          color: 'white', textDecoration: 'none', fontWeight: 'bold'
        }}>
          Return Home
        </Link>
      </div>
    </div>
  );
}
