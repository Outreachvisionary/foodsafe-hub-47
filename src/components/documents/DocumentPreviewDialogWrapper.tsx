
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import DocumentPreviewDialog from './DocumentPreviewDialog';
import { Document } from '@/types/document';

interface DocumentPreviewDialogWrapperProps {
  document: Document | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DocumentPreviewDialogWrapper: React.FC<DocumentPreviewDialogWrapperProps> = ({ 
  document, 
  open, 
  onOpenChange 
}) => {
  if (!document) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] p-6 overflow-auto">
        <DocumentPreviewDialog 
          document={document} 
          onOpenChange={onOpenChange}
        />
      </DialogContent>
    </Dialog>
  );
};

export default DocumentPreviewDialogWrapper;
