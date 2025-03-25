
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';

interface LanguageContextType {
  currentLanguage: string;
  changeLanguage: (language: string) => void;
  supportedLanguages: { code: string; name: string }[];
  isRtl: boolean;
  loadingTranslations: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  currentLanguage: 'en',
  changeLanguage: () => {},
  supportedLanguages: [],
  isRtl: false,
  loadingTranslations: false,
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const { i18n } = useTranslation();
  const [loadingTranslations, setLoadingTranslations] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'en');

  const supportedLanguages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'ar', name: 'العربية' },
  ];

  const isRtl = currentLanguage === 'ar';

  // Load dynamic translations from Supabase if needed
  const loadDynamicTranslations = async (language: string) => {
    try {
      setLoadingTranslations(true);
      const { data, error } = await supabase
        .from('translations')
        .select('*')
        .eq('language', language);

      if (error) {
        console.error('Error loading translations:', error);
        return;
      }

      if (data && data.length > 0) {
        // Transform data into format suitable for i18next
        const dynamicTranslations: Record<string, string> = {};
        data.forEach((item) => {
          dynamicTranslations[item.key] = item.value;
        });

        // Add dynamic translations to i18n resources
        const existingResources = i18n.getResourceBundle(language, 'translation') || {};
        i18n.addResourceBundle(
          language,
          'translation',
          { ...existingResources, ...dynamicTranslations },
          true,
          true
        );
      }
    } catch (error) {
      console.error('Error in dynamic translations:', error);
    } finally {
      setLoadingTranslations(false);
    }
  };

  const changeLanguage = async (language: string) => {
    try {
      // First load any dynamic translations
      await loadDynamicTranslations(language);
      
      // Then change the language
      await i18n.changeLanguage(language);
      setCurrentLanguage(language);
      
      // Save user preference to localStorage
      localStorage.setItem('i18nextLng', language);
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  // Initialize language from localStorage or browser settings
  useEffect(() => {
    const savedLanguage = localStorage.getItem('i18nextLng');
    if (savedLanguage && supportedLanguages.some(lang => lang.code === savedLanguage)) {
      changeLanguage(savedLanguage);
    }
  }, []);

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        changeLanguage,
        supportedLanguages,
        isRtl,
        loadingTranslations,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};
