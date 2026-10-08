import React, { createContext, useContext, useState, useEffect } from 'react';
import en from './en.json';
import te from './te.json';
import hi from './hi.json';

export type SupportedLanguage = 'en' | 'te' | 'hi';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (path: string, fallback?: string) => any;
  languages: { code: SupportedLanguage; label: string; nativeName: string }[];
}

const translations: Record<SupportedLanguage, any> = {
  en,
  te,
  hi,
};

const languagesList: { code: SupportedLanguage; label: string; nativeName: string }[] = [
  { code: 'en', label: 'English', nativeName: 'English' },
  { code: 'te', label: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'hi', label: 'Hindi', nativeName: 'हिन्दी' },
];

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    const saved = localStorage.getItem('centrevision_lang');
    if (saved === 'te' || saved === 'hi' || saved === 'en') {
      return saved;
    }
    return 'en';
  });

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    localStorage.setItem('centrevision_lang', lang);
  };

  const t = (path: string, fallback?: string): any => {
    const keys = path.split('.');
    let current = translations[language];
    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        // Fallback to English
        let enCurrent = translations['en'];
        for (const k of keys) {
          if (enCurrent && typeof enCurrent === 'object' && k in enCurrent) {
            enCurrent = enCurrent[k];
          } else {
            return fallback || path;
          }
        }
        return enCurrent ?? fallback ?? path;
      }
    }
    return current ?? fallback ?? path;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languages: languagesList }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
