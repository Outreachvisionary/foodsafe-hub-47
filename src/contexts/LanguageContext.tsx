
import React, { createContext, useContext, useState, useEffect } from 'react';
import i18n from 'i18next';
import { useUser } from './UserContext';
import { supabase } from '@/integrations/supabase/client';

// Define supported languages
export type SupportedLanguage = {
  code: string;
  name: string;
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

interface LanguageContextValue {
  language: string;
  currentLanguage: string;  // Added for backward compatibility
  supportedLanguages: SupportedLanguage[];
  loadingTranslations: boolean;
  changeLanguage: (lang: string) => void;
}

const supportedLanguagesList: SupportedLanguage[] = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'ar', name: 'Arabic' }
];

const LanguageContext = createContext<LanguageContextValue>({
  language: 'en',
  currentLanguage: 'en',
  supportedLanguages: supportedLanguagesList,
  loadingTranslations: false,
  changeLanguage: () => {}
});

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<string>('en');
  const [loadingTranslations, setLoadingTranslations] = useState<boolean>(false);
  const { user, profile } = useUser();

  useEffect(() => {
    // Set default language from browser if no user preference
    const defaultLang = navigator.language.split('-')[0];
    
    // If user is logged in, try to get their preference from profile
    if (profile) {
      const fetchUserLanguage = async () => {
        try {
          setLoadingTranslations(true);
          if (profile.preferred_language) {
            const userLang = profile.preferred_language;
            await i18n.changeLanguage(userLang);
            setLanguage(userLang);
          } else {
            await i18n.changeLanguage(defaultLang);
            setLanguage(defaultLang);
          }
        } catch (error) {
          console.error('Error setting user language preference:', error);
          await i18n.changeLanguage(defaultLang);
          setLanguage(defaultLang);
        } finally {
          setLoadingTranslations(false);
        }
      };
      
      fetchUserLanguage();
    } else {
      // No user, use default language
      i18n.changeLanguage(defaultLang);
      setLanguage(defaultLang);
    }
  }, [profile]);
  
  const changeLanguage = async (lang: string) => {
    try {
      setLoadingTranslations(true);
      await i18n.changeLanguage(lang);
      setLanguage(lang);
      
      // Save language preference to user profile if logged in
      if (user) {
        await supabase
          .from('profiles')
          .update({ preferred_language: lang })
          .eq('id', user.id);
      }
    } catch (error) {
      console.error('Error changing language:', error);
    } finally {
      setLoadingTranslations(false);
    }
  };
  
  return (
    <LanguageContext.Provider value={{ 
      language, 
      currentLanguage: language, // Alias for backward compatibility
      supportedLanguages: supportedLanguagesList,
      loadingTranslations,
      changeLanguage 
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

export default LanguageContext;
