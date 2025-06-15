
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, RefreshCcw, FileText, Upload, Settings } from 'lucide-react';
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

  const { documents, loading, error, refresh, stats } = useDocument();

  const handleRefresh = () => {
    refresh();
  };

  const handleCreateDocument = () => {
    navigate('/documents/create');
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Document Management</h1>
          <p className="text-muted-foreground">
            Centrally manage all your food safety documentation with version control and approval workflows
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={loading}>
            <RefreshCcw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setShowUploadDialog(true)}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
          <Button onClick={handleCreateDocument}>
            <Plus className="h-4 w-4 mr-2" />
            New Document
          </Button>
        </div>
      </div>

      {/* Quick Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Documents</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Review</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pendingReviewCount}</p>
                </div>
                <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-yellow-600 font-bold text-sm">{stats.pendingReviewCount}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.pendingApprovalCount}</p>
                </div>
                <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 font-bold text-sm">{stats.pendingApprovalCount}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
                  <p className="text-2xl font-bold text-red-600">{stats.expiringCount}</p>
                </div>
                <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 font-bold text-sm">{stats.expiringCount}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="repository">Repository</TabsTrigger>
          <TabsTrigger value="approvals">
            Workflow
            {stats?.pendingApprovalCount > 0 && (
              <span className="ml-1 bg-orange-500 text-white text-xs rounded-full px-2 py-0.5">
                {stats.pendingApprovalCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="review">
            Review Queue
            {stats?.pendingReviewCount > 0 && (
              <span className="ml-1 bg-yellow-500 text-white text-xs rounded-full px-2 py-0.5">
                {stats.pendingReviewCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="expired">
            Expiring
            {stats?.expiringCount > 0 && (
              <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                {stats.expiringCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="repository" className="space-y-6">
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

        <TabsContent value="approvals" className="space-y-6">
          <ApprovalWorkflow />
        </TabsContent>

        <TabsContent value="review" className="space-y-6">
          <ReviewQueue />
        </TabsContent>

        <TabsContent value="expired" className="space-y-6">
          <ExpiredDocuments />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <DocumentStats documents={documents} stats={stats} />
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
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
