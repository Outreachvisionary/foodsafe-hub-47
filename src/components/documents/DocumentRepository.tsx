import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Document } from '@/types/document';
import { useToast } from '@/hooks/use-toast';
import { useDocuments } from '@/contexts/DocumentContext';
import DocumentPreviewDialog from './DocumentPreviewDialog';
import DocumentUploader from './DocumentUploader';
import { format } from 'date-fns';
import { Search, Filter, Plus, Download, Trash2, MoreHorizontal, Edit, Eye, Check, X, AlertTriangle, FileText, CalendarDays, Loader2, RefreshCw, FileWarning } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { supabase } from '@/integrations/supabase/client';
import documentService from '@/services/documentService';
import enhancedDocumentService from '@/services/enhancedDocumentService';
import { useDocumentCategories, useDocumentStatuses } from '@/hooks/useDocumentReferences';
import { useTranslation } from 'react-i18next';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formatDate = (dateStr?: string) => {
  if (!dateStr) return 'N/A';
  try {
    return format(new Date(dateStr), 'MMM d, yyyy');
  } catch (e) {
    return 'Invalid Date';
  }
};

const DocumentRepository: React.FC = () => {
  const {
    t
  } = useTranslation();
  const {
    documents,
    addDocument,
    updateDocument,
    deleteDocument,
    refreshDocumentStats,
    setSelectedDocument,
    isLoading,
    error: documentsError,
    retryFetchDocuments
  } = useDocuments();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [selectedDocForPreview, setSelectedDocForPreview] = useState<Document | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const {
    toast
  } = useToast();

  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError
  } = useDocumentCategories();
  const {
    statuses,
    loading: statusesLoading,
    error: statusesError
  } = useDocumentStatuses();

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        await refreshDocumentStats();
      } catch (error) {
        console.error('Error loading documents:', error);
      }
    };
    loadDocuments();
  }, [refreshDocumentStats]);

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = searchTerm ? doc.title.toLowerCase().includes(searchTerm.toLowerCase()) || doc.description && doc.description.toLowerCase().includes(searchTerm.toLowerCase()) : true;
    const matchesCategory = categoryFilter ? doc.category === categoryFilter : true;
    const matchesStatus = statusFilter ? doc.status === statusFilter : true;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const documentsByCategory = filteredDocuments.reduce((acc: Record<string, Document[]>, doc) => {
    if (!acc[doc.category]) {
      acc[doc.category] = [];
    }
    acc[doc.category].push(doc);
    return acc;
  }, {});

  const handleDocumentUploadComplete = (document: Document) => {
    addDocument(document);
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
  };

  const handleDownload = async (document: Document) => {
    try {
      setLoadingDocumentId(document.id);
      const storagePath = enhancedDocumentService.getStoragePath(document.id, document.file_name);
      const downloadUrl = await enhancedDocumentService.getDownloadUrl(storagePath);
      
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = document.file_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (user) {
        await documentService.createDocumentActivity({
          document_id: document.id,
          action: 'download',
          user_id: user.id,
          user_name: user.email || 'Unknown',
          user_role: 'User',
          comments: 'Document downloaded from repository'
        });
      }
      toast({
        title: 'Download started',
        description: `${document.title} is being downloaded.`
      });
    } catch (error) {
      console.error('Error downloading document:', error);
      toast({
        title: 'Download failed',
        description: 'There was a problem downloading the document.',
        variant: 'destructive'
      });
    } finally {
      setLoadingDocumentId(null);
    }
  };

  const handlePreviewDocument = (doc: Document) => {
    setSelectedDocForPreview(doc);
    setIsPreviewOpen(true);
  };

  const handleDocumentUpdate = (updatedDoc: Document) => {
    updateDocument(updatedDoc);
  };

  const documentStats = {
    total: documents.length,
    byStatus: statuses.reduce((acc: Record<string, number>, status) => {
      acc[status.name] = documents.filter(doc => doc.status === status.name).length;
      return acc;
    }, {}),
    byCategory: categories.reduce((acc: Record<string, number>, category) => {
      acc[category.name] = documents.filter(doc => doc.category === category.name).length;
      return acc;
    }, {})
  };

  if (isLoading || categoriesLoading || statusesLoading) {
    return <div className="flex flex-col justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <span className="text-lg">Loading documents...</span>
      </div>;
  }

  if (documentsError || categoriesError || statusesError) {
    return <div className="flex flex-col items-center justify-center h-64">
        <Alert variant="destructive" className="mb-4 max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error loading documents</AlertTitle>
          <AlertDescription>
            {documentsError?.message || categoriesError?.message || statusesError?.message || 'There was a problem loading the document repository.'}
          </AlertDescription>
        </Alert>
        <Button onClick={retryFetchDocuments} variant="outline" className="flex items-center">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>;
  }

  if (documents.length === 0) {
    return <div className="text-center p-12 bg-white rounded-lg shadow-sm flex flex-col items-center">
        <FileWarning className="h-16 w-16 text-muted-foreground opacity-50 mb-4" />
        <h3 className="text-xl font-medium mb-2">No Documents Found</h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          Your document repository is empty. Get started by uploading your first document.
        </p>
        <Button onClick={() => setUploadDialogOpen(true)} className="flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Upload Your First Document
        </Button>
        
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{t('documents.uploadDocument', 'Upload Document')}</DialogTitle>
              <DialogDescription>
                {t('documents.uploadDescription', 'Upload a document to the repository')}
              </DialogDescription>
            </DialogHeader>
            <DocumentUploader onUploadComplete={handleDocumentUploadComplete} />
          </DialogContent>
        </Dialog>
      </div>;
  }

  return <div className="space-y-6 animate-fade-in bg-cc-sky-200">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input type="search" placeholder={t('documents.search', 'Search documents...')} className="pl-8" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[160px]">
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                <span>{categoryFilter || t('documents.allCategories', 'All Categories')}</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              {categories.map(category => <SelectItem key={category.id} value={category.name}>{category.name}</SelectItem>)}
            </SelectContent>
          </Select>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                <span>{statusFilter || t('documents.allStatuses', 'All Statuses')}</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              {statuses.map(status => <SelectItem key={status.id} value={status.name}>{status.name}</SelectItem>)}
            </SelectContent>
          </Select>
          
          <div className="flex">
            <Button variant="outline" className="rounded-l-md rounded-r-none border-r-0" onClick={() => setViewMode('list')} data-active={viewMode === 'list'}>
              List
            </Button>
            <Button variant="outline" className="rounded-r-md rounded-l-none" onClick={() => setViewMode('grid')} data-active={viewMode === 'grid'}>
              Grid
            </Button>
          </div>
          
          <Button onClick={() => setUploadDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            {t('documents.addDocument', 'Add Document')}
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="documents">
        <TabsList>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        </TabsList>
        
        <TabsContent value="documents">
          {viewMode === 'list' && <Card>
              <CardContent className="p-0">
                {filteredDocuments.length > 0 ? <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('documents.title', 'Title')}</TableHead>
                        <TableHead>{t('documents.category', 'Category')}</TableHead>
                        <TableHead>{t('documents.status', 'Status')}</TableHead>
                        <TableHead>{t('documents.updated', 'Updated')}</TableHead>
                        <TableHead>{t('documents.version', 'Version')}</TableHead>
                        <TableHead className="text-right">{t('documents.actions', 'Actions')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDocuments.map(doc => <TableRow key={doc.id}>
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
                              <DropdownMenuContent align="end" className="bg-slate-800">
                                <DropdownMenuLabel>{t('documents.actions', 'Actions')}</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handlePreviewDocument(doc)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  {t('buttons.view', 'View')}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDownloadDocument(doc)}>
                                  <Download className="h-4 w-4 mr-2" />
                                  {t('buttons.download', 'Download')}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEditDocument(doc)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  {t('buttons.edit', 'Edit')}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => setConfirmDeleteId(doc.id)} className="text-red-600">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  {t('buttons.delete', 'Delete')}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>)}
                    </TableBody>
                  </Table> : <div className="text-center p-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                    <h3 className="text-lg font-medium mb-1">{t('documents.noDocumentsFound', 'No Documents Found')}</h3>
                    <p className="text-muted-foreground mb-4">
                      {searchTerm || categoryFilter || statusFilter ? t('documents.adjustFilters', 'Try adjusting your filters to find what you\'re looking for') : t('documents.uploadFirstDocument', 'Upload your first document to get started')}
                    </p>
                    {!(searchTerm || categoryFilter || statusFilter) && <Button onClick={() => setUploadDialogOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        {t('documents.uploadDocument', 'Upload Document')}
                      </Button>}
                  </div>}
              </CardContent>
            </Card>}
          
          <div key={viewMode === 'grid' && <div>
              {Object.keys(documentsByCategory).length > 0 ? Object.entries(documentsByCategory).map(([category, docs]) => <div key={category} className="mb-6">
                    <h3 className="text-lg font-medium mb-3 flex items-center">
                      <span className="inline-block w-3 h-3 bg-primary rounded-full mr-2"></span>
                      {category} <span className="text-muted-foreground ml-2 text-sm">({docs.length})</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {docs.map(doc => <Card key={doc.id} className="overflow-hidden">
                          <div className="h-32 bg-gray-100 flex items-center justify-center cursor-pointer" onClick={() => handlePreviewDocument(doc)}>
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
                              <span>{t('documents.updated', 'Updated')}: {formatDate(doc.updated_at)}</span>
                            </div>
                            <div className="flex justify-between mt-3">
                              <Button variant="ghost" size="sm" onClick={() => handlePreviewDocument(doc)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDownloadDocument(doc)}>
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleEditDocument(doc)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-500" onClick={() => setConfirmDeleteId(doc.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>)}
                    </div>
                  </div>) : <div className="text-center p-8 bg-white rounded-lg shadow-sm">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <h3 className="text-lg font-medium mb-1">{t('documents.noDocumentsFound', 'No Documents Found')}</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm || categoryFilter || statusFilter ? t('documents.adjustFilters', 'Try adjusting your filters to find what you\'re looking for') : t('documents.uploadFirstDocument', 'Upload your first document to get started')}
                  </p>
                  {!(searchTerm || categoryFilter || statusFilter) && <Button onClick={() => setUploadDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      {t('documents.uploadDocument', 'Upload Document')}
                    </Button>}
                </div>}
            </div>}
        </TabsContent>
        
        <TabsContent value="dashboard">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{documentStats.total}</div>
                <p className="text-muted-foreground">{t('documents.totalDocuments', 'Total Documents')}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{documentStats.byStatus['Published'] || 0}</div>
                <p className="text-muted-foreground">{t('documents.publishedDocuments', 'Published Documents')}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{documentStats.byStatus['Pending Approval'] || 0}</div>
                <p className="text-muted-foreground">{t('documents.awaitingApproval', 'Awaiting Approval')}</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('documents.documentsByCategory', 'Documents by Category')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(documentStats.byCategory).map(([category, count]) => <div key={category} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                        <span>{category}</span>
                      </div>
                      <Badge variant="outline">{count}</Badge>
                    </div>)}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>{t('documents.documentsByStatus', 'Documents by Status')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(documentStats.byStatus).map(([status, count]) => <div key={status} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <StatusBadge status={status} />
                      </div>
                      <Badge variant="outline">{count}</Badge>
                    </div>)}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      <DocumentPreviewDialog document={selectedDocForPreview} open={isPreviewOpen} onOpenChange={setIsPreviewOpen} onDocumentUpdate={handleDocumentUpdate} />
      
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('documents.uploadDocument', 'Upload Document')}</DialogTitle>
            <DialogDescription>
              {t('documents.uploadDescription', 'Upload a document to the repository')}
            </DialogDescription>
          </DialogHeader>
          <DocumentUploader onUploadComplete={handleDocumentUploadComplete} />
        </DialogContent>
      </Dialog>
      
      <Dialog open={!!confirmDeleteId} onOpenChange={open => !open && setConfirmDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                {t('documents.confirmDelete', 'Confirm Delete')}
              </div>
            </DialogTitle>
            <DialogDescription>
              {t('documents.deleteWarning', 'This action cannot be undone. This will permanently delete the document and all its versions.')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDeleteId(null)}>
              <X className="h-4 w-4 mr-2" />
              {t('buttons.cancel', 'Cancel')}
            </Button>
            <Button variant="destructive" onClick={() => confirmDeleteId && handleDeleteDocument(confirmDeleteId)}>
              <Trash2 className="h-4 w-4 mr-2" />
              {t('buttons.delete', 'Delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>;
};

const StatusBadge: React.FC<{
  status: string;
}> = ({
  status
}) => {
  switch (status) {
    case 'Draft':
      return <Badge variant="outline" className="bg-gray-100 text-gray-800">Draft</Badge>;
    case 'Pending Approval':
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending Approval</Badge>;
    case 'Approved':
      return <Badge variant="outline" className="bg-green-100 text-green-800">Approved</Badge>;
    case 'Published':
      return <Badge variant="default">Published</Badge>;
    case 'Archived':
      return <Badge variant="outline" className="bg-purple-100 text-purple-800">Archived</Badge>;
    case 'Expired':
      return <Badge variant="outline" className="bg-red-100 text-red-800">Expired</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default DocumentRepository;
