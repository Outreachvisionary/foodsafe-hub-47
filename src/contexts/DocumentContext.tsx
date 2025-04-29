import React, { createContext, useContext, useState } from 'react';
import { Document } from '@/types/document';
import { DocumentStatus } from '@/types/enums';

interface DocumentContextType {
  documents: Document[];
  setDocuments: React.Dispatch<React.SetStateAction<Document[]>>;
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

export const DocumentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [documents, setDocuments] = useState<Document[]>([]);

  const value: DocumentContextType = {
    documents,
    setDocuments,
  };

  return (
    <DocumentContext.Provider value={value}>
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocumentContext = (): DocumentContextType => {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error("useDocumentContext must be used within a DocumentProvider");
  }
  return context;
};
