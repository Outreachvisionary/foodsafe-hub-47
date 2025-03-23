
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Document } from '@/types/document';
import DocumentEditor from './DocumentEditor';
import DocumentApprover from './DocumentApprover';
import { useToast } from '@/hooks/use-toast';

interface DocumentPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: Document | null;
}

const DocumentPreviewDialog: React.FC<DocumentPreviewDialogProps> = ({
  open,
  onOpenChange,
  document
}) => {
  const { toast } = useToast();
  
  const handleApproveDocument = (doc: Document, comment: string) => {
    // In a real app, this would send the approval to the backend
    toast({
      title: "Document approved",
      description: `Document "${doc.title}" has been approved.`,
    });
    onOpenChange(false);
  };
  
  const handleRejectDocument = (doc: Document, comment: string) => {
    // In a real app, this would send the rejection to the backend
    toast({
      title: "Document rejected",
      description: `Document "${doc.title}" has been rejected with feedback.`,
    });
    onOpenChange(false);
  };
  
  const handleSaveDocument = (updatedDoc: Document) => {
    // In a real app, this would save the document to the backend
    console.log('Saving document:', updatedDoc);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Document Preview</DialogTitle>
          <DialogDescription>
            View and manage document details
          </DialogDescription>
        </DialogHeader>
        
        <div className="overflow-auto flex-grow">
          <DocumentEditor 
            document={document} 
            onSave={handleSaveDocument}
            readOnly={document?.status === 'Pending Approval' || document?.status === 'Published'} 
          />
          
          {document?.status === 'Pending Approval' && (
            <DocumentApprover 
              document={document}
              onApprove={handleApproveDocument}
              onReject={handleRejectDocument}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentPreviewDialog;
