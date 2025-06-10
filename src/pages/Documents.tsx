
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, RefreshCcw, FileText, Upload, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import SidebarLayout from '@/components/layout/SidebarLayout';
import { useQuery } from '@tanstack/react-query';
import { fetchDocuments } from '@/services/documentService';
import DocumentList from '@/components/documents/DocumentList';
import DocumentStats from '@/components/documents/DocumentStats';

const Documents: React.FC = () => {
  const [activeTab, setActiveTab] = useState('repository');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: documents = [], isLoading, error, refetch } = useQuery({
    queryKey: ['documents'],
    queryFn: fetchDocuments,
  });

  const handleRefresh = () => {
    refetch();
  };

  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <SidebarLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Document Management</h1>
            <p className="text-muted-foreground mt-1">
              Store, manage, and organize all your food safety documentation
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRefresh}>
              <RefreshCcw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
            <Button>
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
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Document Repository
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {error ? (
                    <div className="text-center py-8">
                      <p className="text-destructive">Error loading documents: {error.message}</p>
                      <Button onClick={handleRefresh} className="mt-4">
                        Try Again
                      </Button>
                    </div>
                  ) : (
                    <DocumentList 
                      documents={filteredDocuments} 
                      isLoading={isLoading}
                    />
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="approvals">
            <Card>
              <CardHeader>
                <CardTitle>Approval Workflow</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Document approval workflow will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="expired">
            <Card>
              <CardHeader>
                <CardTitle>Expired Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Expired documents will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="review">
            <Card>
              <CardHeader>
                <CardTitle>Review Queue</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Documents pending review will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats">
            <DocumentStats documents={documents} />
          </TabsContent>
        </Tabs>
      </div>
    </SidebarLayout>
  );
};

export default Documents;
