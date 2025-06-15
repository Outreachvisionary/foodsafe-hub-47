
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, FileText, Clock, CheckCircle, AlertTriangle, Archive, Plus } from 'lucide-react';
import { DocumentStatus, DocumentCategory, Document } from '@/types/document';
import { useDocument } from '@/contexts/DocumentContext';

interface DocumentDashboardProps {
  onCreateNew?: () => void;
  onDocumentSelect?: (document: Document) => void;
}

const DocumentDashboard: React.FC<DocumentDashboardProps> = ({
  onCreateNew,
  onDocumentSelect
}) => {
  const { documents, loading, error } = useDocument();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);

  useEffect(() => {
    const filtered = documents.filter(doc =>
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredDocuments(filtered);
  }, [searchQuery, documents]);

  const getDocumentStats = () => {
    const stats = {
      total: documents.length,
      published: documents.filter(d => d.status === 'Published').length,
      pending: documents.filter(d => d.status === 'Pending_Approval').length,
      draft: documents.filter(d => d.status === 'Draft').length,
      expired: documents.filter(d => d.status === 'Expired').length,
    };
    return stats;
  };

  const getStatusColor = (status: DocumentStatus) => {
    switch (status) {
      case 'Published':
        return 'bg-green-100 text-green-800';
      case 'Pending_Approval':
        return 'bg-yellow-100 text-yellow-800';
      case 'Draft':
        return 'bg-gray-100 text-gray-800';
      case 'Expired':
        return 'bg-red-100 text-red-800';
      case 'Archived':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusIcon = (status: DocumentStatus) => {
    switch (status) {
      case 'Published':
        return <CheckCircle className="h-4 w-4" />;
      case 'Pending_Approval':
        return <Clock className="h-4 w-4" />;
      case 'Draft':
        return <FileText className="h-4 w-4" />;
      case 'Expired':
        return <AlertTriangle className="h-4 w-4" />;
      case 'Archived':
        return <Archive className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const stats = getDocumentStats();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        Error loading documents: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Document Management</h2>
          <p className="text-muted-foreground">Manage your documents and approval workflows</p>
        </div>
        {onCreateNew && (
          <Button onClick={onCreateNew}>
            <Plus className="h-4 w-4 mr-2" />
            New Document
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Published</p>
                <p className="text-2xl font-bold text-green-600">{stats.published}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Draft</p>
                <p className="text-2xl font-bold text-gray-600">{stats.draft}</p>
              </div>
              <FileText className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Expired</p>
                <p className="text-2xl font-bold text-red-600">{stats.expired}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search documents..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Documents List */}
      <div className="grid gap-4">
        {filteredDocuments.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No documents found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ? 'Try adjusting your search terms.' : 'Get started by creating your first document.'}
              </p>
              {onCreateNew && !searchQuery && (
                <Button onClick={onCreateNew}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Document
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredDocuments.map((document) => (
            <Card 
              key={document.id} 
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onDocumentSelect?.(document)}
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">{document.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                      {document.description || 'No description available'}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Category: {document.category}</span>
                      <span>Version: {document.version}</span>
                      <span>Created: {formatDate(document.created_at)}</span>
                      <span>By: {document.created_by}</span>
                    </div>
                  </div>
                  <div className="ml-4 flex flex-col items-end gap-2">
                    <Badge className={getStatusColor(document.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(document.status)}
                        {document.status.replace('_', ' ')}
                      </div>
                    </Badge>
                    {document.expiry_date && (
                      <span className="text-xs text-muted-foreground">
                        Expires: {formatDate(document.expiry_date)}
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default DocumentDashboard;
