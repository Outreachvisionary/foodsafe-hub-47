import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  TrendingUp,
  Users,
  Calendar,
  BarChart3
} from 'lucide-react';
import { useDocuments } from '@/hooks/useDocuments';
import { Document } from '@/types/document';

const Dashboard: React.FC = () => {
  const { documents = [], isLoading } = useDocuments();
  const [dashboardStats, setDashboardStats] = useState({
    totalDocuments: 0,
    pendingReview: 0,
    expiringSoon: 0,
    recentlyUpdated: 0
  });

  useEffect(() => {
    if (Array.isArray(documents) && documents.length > 0) {
      const now = new Date();
      const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const stats = {
        totalDocuments: documents.length,
        pendingReview: documents.filter((doc: Document) => doc.status === 'Pending_Review').length,
        expiringSoon: documents.filter((doc: Document) => 
          doc.expiry_date && new Date(doc.expiry_date) <= thirtyDaysFromNow
        ).length,
        recentlyUpdated: documents.filter((doc: Document) => 
          new Date(doc.updated_at) >= oneWeekAgo
        ).length
      };
      
      setDashboardStats(stats);
    }
  }, [documents]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-xl text-muted-foreground">
              Welcome to your Food Safety Management System
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white transform hover:scale-105 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-blue-100 text-sm font-medium uppercase tracking-wide">Total Documents</p>
                <p className="text-3xl font-bold">{dashboardStats.totalDocuments}</p>
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
                <p className="text-3xl font-bold">{dashboardStats.pendingReview}</p>
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
                <p className="text-3xl font-bold">{dashboardStats.expiringSoon}</p>
                <p className="text-red-200 text-xs">Need attention</p>
              </div>
              <div className="bg-white/20 p-3 rounded-full">
                <AlertTriangle className="h-8 w-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-emerald-500 text-white transform hover:scale-105 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-green-100 text-sm font-medium uppercase tracking-wide">Recently Updated</p>
                <p className="text-3xl font-bold">{dashboardStats.recentlyUpdated}</p>
                <p className="text-green-200 text-xs">This week</p>
              </div>
              <div className="bg-white/20 p-3 rounded-full">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Documents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Recent Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.isArray(documents) && documents.slice(0, 5).map((doc: Document) => (
                <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{doc.title}</h4>
                    <p className="text-xs text-gray-500">{doc.category}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {doc.status}
                  </Badge>
                </div>
              ))}
              {(!Array.isArray(documents) || documents.length === 0) && (
                <p className="text-gray-500 text-center py-4">No documents found</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Upload New Document
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Clock className="h-4 w-4 mr-2" />
                Review Pending Items
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Check Expiring Documents
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Reports
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
