'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import styles from './Header.module.css';

export default function Header() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  return (
    <header className={styles.appHeader}>
      <div className={styles.logoArea}>
        <span className={styles.logoIcon}>🌉</span>
        <div className={styles.logoText}>
          <h1>KoreaBridge</h1>
          <p>한글브릿지</p>
        </div>
      </div>
      
      <nav className={styles.navTabs}>
        <div className={styles.navGroup}>
          <span className={styles.navGroupTitle}>📚 Study</span>
          <Link href="/" className={`${styles.navBtn} ${pathname === '/' ? styles.active : ''}`}>
            🏠 Home
          </Link>
          <Link href="/study/aeb" className={`${styles.navBtn} ${pathname.includes('/aeb') ? styles.active : ''}`}>
            🛡️ AEB Study
          </Link>
          <Link href="/study/class" className={`${styles.navBtn} ${pathname.includes('/class') ? styles.active : ''}`}>
            💻 Live Class
          </Link>
        </div>

        <div className={styles.navDivider}></div>

        <div className={styles.navGroup}>
          <span className={styles.navGroupTitle}>🌊 Travel</span>
          <Link href="/travel/buddy" className={`${styles.navBtn} ${pathname.includes('/buddy') ? styles.active : ''}`}>
            🤝 Busan Buddy
          </Link>
          <Link href="/travel/flyer" className={`${styles.navBtn} ${pathname.includes('/flyer') ? styles.active : ''}`}>
            🎴 Flyer
          </Link>
        </div>
      </nav>

      <div className={styles.authArea}>
        {status === 'loading' ? (
          <span style={{ color: '#9ca3af' }}>Loading...</span>
        ) : session ? (
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <span style={{ color: '#fff' }}>Hi, {session.user?.name}!</span>
            {(session.user as any)?.role === 'admin' && (
              <Link href="/admin" style={{ background: '#ffc107', padding: '8px 15px', borderRadius: '8px', color: '#000', fontWeight: 'bold', textDecoration: 'none' }}>
                🛡️ Admin
              </Link>
            )}
            <button 
              onClick={() => signOut()} 
              style={{ background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer' }}
            >
              Logout
            </button>
          </div>
        ) : (
          <Link href="/login" className={styles.loginBtn}>🔑 Login</Link>
        )}
      </div>
    </header>
  );
}
