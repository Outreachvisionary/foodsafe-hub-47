
import React, { useState, useEffect } from 'react';
import { Document } from '@/types/document';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, Send, Clock, AlertTriangle } from 'lucide-react';
import RichTextEditor from './TinyMCEEditorWrapper';
import DocumentVersionHistory from './DocumentVersionHistory';
import DocumentComments from './DocumentComments';
import { useToast } from '@/hooks/use-toast';
import { useDocumentService } from '@/hooks/useDocumentService';

interface DocumentEditorProps {
  document: Document;
  onSave?: (document: Document) => void;
  onSubmitForReview?: (document: Document) => void;
  readOnly?: boolean;
}

const DocumentEditor: React.FC<DocumentEditorProps> = ({
  document,
  onSave,
  onSubmitForReview,
  readOnly = false
}) => {
  const [documentContent, setDocumentContent] = useState<string>("");
  const [documentTitle, setDocumentTitle] = useState(document.title);
  const [documentDescription, setDocumentDescription] = useState(document.description || "");
  const [isVersionHistoryOpen, setIsVersionHistoryOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const documentService = useDocumentService();

  useEffect(() => {
    const loadDocumentContent = async () => {
      setIsLoading(true);
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
      } catch (error) {
        console.error('Error loading document content:', error);
        setDocumentContent(`<h1>${document.title}</h1><p>${document.description || ''}</p>`);
        toast({
          title: "Error",
          description: "Failed to load document content",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    setDocumentTitle(document.title);
    setDocumentDescription(document.description || "");
    loadDocumentContent();
  }, [document]);

  const handleSave = async () => {
    if (readOnly) {
      toast({
        title: "Cannot save",
        description: "This document is currently in read-only mode",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      // Update document metadata
      const updatedDocument = await documentService.updateDocument(document.id, {
        title: documentTitle,
        description: documentDescription,
        updated_at: new Date().toISOString()
      });

      // Create a new version with the content
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
        comments: 'Updated document content'
      });

      toast({
        title: "Success",
        description: "Document saved successfully",
      });

      if (onSave && updatedDocument) {
        onSave(updatedDocument);
      }
    } catch (error) {
      console.error('Error saving document:', error);
      toast({
        title: "Error",
        description: "Failed to save document",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmitForReview = () => {
    if (readOnly) {
      toast({
        title: "Cannot submit",
        description: "This document is currently in read-only mode",
        variant: "destructive",
      });
      return;
    }

    if (onSubmitForReview) {
      onSubmitForReview(document);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {readOnly && (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 p-3 rounded-md mb-4 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          <span>This document is currently in read-only mode. You cannot make changes.</span>
        </div>
      )}
      
      <div className="mb-6 space-y-4">
        <div>
          <Label htmlFor="document-title">Title</Label>
          <Input
            id="document-title"
            value={documentTitle}
            onChange={(e) => setDocumentTitle(e.target.value)}
            className="text-lg font-medium"
            readOnly={readOnly}
          />
        </div>
        
        <div>
          <Label htmlFor="document-description">Description</Label>
          <Input
            id="document-description"
            value={documentDescription}
            onChange={(e) => setDocumentDescription(e.target.value)}
            className="text-base"
            readOnly={readOnly}
          />
        </div>
      </div>
      
      <Tabs defaultValue="editor" className="flex-1">
        <TabsList className="mb-4">
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
          <TabsTrigger value="history">Version History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="editor" className="flex-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Document Content</CardTitle>
            </CardHeader>
            <CardContent>
              <RichTextEditor 
                content={documentContent} 
                onChange={setDocumentContent}
                documentId={document.id}
                readOnly={readOnly}
                height={500}
              />
              
              {!readOnly && (
                <div className="flex justify-end gap-3 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setIsVersionHistoryOpen(true)}
                    className="flex items-center gap-2"
                  >
                    <Clock className="h-4 w-4" />
                    Version History
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={handleSubmitForReview}
                    className="flex items-center gap-2"
                  >
                    <Send className="h-4 w-4" />
                    Submit for Review
                  </Button>
                  
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {isSaving ? "Saving..." : "Save"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="comments" className="flex-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Comments</CardTitle>
            </CardHeader>
            <CardContent>
              <DocumentComments documentId={document.id} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history" className="flex-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Version History</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                onClick={() => setIsVersionHistoryOpen(true)}
                className="flex items-center gap-2"
              >
                <Clock className="h-4 w-4" />
                View Version History
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <DocumentVersionHistory
        document={document}
        open={isVersionHistoryOpen}
        onOpenChange={setIsVersionHistoryOpen}
      />
    </div>
  );
};

export default DocumentEditor;
