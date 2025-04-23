
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardHeader from '@/components/DashboardHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import DocumentRepository from '@/components/documents/DocumentRepository';
import ApprovalWorkflow from '@/components/documents/ApprovalWorkflow';
import ExpiredDocuments from '@/components/documents/ExpiredDocuments';
import DocumentTemplates from '@/components/documents/DocumentTemplates';
import DocumentEditor from '@/components/documents/DocumentEditor';
import DocumentNotificationCenter from '@/components/documents/DocumentNotificationCenter';
import DocumentRepositoryErrorHandler from '@/components/documents/DocumentRepositoryErrorHandler';
import { FileText, ClipboardCheck, CalendarX, FilePlus, Edit, AlertTriangle, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import UploadDocumentDialog from '@/components/documents/UploadDocumentDialog';
import { DocumentProvider, useDocuments } from '@/contexts/DocumentContext';
import { Document as DocumentType } from '@/types/document';
import { useTranslation } from 'react-i18next';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';

const DocumentsContent = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useUser();
  const { 
    documents, 
    notifications, 
    selectedDocument, 
    setSelectedDocument, 
    submitForApproval, 
    updateDocument, 
    markNotificationAsRead, 
    clearAllNotifications,
    fetchDocuments,
    error,
    isLoading
  } = useDocuments();
  
  const [activeTab, setActiveTab] = useState<string>(
    location.state?.activeTab || 'repository'
  );
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [initialLoadAttempted, setInitialLoadAttempted] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (initialLoadAttempted) return;
      
      setInitialLoadAttempted(true);
      try {
        await fetchDocuments();
        console.log("Documents loaded:", documents);
      } catch (error) {
        console.error("Error loading documents:", error);
        toast({
          title: "Error loading documents",
          description: "Could not load documents. Please try again later.",
          variant: "destructive"
        });
      }
    };
    
    loadData();
  }, [fetchDocuments, initialLoadAttempted]);

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('tab', activeTab);
    navigate({
      pathname: location.pathname,
      search: searchParams.toString()
    }, { replace: true });
  }, [activeTab, navigate, location.pathname]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, []);

  const handleSaveDocument = (updatedDoc: DocumentType) => {
    updateDocument(updatedDoc);
  };

  const handleSubmitForReview = (doc: DocumentType) => {
    submitForApproval(doc);
    setActiveTab('approvals');
  };

  const approvalNotifications = notifications.filter(n => 
    n.type === 'approval_overdue' || n.type === 'approval_request'
  ).length;
  
  const expiryNotifications = notifications.filter(n => 
    n.type === 'expiry_reminder'
  ).length;

  const titleElement = (
    <div className="text-gradient-primary text-3xl font-bold">
      {t('documents.header.title', 'Document Management')}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/50 to-white">
      <DashboardHeader 
        title={titleElement}
        subtitle={t('documents.header.subtitle', 'Manage and control your documents and approval workflows')}
        className="bg-gradient-to-r from-primary/5 to-accent/5 border-b border-accent/10"
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <Breadcrumbs />
        
        {error && <DocumentRepositoryErrorHandler />}
        
        <div className="flex justify-between items-center my-6">
          <h2 className="text-2xl font-bold text-gradient-primary">{t('documents.controlSystem', 'Documents Control System')}</h2>
          <div className="flex items-center gap-3">
            <DocumentNotificationCenter 
              notifications={notifications}
              onMarkAsRead={markNotificationAsRead}
              onClearAll={clearAllNotifications}
            />
          </div>
        </div>
        
        <Tabs defaultValue="repository" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 bg-white border border-border shadow-md p-1 gap-1">
            <TabsTrigger 
              value="repository" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white data-[state=active]:shadow-md text-base py-2.5 px-4"
            >
              <FileText className="h-5 w-5" />
              <span>{t('documents.tabs.repository', 'Repository')}</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="approvals" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white data-[state=active]:shadow-md text-base py-2.5 px-4"
            >
              <ClipboardCheck className="h-5 w-5" />
              <span>{t('documents.tabs.approvals', 'Approvals')}</span>
              {approvalNotifications > 0 && (
                <Badge variant="destructive" className="ml-1 bg-red-500 text-white animate-pulse">
                  {approvalNotifications}
                </Badge>
              )}
            </TabsTrigger>
            
            <TabsTrigger 
              value="expired" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white data-[state=active]:shadow-md text-base py-2.5 px-4"
            >
              <CalendarX className="h-5 w-5" />
              <span>{t('documents.tabs.expired', 'Expired')}</span>
              {expiryNotifications > 0 && (
                <Badge variant="destructive" className="ml-1 bg-red-500 text-white animate-pulse">
                  {expiryNotifications}
                </Badge>
              )}
            </TabsTrigger>
            
            <TabsTrigger 
              value="templates" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white data-[state=active]:shadow-md text-base py-2.5 px-4"
            >
              <FilePlus className="h-5 w-5" />
              <span>{t('documents.tabs.templates', 'Templates')}</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="edit" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white data-[state=active]:shadow-md text-base py-2.5 px-4"
            >
              <Edit className="h-5 w-5" />
              <span>{t('documents.tabs.editor', 'Editor')}</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="repository">
            <div className="bg-white border border-accent/10 rounded-lg shadow-lg">
              <DocumentRepository />
            </div>
          </TabsContent>
          
          <TabsContent value="approvals">
            <div className="bg-white border border-accent/10 rounded-lg shadow-lg">
              <ApprovalWorkflow />
            </div>
          </TabsContent>
          
          <TabsContent value="expired">
            <div className="bg-white border border-accent/10 rounded-lg shadow-lg">
              <ExpiredDocuments />
            </div>
          </TabsContent>
          
          <TabsContent value="templates">
            <div className="bg-white border border-accent/10 rounded-lg shadow-lg">
              <DocumentTemplates />
            </div>
          </TabsContent>
          
          <TabsContent value="edit">
            <div className="bg-white border border-accent/10 rounded-lg shadow-lg p-4">
              {selectedDocument ? (
                <DocumentEditor 
                  document={selectedDocument} 
                  onSave={handleSaveDocument}
                  onSubmitForReview={handleSubmitForReview}
                  readOnly={!user || selectedDocument?.is_locked}
                />
              ) : (
                <div className="p-8 text-center">
                  <AlertTriangle className="h-16 w-16 text-warning mx-auto mb-3" />
                  <h3 className="text-xl font-medium text-foreground mb-2">No Document Selected</h3>
                  <p className="text-foreground/80 mb-4 text-lg">Please select a document from the repository to edit.</p>
                  <Button 
                    onClick={() => setActiveTab('repository')}
                    className="bg-gradient-to-r from-primary to-accent hover:from-primary-dark hover:to-accent-dark text-white font-medium text-base shadow-md"
                  >
                    Go to Repository
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <UploadDocumentDialog 
        open={isUploadOpen} 
        onOpenChange={setIsUploadOpen} 
      />
    </div>
  );
};

const Documents = () => (
  <DocumentProvider>
    <DocumentsContent />
  </DocumentProvider>
);

export default Documents;
