
import React from 'react';

export interface DashboardHeaderProps {
  title: React.ReactNode;
  subtitle: string;
  className?: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ title, subtitle, className }) => {
  return (
    <div className={`mb-8 ${className || ''}`}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="text-muted-foreground mt-1">{subtitle}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
