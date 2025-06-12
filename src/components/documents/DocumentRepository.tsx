
import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDocument } from '@/contexts/DocumentContext';
import { FolderPlus, Upload, Search, FileText, Folder, RefreshCcw } from 'lucide-react';
import { Document as DocumentType } from '@/types/document';
import DocumentGrid from '@/components/documents/DocumentGrid';
import DocumentBreadcrumb from './DocumentBreadcrumb';
import { DocumentRepositoryErrorHandler } from './DocumentRepositoryErrorHandler';

interface DocumentRepositoryProps {
  onShowUploadDialog?: () => void;
  onShowCreateFolderDialog?: () => void;
}

export const DocumentRepository: React.FC<DocumentRepositoryProps> = ({
  onShowUploadDialog,
  onShowCreateFolderDialog
}) => {
  const [currentPath, setCurrentPath] = useState('/');
  const [searchTerm, setSearchTerm] = useState('');
  const [repositoryError, setRepositoryError] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<DocumentType | null>(null);
  const [showDocumentPreview, setShowDocumentPreview] = useState(false);

  const { 
    documents,
    loading, 
    error,
    refresh,
    deleteDocument
  } = useDocument();

  // Handle UI errors separately from the context error
  useEffect(() => {
    if (error) {
      setRepositoryError(error);
    } else {
      setRepositoryError(null);
    }
  }, [error]);

  // Use memo for filtered documents to avoid recalculation on every render
  const filteredDocs = useMemo(() => {
    if (!documents) return [];
    
    let filtered = documents;
    
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
  }, [documents, searchTerm]);

  const handlePathChange = (path: string) => {
    setCurrentPath(path);
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
    try {
      await deleteDocument(documentId);
    } catch (error) {
      console.error('Failed to delete document:', error);
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
  };

  const handleDocumentDownload = (document: DocumentType) => {
    console.log('Downloading document:', document.title);
    // TODO: Implement document download functionality
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
            onClick={refresh}
            disabled={loading}
          >
            <RefreshCcw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

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
            <h3 className="text-lg font-medium mb-3">Documents</h3>
            {filteredDocs.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg border">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 font-medium text-lg">No documents found</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {searchTerm 
                    ? "Try adjusting your search terms" 
                    : "Upload documents or create a new folder"}
                </p>
              </div>
            ) : (
              <DocumentGrid 
                documents={filteredDocs} 
                onDocumentClick={handleDocumentClick}
                onDocumentEdit={handleDocumentEdit}
                onDocumentDelete={handleDeleteDocument}
                onDocumentDownload={handleDocumentDownload}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentRepository;
