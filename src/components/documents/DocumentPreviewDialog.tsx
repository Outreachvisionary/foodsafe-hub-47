
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Document } from '@/types/document';
import { Loader2, FileText, Download, Calendar, User } from 'lucide-react';
import documentService from '@/services/documentService';

interface DocumentPreviewDialogProps {
  document: Document | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DocumentPreviewDialog: React.FC<DocumentPreviewDialogProps> = ({
  document,
  open,
  onOpenChange,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && document) {
      loadPreview();
    } else {
      // Clear the preview when dialog closes
      setPreviewUrl(null);
      setError(null);
    }
  }, [open, document]);

  const loadPreview = async () => {
    if (!document) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Determine the storage path for the document
      const storagePath = documentService.getStoragePath(document);
      
      // Get a signed URL for the file
      const url = await documentService.getDownloadUrl(storagePath);
      setPreviewUrl(url);
      
      // Record view activity
      await documentService.createDocumentActivity({
        document_id: document.id,
        action: 'view',
        user_id: 'current-user', // Replace with actual user ID
        user_name: 'Current User', // Replace with actual user name
        user_role: 'User', // Replace with actual user role
        comments: 'Document previewed'
      });
    } catch (error) {
      console.error('Error loading document preview:', error);
      setError('Failed to load document preview. The file may not exist or you may not have permission to view it.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!document || !previewUrl) return;
    
    try {
      // Create a temporary anchor and trigger download
      const a = document.createElement('a');
      a.href = previewUrl;
      a.download = document.file_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // Record download activity
      await documentService.createDocumentActivity({
        document_id: document.id,
        action: 'download',
        user_id: 'current-user', // Replace with actual user ID
        user_name: 'Current User', // Replace with actual user name
        user_role: 'User', // Replace with actual user role
        comments: 'Document downloaded'
      });
    } catch (error) {
      console.error('Error downloading document:', error);
    }
  };

  const renderPreview = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center h-96">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading document preview...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-96 text-center p-4">
          <FileText className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-lg font-semibold mb-2">Preview Not Available</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={handleDownload} disabled={!previewUrl}>
            <Download className="h-4 w-4 mr-2" />
            Download Instead
          </Button>
        </div>
      );
    }

    if (!previewUrl) {
      return (
        <div className="flex flex-col items-center justify-center h-96">
          <FileText className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
          <p className="text-muted-foreground">No preview available</p>
        </div>
      );
    }

    // If we have a preview URL, render different preview based on file type
    if (document) {
      const fileType = document.file_type.toLowerCase();
      
      if (fileType.includes('pdf')) {
        return (
          <iframe
            src={`${previewUrl}#toolbar=0`}
            className="w-full h-[70vh] border rounded"
            title={document.title}
          />
        );
      } else if (fileType.includes('image')) {
        return (
          <div className="flex justify-center h-[70vh] overflow-auto">
            <img
              src={previewUrl}
              alt={document.title}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        );
      } else if (fileType.includes('text') || fileType.includes('html')) {
        return (
          <iframe
            src={previewUrl}
            className="w-full h-[70vh] border rounded"
            title={document.title}
          />
        );
      } else {
        // For other file types, show a download button
        return (
          <div className="flex flex-col items-center justify-center h-96">
            <FileText className="h-16 w-16 text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-2">Preview Not Available</h3>
            <p className="text-muted-foreground mb-4">
              This file type ({document.file_type}) cannot be previewed in the browser.
            </p>
            <Button onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download File
            </Button>
          </div>
        );
      }
    }
    
    return null;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileText className="h-5 w-5" />
            {document?.title || 'Document Preview'}
          </DialogTitle>
        </DialogHeader>
        
        {document && (
          <div className="space-y-4 overflow-hidden flex-grow flex flex-col">
            <div className="flex flex-wrap gap-2 items-center">
              <Badge variant={document.status === 'Published' ? 'default' : 'outline'}>
                {document.status}
              </Badge>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-3.5 w-3.5 mr-1" />
                <span>Updated: {new Date(document.updated_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <User className="h-3.5 w-3.5 mr-1" />
                <span>By: {document.created_by}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Version: {document.version}
              </div>
            </div>
            
            <Card className="flex-grow overflow-hidden p-0">
              {renderPreview()}
            </Card>
          </div>
        )}
        
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {document && (
            <Button onClick={handleDownload} disabled={!previewUrl || loading}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentPreviewDialog;
