
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
        <p className="text-muted-foreground text-lg">{message}</p>
        {message.includes('authentication') && (
          <>
            <div className="mt-4 text-sm text-muted-foreground/70">
              Verifying your session...
            </div>
            <div className="mt-2 text-xs text-muted-foreground/50">
              This should only take a moment
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Loading;
