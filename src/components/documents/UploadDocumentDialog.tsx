
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import DocumentUploader from './DocumentUploader';
import { useDocuments } from '@/contexts/DocumentContext';

interface UploadDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: string;
  allowedTypes?: string[];
  maxSize?: number;
}

const UploadDocumentDialog: React.FC<UploadDocumentDialogProps> = ({
  open,
  onOpenChange,
  category,
  allowedTypes,
  maxSize
}) => {
  const { selectedFolder, refreshData } = useDocuments();
  
  const handleUploadComplete = () => {
    onOpenChange(false);
    refreshData(); // Refresh document list after upload
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            Upload a document to the document management system
            {selectedFolder && ` in folder: ${selectedFolder.name}`}
          </DialogDescription>
        </DialogHeader>
        
        <DocumentUploader
          onSuccess={handleUploadComplete}
          onCancel={() => onOpenChange(false)}
          category={category}
          allowedTypes={allowedTypes}
          maxSize={maxSize}
          selectedFolder={selectedFolder?.id}
        />
      </DialogContent>
    </Dialog>
  );
};

export default UploadDocumentDialog;
