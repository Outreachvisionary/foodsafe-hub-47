import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader, AlertTriangle } from 'lucide-react';

interface LoadingTimeoutProps {
  children: React.ReactNode;
  isLoading: boolean;
  timeoutMs?: number;
}

const LoadingTimeout: React.FC<LoadingTimeoutProps> = ({ 
  children, 
  isLoading, 
  timeoutMs = 15000 
}) => {
  const [isTimedOut, setIsTimedOut] = useState(false);
  
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    
    if (isLoading) {
      timer = setTimeout(() => {
        setIsTimedOut(true);
      }, timeoutMs);
    } else {
      setIsTimedOut(false);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isLoading, timeoutMs]);
  
  if (isLoading && !isTimedOut) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <Loader className="h-10 w-10 animate-spin text-blue-500 mb-4" />
        <p className="text-gray-600">Loading... Please wait while we prepare your data</p>
      </div>
    );
  }
  
  if (isTimedOut) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border border-yellow-200 rounded bg-yellow-50">
        <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
        <h3 className="text-lg font-medium text-yellow-800 mb-2">Loading Timeout</h3>
        <p className="text-yellow-700 mb-4 text-center">
          The data is taking longer than expected to load. There might be a connection issue.
        </p>
        <Button 
          onClick={() => window.location.reload()}
          className="bg-blue-500 hover:bg-blue-600"
        >
          Refresh Page
        </Button>
      </div>
    );
  }
  
  return <>{children}</>;
};

export default LoadingTimeout;
