
import React, { useState, useEffect } from 'react';
import { useDocuments } from '@/contexts/DocumentContext';
import { Search, Plus, Filter, FolderOpen, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import DocumentList from '@/components/documents/DocumentList';
import DocumentFolders from '@/components/documents/DocumentFolders';
import UploadDocumentDialog from '@/components/documents/UploadDocumentDialog';
import { Badge } from '@/components/ui/badge';
import { Document as DocumentType, Folder } from '@/types/document';
import { ScrollArea } from '@/components/ui/scroll-area';
import { adaptDatabaseArray, adaptDatabaseToDocument } from '@/utils/documentTypeAdapter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import DocumentViewer from './DocumentViewer';
import { supabase } from '@/integrations/supabase/client';
import documentService from '@/services/documentService';

const DocumentRepository: React.FC = () => {
  const {
    documents,
    folders,
    selectedFolder,
    setSelectedFolder,
    isLoading,
    error,
    refreshData,
    deleteDocument,
  } = useDocuments();

  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [filteredDocuments, setFilteredDocuments] = useState<DocumentType[]>([]);
  const [sortBy, setSortBy] = useState<'title' | 'updated_at'>('updated_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedDocument, setSelectedDocument] = useState<DocumentType | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const { toast } = useToast();

  // Process and filter documents when dependant states change
  useEffect(() => {
    if (!documents) {
      setFilteredDocuments([]);
      return;
    }
    
    let filtered = [...documents];
    
    // Filter by folder
    if (selectedFolder) {
      filtered = filtered.filter(doc => doc.folder_id === selectedFolder.id);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(doc => 
        doc.title?.toLowerCase().includes(query) || 
        (doc.description && doc.description.toLowerCase().includes(query)) ||
        (doc.tags && doc.tags.some(tag => tag.toLowerCase().includes(query))) ||
        doc.category.toLowerCase().includes(query)
      );
    }
    
    // Sort documents
    filtered = [...filtered].sort((a, b) => {
      if (sortBy === 'title') {
        return sortDirection === 'asc' 
          ? (a.title || '').localeCompare(b.title || '') 
          : (b.title || '').localeCompare(a.title || '');
      } else {
        const dateA = new Date(a.updated_at || a.created_at).getTime();
        const dateB = new Date(b.updated_at || b.created_at).getTime();
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      }
    });
    
    setFilteredDocuments(filtered);
  }, [documents, searchQuery, selectedFolder, sortBy, sortDirection]);

  // Handle sort button click
  const handleSortChange = (field: 'title' | 'updated_at') => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  // Handle folder selection
  const handleFolderSelect = (folder: Folder) => {
    setSelectedFolder(folder);
  };

  // Document action handlers
  const handleViewDocument = async (document: DocumentType) => {
    setSelectedDocument(document);
    setIsViewDialogOpen(true);
    
    try {
      // Record view activity
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await documentService.createDocumentActivity({
          document_id: document.id,
          action: 'view',
          user_id: user.id,
          user_name: user.email || 'Unknown user',
          user_role: 'User',
          comments: 'Document viewed'
        });
      }
    } catch (error) {
      console.error('Error recording view activity:', error);
    }
  };

  const handleEditDocument = (document: DocumentType) => {
    console.log('Edit document:', document);
    // Implement document editing logic here
    toast({
      title: "Edit Document",
      description: `Editing document: ${document.title}`,
    });
  };

  const handleDeleteDocument = async (document: DocumentType) => {
    if (confirm(`Are you sure you want to delete "${document.title}"?`)) {
      try {
        if (!deleteDocument) {
          throw new Error("Delete function is not available");
        }
        
        await deleteDocument(document.id);
        
        toast({
          title: "Document Deleted",
          description: `"${document.title}" has been deleted successfully.`,
        });
        
        // Refresh data after deletion
        await refreshData();
      } catch (error: any) {
        console.error('Error deleting document:', error);
        toast({
          title: "Delete Failed",
          description: error.message || "Failed to delete document.",
          variant: "destructive"
        });
      }
    }
  };

  const handleDownloadDocument = async (document: DocumentType) => {
    try {
      // Get file path from document
      const filePath = document.file_path;
      
      if (!filePath) {
        throw new Error("Document has no file attached");
      }
      
      // Create a download link and click it
      const a = document.createElement('a');
      a.href = filePath;
      a.download = document.file_name || document.title;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast({
        title: "Download Started",
        description: `Downloading ${document.title}`,
      });
      
      // Record download activity
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await documentService.createDocumentActivity({
          document_id: document.id,
          action: 'download',
          user_id: user.id,
          user_name: user.email || 'Unknown user',
          user_role: 'User',
          comments: 'Document downloaded'
        });
      }
    } catch (error: any) {
      console.error('Error downloading document:', error);
      toast({
        title: "Download Failed",
        description: error.message || "Failed to download document.",
        variant: "destructive"
      });
    }
  };

  // Handle upload completion
  const handleUploadComplete = () => {
    refreshData();
  };

  return (
    <div className="p-6 space-y-6">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load documents: {error.message || "Unknown error"}
          </AlertDescription>
        </Alert>
      )}
      
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              placeholder="Search documents..."
              className="pl-10 border-gray-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => handleSortChange('updated_at')}
            className="border-gray-300"
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsUploadOpen(true)} className="gap-2 bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4" /> Upload
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Folders sidebar */}
        <div className="md:col-span-1">
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="bg-gray-50 border-b border-gray-200">
              <CardTitle className="text-lg font-medium flex items-center">
                <FolderOpen className="h-5 w-5 mr-2 text-primary" /> 
                Folders
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <DocumentFolders
                onSelectFolder={handleFolderSelect}
                selectedFolder={selectedFolder}
              />
            </CardContent>
          </Card>
        </div>
        
        {/* Documents list */}
        <div className="md:col-span-3">
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="bg-gray-50 border-b border-gray-200 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CardTitle className="text-lg font-medium flex items-center">
                    {selectedFolder ? (
                      <>
                        <FolderOpen className="h-5 w-5 mr-2 text-primary" />
                        {selectedFolder.name}
                      </>
                    ) : (
                      "All Documents"
                    )}
                  </CardTitle>
                  <Badge variant="outline" className="ml-3 bg-blue-50 text-blue-800 border-blue-200">
                    {filteredDocuments.length} document{filteredDocuments.length !== 1 ? 's' : ''}
                  </Badge>
                </div>
                
                {selectedFolder && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setSelectedFolder(null)}
                    className="text-sm font-normal"
                  >
                    Show All
                  </Button>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex justify-center items-center p-12 text-gray-500">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mr-3"></div>
                  Loading documents...
                </div>
              ) : (
                <DocumentList
                  documents={filteredDocuments}
                  onViewDocument={handleViewDocument}
                  onEditDocument={handleEditDocument}
                  onDeleteDocument={handleDeleteDocument}
                  onDownloadDocument={handleDownloadDocument}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <UploadDocumentDialog 
        open={isUploadOpen} 
        onOpenChange={setIsUploadOpen}
        onSuccess={handleUploadComplete}
      />
      
      {selectedDocument && (
        <DocumentViewer 
          document={selectedDocument}
          open={isViewDialogOpen}
          onOpenChange={setIsViewDialogOpen}
        />
      )}
    </div>
  );
};

export default DocumentRepository;
