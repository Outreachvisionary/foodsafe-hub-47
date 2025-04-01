
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileText, Download, AlertCircle } from 'lucide-react';
import { SupplierDocument } from '@/types/supplier';

interface DocumentViewDialogProps {
  document: SupplierDocument | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DocumentViewDialog: React.FC<DocumentViewDialogProps> = ({
  document,
  open,
  onOpenChange
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!document) {
    return null;
  }

  const handleDownload = () => {
    if (document?.file_path) {
      window.open(document.file_path, '_blank');
    }
  };

  const isImageFile = (fileName: string): boolean => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    const extension = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
    return imageExtensions.includes(extension);
  };

  const isPdfFile = (fileName: string): boolean => {
    return fileName.toLowerCase().endsWith('.pdf');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{document.name}</DialogTitle>
          <DialogDescription>
            {document.type} - Uploaded on {new Date(document.upload_date || '').toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {error ? (
            <div className="flex items-center justify-center p-8 bg-red-50 border border-red-200 rounded-md">
              <AlertCircle className="h-6 w-6 text-red-500 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          ) : isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="border rounded-md p-2 min-h-[400px] flex items-center justify-center overflow-hidden">
              {isPdfFile(document.file_name) ? (
                <iframe 
                  src={`${document.file_path}#view=FitH`} 
                  className="w-full h-[500px]" 
                  title={document.name}
                />
              ) : isImageFile(document.file_name) ? (
                <img 
                  src={document.file_path} 
                  alt={document.name} 
                  className="max-w-full max-h-[500px] object-contain"
                  onError={() => setError("Failed to load image")}
                />
              ) : (
                <div className="text-center p-8">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium">Preview not available</p>
                  <p className="text-sm text-gray-500 mt-1">
                    This file type cannot be previewed. Please download to view.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          <Button 
            onClick={handleDownload}
            disabled={!document.file_path}
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentViewDialog;
