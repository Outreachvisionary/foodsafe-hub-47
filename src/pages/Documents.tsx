
import React, { useState } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import DocumentRepository from '@/components/documents/DocumentRepository';
import ApprovalWorkflow from '@/components/documents/ApprovalWorkflow';
import ExpiredDocuments from '@/components/documents/ExpiredDocuments';
import DocumentTemplates from '@/components/documents/DocumentTemplates';
import { 
  FileText, 
  ClipboardCheck, 
  CalendarX, 
  FilePlus, 
  Upload
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import UploadDocumentDialog from '@/components/documents/UploadDocumentDialog';

const Documents = () => {
  const [activeTab, setActiveTab] = useState('repository');
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader 
        title="Document Management" 
        subtitle="Centralized repository for all compliance documentation with version control and approval workflows" 
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs />
        
        <div className="flex justify-between items-center my-6">
          <h2 className="text-xl font-semibold">Document Control System</h2>
          <Button onClick={() => setIsUploadOpen(true)} className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            <span>Upload Document</span>
          </Button>
        </div>
        
        <Tabs defaultValue="repository" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="repository" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Document Repository</span>
            </TabsTrigger>
            <TabsTrigger value="approvals" className="flex items-center gap-2">
              <ClipboardCheck className="h-4 w-4" />
              <span>Approval Workflow</span>
            </TabsTrigger>
            <TabsTrigger value="expired" className="flex items-center gap-2">
              <CalendarX className="h-4 w-4" />
              <span>Expiring Documents</span>
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <FilePlus className="h-4 w-4" />
              <span>Templates</span>
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
        </Tabs>
      </main>
      
      <UploadDocumentDialog 
        open={isUploadOpen} 
        onOpenChange={setIsUploadOpen} 
      />
    </div>
  );
};

export default Documents;
