
import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDocument } from '@/contexts/DocumentContext';
import { FolderPlus, Upload, Search, FileText, Folder, RefreshCcw } from 'lucide-react';
import { Document as DocumentType } from '@/types/document';
import DocumentGrid from '@/components/documents/DocumentGrid';
import DocumentBreadcrumb from './DocumentBreadcrumb';
import DocumentFolders from './DocumentFolders';
import DocumentViewModeToggle from './DocumentViewModeToggle';
import { DocumentRepositoryErrorHandler } from './DocumentRepositoryErrorHandler';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface DocumentRepositoryProps {
  onShowUploadDialog?: () => void;
  onShowCreateFolderDialog?: () => void;
}

export const DocumentRepository: React.FC<DocumentRepositoryProps> = ({
  onShowUploadDialog,
  onShowCreateFolderDialog
}) => {
  const [currentPath, setCurrentPath] = useState('/');
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [repositoryError, setRepositoryError] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<DocumentType | null>(null);
  const [showDocumentPreview, setShowDocumentPreview] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);

  const { 
    documents,
    folders,
    loading, 
    error,
    refresh,
    deleteDocument,
    updateDocument,
    checkoutDocument,
    checkinDocument
  } = useDocument();

  // Handle UI errors separately from the context error
  useEffect(() => {
    if (error) {
      setRepositoryError(error);
    } else {
      setRepositoryError(null);
    }
  }, [error]);

  // Filter documents based on current folder and search term
  const filteredDocs = useMemo(() => {
    if (!documents) return [];
    
    let filtered = documents;
    
    // Filter by current folder
    if (selectedFolderId) {
      filtered = filtered.filter(doc => doc.folder_id === selectedFolderId);
    } else {
      // Show documents not in any specific folder when no folder is selected
      filtered = filtered.filter(doc => !doc.folder_id || doc.folder_id === 'root');
    }
    
    // Filter by search term
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
  }, [documents, selectedFolderId, searchTerm]);

  const handlePathChange = (path: string) => {
    setCurrentPath(path);
    // Reset folder selection when navigating via breadcrumb
    if (path === '/') {
      setSelectedFolderId(null);
    }
  };

  const handleFolderSelect = (folderId: string, folderPath: string) => {
    setSelectedFolderId(folderId);
    setCurrentPath(folderPath);
    console.log('Selected folder:', folderId, folderPath);
  };

  const handleRetry = () => {
    setRepositoryError(null);
    refresh();
  };

  const handleUploadClick = () => {
    if (onShowUploadDialog) {
      onShowUploadDialog();
    } else {
      console.log('Upload functionality not connected');
    }
  };

  const handleCreateFolderClick = () => {
    if (onShowCreateFolderDialog) {
      onShowCreateFolderDialog();
    } else {
      console.log('Create folder functionality not connected');
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    setDocumentToDelete(documentId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteDocument = async () => {
    if (!documentToDelete) return;

    try {
      await deleteDocument(documentToDelete);
      toast.success('Document deleted successfully');
      setDeleteDialogOpen(false);
      setDocumentToDelete(null);
    } catch (error) {
      console.error('Failed to delete document:', error);
      toast.error('Failed to delete document');
    }
  };

  const handleDocumentClick = (document: DocumentType) => {
    setSelectedDocument(document);
    setShowDocumentPreview(true);
    console.log('Viewing document:', document.title);
  };

  const handleDocumentEdit = (document: DocumentType) => {
    console.log('Editing document:', document.title);
    // TODO: Implement document editing functionality
    toast.info('Document editing feature coming soon');
  };

  const handleDocumentDownload = (document: DocumentType) => {
    console.log('Downloading document:', document.title);
    // TODO: Implement document download functionality
    toast.info('Document download feature coming soon');
  };

  const handleDocumentMove = async (documentId: string, targetFolderId: string) => {
    try {
      await updateDocument(documentId, { folder_id: targetFolderId });
      toast.success('Document moved successfully');
      
      // Refresh to show updated folder structure
      await refresh();
    } catch (error) {
      console.error('Failed to move document:', error);
      toast.error('Failed to move document');
    }
  };

  const handleDocumentCheckout = async (documentId: string) => {
    try {
      await checkoutDocument(documentId);
      toast.success('Document checked out successfully');
    } catch (error) {
      console.error('Failed to checkout document:', error);
      toast.error('Failed to checkout document');
    }
  };

  const handleDocumentCheckin = async (documentId: string) => {
    try {
      await checkinDocument(documentId);
      toast.success('Document checked in successfully');
    } catch (error) {
      console.error('Failed to checkin document:', error);
      toast.error('Failed to checkin document');
    }
  };

  const handleRefresh = async () => {
    try {
      await refresh();
      toast.success('Documents refreshed');
    } catch (error) {
      console.error('Failed to refresh documents:', error);
      toast.error('Failed to refresh documents');
    }
  };

  return (
    <div className="space-y-6">
      <DocumentRepositoryErrorHandler error={repositoryError} onRetry={handleRetry} />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <DocumentBreadcrumb path={currentPath} onNavigate={handlePathChange} />
        <div className="flex items-center gap-2">
          <DocumentViewModeToggle viewMode={viewMode} onViewModeChange={setViewMode} />
          <Button
            variant="outline"
            size="sm"
            onClick={handleUploadClick}
            className="flex items-center"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCreateFolderClick}
            className="flex items-center"
          >
            <FolderPlus className="h-4 w-4 mr-2" />
            New Folder
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCcw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar with folders */}
        <div className="lg:col-span-1">
          <DocumentFolders 
            onSelectFolder={handleFolderSelect}
            selectedFolderId={selectedFolderId}
          />
        </div>
        
        {/* Main content area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search documents by title, description, filename, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Documents */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <RefreshCcw className="h-8 w-8 animate-spin text-gray-400" />
              <span className="ml-2 text-lg text-gray-600">Loading documents...</span>
            </div>
          ) : (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-medium">
                  {currentPath === '/' ? 'All Documents' : `Documents in ${currentPath}`} ({filteredDocs.length})
                </h3>
                {filteredDocs.length > 0 && (
                  <span className="text-sm text-gray-500">
                    Showing {filteredDocs.length} of {documents.length} documents
                  </span>
                )}
              </div>
              
              {filteredDocs.length === 0 ? (
                <Card className="border-2 border-dashed border-gray-300">
                  <CardContent className="text-center py-12">
                    <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
                    <p className="text-sm text-gray-500 mb-6">
                      {searchTerm 
                        ? "Try adjusting your search terms or clear the search to see all documents" 
                        : selectedFolderId 
                        ? "This folder is empty. Upload documents or move existing documents here."
                        : "Get started by uploading your first document or creating a new folder"}
                    </p>
                    <div className="flex justify-center gap-3">
                      <Button onClick={handleUploadClick}>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Document
                      </Button>
                      <Button onClick={handleCreateFolderClick} variant="outline">
                        <FolderPlus className="h-4 w-4 mr-2" />
                        Create Folder
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {/* Quick tips */}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-700">
                      💡 <strong>Pro tip:</strong> Use checkout/checkin to edit documents safely. 
                      Drag and drop documents to move them between folders. 
                      Documents in workflow will appear in the Approval Workflow tab.
                    </p>
                  </div>
                  
                  <DocumentGrid 
                    documents={filteredDocs} 
                    onDocumentClick={handleDocumentClick}
                    onDocumentEdit={handleDocumentEdit}
                    onDocumentDelete={handleDeleteDocument}
                    onDocumentDownload={handleDocumentDownload}
                    onDocumentMove={handleDocumentMove}
                    onDocumentCheckout={handleDocumentCheckout}
                    onDocumentCheckin={handleDocumentCheckin}
                    viewMode={viewMode}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the document
              and remove all associated data including version history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteDocument} 
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Document
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DocumentRepository;
