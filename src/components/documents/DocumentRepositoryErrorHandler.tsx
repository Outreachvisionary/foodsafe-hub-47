
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface DocumentRepositoryErrorHandlerProps {
  error: string | null;
  onRetry?: () => void;
}

export const DocumentRepositoryErrorHandler: React.FC<DocumentRepositoryErrorHandlerProps> = ({ 
  error, 
  onRetry 
}) => {
  if (!error) return null;

  return (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error Loading Documents</AlertTitle>
      <AlertDescription className="mt-2">
        {error}
        {onRetry && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRetry}
            className="mt-2 ml-0"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};
