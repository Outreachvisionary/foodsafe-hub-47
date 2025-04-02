
import React from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '@/components/LanguageSelector';

interface DocumentRepositoryHeaderProps {
  title?: string;
}

const DocumentRepositoryHeader: React.FC<DocumentRepositoryHeaderProps> = ({ 
  title 
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">
        {title || t('documents.repository')}
      </h1>
      <div className="flex items-center gap-4">
        <LanguageSelector />
      </div>
    </div>
  );
};

export default DocumentRepositoryHeader;
