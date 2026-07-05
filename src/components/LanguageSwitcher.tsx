'use client';

import { useLanguage } from '@/i18n/LanguageContext';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
      <button
        onClick={() => setLanguage('en')}
        style={{
          background: language === 'en' ? 'rgba(124, 77, 255, 0.2)' : 'transparent',
          border: `1px solid ${language === 'en' ? 'rgba(124, 77, 255, 0.5)' : 'transparent'}`,
          color: language === 'en' ? '#f1f3f9' : '#a0aec0',
          padding: '4px 8px',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '12px',
          transition: 'all 0.2s ease',
        }}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('ko')}
        style={{
          background: language === 'ko' ? 'rgba(124, 77, 255, 0.2)' : 'transparent',
          border: `1px solid ${language === 'ko' ? 'rgba(124, 77, 255, 0.5)' : 'transparent'}`,
          color: language === 'ko' ? '#f1f3f9' : '#a0aec0',
          padding: '4px 8px',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '12px',
          transition: 'all 0.2s ease',
        }}
      >
        KO
      </button>
    </div>
  );
}
