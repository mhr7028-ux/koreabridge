'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Header.module.css';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLanguage } from '@/i18n/LanguageContext';

export default function Header() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const AuthContent = () => (
    <>
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
                <span style={{ fontWeight: 'bold' }}>{session.user?.name}</span>
              </Link>
            )}
            <span>!</span>
          </span>
          <button
            onClick={() => signOut()}
            style={{ background: 'transparent', border: '1px solid rgba(239, 68, 68, 0.5)', color: '#ef4444', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem' }}
          >
            {t.header.logout}
          </button>
        </div>
      ) : (
        <Link href="/login" className={styles.loginBtn}>🔑 {t.header.login}</Link>
      )}
    </>
  );

  return (
    <motion.header 
      className={`${styles.appHeader} glass-panel`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
    >
      <div className={styles.logoArea} style={{ background: '#fff', padding: '2px', borderRadius: '4px', display: 'flex', alignItems: 'center', marginRight: '10px' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <img src="/logo.png" alt="KoreaBridge Logo" style={{ height: '36px', width: 'auto' }} />
        </Link>
      </div>

      {/* Desktop Navigation */}
      <nav className={styles.navTabs}>
        <div className={styles.navGroup}>
          <span className={styles.navGroupTitle} style={{ marginLeft: 0 }}>{t.header.study.title}</span>
          <div className={styles.navGroupItems}>
            <Link href="/" className={`${styles.navBtn} ${pathname === '/' ? styles.active : ''}`}>
              🏠 {t.header.study.home}
            </Link>
            <Link href="/study/aeb" className={`${styles.navBtn} ${pathname.includes('/aeb') ? styles.active : ''}`}>
              🛡️ {t.header.study.kbStudy}
            </Link>
            <Link href="/study/class" className={`${styles.navBtn} ${pathname.includes('/class') ? styles.active : ''}`}>
              💻 {t.header.study.liveClass}
            </Link>
            <Link href="/study/gallery" className={`${styles.navBtn} ${pathname.includes('/gallery') ? styles.active : ''}`}>
              🎬 Gallery
            </Link>
          </div>
        </div>

        <div className={styles.navDivider}></div>

        <div className={styles.navGroup}>
          <span className={styles.navGroupTitle}> {t.header.community.title}</span>
          <div className={styles.navGroupItems}>
            <a href="https://discord.gg/your-invite-link" target="_blank" rel="noopener noreferrer" className={styles.navBtn} title="KoreaBridge Main Campus">
              👾 Discord
            </a>
            <a href="https://chat.whatsapp.com/your-invite-link" target="_blank" rel="noopener noreferrer" className={styles.navBtn} title="Emergency & Notice">
              💬 WhatsApp
            </a>
          </div>
        </div>

        <div className={styles.navDivider}></div>

        <div className={styles.navGroup}>
          <span className={styles.navGroupTitle}> {t.header.travel.title}</span>
          <div className={styles.navGroupItems}>
            <Link href="/travel/buddy" className={`${styles.navBtn} ${pathname.includes('/buddy') ? styles.active : ''}`}>
              🤝 {t.header.travel.busanBuddy}
            </Link>
            <Link href="/travel/adventure" className={`${styles.navBtn} ${pathname.includes('/adventure') ? styles.active : ''}`}>
              📍 {t.header.travel.adventure}
            </Link>
            <Link href="/travel/booking" className={`${styles.navBtn} ${pathname.includes('/booking') ? styles.active : ''}`}>
              🚲 {t.header.travel.rentals}
            </Link>
            <Link href="/travel/festival" className={`${styles.navBtn} ${pathname.includes('/festival') ? styles.active : ''}`}>
              🎉 {t.header.travel.festival}
            </Link>
            <Link href="/contact" className={`${styles.navBtn} ${pathname.includes('/contact') ? styles.active : ''}`}>
              📞 {t.header.travel.contact}
            </Link>
          </div>
        </div>
      </nav>

      {/* Right Controls (Desktop Auth + Language + Hamburger) */}
      <div className={styles.rightControls}>
        <LanguageSwitcher />

        <div className={styles.authArea}>
          <AuthContent />
        </div>

        <button 
          className={styles.hamburgerBtn}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Sidebar Navigation */}
      <div className={`${styles.mobileSidebar} ${isMobileMenuOpen ? styles.open : ''}`}>
        
        {/* Mobile Auth Area */}
        <div style={{ marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px' }}>
          <AuthContent />
        </div>

        <div className={styles.mobileSidebarGroup}>
          <div className={styles.mobileSidebarGroupTitle}>{t.header.study.title}</div>
          <div className={styles.mobileSidebarItems}>
            <Link href="/" className={`${styles.mobileSidebarBtn} ${pathname === '/' ? styles.active : ''}`}>
              🏠 {t.header.study.home}
            </Link>
            <Link href="/study/aeb" className={`${styles.mobileSidebarBtn} ${pathname.includes('/aeb') ? styles.active : ''}`}>
              🛡️ {t.header.study.kbStudy}
            </Link>
            <Link href="/study/class" className={`${styles.mobileSidebarBtn} ${pathname.includes('/class') ? styles.active : ''}`}>
              💻 {t.header.study.liveClass}
            </Link>
            <Link href="/study/gallery" className={`${styles.mobileSidebarBtn} ${pathname.includes('/gallery') ? styles.active : ''}`}>
              🎬 Gallery
            </Link>
          </div>
        </div>

        <div className={styles.mobileSidebarGroup}>
          <div className={styles.mobileSidebarGroupTitle}>{t.header.community.title}</div>
          <div className={styles.mobileSidebarItems}>
            <a href="https://discord.gg/your-invite-link" target="_blank" rel="noopener noreferrer" className={styles.mobileSidebarBtn}>
              👾 Discord
            </a>
            <a href="https://chat.whatsapp.com/your-invite-link" target="_blank" rel="noopener noreferrer" className={styles.mobileSidebarBtn}>
              💬 WhatsApp
            </a>
          </div>
        </div>

        <div className={styles.mobileSidebarGroup}>
          <div className={styles.mobileSidebarGroupTitle}>{t.header.travel.title}</div>
          <div className={styles.mobileSidebarItems}>
            <Link href="/travel/buddy" className={`${styles.mobileSidebarBtn} ${pathname.includes('/buddy') ? styles.active : ''}`}>
              🤝 {t.header.travel.busanBuddy}
            </Link>
            <Link href="/travel/adventure" className={`${styles.mobileSidebarBtn} ${pathname.includes('/adventure') ? styles.active : ''}`}>
              📍 {t.header.travel.adventure}
            </Link>
            <Link href="/travel/booking" className={`${styles.mobileSidebarBtn} ${pathname.includes('/booking') ? styles.active : ''}`}>
              🚲 {t.header.travel.rentals}
            </Link>
            <Link href="/travel/festival" className={`${styles.mobileSidebarBtn} ${pathname.includes('/festival') ? styles.active : ''}`}>
              🎉 {t.header.travel.festival}
            </Link>
            <Link href="/contact" className={`${styles.mobileSidebarBtn} ${pathname.includes('/contact') ? styles.active : ''}`}>
              📞 {t.header.travel.contact}
            </Link>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
