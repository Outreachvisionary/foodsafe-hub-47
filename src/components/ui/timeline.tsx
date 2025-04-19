
import React, { ReactNode } from 'react';

interface TimelineProps {
  children: ReactNode;
}

interface TimelineItemProps {
  children: ReactNode;
}

interface TimelineContentProps {
  children: ReactNode;
}

interface TimelineSeparatorProps {
  children: ReactNode;
}

interface TimelineDotProps {
  variant?: 'filled' | 'outlined';
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  className?: string;
  children?: ReactNode;
}

interface TimelineConnectorProps {
  className?: string;
}

export const Timeline: React.FC<TimelineProps> = ({ children }) => {
  return <div className="relative ml-3">{children}</div>;
};

export const TimelineItem: React.FC<TimelineItemProps> = ({ children }) => {
  return <div className="mb-8 flex">{children}</div>;
};

export const TimelineContent: React.FC<TimelineContentProps> = ({ children }) => {
  return <div className="ml-4 pt-0.5">{children}</div>;
};

export const TimelineSeparator: React.FC<TimelineSeparatorProps> = ({ children }) => {
  return <div className="flex flex-col items-center">{children}</div>;
};

export const TimelineDot: React.FC<TimelineDotProps> = ({ 
  variant = 'filled', 
  color = 'primary',
  className = '',
  children
}) => {
  const baseClasses = "rounded-full h-6 w-6 z-10 flex items-center justify-center ";
  
  const colorClasses = {
    primary: "bg-primary text-primary-foreground",
    secondary: "bg-gray-500 text-white",
    error: "bg-red-500 text-white",
    info: "bg-blue-500 text-white",
    success: "bg-green-500 text-white",
    warning: "bg-yellow-500 text-white",
  };
  
  return (
    <div className={`${baseClasses} ${colorClasses[color]} ${className}`}>
      {children}
    </div>
  );
};

export const TimelineConnector: React.FC<TimelineConnectorProps> = ({ className = '' }) => {
  return <div className={`w-0.5 h-full bg-gray-300 ${className}`}></div>;
};
