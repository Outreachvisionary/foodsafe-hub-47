
import React from 'react';

interface LoadingProps {
  message?: string;
}

const Loading: React.FC<LoadingProps> = ({ message = 'Loading...' }) => {
  console.log('Loading component rendered with message:', message);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">{message}</p>
        <div className="mt-2 text-xs text-muted-foreground/70">
          Initializing authentication system...
        </div>
      </div>
    </div>
  );
};

export default Loading;
