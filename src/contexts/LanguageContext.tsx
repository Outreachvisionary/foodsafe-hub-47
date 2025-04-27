import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/contexts/UserContext';

interface LanguageContextType {
  currentLanguage: string;
  supportedLanguages: { code: string; name: string }[];
  changeLanguage: (language: string) => Promise<void>;
  loadingTranslations: boolean;
}

const defaultLanguage = 'en';

const supportedLanguages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
];

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();
  const { user, updateProfile } = useUser();
  const [currentLanguage, setCurrentLanguage] = useState(defaultLanguage);
  const [loadingTranslations, setLoadingTranslations] = useState(false);

  // Initialize language from user preferences or browser settings
  useEffect(() => {
    const initLanguage = async () => {
      try {
        // If user has a preferred language in their profile, use that
        if (user?.preferred_language) {
          await setUserLanguage(user.preferred_language);
          return;
        }

        // Otherwise, check browser language
        const browserLang = navigator.language.split('-')[0];
        const isSupported = supportedLanguages.some(lang => lang.code === browserLang);

        if (isSupported) {
          await setUserLanguage(browserLang);
        } else {
          await setUserLanguage(defaultLanguage);
        }
      } catch (error) {
        console.error('Error initializing language:', error);
        await setUserLanguage(defaultLanguage);
      }
    };

    initLanguage();
  }, [user?.id, user?.preferred_language]);

  const setUserLanguage = async (language: string) => {
    try {
      setLoadingTranslations(true);
      await i18n.changeLanguage(language);
      setCurrentLanguage(language);
    } catch (error) {
      console.error('Error setting language:', error);
    } finally {
      setLoadingTranslations(false);
    }
  };

  const changeLanguage = async (language: string) => {
    try {
      await setUserLanguage(language);

      // Update user profile if they're logged in
      if (user?.id) {
        await updateProfile({ preferred_language: language });
      }

      // Store in localStorage as fallback
      localStorage.setItem('preferredLanguage', language);
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  const contextValue: LanguageContextType = {
    currentLanguage,
    supportedLanguages,
    changeLanguage,
    loadingTranslations
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
