
import React from 'react';
import { Document } from '@/types/document';
import DocumentListView from './DocumentListView';
import DocumentGridView from './DocumentGridView';

interface DocumentGridProps {
  documents: Document[];
  onDocumentClick?: (document: Document) => void;
  onDocumentEdit?: (document: Document) => void;
  onDocumentDelete?: (documentId: string) => void;
  onDocumentDownload?: (document: Document) => void;
  onDocumentMove?: (documentId: string, targetFolderId: string) => void;
  onDocumentCheckout?: (documentId: string) => void;
  onDocumentCheckin?: (documentId: string) => void;
  viewMode?: 'grid' | 'list';
}

const DocumentGrid: React.FC<DocumentGridProps> = ({
  documents,
  onDocumentClick,
  onDocumentEdit,
  onDocumentDelete,
  onDocumentDownload,
  onDocumentCheckout,
  onDocumentCheckin,
  viewMode = 'grid'
}) => {
  const commonProps = {
    documents,
    onDocumentClick,
    onDocumentEdit,
    onDocumentDelete,
    onDocumentDownload,
    onDocumentCheckout,
    onDocumentCheckin,
  };

  if (viewMode === 'list') {
    return <DocumentListView {...commonProps} />;
  }

  return <DocumentGridView {...commonProps} />;
};

export default DocumentGrid;
