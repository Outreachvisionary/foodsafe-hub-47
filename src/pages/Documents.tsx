
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Plus, RefreshCcw, Search, FileText, Clock, CheckCircle2, AlertCircle, Folder, Upload, BarChart3 } from 'lucide-react';
import DocumentRepository from '@/components/documents/DocumentRepository';
import ReviewQueue from '@/components/documents/ReviewQueue';
import ExpiredDocuments from '@/components/documents/ExpiredDocuments';
import DocumentStats from '@/components/documents/DocumentStats';

const Documents: React.FC = () => {
  const [activeTab, setActiveTab] = useState('repository');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock stats - in real app these would come from service
  const documentStats = {
    totalDocuments: 1247,
    pendingReview: 23,
    expiringSoon: 8,
    recentlyUpdated: 15
  };

  // Mock documents data for DocumentStats component
  const mockDocuments = [
    {
      id: '1',
      title: 'Quality Manual',
      description: 'Company quality management system manual',
      category: 'Policy',
      status: 'Published' as const,
      version: '2.1',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-20T14:30:00Z',
      created_by: 'John Doe',
      expiry_date: '2024-12-31'
    },
    {
      id: '2',
      title: 'SOP-001 Document Control',
      description: 'Standard operating procedure for document control',
      category: 'SOP',
      status: 'Pending_Review' as const,
      version: '1.0',
      created_at: '2024-01-10T09:00:00Z',
      updated_at: '2024-01-18T16:45:00Z',
      created_by: 'Jane Smith',
      expiry_date: '2024-11-30'
    }
  ];

  const getTabCounts = () => {
    return {
      repository: documentStats.totalDocuments,
      review: documentStats.pendingReview,
      expired: documentStats.expiringSoon,
      stats: 0
    };
  };

  const tabCounts = getTabCounts();

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
            >
              <RefreshCcw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button 
              className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 text-white border-0"
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
                  <DocumentRepository />
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
                  <ReviewQueue />
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
                  <ExpiredDocuments />
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
                  <DocumentStats documents={mockDocuments} />
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Documents;
