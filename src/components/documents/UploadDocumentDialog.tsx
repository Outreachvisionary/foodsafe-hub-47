
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import DocumentUploader from './DocumentUploader';
import { DocumentCategory } from '@/types/database';

interface UploadDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  onCancel?: () => void;
  defaultCategory?: DocumentCategory;
}

const UploadDocumentDialog: React.FC<UploadDocumentDialogProps> = ({
  open,
  onOpenChange,
  onSuccess,
  onCancel,
  defaultCategory = 'SOP'
}) => {
  const handleUploadComplete = () => {
    onOpenChange(false);
    if (onSuccess) onSuccess();
  };

  const handleCancel = () => {
    onOpenChange(false);
    if (onCancel) onCancel();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
        </DialogHeader>
        <DocumentUploader 
          onUploadComplete={handleUploadComplete} 
          category={defaultCategory}
        />
        {onCancel && (
          <div className="flex justify-end mt-4">
            <button 
              className="text-sm text-gray-500 hover:text-gray-700"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UploadDocumentDialog;
