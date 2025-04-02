
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardHeader from '@/components/DashboardHeader';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import { DocumentProvider } from '@/contexts/DocumentContext';
import DocumentRepository from '@/components/documents/DocumentRepository';
import { DocumentWorkflowDashboard } from '@/components/documents/workflow/DocumentWorkflowDashboard';
import { DocumentVersionControl } from '@/components/documents/version/DocumentVersionControl';
import { DocumentSearch } from '@/components/documents/search/DocumentSearch';
import { Button } from '@/components/ui/button';
import { Folder, FileText, Clock, Search, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const DocumentManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('repository');
  const { toast } = useToast();
  
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader 
        title="Document Management System"
        subtitle="Manage, control, and collaborate on your organization's documents"
        className="bg-gradient-to-r from-primary/5 to-secondary/10 border-b"
      />
      
      <main className="container mx-auto py-8 px-4 md:px-6">
        <Breadcrumbs />
        
        <div className="mt-6 mb-8">
          <h2 className="text-3xl font-bold text-primary">Document Control System</h2>
          <p className="text-muted-foreground mt-2">
            Create, upload, track, and manage documents throughout their lifecycle
          </p>
        </div>
        
        <DocumentProvider>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-8 bg-card border shadow-sm p-1 gap-1">
              <TabsTrigger 
                value="repository" 
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Folder className="h-4 w-4" />
                <span>Repository</span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="search" 
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Search className="h-4 w-4" />
                <span>Advanced Search</span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="workflow" 
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <ChevronRight className="h-4 w-4" />
                <span>Workflow</span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="versions" 
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Clock className="h-4 w-4" />
                <span>Version Control</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="repository" className="space-y-6">
              <DocumentRepository />
            </TabsContent>
            
            <TabsContent value="search" className="space-y-6">
              <DocumentSearch />
            </TabsContent>
            
            <TabsContent value="workflow" className="space-y-6">
              <DocumentWorkflowDashboard />
            </TabsContent>
            
            <TabsContent value="versions" className="space-y-6">
              <DocumentVersionControl />
            </TabsContent>
          </Tabs>
        </DocumentProvider>
      </main>
    </div>
  );
};

export default DocumentManagement;
