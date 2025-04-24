
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
  // Only render the dialog content if document exists and dialog is open
  if (!open) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] p-6 overflow-auto bg-white">
        {document ? (
          <DocumentPreviewDialog 
            document={document} 
            isOpen={open}
            onClose={() => onOpenChange(false)}
            onOpenChange={onOpenChange}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <h2 className="text-xl font-semibold mb-2">Document Not Found</h2>
            <p className="text-muted-foreground">The document could not be loaded or doesn't exist.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DocumentPreviewDialogWrapper;
