
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Plus, RefreshCcw, Search, FileText, Clock, CheckCircle2, AlertCircle, Folder, Upload, BarChart3 } from 'lucide-react';
import { DocumentCategory, DocumentStatus } from '@/types/enums';
import DocumentRepository from '@/components/documents/DocumentRepository';
import ReviewQueue from '@/components/documents/ReviewQueue';
import ExpiredDocuments from '@/components/documents/ExpiredDocuments';
import DocumentStats from '@/components/documents/DocumentStats';
import UploadDocumentDialog from '@/components/documents/UploadDocumentDialog';
import { useDocuments } from '@/hooks/useDocuments';
import { toast } from 'sonner';

const Documents: React.FC = () => {
  const [activeTab, setActiveTab] = useState('repository');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  
  const {
    documents,
    isLoading,
    error,
    createDocument,
    updateDocument,
    deleteDocument,
    isCreating
  } = useDocuments();

  const [documentStats, setDocumentStats] = useState({
    totalDocuments: 0,
    pendingReview: 0,
    expiringSoon: 0,
    recentlyUpdated: 0
  });

  // Calculate stats from real documents
  useEffect(() => {
    if (documents.length > 0) {
      const now = new Date();
      const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const stats = {
        totalDocuments: documents.length,
        pendingReview: documents.filter(doc => doc.status === 'Pending_Review').length,
        expiringSoon: documents.filter(doc => 
          doc.expiry_date && new Date(doc.expiry_date) <= thirtyDaysFromNow
        ).length,
        recentlyUpdated: documents.filter(doc => 
          new Date(doc.updated_at) >= oneWeekAgo
        ).length
      };
      
      setDocumentStats(stats);
    }
  }, [documents]);

  const handleRefresh = () => {
    // The useDocuments hook will automatically refetch data
    toast.success('Document list refreshed');
  };

  const handleUploadDocument = () => {
    setShowUploadDialog(true);
  };

  const getTabCounts = () => {
    return {
      repository: documentStats.totalDocuments,
      review: documentStats.pendingReview,
      expired: documentStats.expiringSoon,
      stats: 0
    };
  };

  const tabCounts = getTabCounts();

  if (error) {
    return (
      <div className="p-8">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading documents</h3>
          <p className="text-gray-500 mb-4">{error.message}</p>
          <Button onClick={handleRefresh}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
      {/* Enhanced Header */}
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Document Management
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Centralized document control with version management, approval workflows, and compliance tracking
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button 
              variant="outline"
              className="shadow-lg hover:shadow-xl transition-all duration-300 border-blue-200 hover:border-blue-300 hover:bg-blue-50"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCcw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button 
              className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 text-white border-0"
              onClick={handleUploadDocument}
              disabled={isCreating}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </div>
        </div>

        {/* Enhanced Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white transform hover:scale-105 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-blue-100 text-sm font-medium uppercase tracking-wide">Total Documents</p>
                  <p className="text-3xl font-bold">{documentStats.totalDocuments}</p>
                  <p className="text-blue-200 text-xs">In repository</p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <FileText className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-500 to-orange-500 text-white transform hover:scale-105 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-amber-100 text-sm font-medium uppercase tracking-wide">Pending Review</p>
                  <p className="text-3xl font-bold">{documentStats.pendingReview}</p>
                  <p className="text-amber-200 text-xs">Awaiting approval</p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <Clock className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-red-500 to-pink-500 text-white transform hover:scale-105 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-red-100 text-sm font-medium uppercase tracking-wide">Expiring Soon</p>
                  <p className="text-3xl font-bold">{documentStats.expiringSoon}</p>
                  <p className="text-red-200 text-xs">Need attention</p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <AlertCircle className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-emerald-500 text-white transform hover:scale-105 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-green-100 text-sm font-medium uppercase tracking-wide">Recently Updated</p>
                  <p className="text-3xl font-bold">{documentStats.recentlyUpdated}</p>
                  <p className="text-green-200 text-xs">This week</p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <CheckCircle2 className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Enhanced Tabs */}
      <div className="bg-white rounded-2xl shadow-xl border-0 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <TabsList className="grid w-full lg:w-auto grid-cols-2 lg:grid-cols-4 bg-white/70 backdrop-blur-sm shadow-md border border-gray-200/50">
                <TabsTrigger value="repository" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white transition-all duration-200">
                  Repository ({tabCounts.repository})
                </TabsTrigger>
                <TabsTrigger value="review" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white transition-all duration-200">
                  Review Queue ({tabCounts.review})
                </TabsTrigger>
                <TabsTrigger value="expired" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-pink-500 data-[state=active]:text-white transition-all duration-200">
                  Expiring ({tabCounts.expired})
                </TabsTrigger>
                <TabsTrigger value="stats" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white transition-all duration-200">
                  Statistics
                </TabsTrigger>
              </TabsList>
              
              {/* Enhanced Search */}
              <div className="relative w-full lg:w-96">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search documents by title, content, or tags..."
                  className="pl-12 pr-4 py-3 shadow-lg border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 bg-white/80 backdrop-blur-sm transition-all duration-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="p-6">
            <TabsContent value="repository" className="mt-0">
              <Card className="border-0 shadow-lg bg-white">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200/50">
                  <CardTitle className="text-lg text-blue-800 flex items-center gap-3">
                    <div className="p-2 bg-blue-500 rounded-lg">
                      <Folder className="h-5 w-5 text-white" />
                    </div>
                    Document Repository ({tabCounts.repository} documents)
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <DocumentRepository 
                    searchQuery={searchQuery}
                    isLoading={isLoading}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="review" className="mt-0">
              <Card className="border-0 shadow-lg bg-white">
                <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200/50">
                  <CardTitle className="text-lg text-amber-800 flex items-center gap-3">
                    <div className="p-2 bg-amber-500 rounded-lg">
                      <Clock className="h-5 w-5 text-white" />
                    </div>
                    Review Queue ({tabCounts.review} pending)
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <ReviewQueue 
                    documents={documents.filter(doc => doc.status === 'Pending_Review')}
                    isLoading={isLoading}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="expired" className="mt-0">
              <Card className="border-0 shadow-lg bg-white">
                <CardHeader className="bg-gradient-to-r from-red-50 to-pink-50 border-b border-red-200/50">
                  <CardTitle className="text-lg text-red-800 flex items-center gap-3">
                    <div className="p-2 bg-red-500 rounded-lg">
                      <AlertCircle className="h-5 w-5 text-white" />
                    </div>
                    Expiring Documents ({tabCounts.expired} items)
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <ExpiredDocuments 
                    documents={documents.filter(doc => {
                      if (!doc.expiry_date) return false;
                      const expiryDate = new Date(doc.expiry_date);
                      const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
                      return expiryDate <= thirtyDaysFromNow;
                    })}
                    isLoading={isLoading}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stats" className="mt-0">
              <Card className="border-0 shadow-lg bg-white">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200/50">
                  <CardTitle className="text-lg text-green-800 flex items-center gap-3">
                    <div className="p-2 bg-green-500 rounded-lg">
                      <BarChart3 className="h-5 w-5 text-white" />
                    </div>
                    Document Statistics & Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <DocumentStats documents={documents} />
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      <UploadDocumentDialog
        open={showUploadDialog}
        onOpenChange={setShowUploadDialog}
      />
    </div>
  );
};

export default Documents;
