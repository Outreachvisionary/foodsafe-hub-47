
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useDocumentService } from '@/hooks/useDocumentService';
import { Document } from '@/types/document';

interface DocumentContextProps {
  documents: Document[];
  loading: boolean;
  error: string | null;
  fetchDocuments: () => Promise<void>;
  documentService: any; // Add this to match usage in DocumentUploader
}

const DocumentContext = createContext<DocumentContextProps>({
  documents: [],
  loading: false,
  error: null,
  fetchDocuments: async () => {},
  documentService: {} // Add default value
});

export const useDocument = () => useContext(DocumentContext);

interface DocumentProviderProps {
  children: ReactNode;
}

export const DocumentProvider: React.FC<DocumentProviderProps> = ({ children }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get document service
  const documentService = useDocumentService();
  
  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await documentService.getDocuments();
      setDocuments(data);
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError('Failed to load documents. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchDocuments();
  }, []);
  
  return (
    <DocumentContext.Provider value={{ 
      documents, 
      loading, 
      error, 
      fetchDocuments,
      documentService // Expose document service
    }}>
      {children}
    </DocumentContext.Provider>
  );
};
