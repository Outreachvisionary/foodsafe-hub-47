
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Document as DocumentType } from '@/types/document';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';
import { FileText, Download, Calendar, Tag, Info, Loader2, AlertCircle, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DocumentViewerProps {
  document: DocumentType | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({
  document,
  open,
  onOpenChange
}) => {
  const [activeTab, setActiveTab] = useState('preview');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Reset loading state when document changes
    if (document) {
      setIsLoading(true);
      setError(null);
      
      // Simulate loading delay
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [document]);
  
  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'draft':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'pending approval':
      case 'pending_approval':  
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'approved':
      case 'published':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'archived':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };
  
  const handleDownload = () => {
    if (!document || !document.file_path) return;
    
    const a = document.createElement('a');
    a.href = document.file_path;
    a.download = document.file_name || document.title;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const renderPreview = () => {
    if (!document) return null;
    
    // Check if there's no file to preview
    if (!document.file_path) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <AlertCircle className="h-12 w-12 text-yellow-500 mb-3" />
          <h3 className="text-lg font-medium mb-2">No preview available</h3>
          <p className="text-muted-foreground">
            This document does not have an associated file.
          </p>
        </div>
      );
    }
    
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center p-8">
          <Loader2 className="h-12 w-12 text-primary animate-spin mb-3" />
          <p className="text-muted-foreground">Loading preview...</p>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <AlertCircle className="h-12 w-12 text-destructive mb-3" />
          <h3 className="text-lg font-medium mb-2">Error loading preview</h3>
          <p className="text-muted-foreground">{error}</p>
          <Button variant="outline" className="mt-4" onClick={() => setIsLoading(true)}>
            Try Again
          </Button>
        </div>
      );
    }
    
    // Check file type for appropriate preview
    const fileType = document.file_type.toLowerCase();
    
    if (fileType.includes('pdf')) {
      return (
        <iframe 
          src={`${document.file_path}#toolbar=0`}
          className="w-full h-[60vh] border-0"
          title={document.title}
        />
      );
    }
    
    if (fileType.includes('image')) {
      return (
        <div className="flex justify-center p-4">
          <img 
            src={document.file_path} 
            alt={document.title} 
            className="max-h-[60vh] max-w-full object-contain"
          />
        </div>
      );
    }
    
    // For other file types, show download prompt
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <FileText className="h-12 w-12 text-primary mb-3" />
        <h3 className="text-lg font-medium mb-2">Preview not available</h3>
        <p className="text-muted-foreground mb-4">
          This file type ({document.file_type || 'Unknown'}) cannot be previewed directly.
        </p>
        <Button onClick={handleDownload} className="gap-2">
          <Download className="h-4 w-4" />
          Download File
        </Button>
      </div>
    );
  };
  
  const renderDetails = () => {
    if (!document) return null;
    
    return (
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Document ID</p>
            <p className="font-mono text-xs bg-muted p-2 rounded">{document.id}</p>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Status</p>
            <div>
              <Badge 
                className={cn("font-medium border", getStatusBadgeColor(document.status))}
              >
                {document.status}
              </Badge>
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Category</p>
            <p>{document.category || 'Uncategorized'}</p>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Version</p>
            <p>v{document.version || 1}</p>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Created By</p>
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2 text-muted-foreground" />
              <p>{document.created_by || 'Unknown'}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Created Date</p>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <p>{document.created_at ? format(new Date(document.created_at), 'PPP') : 'Unknown'}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <p>{document.updated_at ? format(new Date(document.updated_at), 'PPP') : 'N/A'}</p>
            </div>
          </div>
          
          {document.expiry_date && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Expires On</p>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <p>{format(new Date(document.expiry_date), 'PPP')}</p>
              </div>
            </div>
          )}
        </div>
        
        {document.description && (
          <div className="space-y-2 border-t pt-4">
            <p className="text-sm font-medium text-muted-foreground">Description</p>
            <p className="text-sm">{document.description}</p>
          </div>
        )}
        
        {document.tags && document.tags.length > 0 && (
          <div className="space-y-2 border-t pt-4">
            <p className="text-sm font-medium text-muted-foreground">Tags</p>
            <div className="flex flex-wrap gap-2">
              {document.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="flex items-center">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {document.file_name && (
          <div className="space-y-2 border-t pt-4">
            <p className="text-sm font-medium text-muted-foreground">File Information</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Name</p>
                <p className="text-sm truncate">{document.file_name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Size</p>
                <p className="text-sm">
                  {document.file_size ? `${Math.round(document.file_size / 1024)} KB` : 'Unknown'}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Type</p>
                <p className="text-sm">{document.file_type || 'Unknown'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  if (!document) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="mr-2 h-5 w-5 text-primary" />
              <DialogTitle className="text-xl">{document.title}</DialogTitle>
            </div>
            <Badge 
              className={cn("font-medium border", getStatusBadgeColor(document.status))}
            >
              {document.status}
            </Badge>
          </div>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="preview" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="details" className="flex items-center">
              <Info className="h-4 w-4 mr-2" />
              Details
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="preview" className="border rounded-md mt-4">
            <Card>
              {renderPreview()}
            </Card>
          </TabsContent>
          
          <TabsContent value="details" className="border rounded-md mt-4">
            <Card>
              {renderDetails()}
            </Card>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          {document.file_path && (
            <Button onClick={handleDownload} className="gap-2 mr-auto">
              <Download className="h-4 w-4" />
              Download
            </Button>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentViewer;
