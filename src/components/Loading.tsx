
import React from 'react';

interface LoadingProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

const Loading: React.FC<LoadingProps> = ({ 
  message = 'Loading...', 
  size = 'md',
  fullScreen = true 
}) => {
  console.log('Loading component rendered with message:', message);
  
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  const containerClasses = fullScreen 
    ? 'min-h-screen flex items-center justify-center bg-background'
    : 'flex items-center justify-center p-8';
  
  return (
    <div className={containerClasses}>
      <div className="text-center">
        <div className={`animate-spin rounded-full border-b-2 border-primary mx-auto mb-4 ${sizeClasses[size]}`}></div>
        <p className="text-muted-foreground text-lg">{message}</p>
        <div className="mt-2 text-xs text-muted-foreground/50">
          Please wait while we load your content
        </div>
      </div>
    </div>
  );
};

export default Loading;
