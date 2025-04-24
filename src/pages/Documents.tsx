
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DocumentProvider } from '@/contexts/DocumentContext';
import DashboardHeader from '@/components/DashboardHeader';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { DocumentRepository } from '@/components/documents/DocumentRepository';
import { ApprovalWorkflow } from '@/components/documents/ApprovalWorkflow';
import ExpiredDocuments from '@/components/documents/ExpiredDocuments';
import ReviewQueue from '@/components/documents/ReviewQueue';
import { DocumentEditor } from '@/components/documents/DocumentEditor';
import DocumentStatistics from '@/components/documents/DocumentStatistics';
import { DocumentRepositoryErrorHandler } from '@/components/documents/DocumentRepositoryErrorHandler';

const Documents = () => {
  const [activeTab, setActiveTab] = useState('repository');
  const [error, setError] = useState<Error | null>(null);

  // Handle errors in the documents page
  const handleError = (err: Error) => {
    setError(err);
    console.error('Document system error:', err);
  };

  return (
    <DocumentProvider>
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader 
          title="Document Management" 
          subtitle="Store, manage, and organize all your food safety documentation"
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error.message || 'An error occurred in the document system'}
              </AlertDescription>
            </Alert>
          )}

          <Tabs 
            defaultValue="repository" 
            value={activeTab} 
            onValueChange={setActiveTab} 
            className="w-full"
          >
            <TabsList className="mb-8">
              <TabsTrigger value="repository">Document Repository</TabsTrigger>
              <TabsTrigger value="approvals">Approval Workflow</TabsTrigger>
              <TabsTrigger value="expired">Expired Documents</TabsTrigger>
              <TabsTrigger value="review">Review Queue</TabsTrigger>
              <TabsTrigger value="stats">Statistics</TabsTrigger>
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
            
            <TabsContent value="review">
              <ReviewQueue />
            </TabsContent>
            
            <TabsContent value="stats">
              <DocumentStatistics />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </DocumentProvider>
  );
};

export default Documents;
