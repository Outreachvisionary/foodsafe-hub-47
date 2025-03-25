
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
import { FileText, ClipboardCheck, CalendarX, FilePlus, Upload, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import UploadDocumentDialog from '@/components/documents/UploadDocumentDialog';
import { DocumentProvider, useDocuments } from '@/contexts/DocumentContext';
import { Document as DocumentType } from '@/types/document';
import { useTranslation } from 'react-i18next';
import { useUser } from '@/contexts/UserContext';

const DocumentsContent = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();
  const { documents, notifications, selectedDocument, setSelectedDocument, submitForApproval, updateDocument, markNotificationAsRead, clearAllNotifications } = useDocuments();
  const [activeTab, setActiveTab] = useState<string>(
    location.state?.activeTab || 'repository'
  );
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  // Update URL when tab changes for better navigation
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('tab', activeTab);
    navigate({
      pathname: location.pathname,
      search: searchParams.toString()
    }, { replace: true });
  }, [activeTab, navigate, location.pathname]);

  // Check URL params on initial load
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

  const handleDocumentWorkflow = () => {
    setIsUploadOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader 
        title={t('documents.header.title')}
        subtitle={t('documents.header.subtitle')}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs />
        
        <div className="flex justify-between items-center my-6">
          <h2 className="text-xl font-semibold">{t('documents.controlSystem')}</h2>
          <div className="flex items-center gap-3">
            <DocumentNotificationCenter 
              notifications={notifications}
              onMarkAsRead={markNotificationAsRead}
              onClearAll={clearAllNotifications}
            />
            <Button onClick={handleDocumentWorkflow} className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              <span>{t('documents.createNew')}</span>
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="repository" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="repository" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>{t('documents.tabs.repository')}</span>
            </TabsTrigger>
            <TabsTrigger value="approvals" className="flex items-center gap-2">
              <ClipboardCheck className="h-4 w-4" />
              <span>{t('documents.tabs.approvals')}</span>
              {notifications.filter(n => n.type === 'approval_overdue' || n.type === 'approval_request').length > 0 && (
                <Badge variant="destructive" className="ml-1">
                  {notifications.filter(n => n.type === 'approval_overdue' || n.type === 'approval_request').length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="expired" className="flex items-center gap-2">
              <CalendarX className="h-4 w-4" />
              <span>{t('documents.tabs.expired')}</span>
              {notifications.filter(n => n.type === 'expiry_reminder').length > 0 && (
                <Badge variant="destructive" className="ml-1">
                  {notifications.filter(n => n.type === 'expiry_reminder').length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <FilePlus className="h-4 w-4" />
              <span>{t('documents.tabs.templates')}</span>
            </TabsTrigger>
            <TabsTrigger value="edit" className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              <span>{t('documents.tabs.editor')}</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="repository">
            <DocumentRepository />
          </TabsContent>
          
          <TabsContent value="approvals">
            <ApprovalWorkflow />
          </TabsContent>
          
          <TabsContent value="expired">
            <ExpiredDocuments />
          </TabsContent>
          
          <TabsContent value="templates">
            <DocumentTemplates />
          </TabsContent>
          
          <TabsContent value="edit">
            <DocumentEditor 
              document={selectedDocument} 
              onSave={handleSaveDocument}
              onSubmitForReview={handleSubmitForReview}
              readOnly={!user || selectedDocument?.is_locked}
            />
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
