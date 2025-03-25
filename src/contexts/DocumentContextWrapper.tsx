
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Document } from '@/types/database';
import { fetchDocuments, createDocument, updateDocument, deleteDocument } from '@/services/supabaseService';
import { useToast } from '@/hooks/use-toast';

interface DocumentContextType {
  documents: Document[];
  selectedDocument: Document | null;
  setSelectedDocument: (document: Document | null) => void;
  addDocument: (document: Omit<Document, 'id'>) => Promise<Document>;
  updateDocument: (id: string, updates: Partial<Document>) => Promise<Document>;
  deleteDocument: (id: string) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

export const DocumentContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        setIsLoading(true);
        const data = await fetchDocuments();
        setDocuments(data);
        setError(null);
      } catch (err) {
        console.error('Error loading documents:', err);
        setError(err instanceof Error ? err : new Error('Failed to load documents'));
        toast({
          title: 'Error loading documents',
          description: 'There was a problem loading the documents. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadDocuments();
  }, [toast]);

  const addDocumentHandler = async (document: Omit<Document, 'id'>): Promise<Document> => {
    try {
      const newDocument = await createDocument(document);
      setDocuments(prev => [...prev, newDocument]);
      toast({
        title: 'Document created',
        description: 'The document was successfully created.',
      });
      return newDocument;
    } catch (err) {
      console.error('Error adding document:', err);
      toast({
        title: 'Error creating document',
        description: 'There was a problem creating the document. Please try again.',
        variant: 'destructive',
      });
      throw err;
    }
  };

  const updateDocumentHandler = async (id: string, updates: Partial<Document>): Promise<Document> => {
    try {
      const updatedDocument = await updateDocument(id, updates);
      setDocuments(prev => 
        prev.map(doc => doc.id === id ? updatedDocument : doc)
      );
      
      if (selectedDocument && selectedDocument.id === id) {
        setSelectedDocument(updatedDocument);
      }
      
      toast({
        title: 'Document updated',
        description: 'The document was successfully updated.',
      });
      
      return updatedDocument;
    } catch (err) {
      console.error('Error updating document:', err);
      toast({
        title: 'Error updating document',
        description: 'There was a problem updating the document. Please try again.',
        variant: 'destructive',
      });
      throw err;
    }
  };

  const deleteDocumentHandler = async (id: string): Promise<void> => {
    try {
      await deleteDocument(id);
      setDocuments(prev => prev.filter(doc => doc.id !== id));
      
      if (selectedDocument && selectedDocument.id === id) {
        setSelectedDocument(null);
      }
      
      toast({
        title: 'Document deleted',
        description: 'The document was successfully deleted.',
      });
    } catch (err) {
      console.error('Error deleting document:', err);
      toast({
        title: 'Error deleting document',
        description: 'There was a problem deleting the document. Please try again.',
        variant: 'destructive',
      });
      throw err;
    }
  };

  const value = {
    documents,
    selectedDocument,
    setSelectedDocument,
    addDocument: addDocumentHandler,
    updateDocument: updateDocumentHandler,
    deleteDocument: deleteDocumentHandler,
    isLoading,
    error
  };

  return (
    <DocumentContext.Provider value={value}>
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocuments = (): DocumentContextType => {
  const context = useContext(DocumentContext);
  if (context === undefined) {
    throw new Error('useDocuments must be used within a DocumentContextProvider');
  }
  return context;
};
