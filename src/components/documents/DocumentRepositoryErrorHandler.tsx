
import React from 'react';
import { useDocument } from '@/contexts/DocumentContext';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertTriangle, ArchiveRestore, Database } from 'lucide-react';

interface DocumentRepositoryErrorHandlerProps {
  error: string | null;
}

export const DocumentRepositoryErrorHandler: React.FC<DocumentRepositoryErrorHandlerProps> = ({
  error,
}) => {
  const { fetchDocuments } = useDocument();

  const retryFetchDocuments = () => {
    fetchDocuments();
  };

  if (!error) return null;

  return (
    <div className="rounded-md bg-red-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-red-400" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">
            Error loading documents
          </h3>
          <div className="mt-2 text-sm text-red-700">
            <p>{error}</p>
          </div>
          <div className="mt-4">
            <Button
              size="sm"
              variant="outline"
              onClick={retryFetchDocuments}
              className="bg-red-50 text-red-800 hover:bg-red-100"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentRepositoryErrorHandler;
