
import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useDocument } from '@/contexts/DocumentContext';
import { RefreshCw } from 'lucide-react';
import { Document as DocumentType } from '@/types/document';
import DocumentGrid from '@/components/documents/DocumentGrid';
import DocumentFolders from './DocumentFolders';
import DocumentHeader from './DocumentHeader';
import DocumentSearch from './DocumentSearch';
import EmptyDocumentsState from './EmptyDocumentsState';
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
  const [selectedDocument, setSelectedDocument] = useState<DocumentType | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);

  const { 
    documents,
    loading, 
    error,
    refresh,
    deleteDocument,
    updateDocument,
    checkoutDocument,
    checkinDocument
  } = useDocument();

  console.log('DocumentRepository render:', { 
    documentsCount: documents?.length, 
    loading, 
    error, 
    hasDocuments: !!documents 
  });

  // Filter documents based on current folder and search term
  const filteredDocs = useMemo(() => {
    if (!documents || !Array.isArray(documents)) {
      console.log('No documents array available');
      return [];
    }
    
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
        doc.title?.toLowerCase().includes(term) || 
        doc.description?.toLowerCase().includes(term) ||
        doc.file_name?.toLowerCase().includes(term) ||
        doc.tags?.some(tag => tag.toLowerCase().includes(term))
      );
    }
    
    console.log('Filtered documents:', filtered.length);
    return filtered;
  }, [documents, selectedFolderId, searchTerm]);

  const handlePathChange = (path: string) => {
    setCurrentPath(path);
    if (path === '/') {
      setSelectedFolderId(null);
    }
  };

  const handleFolderSelect = (folderId: string | null, folderPath: string) => {
    setSelectedFolderId(folderId);
    setCurrentPath(folderPath);
    console.log('Selected folder:', folderId, folderPath);
  };

  const handleUploadClick = () => {
    if (onShowUploadDialog) {
      onShowUploadDialog();
    } else {
      toast.info('Upload dialog not connected');
    }
  };

  const handleCreateFolderClick = () => {
    if (onShowCreateFolderDialog) {
      onShowCreateFolderDialog();
    } else {
      toast.info('Create folder dialog not connected');
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
    console.log('Viewing document:', document.title);
  };

  const handleDocumentEdit = (document: DocumentType) => {
    console.log('Editing document:', document.title);
    toast.info('Document editing feature coming soon');
  };

  const handleDocumentDownload = (document: DocumentType) => {
    console.log('Downloading document:', document.title);
    toast.info('Document download feature coming soon');
  };

  const handleDocumentMove = async (documentId: string, targetFolderId: string) => {
    try {
      await updateDocument(documentId, { folder_id: targetFolderId });
      toast.success('Document moved successfully');
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

  // Show error state if there's an error
  if (error) {
    return (
      <div className="space-y-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="text-center py-12">
            <div className="text-red-600 mb-4">
              <RefreshCw className="mx-auto h-12 w-12 mb-2" />
              <h3 className="text-lg font-medium">Error Loading Documents</h3>
              <p className="text-sm mt-2">{error}</p>
            </div>
            <button onClick={handleRefresh} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
              Try Again
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <DocumentHeader
        currentPath={currentPath}
        viewMode={viewMode}
        loading={loading}
        onNavigate={handlePathChange}
        onViewModeChange={setViewMode}
        onUpload={handleUploadClick}
        onCreateFolder={handleCreateFolderClick}
        onRefresh={handleRefresh}
      />

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
          <DocumentSearch
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />

          {/* Documents */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
              <span className="ml-2 text-lg text-gray-600">Loading documents...</span>
            </div>
          ) : (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-medium">
                  {currentPath === '/' ? 'All Documents' : `Documents in ${currentPath}`} ({filteredDocs.length})
                </h3>
                {filteredDocs.length > 0 && documents && (
                  <span className="text-sm text-gray-500">
                    Showing {filteredDocs.length} of {documents.length} documents
                  </span>
                )}
              </div>
              
              {filteredDocs.length === 0 ? (
                <EmptyDocumentsState
                  searchTerm={searchTerm}
                  selectedFolderId={selectedFolderId}
                  onUpload={handleUploadClick}
                  onCreateFolder={handleCreateFolderClick}
                />
              ) : (
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
              This action cannot be undone. This will permanently delete the document.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteDocument}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DocumentRepository;
