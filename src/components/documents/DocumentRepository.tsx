
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Document, DocumentCategory, DocumentStatus } from '@/types/document';
import { useToast } from '@/hooks/use-toast';
import { useDocuments } from '@/contexts/DocumentContext';
import DocumentPreviewDialog from './DocumentPreviewDialog';
import DocumentUploader from './DocumentUploader';
import { format } from 'date-fns';
import { 
  Search, 
  Filter, 
  Plus, 
  Download, 
  Trash2, 
  MoreHorizontal, 
  Edit, 
  Eye, 
  Check,
  X,
  AlertTriangle,
  FileText,
  CalendarDays
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { supabase } from '@/integrations/supabase/client';
import documentService from '@/services/documentService';

// Helper function to format dates
const formatDate = (dateStr?: string) => {
  if (!dateStr) return 'N/A';
  try {
    return format(new Date(dateStr), 'MMM d, yyyy');
  } catch (e) {
    return 'Invalid Date';
  }
};

const DocumentRepository: React.FC = () => {
  const { documents, fetchDocuments, setSelectedDocument, deleteDocument } = useDocuments();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [selectedDocForPreview, setSelectedDocForPreview] = useState<Document | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const { toast } = useToast();
  
  // Filter documents based on search and filters
  const filteredDocuments = documents.filter(doc => {
    // Search term filter
    const matchesSearch = searchTerm 
      ? doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (doc.description && doc.description.toLowerCase().includes(searchTerm.toLowerCase()))
      : true;
    
    // Category filter
    const matchesCategory = categoryFilter 
      ? doc.category === categoryFilter 
      : true;
    
    // Status filter
    const matchesStatus = statusFilter 
      ? doc.status === statusFilter 
      : true;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Group documents by category for grid view
  const documentsByCategory = filteredDocuments.reduce((acc: Record<string, Document[]>, doc) => {
    if (!acc[doc.category]) {
      acc[doc.category] = [];
    }
    acc[doc.category].push(doc);
    return acc;
  }, {});

  // Get unique categories and statuses for filters
  const categories = Array.from(new Set(documents.map(doc => doc.category)));
  const statuses = Array.from(new Set(documents.map(doc => doc.status)));

  const handleDocumentUploadComplete = (document: Document) => {
    fetchDocuments();
    setUploadDialogOpen(false);
    toast({
      title: 'Document uploaded',
      description: `${document.title} has been successfully uploaded.`
    });
  };

  const handleDeleteDocument = async (documentId: string) => {
    try {
      await deleteDocument(documentId);
      setConfirmDeleteId(null);
      toast({
        title: 'Document deleted',
        description: 'The document has been permanently deleted.'
      });
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete document. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleEditDocument = (doc: Document) => {
    setSelectedDocument(doc);
    // Navigate to editor tab is handled by the parent component
  };

  const handleDownloadDocument = async (doc: Document) => {
    try {
      // Get the storage path for the document
      const storagePath = documentService.getStoragePath(doc);
      
      // Get a signed URL for the file
      const url = await documentService.getDownloadUrl(storagePath);
      
      // Use the browser's download capability
      const a = window.document.createElement('a');
      a.href = url;
      a.download = doc.file_name;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
      
      // Record download activity
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await documentService.createDocumentActivity({
          document_id: doc.id,
          action: 'download',
          user_id: user.id,
          user_name: user.email || 'Unknown',
          user_role: 'User',
          comments: 'Document downloaded from repository'
        });
      }
      
      toast({
        title: 'Download started',
        description: `${doc.title} is being downloaded.`
      });
    } catch (error) {
      console.error('Error downloading document:', error);
      toast({
        title: 'Download failed',
        description: 'There was a problem downloading the document.',
        variant: 'destructive'
      });
    }
  };

  const handlePreviewDocument = (doc: Document) => {
    setSelectedDocForPreview(doc);
    setIsPreviewOpen(true);
  };

  const handleDocumentUpdate = (updatedDoc: Document) => {
    fetchDocuments();
  };

  // Statistical data for dashboard
  const documentStats = {
    total: documents.length,
    byStatus: statuses.reduce((acc: Record<string, number>, status) => {
      acc[status] = documents.filter(doc => doc.status === status).length;
      return acc;
    }, {}),
    byCategory: categories.reduce((acc: Record<string, number>, category) => {
      acc[category] = documents.filter(doc => doc.category === category).length;
      return acc;
    }, {})
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search documents..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[160px]">
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                <span>{categoryFilter || 'All Categories'}</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                <span>{statusFilter || 'All Statuses'}</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              {statuses.map((status) => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="flex">
            <Button 
              variant="outline" 
              className="rounded-l-md rounded-r-none border-r-0"
              onClick={() => setViewMode('list')}
              data-active={viewMode === 'list'}
            >
              List
            </Button>
            <Button 
              variant="outline" 
              className="rounded-r-md rounded-l-none"
              onClick={() => setViewMode('grid')}
              data-active={viewMode === 'grid'}
            >
              Grid
            </Button>
          </div>
          
          <Button onClick={() => setUploadDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Document
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="documents">
        <TabsList>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        </TabsList>
        
        <TabsContent value="documents">
          {/* List View */}
          {viewMode === 'list' && (
            <Card>
              <CardContent className="p-0">
                {filteredDocuments.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Updated</TableHead>
                        <TableHead>Version</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDocuments.map((doc) => (
                        <TableRow key={doc.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{doc.title}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-gray-100">
                              {doc.category}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={doc.status} />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <CalendarDays className="h-3 w-3 mr-1 text-muted-foreground" />
                              <span>{formatDate(doc.updated_at)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-blue-50 text-blue-700">
                              v{doc.version}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handlePreviewDocument(doc)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Preview
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDownloadDocument(doc)}>
                                  <Download className="h-4 w-4 mr-2" />
                                  Download
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEditDocument(doc)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => setConfirmDeleteId(doc.id)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center p-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                    <h3 className="text-lg font-medium mb-1">No documents found</h3>
                    <p className="text-muted-foreground mb-4">
                      {searchTerm || categoryFilter || statusFilter 
                        ? "Try adjusting your search or filters" 
                        : "Upload your first document to get started"}
                    </p>
                    {!(searchTerm || categoryFilter || statusFilter) && (
                      <Button onClick={() => setUploadDialogOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Upload Document
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
          
          {/* Grid View */}
          {viewMode === 'grid' && (
            <div>
              {Object.keys(documentsByCategory).length > 0 ? (
                Object.entries(documentsByCategory).map(([category, docs]) => (
                  <div key={category} className="mb-6">
                    <h3 className="text-lg font-medium mb-3 flex items-center">
                      <span className="inline-block w-3 h-3 bg-primary rounded-full mr-2"></span>
                      {category} <span className="text-muted-foreground ml-2 text-sm">({docs.length})</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {docs.map((doc) => (
                        <Card key={doc.id} className="overflow-hidden">
                          <div 
                            className="h-32 bg-gray-100 flex items-center justify-center cursor-pointer"
                            onClick={() => handlePreviewDocument(doc)}
                          >
                            <FileText className="h-12 w-12 text-muted-foreground opacity-50" />
                          </div>
                          <CardContent className="p-4">
                            <h4 className="font-medium truncate" title={doc.title}>
                              {doc.title}
                            </h4>
                            <div className="flex justify-between items-center mt-2">
                              <StatusBadge status={doc.status} />
                              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                                v{doc.version}
                              </Badge>
                            </div>
                            <div className="text-xs text-muted-foreground mt-2 flex justify-between">
                              <span>Updated: {formatDate(doc.updated_at)}</span>
                            </div>
                            <div className="flex justify-between mt-3">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handlePreviewDocument(doc)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDownloadDocument(doc)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleEditDocument(doc)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-red-500"
                                onClick={() => setConfirmDeleteId(doc.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-8 bg-white rounded-lg shadow-sm">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <h3 className="text-lg font-medium mb-1">No documents found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm || categoryFilter || statusFilter 
                      ? "Try adjusting your search or filters" 
                      : "Upload your first document to get started"}
                  </p>
                  {!(searchTerm || categoryFilter || statusFilter) && (
                    <Button onClick={() => setUploadDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Upload Document
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="dashboard">
          {/* Dashboard View with Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{documentStats.total}</div>
                <p className="text-muted-foreground">Total Documents</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{documentStats.byStatus['Published'] || 0}</div>
                <p className="text-muted-foreground">Published Documents</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{documentStats.byStatus['Pending Approval'] || 0}</div>
                <p className="text-muted-foreground">Awaiting Approval</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Documents by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(documentStats.byCategory).map(([category, count]) => (
                    <div key={category} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                        <span>{category}</span>
                      </div>
                      <Badge variant="outline">{count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Documents by Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(documentStats.byStatus).map(([status, count]) => (
                    <div key={status} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <StatusBadge status={status as DocumentStatus} />
                      </div>
                      <Badge variant="outline">{count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Document preview dialog */}
      <DocumentPreviewDialog 
        document={selectedDocForPreview} 
        open={isPreviewOpen} 
        onOpenChange={setIsPreviewOpen}
        onDocumentUpdate={handleDocumentUpdate}
      />
      
      {/* Document upload dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>
              Upload a new document to the document repository.
            </DialogDescription>
          </DialogHeader>
          <DocumentUploader 
            onUploadComplete={handleDocumentUploadComplete}
          />
        </DialogContent>
      </Dialog>
      
      {/* Confirm delete dialog */}
      <Dialog open={!!confirmDeleteId} onOpenChange={(open) => !open && setConfirmDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                Confirm Delete
              </div>
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this document? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDeleteId(null)}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => confirmDeleteId && handleDeleteDocument(confirmDeleteId)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Helper component for status badges
const StatusBadge: React.FC<{ status: DocumentStatus | string }> = ({ status }) => {
  switch (status) {
    case 'Draft':
      return (
        <Badge variant="outline" className="bg-gray-100 text-gray-800">Draft</Badge>
      );
    case 'Pending Approval':
      return (
        <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending Approval</Badge>
      );
    case 'Approved':
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800">Approved</Badge>
      );
    case 'Published':
      return (
        <Badge variant="default">Published</Badge>
      );
    case 'Archived':
      return (
        <Badge variant="outline" className="bg-purple-100 text-purple-800">Archived</Badge>
      );
    case 'Expired':
      return (
        <Badge variant="outline" className="bg-red-100 text-red-800">Expired</Badge>
      );
    default:
      return (
        <Badge variant="outline">{status}</Badge>
      );
  }
};

export default DocumentRepository;
