
import React, { createContext, useContext, useState, useEffect } from 'react';
import i18n from 'i18next';
import { useUser } from './UserContext';
import { supabase } from '@/integrations/supabase/client';

interface LanguageProviderProps {
  children: React.ReactNode;
}

interface LanguageContextValue {
  language: string;
  changeLanguage: (lang: string) => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  language: 'en',
  changeLanguage: () => {}
});

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<string>('en');
  const { user, updateUserProfile } = useUser();

  useEffect(() => {
    // Set default language from browser if no user preference
    const defaultLang = navigator.language.split('-')[0];
    
    // If user is logged in, try to get their preference from profile
    if (user) {
      const fetchUserLanguage = async () => {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('preferred_language')
            .eq('id', user.id)
            .single();
          
          if (data && data.preferred_language) {
            const userLang = data.preferred_language;
            await i18n.changeLanguage(userLang);
            setLanguage(userLang);
          } else {
            await i18n.changeLanguage(defaultLang);
            setLanguage(defaultLang);
          }
        } catch (error) {
          console.error('Error fetching user language preference:', error);
          await i18n.changeLanguage(defaultLang);
          setLanguage(defaultLang);
        }
      };
      
      fetchUserLanguage();
    } else {
      // No user, use default language
      i18n.changeLanguage(defaultLang);
      setLanguage(defaultLang);
    }
  }, [user]);
  
  const changeLanguage = async (lang: string) => {
    try {
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
    }
  };
  
  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

export default LanguageContext;
