
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Document } from '@/types/database';
import { useDocumentService } from '@/hooks/useDocumentService';
import { Loader2, FileText, Download, Copy, Share, Info } from 'lucide-react';
import { format } from 'date-fns';
import DocumentVersionHistory from './DocumentVersionHistory';
import DocumentComments from './DocumentComments';

interface DocumentPreviewProps {
  document: Document;
  onClose: () => void;
}

const DocumentPreviewDialog: React.FC<DocumentPreviewProps> = ({ document, onClose }) => {
  const [activeTab, setActiveTab] = useState('preview');
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const documentService = useDocumentService();

  useEffect(() => {
    const loadPreview = async () => {
      if (!document) return;
      
      setIsLoading(true);
      try {
        const storagePath = documentService.getStoragePath(document.id, document.file_name);
        
        // Generate download URL
        const url = await documentService.getDownloadUrl(storagePath);
        setPreviewUrl(url);
      } catch (error) {
        console.error('Error loading document preview:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPreview();
  }, [document]);

  if (!document) return null;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">{document.title}</h2>
          <p className="text-muted-foreground">{document.description}</p>
        </div>
        <Button variant="ghost" onClick={onClose}>Close</Button>
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
          <div className="min-h-[400px] flex flex-col items-center justify-center border rounded-md">
            {isLoading ? (
              <div className="flex flex-col items-center">
                <Loader2 className="h-10 w-10 animate-spin mb-2" />
                <p>Loading document preview...</p>
              </div>
            ) : previewUrl ? (
              <iframe 
                src={previewUrl} 
                className="w-full h-[600px] border-0" 
                title={document.title}
              />
            ) : (
              <div className="flex flex-col items-center">
                <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">Preview not available</p>
                <p className="text-muted-foreground mb-4">This document type cannot be previewed directly in the browser.</p>
                <Button>
                  <Download className="h-4 w-4 mr-2" />
                  Download Document
                </Button>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'details' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Category</p>
                <p className="font-medium">{document.category}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="font-medium">{document.status}</p>
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
            
            <div className="flex space-x-2">
              <Button variant="outline" className="flex items-center">
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
