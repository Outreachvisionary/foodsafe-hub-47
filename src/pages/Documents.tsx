
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import ProtectedSidebarLayout from '@/components/layout/ProtectedSidebarLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Plus,
  Search,
  Filter,
  FileText,
  Eye,
  Download,
  Edit,
  Clock,
  CheckCircle,
  AlertTriangle,
  Calendar
} from 'lucide-react';

const Documents = () => {
  const { user, loading } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  console.log('Documents page render:', { loading, hasUser: !!user });

  // Simple loading check with timeout fallback
  if (loading) {
    console.log('Documents: showing loading state');
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading documents...</p>
        </div>
      </div>
    );
  }

  // If no user after loading, redirect to auth
  if (!user) {
    console.log('Documents: no user, redirecting to auth');
    return <Navigate to="/auth" replace />;
  }

  console.log('Documents: rendering main content');

  // Mock data - replace with actual data fetching
  const documents = [
    {
      id: '1',
      title: 'HACCP Plan - Production Line A',
      description: 'Critical Control Points and monitoring procedures',
      category: 'SOP',
      status: 'approved',
      version: '2.1',
      author: 'John Smith',
      lastModified: '2024-06-15',
      expiryDate: '2025-06-15',
      fileSize: '2.3 MB'
    },
    {
      id: '2',
      title: 'Supplier Approval Procedure',
      description: 'Standard operating procedure for supplier qualification',
      category: 'Policy',
      status: 'pending',
      version: '1.4',
      author: 'Sarah Johnson',
      lastModified: '2024-06-18',
      expiryDate: '2025-12-31',
      fileSize: '1.8 MB'
    },
    {
      id: '3',
      title: 'Internal Audit Checklist - ISO 22000',
      description: 'Comprehensive audit checklist for food safety management',
      category: 'Form',
      status: 'draft',
      version: '3.0',
      author: 'Mike Wilson',
      lastModified: '2024-06-19',
      expiryDate: '2024-12-31',
      fileSize: '956 KB'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-blue-100 text-blue-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'expired': return <AlertTriangle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <ProtectedSidebarLayout>
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Documents</h1>
              <p className="text-muted-foreground text-lg">
                Manage quality documents and control procedures
              </p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Document
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search documents..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select 
                  className="px-3 py-2 border rounded-md"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                  <option value="draft">Draft</option>
                  <option value="expired">Expired</option>
                </select>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  More Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <Card key={doc.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-1">{doc.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {doc.description}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    {getStatusIcon(doc.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge className={getStatusColor(doc.status)}>
                      {doc.status}
                    </Badge>
                    <Badge variant="outline">
                      {doc.category}
                    </Badge>
                    <Badge variant="secondary">
                      v{doc.version}
                    </Badge>
                  </div>
                  
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center justify-between">
                      <span>Author: {doc.author}</span>
                      <span>{doc.fileSize}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>Modified: {doc.lastModified}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>Expires: {doc.expiryDate}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-3 w-3" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </ProtectedSidebarLayout>
  );
};

export default Documents;
