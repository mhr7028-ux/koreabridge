'use client';
import { useState } from 'react';
import styles from './page.module.css';
import { translations } from '@/data/translations';

export default function Home() {
  const [lang, setLang] = useState('en');
  const t = translations[lang] || translations['en'];

  return (
    <div className={styles.homeContainer}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <span className={styles.badgeGold}>🇰🇷 LEARN KOREAN IN BUSAN</span>
          <h2>Speak Korean in 3 Months!</h2>
          <p>
            Not just Korean lessons — your local friend in Busan. Read Hangeul in 1 day, 
            speak survival Korean in 3 months, and travel confidently.
          </p>
          <div className={styles.heroActions}>
            <button className={styles.btnPrimary}>Get Started (Free Trial)</button>
          </div>
        </div>
      </section>

      {/* AEB Methodology */}
      <section className={styles.section}>
        <div className={styles.sectionTitle}>
          <h2>🧠 The AEB Teaching Methodology</h2>
          <p>"Trick the brain, shout with your mouth, and engrave with your hands!"</p>
        </div>
        <div className={styles.gridThreeCol}>
          <div className={styles.card}>
            <div className={styles.cardIcon}>🗣️</div>
            <h3>1. Speak (입으로 외쳐라)</h3>
            <p>Learn the Hangeul reading system in just 1 day. Recite survival Korean for 5 minutes daily.</p>
          </div>
          <div className={styles.card}>
            <div className={styles.cardIcon}>✍️</div>
            <h3>2. Engrave (손으로 새겨라)</h3>
            <p>Physically write Korean characters by hand in a notebook. Upload a photo for AI feedback.</p>
          </div>
          <div className={styles.card}>
            <div className={styles.cardIcon}>📸</div>
            <h3>3. Share (인스타 과제)</h3>
            <p>Record a 10-second practice video daily, upload it to Instagram tagged with @korea.bridge.</p>
          </div>
        </div>
      </section>

      {/* Course Pricing Section */}
      <section className={styles.section}>
        <div className={styles.sectionTitle}>
          <h2>💰 Course Programs & Pricing</h2>
          <p>Affordable monthly subscription plans. Start your journey today.</p>
        </div>

        <div className={styles.langSelector}>
          {['en', 'jp'].map(l => (
            <button 
              key={l} 
              className={`${styles.langPill} ${lang === l ? styles.activeLang : ''}`}
              onClick={() => setLang(l)}
            >
              {l === 'en' ? '🇬🇧 English' : '🇯🇵 日本語'}
            </button>
          ))}
        </div>

        <div className={styles.gridThreeCol}>
          {/* Starter */}
          <div className={styles.pricingCard}>
            <h3>{t.starterName}</h3>
            <div className={styles.priceWrap}>
              <span className={styles.price}>{t.starterPrice}</span>
              <span className={styles.period}>{t.starterPeriod}</span>
            </div>
            <p className={styles.desc}>{t.starterDesc}</p>
            <ul className={styles.features}>
              {t.bullets.starter.map((bullet, i) => (
                <li key={i}>✅ {bullet}</li>
              ))}
            </ul>
            <button className={styles.btnSecondary}>Choose Starter</button>
          </div>

          {/* Premium */}
          <div className={`${styles.pricingCard} ${styles.premiumCard}`}>
            <div className={styles.popularBadge}>Most Popular</div>
            <h3>{t.premiumName}</h3>
            <div className={styles.priceWrap}>
              <span className={styles.price}>{t.premiumPrice}</span>
              <span className={styles.period}>{t.premiumPeriod}</span>
            </div>
            <p className={styles.desc}>{t.premiumDesc}</p>
            <ul className={styles.features}>
              {t.bullets.premium.map((bullet, i) => (
                <li key={i}>✨ {bullet}</li>
              ))}
            </ul>
            <button className={styles.btnPrimary}>Choose Premium</button>
          </div>

          {/* Intensive */}
          <div className={styles.pricingCard}>
            <h3>{t.intensiveName}</h3>
            <div className={styles.priceWrap}>
              <span className={styles.price}>{t.intensivePrice}</span>
              <span className={styles.period}>{t.intensivePeriod}</span>
            </div>
            <p className={styles.desc}>{t.intensiveDesc}</p>
            <ul className={styles.features}>
              {t.bullets.intensive.map((bullet, i) => (
                <li key={i}>🚀 {bullet}</li>
              ))}
            </ul>
            <button className={styles.btnSecondary}>Choose Intensive</button>
          </div>
        </div>
      </section>
    </div>
  );
}
