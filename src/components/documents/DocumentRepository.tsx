
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
import { DocumentRepositoryErrorHandler } from './DocumentRepositoryErrorHandler';
import { toast } from 'sonner';

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
  const [repositoryError, setRepositoryError] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<DocumentType | null>(null);
  const [showDocumentPreview, setShowDocumentPreview] = useState(false);

  const { 
    documents,
    loading, 
    error,
    refresh,
    deleteDocument,
    updateDocument
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
        doc.file_name.toLowerCase().includes(term)
      );
    }
    
    return filtered;
  }, [documents, selectedFolderId, searchTerm]);

  const handlePathChange = (path: string) => {
    setCurrentPath(path);
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
    if (!confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      await deleteDocument(documentId);
      toast.success('Document deleted successfully');
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
    <div className="space-y-4">
      <DocumentRepositoryErrorHandler error={repositoryError} onRetry={handleRetry} />
      
      <div className="flex justify-between items-center">
        <DocumentBreadcrumb path={currentPath} onNavigate={handlePathChange} />
        <div className="flex gap-2">
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
        <div className="lg:col-span-1">
          <DocumentFolders onSelectFolder={handleFolderSelect} />
        </div>
        
        <div className="lg:col-span-3 space-y-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <RefreshCcw className="h-8 w-8 animate-spin text-gray-400" />
              <span className="ml-2 text-lg text-gray-600">Loading documents...</span>
            </div>
          ) : (
            <div>
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-3">
                  Documents in {currentPath} ({filteredDocs.length})
                </h3>
                {filteredDocs.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border">
                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 font-medium text-lg">No documents found</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {searchTerm 
                        ? "Try adjusting your search terms" 
                        : selectedFolderId 
                        ? "This folder is empty. Upload documents or move existing documents here."
                        : "Upload documents or create a new folder"}
                    </p>
                    <div className="mt-4 flex justify-center gap-2">
                      <Button onClick={handleUploadClick} size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Document
                      </Button>
                      <Button onClick={handleCreateFolderClick} variant="outline" size="sm">
                        <FolderPlus className="h-4 w-4 mr-2" />
                        Create Folder
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-700">
                        💡 <strong>Tip:</strong> Drag and drop documents to move them between folders. 
                        Documents with approval workflow will appear in the Approval Workflow tab.
                      </p>
                    </div>
                    <DocumentGrid 
                      documents={filteredDocs} 
                      onDocumentClick={handleDocumentClick}
                      onDocumentEdit={handleDocumentEdit}
                      onDocumentDelete={handleDeleteDocument}
                      onDocumentDownload={handleDocumentDownload}
                      onDocumentMove={handleDocumentMove}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentRepository;
