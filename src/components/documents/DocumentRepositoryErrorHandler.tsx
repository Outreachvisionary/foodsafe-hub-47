
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface DocumentRepositoryErrorHandlerProps {
  error: string | null;
  onRetry: () => void;
}

export const DocumentRepositoryErrorHandler: React.FC<DocumentRepositoryErrorHandlerProps> = ({
  error,
  onRetry
}) => {
  if (!error) return null;

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <span>Error loading documents: {error}</span>
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="ml-4"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default DocumentRepositoryErrorHandler;
