
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useDocument } from '@/contexts/DocumentContext';
import { 
  RefreshCw, 
  Search, 
  Upload, 
  FolderPlus, 
  Grid3X3, 
  List,
  FileText,
  Filter
} from 'lucide-react';
import { Document } from '@/types/document';
import { toast } from 'sonner';
import DocumentUploadModal from './DocumentUploadModal';
import DocumentViewModal from './DocumentViewModal';
import DocumentEditModal from './DocumentEditModal';
import DocumentCard from './DocumentCard';
import DocumentTableView from './DocumentTableView';
import FolderNavigation from './FolderNavigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { supabase } from '@/integrations/supabase/client';

const DocumentRepositoryView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const { 
    documents, 
    loading, 
    error, 
    refresh,
    deleteDocument,
    checkoutDocument,
    checkinDocument 
  } = useDocument();

  // Filter and search documents
  const filteredDocuments = useMemo(() => {
    if (!documents) return [];

    let filtered = documents;

    // Filter by folder
    if (selectedFolder) {
      filtered = filtered.filter(doc => doc.folder_id === selectedFolder);
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(doc => doc.status === statusFilter);
    }

    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(doc => doc.category === categoryFilter);
    }

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(doc =>
        doc.title.toLowerCase().includes(term) ||
        doc.description?.toLowerCase().includes(term) ||
        doc.file_name.toLowerCase().includes(term) ||
        doc.tags?.some(tag => tag.toLowerCase().includes(term))
      );
    }

    return filtered;
  }, [documents, selectedFolder, statusFilter, categoryFilter, searchTerm]);

  const handleDocumentAction = async (action: string, documentId: string) => {
    try {
      switch (action) {
        case 'view':
          setSelectedDocumentId(documentId);
          setShowViewModal(true);
          break;
        case 'edit':
          setSelectedDocumentId(documentId);
          setShowEditModal(true);
          break;
        case 'download':
          await handleDownload(documentId);
          break;
        case 'checkout':
          await checkoutDocument(documentId);
          toast.success('Document checked out successfully');
          break;
        case 'checkin':
          await checkinDocument(documentId);
          toast.success('Document checked in successfully');
          break;
        case 'delete':
          await deleteDocument(documentId);
          toast.success('Document deleted successfully');
          break;
        default:
          toast.info(`${action} action coming soon`);
      }
    } catch (error) {
      toast.error(`Failed to ${action} document`);
      console.error(`${action} error:`, error);
    }
  };

  const handleDownload = async (documentId: string) => {
    const document = documents.find(d => d.id === documentId);
    if (!document) {
      toast.error('Document not found');
      return;
    }

    try {
      // Get download URL
      const { data, error } = await supabase
        .storage
        .from('documents')
        .createSignedUrl(document.file_path, 60); // 1 minute expiry
        
      if (error) {
        throw error;
      }
      
      if (data?.signedUrl) {
        // Create an anchor element and trigger download
        const a = window.document.createElement('a');
        a.href = data.signedUrl;
        a.download = document.file_name;
        window.document.body.appendChild(a);
        a.click();
        window.document.body.removeChild(a);
        
        toast.success('Document download started');
      }
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download document');
    }
  };

  const handleRefresh = async () => {
    try {
      await refresh();
      toast.success('Documents refreshed');
    } catch (error) {
      toast.error('Failed to refresh documents');
    }
  };

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="text-center py-12">
          <div className="text-red-600 mb-4">
            <RefreshCw className="mx-auto h-12 w-12 mb-2" />
            <h3 className="text-lg font-medium">Error Loading Documents</h3>
            <p className="text-sm mt-2">{error}</p>
          </div>
          <Button onClick={handleRefresh} className="bg-red-600 hover:bg-red-700">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  const uniqueStatuses = [...new Set(documents?.map(doc => doc.status) || [])];
  const uniqueCategories = [...new Set(documents?.map(doc => doc.category) || [])];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Document Repository</h2>
          <p className="text-muted-foreground">
            Manage and organize your documents with version control
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            onClick={() => setShowUploadModal(true)}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Documents</p>
                <p className="text-2xl font-bold">{documents?.length || 0}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Draft</p>
                <p className="text-2xl font-bold">
                  {documents?.filter(doc => doc.status === 'Draft').length || 0}
                </p>
              </div>
              <Badge variant="secondary">Draft</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Published</p>
                <p className="text-2xl font-bold">
                  {documents?.filter(doc => doc.status === 'Published').length || 0}
                </p>
              </div>
              <Badge className="bg-green-100 text-green-800">Published</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">
                  {documents?.filter(doc => doc.status.includes('Pending')).length || 0}
                </p>
              </div>
              <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Status: {statusFilter === 'all' ? 'All' : statusFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                  All Statuses
                </DropdownMenuItem>
                {uniqueStatuses.map(status => (
                  <DropdownMenuItem 
                    key={status} 
                    onClick={() => setStatusFilter(status)}
                  >
                    {status}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Category Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Category: {categoryFilter === 'all' ? 'All' : categoryFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setCategoryFilter('all')}>
                  All Categories
                </DropdownMenuItem>
                {uniqueCategories.map(category => (
                  <DropdownMenuItem 
                    key={category} 
                    onClick={() => setCategoryFilter(category)}
                  >
                    {category}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* View Mode Toggle */}
            <div className="flex border rounded-md">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('table')}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Folder Navigation */}
      <FolderNavigation
        selectedFolder={selectedFolder}
        onFolderSelect={setSelectedFolder}
      />

      {/* Documents Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>
              Documents ({filteredDocuments.length})
            </span>
            {searchTerm && (
              <Badge variant="outline">
                Search: "{searchTerm}"
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-2 text-lg text-muted-foreground">Loading documents...</span>
            </div>
          ) : filteredDocuments.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No documents found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? 'Try adjusting your search or filters' : 'Upload your first document to get started'}
              </p>
              <Button onClick={() => setShowUploadModal(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
            </div>
          ) : (
            <div>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredDocuments.map((document) => (
                    <DocumentCard
                      key={document.id}
                      document={document}
                      onAction={handleDocumentAction}
                    />
                  ))}
                </div>
              ) : (
                <DocumentTableView
                  documents={filteredDocuments}
                  onAction={handleDocumentAction}
                />
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload Modal */}
      <DocumentUploadModal
        open={showUploadModal}
        onOpenChange={setShowUploadModal}
        selectedFolder={selectedFolder}
      />
      
      {/* View Modal */}
      <DocumentViewModal
        open={showViewModal}
        onOpenChange={(open) => {
          setShowViewModal(open);
          if (!open) setSelectedDocumentId(null);
        }}
        documentId={selectedDocumentId}
        onAction={handleDocumentAction}
      />
      
      {/* Edit Modal */}
      <DocumentEditModal
        open={showEditModal}
        onOpenChange={(open) => {
          setShowEditModal(open);
          if (!open) setSelectedDocumentId(null);
        }}
        documentId={selectedDocumentId}
      />
    </div>
  );
};

export default DocumentRepositoryView;
