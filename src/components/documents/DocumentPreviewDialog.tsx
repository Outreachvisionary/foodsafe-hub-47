import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Document } from '@/types/database';
import { DocumentVersion } from '@/types/document';
import DocumentEditor from './DocumentEditor';
import DocumentApprover from './DocumentApprover';
import DocumentVersionHistory from './DocumentVersionHistory';
import DocumentVersionCompare from './DocumentVersionCompare';
import DocumentExpirySettings from './DocumentExpirySettings';
import DocumentAccessControl from './DocumentAccessControl';
import { documentWorkflowService } from '@/services/documentWorkflowService';
import enhancedDocumentService from '@/services/documentService';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  FileText, 
  History, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Calendar, 
  Download, 
  Lock, 
  Unlock, 
  Shield, 
  Users
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface DocumentPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: Document | null;
  onDocumentUpdate?: (updatedDoc: Document) => void;
}

const DocumentPreviewDialog: React.FC<DocumentPreviewDialogProps> = ({
  open,
  onOpenChange,
  document,
  onDocumentUpdate
}) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('view');
  const [expirySettingsOpen, setExpirySettingsOpen] = useState<boolean>(false);
  const [currentDocument, setCurrentDocument] = useState<Document | null>(document);
  const [versions, setVersions] = useState<DocumentVersion[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);
  const [isCheckingIn, setIsCheckingIn] = useState<boolean>(false);
  const [accessControlOpen, setAccessControlOpen] = useState<boolean>(false);
  
  useEffect(() => {
    setCurrentDocument(document);
    if (document?.id) {
      loadVersions(document.id);
    }
  }, [document]);
  
  const loadVersions = async (documentId: string) => {
    try {
      setIsLoading(true);
      const fetchedVersions = await enhancedDocumentService.fetchVersions(documentId);
      setVersions(fetchedVersions);
    } catch (error) {
      console.error('Error loading document versions:', error);
      toast({
        title: t('common.error'),
        description: t('documents.errorLoadingVersions'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleApproveDocument = (doc: Document, comment: string) => {
    setCurrentDocument(doc);
    if (onDocumentUpdate) {
      onDocumentUpdate(doc);
    }
    toast({
      title: t('documents.documentApproved'),
      description: t('documents.documentApprovedDesc', { title: doc.title }),
    });
  };
  
  const handleRejectDocument = (doc: Document, comment: string) => {
    setCurrentDocument(doc);
    if (onDocumentUpdate) {
      onDocumentUpdate(doc);
    }
    toast({
      title: t('documents.documentRejected'),
      description: t('documents.documentRejectedDesc', { title: doc.title }),
    });
  };
  
  const handleSaveDocument = (updatedDoc: Document) => {
    setCurrentDocument(updatedDoc);
    if (onDocumentUpdate) {
      onDocumentUpdate(updatedDoc);
    }
    toast({
      title: t('documents.documentSaved'),
      description: t('documents.documentSavedDesc'),
    });
  };

  const handleSubmitForReview = () => {
    if (!currentDocument) return;
    
    const updatedDoc = documentWorkflowService.submitForApproval(currentDocument);
    setCurrentDocument(updatedDoc);
    if (onDocumentUpdate) {
      onDocumentUpdate(updatedDoc);
    }
    
    toast({
      title: t('documents.documentSubmitted'),
      description: t('documents.documentSubmittedDesc'),
    });
  };

  const handleUpdateExpirySettings = (updatedDoc: Document) => {
    setCurrentDocument(updatedDoc);
    if (onDocumentUpdate) {
      onDocumentUpdate(updatedDoc);
    }
  };

  const handleRevertVersion = (updatedDoc: Document, version: DocumentVersion) => {
    setCurrentDocument(updatedDoc);
    if (onDocumentUpdate) {
      onDocumentUpdate(updatedDoc);
    }
    toast({
      title: t('documents.versionReverted'),
      description: t('documents.versionRevertedDesc', { version: version.version_number }),
    });
  };

  const handleDownload = async () => {
    if (!currentDocument) return;
    
    try {
      const mockDownloadUrl = `#download-${currentDocument.id}`;
      
      const link = window.document.createElement('a');
      link.href = mockDownloadUrl;
      link.download = currentDocument.file_name;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      
      toast({
        title: t('documents.downloadStarted'),
        description: t('documents.fileDownloading', { fileName: currentDocument.file_name }),
      });
    } catch (error) {
      console.error('Error downloading document:', error);
      toast({
        title: t('common.error'),
        description: t('documents.errorDownloadingDocument'),
        variant: 'destructive',
      });
    }
  };

  const handleCheckout = async () => {
    if (!currentDocument) return;
    
    try {
      setIsCheckingOut(true);
      const updatedDoc = await enhancedDocumentService.checkout(currentDocument.id, 'current-user-id');
      setCurrentDocument(updatedDoc);
      if (onDocumentUpdate) {
        onDocumentUpdate(updatedDoc);
      }
      toast({
        title: t('documents.documentCheckedOut'),
        description: t('documents.documentCheckedOutDesc'),
      });
    } catch (error) {
      console.error('Error checking out document:', error);
      toast({
        title: t('common.error'),
        description: error.message || t('documents.errorCheckingOutDocument'),
        variant: 'destructive',
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleCheckin = async (createNewVersion = false) => {
    if (!currentDocument) return;
    
    try {
      setIsCheckingIn(true);
      let versionDetails = null;
      
      if (createNewVersion) {
        versionDetails = {
          file_name: currentDocument.file_name,
          file_size: currentDocument.file_size,
          file_type: currentDocument.file_type,
          created_by: 'current-user',
          change_summary: 'Updated document during check-in',
          storage_path: `documents/${currentDocument.id}/${currentDocument.file_name}`
        };
      }
      
      const updatedDoc = await enhancedDocumentService.checkin(
        currentDocument.id, 
        'current-user-id',
        createNewVersion,
        versionDetails
      );
      
      setCurrentDocument(updatedDoc);
      if (onDocumentUpdate) {
        onDocumentUpdate(updatedDoc);
      }
      
      if (createNewVersion) {
        loadVersions(currentDocument.id);
      }
      
      toast({
        title: t('documents.documentCheckedIn'),
        description: createNewVersion 
          ? t('documents.documentCheckedInWithNewVersion') 
          : t('documents.documentCheckedInDesc'),
      });
    } catch (error) {
      console.error('Error checking in document:', error);
      toast({
        title: t('common.error'),
        description: error.message || t('documents.errorCheckingInDocument'),
        variant: 'destructive',
      });
    } finally {
      setIsCheckingIn(false);
    }
  };

  if (!document || !currentDocument) return null;

  let daysUntilExpiry: number | null = null;
  if (currentDocument.expiry_date) {
    const expiryDate = new Date(currentDocument.expiry_date);
    const currentDate = new Date();
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    daysUntilExpiry = Math.floor((expiryDate.getTime() - currentDate.getTime()) / millisecondsPerDay);
  }

  const isCheckedOut = Boolean(currentDocument.checkout_user_id);
  const isCheckedOutByCurrentUser = currentDocument.checkout_user_id === 'current-user-id';
  const isReadOnly = currentDocument.status === 'Pending Approval' || 
                    currentDocument.status === 'Published' ||
                    (isCheckedOut && !isCheckedOutByCurrentUser);

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
                  {currentDocument.file_name} • {t('documents.version')} {currentDocument.version}
                </DialogDescription>
              </div>
              <div className="flex items-center gap-2">
                {isCheckedOut && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge variant="outline" className="bg-amber-100 text-amber-800 flex items-center gap-1">
                          <Lock className="h-3 w-3" />
                          {isCheckedOutByCurrentUser ? t('documents.checkedOutByYou') : t('documents.checkedOut')}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        {isCheckedOutByCurrentUser 
                          ? t('documents.youCheckedOutDocument') 
                          : t('documents.documentCheckedOutBy', { user: currentDocument.checkout_user_id })}
                        {currentDocument.checkout_timestamp && (
                          <> {t('documents.since')} {new Date(currentDocument.checkout_timestamp).toLocaleString()}</>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
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
            </div>
          </DialogHeader>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-grow flex flex-col overflow-hidden">
            <TabsList className="mb-2">
              <TabsTrigger value="view" className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                <span>{t('documents.viewAndEdit')}</span>
              </TabsTrigger>
              <TabsTrigger value="versions" className="flex items-center gap-1">
                <History className="h-4 w-4" />
                <span>{t('documents.versionHistory')}</span>
              </TabsTrigger>
              <TabsTrigger value="access" className="flex items-center gap-1">
                <Shield className="h-4 w-4" />
                <span>{t('documents.accessControl')}</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="view" className="flex-grow overflow-auto">
              <div className="overflow-auto flex-grow">
                <DocumentEditor 
                  document={currentDocument} 
                  onSave={handleSaveDocument}
                  readOnly={isReadOnly} 
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
            
            <TabsContent value="versions" className="flex-grow overflow-auto p-1">
              <DocumentVersionHistory 
                document={currentDocument} 
                onRevertVersion={handleRevertVersion} 
              />
            </TabsContent>
            
            <TabsContent value="access" className="flex-grow overflow-auto p-1">
              <Card className="mt-6">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Users className="mr-2 h-5 w-5 text-muted-foreground" />
                    {t('documents.documentAccess')}
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAccessControlOpen(true)}
                  >
                    {t('documents.manageAccess')}
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="py-8 text-center text-muted-foreground">
                    {t('documents.accessControlDescription')}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <DialogFooter className="mt-4 flex justify-between items-center border-t pt-4">
            <div className="flex items-center text-sm text-gray-500 gap-4">
              <span>{t('documents.lastUpdated')}: {currentDocument.updated_at ? new Date(currentDocument.updated_at).toLocaleDateString() : t('common.unknown')}</span>
              
              {daysUntilExpiry !== null && (
                <div className={`flex items-center gap-1 ${
                  daysUntilExpiry < 30 ? 'text-amber-600' : 'text-gray-500'
                }`}>
                  <Clock className="h-4 w-4" />
                  <span>
                    {daysUntilExpiry <= 0 
                      ? t('documents.expired') 
                      : t('documents.expiresInDays', { days: daysUntilExpiry })
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
                {t('documents.expirySettings')}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleDownload}
                className="flex items-center gap-1"
              >
                <Download className="h-4 w-4" />
                {t('documents.download')}
              </Button>
              
              {isCheckedOut ? (
                isCheckedOutByCurrentUser && (
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => handleCheckin(false)}
                      disabled={isCheckingIn}
                      className="flex items-center gap-1"
                    >
                      <Unlock className="h-4 w-4" />
                      {isCheckingIn ? t('common.processing') : t('documents.checkin')}
                    </Button>
                    
                    <Button 
                      variant="default" 
                      onClick={() => handleCheckin(true)}
                      disabled={isCheckingIn}
                      className="flex items-center gap-1"
                    >
                      <Unlock className="h-4 w-4" />
                      {isCheckingIn ? t('common.processing') : t('documents.checkinWithNewVersion')}
                    </Button>
                  </div>
                )
              ) : (
                <Button 
                  variant="default" 
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="flex items-center gap-1"
                >
                  <Lock className="h-4 w-4" />
                  {isCheckingOut ? t('common.processing') : t('documents.checkout')}
                </Button>
              )}
              
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                {t('common.close')}
              </Button>
              
              {currentDocument.status === 'Draft' && !isCheckedOut && (
                <Button onClick={handleSubmitForReview}>
                  {t('documents.submitForReview')}
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {currentDocument && (
        <>
          <DocumentExpirySettings 
            document={currentDocument}
            open={expirySettingsOpen}
            onOpenChange={setExpirySettingsOpen}
            onUpdate={handleUpdateExpirySettings}
          />
          
          <DocumentAccessControl
            documentId={currentDocument.id}
            open={accessControlOpen}
            onOpenChange={setAccessControlOpen}
          />
        </>
      )}
    </>
  );
};

export default DocumentPreviewDialog;
