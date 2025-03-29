
// src/components/layout/AppLayout.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface AppLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  showBackButton?: boolean;
  onBack?: () => void;
}

const AppLayout: React.FC<AppLayoutProps> = ({ 
  title, 
  subtitle, 
  children, 
  showBackButton,
  onBack
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
            {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
          </div>
          {showBackButton && (
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
          )}
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        {children}
      </div>
    </div>
  );
};

export default AppLayout;
