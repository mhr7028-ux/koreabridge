import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      minHeight: '60vh', padding: '2rem', textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '4rem', color: '#ffc107', marginBottom: '1rem' }}>404</h1>
      <h2 style={{ fontSize: '2rem', color: '#f1f3f9', marginBottom: '1rem' }}>
        Page Not Found
      </h2>
      <p style={{ color: '#9ca3af', marginBottom: '2rem', maxWidth: '400px' }}>
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link href="/" style={{
        padding: '12px 24px', borderRadius: '8px', background: '#7c4dff',
        color: 'white', textDecoration: 'none', fontWeight: 'bold',
        boxShadow: '0 4px 12px rgba(124, 77, 255, 0.3)'
      }}>
        Return Home
      </Link>
    </div>
  );
}
