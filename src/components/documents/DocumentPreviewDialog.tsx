
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Document } from '@/types/document';
import { FileDown, FileText, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import enhancedDocumentService from '@/services/documentService';
import { useToast } from '@/hooks/use-toast';

interface DocumentPreviewDialogProps {
  document: Document | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DocumentPreviewDialog: React.FC<DocumentPreviewDialogProps> = ({ document, open, onOpenChange }) => {
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();

  // Reset state when dialog opens or document changes
  useEffect(() => {
    if (open && document) {
      loadPreview();
    } else {
      setPreviewUrl(null);
      setCurrentPage(1);
      setTotalPages(1);
    }
  }, [open, document]);

  const loadPreview = async () => {
    if (!document) return;
    
    try {
      setLoading(true);
      
      // For PDF files, we might need to generate a preview
      // For images, we can directly use them
      // For other files, we'd need specialized handling
      
      const storagePath = enhancedDocumentService.getStoragePath(document);
      const downloadUrl = await enhancedDocumentService.getDownloadUrl(storagePath);
      
      setPreviewUrl(downloadUrl);
      
      // For PDFs, we could fetch page count here
      // For demo purposes, let's set a random number
      if (document.file_type === 'application/pdf') {
        setTotalPages(Math.floor(Math.random() * 10) + 1);
      } else {
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Error loading document preview:', error);
      toast({
        title: "Preview failed",
        description: "Could not load document preview. Please try downloading instead.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!document) return;
    
    try {
      const storagePath = enhancedDocumentService.getStoragePath(document);
      const downloadUrl = await enhancedDocumentService.getDownloadUrl(storagePath);
      
      // Create an anchor element and trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = document.file_name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download started",
        description: `Downloading ${document.file_name}`,
      });
    } catch (error) {
      console.error('Error downloading document:', error);
      toast({
        title: "Download failed",
        description: "Could not download the document",
        variant: "destructive",
      });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {document?.title}
          </DialogTitle>
          <DialogDescription>
            {document?.file_name} • Version {document?.version}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto border rounded-md bg-gray-50 flex items-center justify-center">
          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading preview...</div>
          ) : previewUrl ? (
            document?.file_type?.startsWith('image/') ? (
              <img 
                src={previewUrl} 
                alt={document.title} 
                className="max-h-full object-contain"
              />
            ) : document?.file_type === 'application/pdf' ? (
              <iframe
                src={`${previewUrl}#page=${currentPage}`}
                className="w-full h-full"
                title={document.title}
              />
            ) : (
              <div className="text-center py-12 text-gray-600 px-4">
                <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <p className="font-medium mb-2">Preview not available for this file type</p>
                <p className="text-sm text-gray-500 mb-6">
                  This document ({document?.file_type}) cannot be previewed directly.
                </p>
                <Button onClick={handleDownload} variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Download for viewing
                </Button>
              </div>
            )
          ) : (
            <div className="text-center py-12 text-gray-500">No preview available</div>
          )}
        </div>
        
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 py-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevPage}
              disabled={currentPage <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage >= totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
        
        <div className="flex justify-end pt-2">
          <Button onClick={handleDownload} className="gap-2">
            <FileDown className="h-4 w-4" />
            Download
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentPreviewDialog;
