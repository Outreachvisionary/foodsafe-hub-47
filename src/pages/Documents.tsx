
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, RefreshCcw, FileText, Upload } from 'lucide-react';
import { useDocument } from '@/contexts/DocumentContext';
import DocumentList from '@/components/documents/DocumentList';
import DocumentStats from '@/components/documents/DocumentStats';
import DocumentRepository from '@/components/documents/DocumentRepository';
import ReviewQueue from '@/components/documents/ReviewQueue';
import ExpiredDocuments from '@/components/documents/ExpiredDocuments';
import ApprovalWorkflow from '@/components/documents/ApprovalWorkflow';
import UploadDocumentDialog from '@/components/documents/UploadDocumentDialog';
import CreateFolderDialog from '@/components/documents/CreateFolderDialog';

const Documents: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('repository');
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showCreateFolderDialog, setShowCreateFolderDialog] = useState(false);

  const { documents, loading, error, refresh } = useDocument();

  const handleRefresh = () => {
    refresh();
  };

  const handleCreateDocument = () => {
    navigate('/create');
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Document Management</h1>
          <p className="text-muted-foreground mt-1">
            Store, manage, and organize all your food safety documentation
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={loading}>
            <RefreshCcw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={() => setShowUploadDialog(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
          <Button onClick={handleCreateDocument}>
            <Plus className="h-4 w-4 mr-2" />
            New Document
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="repository">Document Repository</TabsTrigger>
          <TabsTrigger value="approvals">Approval Workflow</TabsTrigger>
          <TabsTrigger value="expired">Expired Documents</TabsTrigger>
          <TabsTrigger value="review">Review Queue</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="repository">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Document Repository
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DocumentRepository 
                onShowUploadDialog={() => setShowUploadDialog(true)}
                onShowCreateFolderDialog={() => setShowCreateFolderDialog(true)}
              />
            </CardContent>
          </Card>
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
          <DocumentStats documents={documents} />
        </TabsContent>
      </Tabs>

      <UploadDocumentDialog
        open={showUploadDialog}
        onOpenChange={setShowUploadDialog}
      />

      <CreateFolderDialog
        open={showCreateFolderDialog}
        onOpenChange={setShowCreateFolderDialog}
      />
    </div>
  );
};

export default Documents;
