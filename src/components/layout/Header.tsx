'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { motion } from 'framer-motion';
import styles from './Header.module.css';

export default function Header() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  return (
    <motion.header 
      className={`${styles.appHeader} glass-panel`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
      style={{ borderBottom: '1px solid var(--glass-border)' }}
    >
      <div className={styles.logoArea} style={{ background: '#fff', padding: '2px', borderRadius: '4px', display: 'flex', alignItems: 'center', marginRight: '10px' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <img src="/logo.png" alt="KoreaBridge Logo" style={{ height: '36px', width: 'auto' }} />
        </Link>
      </div>

      <nav className={styles.navTabs}>
        <div className={styles.navGroup}>
          <span className={styles.navGroupTitle} style={{ marginLeft: 0 }}>Study</span>
          <Link href="/" className={`${styles.navBtn} ${pathname === '/' ? styles.active : ''}`}>
            🏠 Home
          </Link>
          <Link href="/study/aeb" className={`${styles.navBtn} ${pathname.includes('/aeb') ? styles.active : ''}`}>
            🛡️ KB Study
          </Link>
          <Link href="/study/class" className={`${styles.navBtn} ${pathname.includes('/class') ? styles.active : ''}`}>
            💻 Live Class
          </Link>
          <Link href="/study/gallery" className={`${styles.navBtn} ${pathname.includes('/gallery') ? styles.active : ''}`}>
            🎬 Gallery
          </Link>
        </div>

        <div className={styles.navDivider}></div>

        <div className={styles.navGroup}>
          <span className={styles.navGroupTitle}> Community</span>
          <a href="https://discord.gg/your-invite-link" target="_blank" rel="noopener noreferrer" className={styles.navBtn} title="KoreaBridge Main Campus">
            👾 Discord
          </a>
          <a href="https://chat.whatsapp.com/your-invite-link" target="_blank" rel="noopener noreferrer" className={styles.navBtn} title="Emergency & Notice">
            💬 WhatsApp
          </a>
        </div>

        <div className={styles.navDivider}></div>

        <div className={styles.navGroup}>
          <span className={styles.navGroupTitle}> Travel</span>
          <Link href="/travel/buddy" className={`${styles.navBtn} ${pathname.includes('/buddy') ? styles.active : ''}`}>
            🤝 Busan Buddy
          </Link>
          <Link href="/travel/adventure" className={`${styles.navBtn} ${pathname.includes('/adventure') ? styles.active : ''}`}>
            📍 Adventure
          </Link>
          <Link href="/travel/booking" className={`${styles.navBtn} ${pathname.includes('/booking') ? styles.active : ''}`}>
            🚲 Rentals
          </Link>
          <Link href="/travel/festival" className={`${styles.navBtn} ${pathname.includes('/festival') ? styles.active : ''}`}>
            🎉 Festival
          </Link>
          <Link href="/contact" className={`${styles.navBtn} ${pathname.includes('/contact') ? styles.active : ''}`}>
            📞 Contact
          </Link>
        </div>
      </nav>

      <div className={styles.authArea}>
        {status === 'loading' ? (
          <span style={{ color: '#9ca3af' }}>Loading...</span>
        ) : session ? (
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <span style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
              Hi,
              {(session.user as any)?.role === 'admin' ? (
                <Link href="/admin" style={{ color: '#ffc107', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 8px', borderRadius: '6px', background: 'rgba(255, 193, 7, 0.1)' }} title="Go to Admin Panel">
                  <span>🛡️</span>
                  <span style={{ fontWeight: 'bold' }}>{session.user?.name}</span>
                </Link>
              ) : (
                <Link href="/dashboard" style={{ color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(255,255,255,0.1)', padding: '4px 10px', borderRadius: '6px' }} title="Go to My Page">
                  <span>🎮</span>
                  <span style={{ fontWeight: 'bold' }}>{session.user?.name} (My Page)</span>
                </Link>
              )}
              <span style={{ marginLeft: '5px' }}>!</span>
            </span>
            <button
              onClick={() => signOut()}
              style={{ background: 'transparent', border: '1px solid rgba(239, 68, 68, 0.5)', color: '#ef4444', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem' }}
            >
              Logout
            </button>
          </div>
        ) : (
          <Link href="/login" className={styles.loginBtn}>🔑 Login</Link>
        )}
      </div>
    </motion.header>
  );
}
