
// Only updating the relevant part with the issue
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDocument } from '@/contexts/DocumentContext';
import { FolderPlus, Upload, Search, FileText, Folder, RefreshCcw } from 'lucide-react';
import { Document as DocumentType } from '@/types/document';
import DocumentGrid from '@/components/documents/DocumentGrid';
import DocumentBreadcrumb from './DocumentBreadcrumb';
import { DocumentRepositoryErrorHandler } from './DocumentRepositoryErrorHandler';

export const DocumentRepository = () => {
  const [currentPath, setCurrentPath] = useState('/');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDocs, setFilteredDocs] = useState<DocumentType[]>([]);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showCreateFolderDialog, setShowCreateFolderDialog] = useState(false);
  const [repositoryError, setRepositoryError] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<DocumentType | null>(null);
  const [showDocumentPreview, setShowDocumentPreview] = useState(false);

  const { 
    documents, 
    loading, 
    error,
    fetchDocuments
  } = useDocument();

  // Mock folders for now since the context doesn't have real folders
  const folders: any[] = [];  

  // Handle UI errors separately from the context error
  useEffect(() => {
    if (error) {
      setRepositoryError(error);
    } else {
      setRepositoryError(null);
    }
  }, [error]);

  useEffect(() => {
    if (!documents) return;
    
    let filtered = documents;
    
    // Filter by path
    filtered = filtered.filter(doc => {
      const docPath = doc.file_path || '/';
      return docPath === currentPath;
    });
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(doc => 
        doc.title.toLowerCase().includes(term) || 
        doc.description?.toLowerCase().includes(term)
      );
    }
    
    setFilteredDocs(filtered);
  }, [documents, currentPath, searchTerm]);

  const currentFolders = folders?.filter(folder => 
    folder.path === currentPath
  ) || [];

  const handlePathChange = (path: string) => {
    setCurrentPath(path);
  };

  const handleRetry = () => {
    setRepositoryError(null);
    fetchDocuments();
  };

  const isRootPath = currentPath === '/';
  const parentPath = isRootPath 
    ? '/' 
    : currentPath.substring(0, currentPath.lastIndexOf('/')) || '/';

  const handleCreateFolder = (folderName: string) => {
    // Implementation for creating a folder
    console.log(`Creating folder ${folderName} at ${currentPath}`);
    setShowCreateFolderDialog(false);
    // After creating folder, refresh the document list
    fetchDocuments();
  };

  const handleUploadDocument = (files: File[]) => {
    // Implementation for uploading documents
    console.log(`Uploading ${files.length} files to ${currentPath}`);
    setShowUploadDialog(false);
    // After uploading, refresh the document list
    fetchDocuments();
  };

  const handleDeleteDocument = (documentId: string) => {
    // Implementation for deleting a document
    console.log(`Deleting document ${documentId}`);
    // After deleting, refresh the document list
    fetchDocuments();
  };

  const handleMoveDocument = (documentId: string, newPath: string) => {
    // Implementation for moving a document
    console.log(`Moving document ${documentId} to ${newPath}`);
    // After moving, refresh the document list
    fetchDocuments();
  };

  const handleDocumentClick = (document: DocumentType) => {
    setSelectedDocument(document);
    setShowDocumentPreview(true);
  };

  return (
    <div className="space-y-4">
      <DocumentRepositoryErrorHandler error={repositoryError} />
      
      <div className="flex justify-between items-center">
        <DocumentBreadcrumb path={currentPath} onNavigate={handlePathChange} />
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowUploadDialog(true)}
            className="flex items-center"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCreateFolderDialog(true)}
            className="flex items-center"
          >
            <FolderPlus className="h-4 w-4 mr-2" />
            New Folder
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
        // Render folders and documents
        <div>
          {/* Folders section */}
          {currentFolders.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Folders</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {currentFolders.map((folder) => (
                  <Card
                    key={folder.id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handlePathChange(`${currentPath}/${folder.name}`)}
                  >
                    <CardContent className="p-4 flex items-center">
                      <Folder className="h-5 w-5 mr-2 text-blue-500" />
                      <span>{folder.name}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Documents section */}
          <div>
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
              <DocumentGrid documents={filteredDocs} onDocumentClick={handleDocumentClick} />
            )}
          </div>
        </div>
      )}

      {/* Upload dialog and create folder dialog components would be rendered here */}
    </div>
  );
};

export default DocumentRepository;
