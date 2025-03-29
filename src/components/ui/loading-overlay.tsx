
import React from 'react';
import { LoadingSpinner } from './loading-spinner';

interface LoadingOverlayProps {
  message?: string;
  submessage?: string;
}

export function LoadingOverlay({ 
  message = "Loading...", 
  submessage = "Please wait while we prepare your data" 
}: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background/95 z-50">
      <LoadingSpinner size="lg" className="text-primary mb-4" />
      <h2 className="text-xl font-medium text-foreground">{message}</h2>
      <p className="text-muted-foreground mt-2">{submessage}</p>
    </div>
  );
}
