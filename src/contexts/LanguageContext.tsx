
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import i18n from 'i18next';

// Define types for language context
interface LanguageContextType {
  currentLanguage: string;
  changeLanguage: (language: string) => void;
  supportedLanguages: { code: string; name: string }[];
  loadingTranslations: boolean;
}

// Create the context with a default undefined value
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Available languages in the application
const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'ar', name: 'العربية' }
];

// Provider component that wraps the app and makes language context available
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<string>(i18n.language || 'en');
  const [loadingTranslations, setLoadingTranslations] = useState<boolean>(false);

  // Function to change the current language
  const changeLanguage = async (language: string) => {
    setLoadingTranslations(true);
    try {
      await i18n.changeLanguage(language);
      setCurrentLanguage(language);
      // Save language preference to localStorage
      localStorage.setItem('language', language);
    } catch (error) {
      console.error('Error changing language:', error);
    } finally {
      setLoadingTranslations(false);
    }
  };

  // Initialize language on component mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && savedLanguage !== currentLanguage) {
      changeLanguage(savedLanguage);
    }
  }, []);

  // Context value
  const value = {
    currentLanguage,
    changeLanguage,
    supportedLanguages: SUPPORTED_LANGUAGES,
    loadingTranslations
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
