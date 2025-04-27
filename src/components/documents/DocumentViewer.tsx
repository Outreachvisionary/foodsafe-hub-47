
import React, { useState, useEffect } from 'react';
import { isDocumentStatus } from '@/utils/typeAdapters';
import { Document } from '@/types/document';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { FileText, Download, Eye, Code, FileCode } from 'lucide-react';
import useDocumentService from '@/hooks/useDocumentService';

interface DocumentViewerProps {
  document: Document;
  onClose?: () => void;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ document, onClose }) => {
  const [activeTab, setActiveTab] = useState('preview');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const documentService = useDocumentService();

  useEffect(() => {
    const loadDocumentPreview = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        if (document.file_type === 'application/pdf') {
          // Handle PDF preview
          const url = await documentService.getDownloadUrl(
            documentService.getStoragePath(document.id, document.file_name)
          );
          setPreviewUrl(url);
        } else if (document.file_type?.startsWith('image/')) {
          // Handle image preview
          const url = await documentService.getDownloadUrl(
            documentService.getStoragePath(document.id, document.file_name)
          );
          setPreviewUrl(url);
        } else {
          // For other file types, we don't have a preview
          setPreviewUrl(null);
        }
      } catch (error) {
        console.error('Error loading document preview:', error);
        setError('Failed to load document preview');
      } finally {
        setIsLoading(false);
      }
    };

    loadDocumentPreview();
  }, [document, documentService]);

  const handleDownload = async () => {
    try {
      const url = await documentService.getDownloadUrl(
        documentService.getStoragePath(document.id, document.file_name)
      );
      
      const link = window.document.createElement('a');
      link.href = url;
      link.download = document.file_name;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      
      toast({
        title: "Download started",
        description: `Downloading ${document.file_name}`,
      });
    } catch (error) {
      console.error('Error downloading document:', error);
      toast({
        title: "Download failed",
        description: "Failed to download the document",
        variant: "destructive",
      });
    }
  };

  const renderPreview = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <p>Loading preview...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-64">
          <p className="text-destructive">{error}</p>
        </div>
      );
    }

    if (!previewUrl) {
      return (
        <div className="flex flex-col items-center justify-center h-64">
          <FileText className="h-16 w-16 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Preview not available for this file type</p>
          <Button className="mt-4" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      );
    }

    if (document.file_type === 'application/pdf') {
      return (
        <iframe
          src={previewUrl}
          className="w-full h-[600px] border-0"
          title={document.title}
        />
      );
    }

    if (document.file_type?.startsWith('image/')) {
      return (
        <div className="flex justify-center">
          <img
            src={previewUrl}
            alt={document.title}
            className="max-w-full max-h-[600px] object-contain"
          />
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center h-64">
        <FileText className="h-16 w-16 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Preview not available</p>
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold">{document.title}</h2>
            <div className="flex items-center mt-1 space-x-2">
              <Badge variant="outline">{document.category}</Badge>
              <Badge 
                variant={
                  isDocumentStatus(document.status, 'Published') ? 'default' :
                  isDocumentStatus(document.status, 'Draft') ? 'outline' :
                  isDocumentStatus(document.status, 'Archived') ? 'secondary' :
                  'outline'
                }
              >
                {document.status.replace(/_/g, ' ')}
              </Badge>
            </div>
          </div>
          <Button variant="outline" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>

        <Tabs defaultValue="preview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="preview">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="details">
              <FileCode className="h-4 w-4 mr-2" />
              Details
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="preview">
            {renderPreview()}
          </TabsContent>
          
          <TabsContent value="details">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                <p>{document.description || 'No description provided'}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">File Name</h3>
                  <p>{document.file_name}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">File Type</h3>
                  <p>{document.file_type}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">File Size</h3>
                  <p>{(document.file_size / 1024).toFixed(2)} KB</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Version</h3>
                  <p>{document.version}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Created</h3>
                  <p>{new Date(document.created_at).toLocaleDateString()}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Last Updated</h3>
                  <p>{new Date(document.updated_at).toLocaleDateString()}</p>
                </div>
                
                {document.expiry_date && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Expires</h3>
                    <p>{new Date(document.expiry_date).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
              
              {document.tags && document.tags.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Tags</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {document.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DocumentViewer;
