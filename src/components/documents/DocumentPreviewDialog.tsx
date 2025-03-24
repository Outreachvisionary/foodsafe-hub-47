
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Document, DocumentVersion } from '@/types/document';
import DocumentEditor from './DocumentEditor';
import DocumentApprover from './DocumentApprover';
import DocumentVersionCompare from './DocumentVersionCompare';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { FileText, History, CheckCircle, AlertCircle } from 'lucide-react';

interface DocumentPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: Document | null;
}

const DocumentPreviewDialog: React.FC<DocumentPreviewDialogProps> = ({
  open,
  onOpenChange,
  document
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('view');
  
  // Mock document versions for demo
  const mockVersions: DocumentVersion[] = [
    {
      id: 'v1',
      documentId: document?.id || '',
      version: document ? document.version - 1 : 1,
      fileName: document?.fileName.replace(`v${document?.version}`, `v${document ? document.version - 1 : 1}`) || '',
      fileSize: document?.fileSize || 0,
      createdBy: 'Jane Smith',
      createdAt: '2023-05-15T10:30:00Z',
      changeNotes: 'Initial version'
    },
    {
      id: 'v2',
      documentId: document?.id || '',
      version: document?.version || 2,
      fileName: document?.fileName || '',
      fileSize: document?.fileSize || 0,
      createdBy: document?.createdBy || '',
      createdAt: document?.updatedAt || '',
      changeNotes: 'Updated with latest requirements'
    }
  ];
  
  const handleApproveDocument = (doc: Document, comment: string) => {
    // In a real app, this would send the approval to the backend
    toast({
      title: "Document approved",
      description: `Document "${doc.title}" has been approved.`,
    });
    onOpenChange(false);
  };
  
  const handleRejectDocument = (doc: Document, comment: string) => {
    // In a real app, this would send the rejection to the backend
    toast({
      title: "Document rejected",
      description: `Document "${doc.title}" has been rejected with feedback.`,
    });
    onOpenChange(false);
  };
  
  const handleSaveDocument = (updatedDoc: Document) => {
    // In a real app, this would save the document to the backend
    console.log('Saving document:', updatedDoc);
    toast({
      title: "Document saved",
      description: "Your changes have been saved successfully.",
    });
  };

  if (!document) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <div>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                {document.title}
              </DialogTitle>
              <DialogDescription>
                {document.fileName} • Version {document.version}
              </DialogDescription>
            </div>
            <Badge 
              variant={
                document.status === 'Published' ? 'default' : 
                document.status === 'Pending Approval' ? 'outline' : 
                'secondary'
              }
            >
              {document.status}
            </Badge>
          </div>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-grow flex flex-col overflow-hidden">
          <TabsList className="mb-2">
            <TabsTrigger value="view" className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span>View & Edit</span>
            </TabsTrigger>
            <TabsTrigger value="compare" className="flex items-center gap-1">
              <History className="h-4 w-4" />
              <span>Version Compare</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="view" className="flex-grow overflow-auto">
            <div className="overflow-auto flex-grow">
              <DocumentEditor 
                document={document} 
                onSave={handleSaveDocument}
                readOnly={document.status === 'Pending Approval' || document.status === 'Published'} 
              />
              
              {document.status === 'Pending Approval' && (
                <DocumentApprover 
                  document={document}
                  onApprove={handleApproveDocument}
                  onReject={handleRejectDocument}
                />
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="compare" className="flex-grow overflow-auto p-1">
            <DocumentVersionCompare
              oldVersion={mockVersions[0]}
              newVersion={mockVersions[1]}
            />
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="mt-4 flex justify-between items-center border-t pt-4">
          <div className="flex items-center text-sm text-gray-500">
            <span>Last updated: {new Date(document.updatedAt).toLocaleDateString()}</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            {document.status === 'Draft' && (
              <Button 
                onClick={() => {
                  toast({
                    title: "Document submitted for review",
                    description: "The document has been submitted for approval.",
                  });
                  onOpenChange(false);
                }}
              >
                Submit for Review
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentPreviewDialog;
