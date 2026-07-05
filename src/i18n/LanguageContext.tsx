'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import en from './dictionaries/en.json';
import ko from './dictionaries/ko.json';

type Language = 'en' | 'ko';
type Dictionary = typeof en;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Dictionary;
}

const dictionaries: Record<Language, Dictionary> = { en, ko };

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    // Load saved language from localStorage
    const saved = localStorage.getItem('kb_language') as Language;
    if (saved && (saved === 'en' || saved === 'ko')) {
      setLanguageState(saved);
    } else {
      // Auto-detect based on browser
      const browserLang = navigator.language.slice(0, 2);
      if (browserLang === 'ko') {
        setLanguageState('ko');
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('kb_language', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: dictionaries[language] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
