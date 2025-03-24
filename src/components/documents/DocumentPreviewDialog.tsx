
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
import DocumentExpirySettings from './DocumentExpirySettings';
import { documentWorkflowService } from '@/services/documentWorkflowService';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { FileText, History, CheckCircle, AlertCircle, Clock, Calendar } from 'lucide-react';

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
  const [expirySettingsOpen, setExpirySettingsOpen] = useState<boolean>(false);
  const [currentDocument, setCurrentDocument] = useState<Document | null>(document);
  
  // Update local document state when the prop changes
  React.useEffect(() => {
    setCurrentDocument(document);
  }, [document]);
  
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
    setCurrentDocument(doc);
    toast({
      title: "Document approved",
      description: `Document "${doc.title}" has been approved.`,
    });
  };
  
  const handleRejectDocument = (doc: Document, comment: string) => {
    // In a real app, this would send the rejection to the backend
    setCurrentDocument(doc);
    toast({
      title: "Document rejected",
      description: `Document "${doc.title}" has been rejected with feedback.`,
    });
  };
  
  const handleSaveDocument = (updatedDoc: Document) => {
    // In a real app, this would save the document to the backend
    console.log('Saving document:', updatedDoc);
    setCurrentDocument(updatedDoc);
    toast({
      title: "Document saved",
      description: "Your changes have been saved successfully.",
    });
  };

  const handleSubmitForReview = () => {
    if (!currentDocument) return;
    
    const updatedDoc = documentWorkflowService.submitForApproval(currentDocument);
    setCurrentDocument(updatedDoc);
    
    toast({
      title: "Document submitted for review",
      description: "The document has been submitted for approval.",
    });
  };

  const handleUpdateExpirySettings = (updatedDoc: Document) => {
    setCurrentDocument(updatedDoc);
  };

  if (!document || !currentDocument) return null;

  // Calculate days until expiry if document has an expiry date
  let daysUntilExpiry: number | null = null;
  if (currentDocument.expiryDate) {
    const expiryDate = new Date(currentDocument.expiryDate);
    const currentDate = new Date();
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    daysUntilExpiry = Math.floor((expiryDate.getTime() - currentDate.getTime()) / millisecondsPerDay);
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <div className="flex justify-between items-center">
              <div>
                <DialogTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  {currentDocument.title}
                </DialogTitle>
                <DialogDescription>
                  {currentDocument.fileName} • Version {currentDocument.version}
                </DialogDescription>
              </div>
              <Badge 
                variant={
                  currentDocument.status === 'Published' ? 'default' : 
                  currentDocument.status === 'Pending Approval' ? 'outline' : 
                  'secondary'
                }
              >
                {currentDocument.status}
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
                  document={currentDocument} 
                  onSave={handleSaveDocument}
                  readOnly={currentDocument.status === 'Pending Approval' || currentDocument.status === 'Published'} 
                />
                
                {currentDocument.status === 'Pending Approval' && (
                  <DocumentApprover 
                    document={currentDocument}
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
            <div className="flex items-center text-sm text-gray-500 gap-4">
              <span>Last updated: {new Date(currentDocument.updatedAt).toLocaleDateString()}</span>
              
              {daysUntilExpiry !== null && (
                <div className={`flex items-center gap-1 ${
                  daysUntilExpiry < 30 ? 'text-amber-600' : 'text-gray-500'
                }`}>
                  <Clock className="h-4 w-4" />
                  <span>
                    {daysUntilExpiry <= 0 
                      ? 'Expired' 
                      : `Expires in ${daysUntilExpiry} days`
                    }
                  </span>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setExpirySettingsOpen(true)}
                className="flex items-center gap-1"
              >
                <Calendar className="h-4 w-4" />
                Expiry Settings
              </Button>
              
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
              
              {currentDocument.status === 'Draft' && (
                <Button onClick={handleSubmitForReview}>
                  Submit for Review
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {currentDocument && (
        <DocumentExpirySettings 
          document={currentDocument}
          open={expirySettingsOpen}
          onOpenChange={setExpirySettingsOpen}
          onUpdate={handleUpdateExpirySettings}
        />
      )}
    </>
  );
};

export default DocumentPreviewDialog;
