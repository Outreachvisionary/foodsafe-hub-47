import React, { useState, useEffect } from 'react';
import { useDocuments } from '@/contexts/DocumentContext';
import { Search, Plus, Filter, FolderOpen, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import DocumentList from '@/components/documents/DocumentList';
import DocumentFolders from '@/components/documents/DocumentFolders';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UploadDocumentDialog from '@/components/documents/UploadDocumentDialog';
import { Badge } from '@/components/ui/badge';
import { Folder, Document as DocumentType } from '@/types/database';
import { ScrollArea } from '@/components/ui/scroll-area';

const DocumentRepository: React.FC = () => {
  const {
    documents,
    folders,
    selectedFolder,
    setSelectedFolder,
    isLoading,
    error
  } = useDocuments();

  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [filteredDocuments, setFilteredDocuments] = useState<DocumentType[]>([]);
  const [sortBy, setSortBy] = useState<'title' | 'updated_at'>('updated_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    let filtered = documents;
    
    if (selectedFolder) {
      filtered = filtered.filter(doc => doc.folder_id === selectedFolder.id);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(doc => 
        doc.title.toLowerCase().includes(query) || 
        (doc.description && doc.description.toLowerCase().includes(query)) ||
        (doc.tags && doc.tags.some(tag => tag.toLowerCase().includes(query))) ||
        doc.category.toLowerCase().includes(query)
      );
    }
    
    filtered = [...filtered].sort((a, b) => {
      if (sortBy === 'title') {
        return sortDirection === 'asc' 
          ? a.title.localeCompare(b.title) 
          : b.title.localeCompare(a.title);
      } else {
        const dateA = new Date(a.updated_at).getTime();
        const dateB = new Date(b.updated_at).getTime();
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      }
    });
    
    setFilteredDocuments(filtered);
  }, [documents, searchQuery, selectedFolder, sortBy, sortDirection]);

  const handleSortChange = (field: 'title' | 'updated_at') => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  const handleFolderSelect = (folder: Folder | null) => {
    setSelectedFolder(folder);
  };

  const handleViewDocument = (document: DocumentType) => {
    console.log('View document:', document);
  };

  const handleEditDocument = (document: DocumentType) => {
    console.log('Edit document:', document);
  };

  const handleDeleteDocument = (document: DocumentType) => {
    console.log('Delete document:', document);
  };

  const handleDownloadDocument = (document: DocumentType) => {
    console.log('Download document:', document);
  };

  return (
    <div className="p-6 bg-white">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="documentList">Document List</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard">
          <div className="text-center py-8">
            <h3 className="text-xl font-medium mb-4">Document Dashboard</h3>
            <p className="text-muted-foreground mb-4">
              View and manage your document metrics and statistics here.
            </p>
            <Button onClick={() => setActiveTab('documentList')}>
              View Documents
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="documentList" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1">
              <DocumentFolders
                onSelectFolder={handleFolderSelect}
                selectedFolder={selectedFolder}
              />
            </div>
            
            <div className="md:col-span-3 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search documents..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="gap-1"
                    onClick={() => handleSortChange('updated_at')}
                  >
                    <ArrowUpDown className="h-4 w-4" />
                    <span className="hidden sm:inline">Sort</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="gap-1"
                    onClick={() => setSortBy(sortBy === 'title' ? 'updated_at' : 'title')}
                  >
                    <Filter className="h-4 w-4" />
                    <span className="hidden sm:inline">Filter</span>
                  </Button>
                  
                  <Button 
                    className="gap-1"
                    onClick={() => setIsUploadOpen(true)}
                  >
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">Upload</span>
                  </Button>
                </div>
              </div>
              
              {selectedFolder && (
                <div className="flex items-center gap-2 bg-muted/30 rounded-md p-2">
                  <FolderOpen className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Current Folder: {selectedFolder.name}</span>
                  <Badge variant="outline" className="ml-2">
                    {filteredDocuments.length} documents
                  </Badge>
                </div>
              )}
              
              {filteredDocuments.length > 0 ? (
                <div className="border rounded-md">
                  <DocumentList 
                    documents={filteredDocuments} 
                    onViewDocument={handleViewDocument}
                    onEditDocument={handleEditDocument}
                    onDeleteDocument={handleDeleteDocument}
                    onDownloadDocument={handleDownloadDocument}
                  />
                </div>
              ) : (
                <div className="border rounded-md p-12 text-center">
                  <div className="mx-auto bg-muted/20 rounded-full w-20 h-20 flex items-center justify-center mb-4">
                    <FolderOpen className="h-10 w-10 text-muted-foreground/60" />
                  </div>
                  <h3 className="text-lg font-medium">No documents found</h3>
                  {selectedFolder ? (
                    <p className="text-muted-foreground mt-1 mb-4">
                      This folder is empty. Upload documents to get started.
                    </p>
                  ) : (
                    <p className="text-muted-foreground mt-1 mb-4">
                      No documents match your search query.
                    </p>
                  )}
                  <Button 
                    onClick={() => setIsUploadOpen(true)}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Upload Your First Document
                  </Button>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <UploadDocumentDialog 
        open={isUploadOpen} 
        onOpenChange={setIsUploadOpen}
      />
    </div>
  );
};

export default DocumentRepository;
