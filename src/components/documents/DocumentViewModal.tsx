import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  FileText, 
  Download, 
  Edit, 
  Clock,
  Calendar,
  Info,
  History
} from 'lucide-react';
import { Document, DocumentVersion } from '@/types/document';
import { format } from 'date-fns';
import { useDocument } from '@/contexts/DocumentContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface DocumentViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documentId: string | null;
  onAction?: (action: string, documentId: string) => void;
}

const DocumentViewModal: React.FC<DocumentViewModalProps> = ({
  open,
  onOpenChange,
  documentId,
  onAction
}) => {
  const [activeTab, setActiveTab] = useState('preview');
  const [document, setDocument] = useState<Document | null>(null);
  const [versions, setVersions] = useState<DocumentVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const { documents, getDocumentVersions } = useDocument();

  useEffect(() => {
    const fetchData = async () => {
      if (documentId && open) {
        setLoading(true);
        
        // Find document in context
        const doc = documents.find(d => d.id === documentId);
        if (doc) {
          setDocument(doc);
          
          try {
            // Get document versions
            const fetchedVersions = await getDocumentVersions(documentId);
            setVersions(fetchedVersions);
            
            // Try to get preview URL for the document
            const { data, error } = await supabase
              .storage
              .from('documents')
              .createSignedUrl(doc.file_path, 60 * 60); // 1 hour expiry
              
            if (error) {
              console.error('Error creating signed URL:', error);
            } else if (data) {
              setPreviewUrl(data.signedUrl);
            }
          } catch (error) {
            console.error('Error fetching document data:', error);
            toast.error('Failed to load document details');
          }
        }
        
        setLoading(false);
      }
    };
    
    fetchData();
  }, [documentId, open, documents, getDocumentVersions]);

  const handleDownload = async () => {
    if (!document) return;
    
    try {
      // Get download URL
      const { data, error } = await supabase
        .storage
        .from('documents')
        .createSignedUrl(document.file_path, 60); // 1 minute expiry
        
      if (error) {
        throw error;
      }
      
      if (data?.signedUrl) {
        // Create an anchor element and trigger download
        const a = window.document.createElement('a');
        a.href = data.signedUrl;
        a.download = document.file_name;
        window.document.body.appendChild(a);
        a.click();
        window.document.body.removeChild(a);
        
        toast.success('Document download started');
      }
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download document');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Published':
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Draft':
        return 'bg-blue-100 text-blue-800';
      case 'Pending_Approval':
      case 'Pending_Review':
        return 'bg-yellow-100 text-yellow-800';
      case 'Archived':
        return 'bg-gray-100 text-gray-800';
      case 'Expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!document && !loading) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="ml-2">Loading document...</p>
          </div>
        ) : document ? (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <DialogTitle className="text-xl">{document.title}</DialogTitle>
              </div>
              <DialogDescription className="flex flex-wrap gap-2 mt-2">
                <Badge className={getStatusColor(document.status)}>
                  {document.status.replace('_', ' ')}
                </Badge>
                <Badge variant="outline">
                  {document.category}
                </Badge>
                <Badge variant="secondary">
                  v{document.version}
                </Badge>
                <Badge variant="outline" className="ml-auto">
                  {formatFileSize(document.file_size)}
                </Badge>
              </DialogDescription>
            </DialogHeader>

            <Tabs 
              defaultValue="preview" 
              value={activeTab}
              onValueChange={setActiveTab}
              className="flex-1 flex flex-col min-h-0"
            >
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="versions">
                  Versions ({versions.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="preview" className="flex-1 flex flex-col data-[state=active]:flex-1">
                <div className="border rounded-md h-full min-h-[400px] overflow-hidden flex items-center justify-center">
                  {previewUrl ? (
                    document.file_type.includes('pdf') ? (
                      <iframe 
                        src={`${previewUrl}#toolbar=0`} 
                        className="w-full h-full" 
                        title={document.title}
                      />
                    ) : document.file_type.includes('image') ? (
                      <img 
                        src={previewUrl} 
                        alt={document.title} 
                        className="max-w-full max-h-full object-contain" 
                      />
                    ) : (
                      <div className="text-center p-6">
                        <FileText className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">{document.file_name}</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          This file type cannot be previewed directly in the browser.
                        </p>
                        <Button onClick={handleDownload}>
                          <Download className="h-4 w-4 mr-2" />
                          Download to view
                        </Button>
                      </div>
                    )
                  ) : (
                    <div className="text-center p-6">
                      <FileText className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">{document.file_name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Preview not available. Download the file to view its contents.
                      </p>
                      <Button onClick={handleDownload}>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="details" className="data-[state=active]:flex-1">
                <ScrollArea className="border rounded-md h-full max-h-[400px] p-4">
                  <div className="space-y-4">
                    {document.description && (
                      <div className="mb-4">
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
                        <p>{document.description}</p>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <h3 className="text-sm font-medium text-muted-foreground">Document Info</h3>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <FileText className="h-4 w-4" />
                            <span className="font-medium">Filename:</span>
                            <span>{document.file_name}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Info className="h-4 w-4" />
                            <span className="font-medium">File Type:</span>
                            <span>{document.file_type}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Info className="h-4 w-4" />
                            <span className="font-medium">File Size:</span>
                            <span>{formatFileSize(document.file_size)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <h3 className="text-sm font-medium text-muted-foreground">Dates</h3>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4" />
                            <span className="font-medium">Created:</span>
                            <span>{format(new Date(document.created_at), 'MMM dd, yyyy HH:mm')}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4" />
                            <span className="font-medium">Modified:</span>
                            <span>{format(new Date(document.updated_at), 'MMM dd, yyyy HH:mm')}</span>
                          </div>
                          {document.expiry_date && (
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="h-4 w-4" />
                              <span className="font-medium">Expires:</span>
                              <span>{format(new Date(document.expiry_date), 'MMM dd, yyyy')}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Additional metadata could be added here */}
                    
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="versions" className="data-[state=active]:flex-1">
                <ScrollArea className="border rounded-md h-full max-h-[400px]">
                  {versions.length === 0 ? (
                    <div className="text-center p-6">
                      <History className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">No version history available</p>
                    </div>
                  ) : (
                    <div className="space-y-2 p-2">
                      {versions.map((version) => (
                        <div key={version.id} className="border rounded-md p-3 hover:bg-muted/50">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">v{version.version}</Badge>
                              <span className="text-sm">
                                {format(new Date(version.created_at), 'MMM dd, yyyy HH:mm')}
                              </span>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => onAction && onAction('downloadVersion', version.id)}
                            >
                              <Download className="h-3 w-3" />
                            </Button>
                          </div>
                          {version.change_notes && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {version.change_notes}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
            </Tabs>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Close
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleDownload}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button
                  onClick={() => onAction && onAction('edit', document.id)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </div>
            </DialogFooter>
          </>
        ) : (
          <div className="text-center py-8">
            <p>Document not found</p>
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="mt-4"
            >
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DocumentViewModal;