
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';

const LanguageSelector = () => {
  const { t } = useTranslation();
  const { language, changeLanguage, supportedLanguages, loadingTranslations } = useLanguage();

  const handleLanguageChange = (languageCode: string) => {
    changeLanguage(languageCode);
  };

  const getCurrentLanguageName = () => {
    const currentLang = supportedLanguages.find(lang => lang.code === language);
    return currentLang ? t(`common.${currentLang.code === 'en' ? 'english' : currentLang.code === 'es' ? 'spanish' : currentLang.code === 'fr' ? 'french' : currentLang.code === 'de' ? 'german' : 'arabic'}`) : '';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2" disabled={loadingTranslations}>
          <Globe className="h-4 w-4" />
          <span>{getCurrentLanguageName()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {supportedLanguages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={lang.code === language ? 'bg-accent font-medium' : ''}
          >
            {t(`common.${lang.code === 'en' ? 'english' : lang.code === 'es' ? 'spanish' : lang.code === 'fr' ? 'french' : lang.code === 'de' ? 'german' : 'arabic'}`)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
