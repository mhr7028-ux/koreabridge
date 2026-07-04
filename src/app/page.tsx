'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import styles from './page.module.css';
import { translations } from '@/data/translations';

export default function Home() {
  const [lang, setLang] = useState('en');
  const t = translations[lang] || translations['en'];

  return (
    <div className={styles.homeContainer}>
      {/* Hero Section */}
      <motion.section 
        className={styles.heroSection}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <motion.span 
            className={styles.badgeGold}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            🇰🇷 Dive into Busan, Speak Korean! 안녕하세요!
          </motion.span>
          <motion.h2 
            style={{ fontSize: '2.8rem', fontWeight: '800', marginBottom: '15px', color: '#fff' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Yaho Busan~~ <span style={{ color: '#fbbf24' }}>안녕하세요!</span>
          </motion.h2>
          <motion.p 
            style={{ fontSize: '1.2rem', lineHeight: '1.6', maxWidth: '700px', margin: '0 auto 30px', color: '#e5e7eb' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            Remember when BTS shouted <strong>'Yaho Busan!'</strong>? <br />
            Now it's your turn to experience the energy of Busan with KoreaBridge!
          </motion.p>
          <motion.div 
            className={styles.heroActions}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            <button className={`${styles.btnPrimary} btn-premium`}>Get Started (Free Trial)</button>
          </motion.div>
        </div>
      </motion.section>

      {/* AEB Methodology */}
      <motion.section 
        className={styles.section}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
      >
        <div className={styles.sectionTitle}>
          <h2>🧠 The AEB Teaching Methodology</h2>
          <p>"Trick the brain, shout with your mouth, and engrave with your hands!"</p>
        </div>
        <div className={styles.gridThreeCol}>
          {[
            { icon: '🗣️', title: '1. Speak (입으로 외쳐라)', desc: 'Learn the Hangeul reading system in just 1 day. Recite survival Korean for 5 minutes daily.' },
            { icon: '✍️', title: '2. Engrave (손으로 새겨라)', desc: 'Physically write Korean characters by hand in a notebook. Upload a photo for AI feedback.' },
            { icon: '📸', title: '3. Share (인스타 과제)', desc: 'Record a 10-second practice video daily, upload it to Instagram tagged with @korea.bridge.' }
          ].map((item, index) => (
            <motion.div 
              className={`${styles.card} glass-panel`}
              key={index}
              whileHover={{ y: -10, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className={styles.cardIcon}>{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Course Pricing Section */}
      <motion.section 
        className={styles.section}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
      >
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
          <motion.div 
            className={`${styles.pricingCard} glass-panel`}
            whileHover={{ y: -10 }}
          >
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
            <button className={`${styles.btnSecondary} btn-premium`} style={{ background: 'transparent', border: '1px solid #7c4dff', color: '#f1f3f9' }}>Choose Starter</button>
          </motion.div>

          {/* Premium */}
          <motion.div 
            className={`${styles.pricingCard} ${styles.premiumCard} glass-panel`}
            whileHover={{ y: -15, scale: 1.02 }}
            initial={{ scale: 1.05 }}
          >
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
            <button className="btn-premium" style={{ width: '100%' }}>Choose Premium</button>
          </motion.div>

          {/* Intensive */}
          <motion.div 
            className={`${styles.pricingCard} glass-panel`}
            whileHover={{ y: -10 }}
          >
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
            <button className={`${styles.btnSecondary} btn-premium`} style={{ background: 'transparent', border: '1px solid #7c4dff', color: '#f1f3f9' }}>Choose Intensive</button>
          </motion.div>
        </div>

        {/* Payment Information */}
        <motion.div 
          style={{ maxWidth: '800px', margin: '40px auto 0', padding: '30px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid #3b82f6', borderRadius: '16px', textAlign: 'center' }}
          className="glass-panel"
          whileHover={{ scale: 1.02 }}
        >
          <h3 style={{ color: '#60a5fa', fontSize: '1.4rem', margin: '0 0 15px 0' }}>💳 How to Pay (Payment Information)</h3>
          <p style={{ color: '#d1d5db', fontSize: '1.1rem', margin: '0 0 20px 0' }}>
            We currently accept international payments via <strong style={{ color: '#60a5fa' }}>PayPal</strong>.
          </p>
          <div style={{ display: 'inline-block', background: '#1e3a8a', padding: '15px 30px', borderRadius: '12px', margin: '0 0 15px 0' }}>
            <div style={{ color: '#93c5fd', fontSize: '0.9rem', marginBottom: '5px' }}>PayPal Account (Email)</div>
            <div style={{ color: '#fff', fontSize: '1.3rem', fontWeight: 'bold' }}>mhr73@naver.com</div>
          </div>
          <p style={{ color: '#9ca3af', fontSize: '0.95rem', margin: 0 }}>
            Please send the class fee to the PayPal email above, and contact us with your name!
          </p>
        </motion.div>
      </motion.section>
    </div>
  );
}
