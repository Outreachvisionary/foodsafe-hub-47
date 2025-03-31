
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Document } from '@/types/database';
import { useDocumentService } from '@/hooks/useDocumentService';
import { Loader2, FileText, Download, Copy, Share, Info, Eye, Edit, Trash2, X } from 'lucide-react';
import { format } from 'date-fns';
import DocumentVersionHistory from './DocumentVersionHistory';
import DocumentComments from './DocumentComments';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface DocumentPreviewProps {
  document: Document;
  onClose?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const DocumentPreviewDialog: React.FC<DocumentPreviewProps> = ({ 
  document, 
  onClose, 
  open, 
  onOpenChange 
}) => {
  const [activeTab, setActiveTab] = useState('preview');
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const documentService = useDocumentService();

  useEffect(() => {
    const loadPreview = async () => {
      if (!document) return;
      
      setIsLoading(true);
      setPreviewError(null);
      
      try {
        // Try to get a URL for in-browser preview
        const storagePath = documentService.getStoragePath(document.id, document.file_name);
        const url = await documentService.getDownloadUrl(storagePath);
        setPreviewUrl(url);
        
        // For certain file types, we need to handle preview differently
        if (document.file_type && (
            document.file_type.includes('pdf') || 
            document.file_type.includes('image') ||
            document.file_type.includes('text') ||
            document.file_type.includes('html')
        )) {
          // These file types can be previewed directly
          console.log("File can be previewed in browser:", document.file_type);
        } else {
          // Set an error for file types that can't be previewed in browser
          setPreviewError(`File type ${document.file_type} cannot be previewed directly.`);
        }
      } catch (error) {
        console.error('Error loading document preview:', error);
        setPreviewError('Failed to load document preview');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPreview();
  }, [document]);

  const handleDownload = async () => {
    if (!document || !previewUrl) return;
    
    try {
      // Create a temporary anchor element to trigger the download
      const link = window.document.createElement('a');
      link.href = previewUrl;
      link.download = document.file_name;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading document:', error);
    }
  };

  if (!document) return null;

  // Use the onClose prop if provided, otherwise use onOpenChange
  const handleClose = () => {
    if (onClose) {
      onClose();
    } else if (onOpenChange) {
      onOpenChange(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">{document.title}</h2>
          <p className="text-muted-foreground">{document.description}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={handleClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="flex border-b">
        <button 
          className={`px-4 py-2 font-medium ${activeTab === 'preview' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
          onClick={() => setActiveTab('preview')}
        >
          Preview
        </button>
        <button 
          className={`px-4 py-2 font-medium ${activeTab === 'details' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
          onClick={() => setActiveTab('details')}
        >
          Details
        </button>
        <button 
          className={`px-4 py-2 font-medium ${activeTab === 'comments' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
          onClick={() => setActiveTab('comments')}
        >
          Comments
        </button>
        <button 
          className={`px-4 py-2 font-medium ${activeTab === 'history' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
          onClick={() => setActiveTab('history')}
        >
          Version History
        </button>
      </div>
      
      <div className="mt-4">
        {activeTab === 'preview' && (
          <div className="min-h-[400px] flex flex-col border rounded-md relative overflow-hidden">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full py-12">
                <Loader2 className="h-10 w-10 animate-spin mb-2" />
                <p>Loading document preview...</p>
              </div>
            ) : previewError ? (
              <div className="flex flex-col items-center justify-center h-full py-12">
                <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">Preview not available</p>
                <p className="text-muted-foreground mb-4">{previewError}</p>
                <Button onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Document
                </Button>
              </div>
            ) : previewUrl ? (
              <div className="h-[600px] w-full">
                {document.file_type?.includes('pdf') ? (
                  <iframe 
                    src={`${previewUrl}#toolbar=0&navpanes=0`} 
                    className="w-full h-full border-0" 
                    title={document.title}
                  />
                ) : document.file_type?.includes('image') ? (
                  <div className="flex items-center justify-center h-full p-4">
                    <img 
                      src={previewUrl} 
                      alt={document.title} 
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                ) : document.file_type?.includes('text') || document.file_type?.includes('html') ? (
                  <iframe 
                    src={previewUrl} 
                    className="w-full h-full border-0" 
                    title={document.title}
                    sandbox="allow-same-origin"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                    <p className="text-lg font-medium">Preview not available</p>
                    <p className="text-muted-foreground mb-4">This document type cannot be previewed directly.</p>
                    <Button onClick={handleDownload}>
                      <Download className="h-4 w-4 mr-2" />
                      Download Document
                    </Button>
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-2">
                  <Button size="sm" variant="secondary" onClick={handleDownload}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-12">
                <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">Preview not available</p>
                <p className="text-muted-foreground mb-4">Unable to load document preview.</p>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'details' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Category</p>
                <Badge variant="outline" className="bg-secondary/30 font-medium">
                  {document.category}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge
                  className={cn(
                    document.status === 'Draft' && 'bg-slate-200 text-slate-700',
                    document.status === 'Pending Approval' && 'bg-amber-100 text-amber-700',
                    document.status === 'Approved' && 'bg-green-100 text-green-700',
                    document.status === 'Published' && 'bg-blue-100 text-blue-700',
                    document.status === 'Archived' && 'bg-gray-100 text-gray-700',
                    document.status === 'Expired' && 'bg-red-100 text-red-700',
                    'font-medium'
                  )}
                >
                  {document.status}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Created By</p>
                <p className="font-medium">{document.created_by}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Created Date</p>
                <p className="font-medium">{format(new Date(document.created_at), 'MMM d, yyyy')}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="font-medium">{format(new Date(document.updated_at), 'MMM d, yyyy')}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Version</p>
                <p className="font-medium">{document.version}</p>
              </div>
              {document.expiry_date && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Expiry Date</p>
                  <p className="font-medium">{format(new Date(document.expiry_date), 'MMM d, yyyy')}</p>
                </div>
              )}
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">File Name</p>
                <p className="font-medium">{document.file_name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">File Type</p>
                <p className="font-medium">{document.file_type}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">File Size</p>
                <p className="font-medium">{(document.file_size / 1024).toFixed(2)} KB</p>
              </div>
            </div>
            
            {document.tags && document.tags.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {document.tags.map((tag, index) => (
                    <span 
                      key={index} 
                      className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" className="flex items-center" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" className="flex items-center">
                <Copy className="h-4 w-4 mr-2" />
                Copy Link
              </Button>
              <Button variant="outline" className="flex items-center">
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" className="flex items-center" onClick={() => setShowVersionHistory(true)}>
                <Info className="h-4 w-4 mr-2" />
                Version History
              </Button>
            </div>
          </div>
        )}
        
        {activeTab === 'comments' && (
          <DocumentComments documentId={document.id} />
        )}
        
        {activeTab === 'history' && (
          <div>
            <h3 className="text-lg font-medium mb-4">Version History</h3>
            <DocumentVersionHistory 
              document={document} 
              open={showVersionHistory} 
              onOpenChange={setShowVersionHistory} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentPreviewDialog;
