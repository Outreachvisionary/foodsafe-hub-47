
import React, { useState, useEffect } from 'react';
import { Document } from '@/types/document';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Download, Edit, Copy, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useDocumentService } from '@/hooks/useDocumentService';
import RichTextEditor from './TinyMCEEditorWrapper';
import { DocumentComment } from '@/types/document-comment';
import DocumentComments from './DocumentComments';

interface DocumentPreviewDialogProps {
  document: Document;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
}

const DocumentPreviewDialog: React.FC<DocumentPreviewDialogProps> = ({ 
  document, 
  open,
  onOpenChange,
  onClose 
}) => {
  const [activeTab, setActiveTab] = useState<string>("preview");
  const [isEditing, setIsEditing] = useState(false);
  const [documentContent, setDocumentContent] = useState<string>("");
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const documentService = useDocumentService();

  useEffect(() => {
    const loadDocumentPreview = async () => {
      setIsLoading(true);
      try {
        if (document.file_type?.startsWith('image/')) {
          // Handle images
          const previewInfo = await documentService.getPreviewUrl(
            document.id, 
            document.file_name, 
            document.file_type
          );
          setIframeUrl(previewInfo.url);
          setDocumentContent("");
        } else if (document.file_type === 'application/pdf') {
          // Handle PDFs
          const previewInfo = await documentService.getPreviewUrl(
            document.id, 
            document.file_name, 
            document.file_type
          );
          setIframeUrl(previewInfo.url);
          setDocumentContent("");
        } else if (document.file_type === 'text/plain' || document.file_type === 'text/html' || document.file_type?.includes('document')) {
          // Handle text and document files
          try {
            const versions = await documentService.fetchVersions(document.id);
            if (versions && versions.length > 0) {
              const latestVersion = versions[0];
              if (latestVersion.editor_metadata && latestVersion.editor_metadata.content) {
                setDocumentContent(latestVersion.editor_metadata.content);
              } else {
                setDocumentContent(`<h1>${document.title}</h1><p>${document.description || ''}</p>`);
              }
            } else {
              setDocumentContent(`<h1>${document.title}</h1><p>${document.description || ''}</p>`);
            }
            setIframeUrl(null);
          } catch (err) {
            console.error("Error fetching document versions:", err);
            setDocumentContent(`<h1>${document.title}</h1><p>${document.description || ''}</p>`);
          }
        } else {
          // Other file types - provide download instead of preview
          setDocumentContent(`<div class="text-center p-8">
            <p class="mb-4">Preview not available for this file type (${document.file_type}).</p>
            <p>Please download the file to view it.</p>
          </div>`);
          setIframeUrl(null);
        }
      } catch (error) {
        console.error('Error loading document preview:', error);
        setDocumentContent(`<div class="text-center p-8">
          <p class="mb-4">Error loading preview.</p>
          <p>Please try downloading the file instead.</p>
        </div>`);
      } finally {
        setIsLoading(false);
      }
    };

    loadDocumentPreview();
  }, [document]);

  const handleDownload = async () => {
    try {
      const url = await documentService.getDownloadUrl(
        documentService.getStoragePath(document.id, document.file_name)
      );
      
      // Create a temporary link and click it - fixing the DOM manipulation errors
      const a = window.document.createElement('a');
      a.href = url;
      a.download = document.file_name;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
      
      toast({
        title: "Download initiated",
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

  const handleSaveContent = async () => {
    try {
      // Create a new document version with the edited content
      await documentService.createVersion({
        document_id: document.id,
        file_name: document.file_name,
        file_size: document.file_size,
        created_by: 'admin',
        editor_metadata: { content: documentContent }
      });

      // Record the activity
      await documentService.recordActivity({
        document_id: document.id,
        action: 'edit',
        user_id: 'admin',
        user_name: 'Administrator',
        user_role: 'Admin',
        comments: 'Edited document content'
      });

      setIsEditing(false);
      toast({
        title: "Success",
        description: "Document content updated successfully",
      });
    } catch (error) {
      console.error('Error saving document content:', error);
      toast({
        title: "Save failed",
        description: "Could not save the document content",
        variant: "destructive",
      });
    }
  };

  const renderPreviewContent = () => {
    if (isLoading) {
      return <div className="flex justify-center items-center h-96">Loading preview...</div>;
    }

    if (iframeUrl) {
      return (
        <iframe 
          src={iframeUrl} 
          className="w-full h-[600px] border-0" 
          title={document.title}
        />
      );
    }

    if (isEditing) {
      return (
        <div className="w-full">
          <RichTextEditor 
            content={documentContent} 
            onChange={setDocumentContent}
            documentId={document.id}
            height={500}
          />
          <div className="flex justify-end gap-2 mt-4">
            <Button 
              variant="outline" 
              onClick={() => setIsEditing(false)}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button 
              onClick={handleSaveContent}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="relative">
        <div 
          className="document-preview prose prose-sm max-w-none bg-white p-4 rounded-md border min-h-[500px]"
          dangerouslySetInnerHTML={{ __html: documentContent }}
        />
        {(document.file_type === 'text/plain' || document.file_type === 'text/html' || document.file_type?.includes('document')) && (
          <Button 
            variant="outline" 
            size="sm" 
            className="absolute top-2 right-2 flex items-center gap-2"
            onClick={() => setIsEditing(true)}
          >
            <Edit className="h-4 w-4" />
            Edit
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold">{document.title}</h2>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="bg-secondary/30">
              {document.category}
            </Badge>
            <Badge
              className={
                document.status === 'Draft' ? 'bg-slate-200 text-slate-700' :
                document.status === 'Pending Approval' ? 'bg-amber-100 text-amber-700' :
                document.status === 'Approved' ? 'bg-green-100 text-green-700' :
                document.status === 'Published' ? 'bg-blue-100 text-blue-700' :
                document.status === 'Archived' ? 'bg-gray-100 text-gray-700' :
                'bg-red-100 text-red-700'
              }
            >
              {document.status}
            </Badge>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDownload}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download
          </Button>
          {(onClose || onOpenChange) && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                if (onClose) onClose();
                if (onOpenChange) onOpenChange(false);
              }}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Close
            </Button>
          )}
        </div>
      </div>
      
      {document.description && (
        <p className="text-muted-foreground mb-4">{document.description}</p>
      )}
      
      <div className="text-sm text-muted-foreground mb-4">
        <span>Created: {format(new Date(document.created_at || ''), 'PPP')}</span>
        {document.updated_at && document.updated_at !== document.created_at && (
          <span className="ml-4">Updated: {format(new Date(document.updated_at), 'PPP')}</span>
        )}
        {document.expiry_date && (
          <span className="ml-4">Expires: {format(new Date(document.expiry_date), 'PPP')}</span>
        )}
      </div>
      
      <Tabs defaultValue="preview" value={activeTab} onValueChange={setActiveTab} className="flex-1">
        <TabsList className="mb-4">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="edit">Edit</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>
        
        <TabsContent value="preview" className="flex-1">
          {renderPreviewContent()}
        </TabsContent>
        
        <TabsContent value="edit" className="flex-1">
          <RichTextEditor 
            content={documentContent} 
            onChange={setDocumentContent}
            documentId={document.id}
            height={500}
          />
          <div className="flex justify-end gap-2 mt-4">
            <Button 
              onClick={handleSaveContent}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="comments" className="flex-1">
          <DocumentComments documentId={document.id} />
        </TabsContent>
        
        <TabsContent value="details" className="flex-1">
          <div className="bg-white p-4 rounded-md border">
            <h3 className="text-lg font-medium mb-4">Document Details</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">File Name</h4>
                <p>{document.file_name}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">File Type</h4>
                <p>{document.file_type}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">File Size</h4>
                <p>{(document.file_size / 1024).toFixed(2)} KB</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Version</h4>
                <p>{document.version}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Created By</h4>
                <p>{document.created_by}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                <p>{document.status}</p>
              </div>
              
              {document.tags && document.tags.length > 0 && (
                <div className="col-span-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Tags</h4>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {document.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DocumentPreviewDialog;
