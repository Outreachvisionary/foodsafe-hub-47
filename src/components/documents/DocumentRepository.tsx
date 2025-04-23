
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
import { Document } from '@/types/database';
import { Folder } from '@/types/document';
import { ScrollArea } from '@/components/ui/scroll-area';
import { adaptDatabaseArray, adaptDatabaseToFolder } from '@/utils/documentTypeAdapter';
import { Card, CardContent } from '@/components/ui/card';

const DocumentRepository: React.FC = () => {
  const {
    documents,
    folders,
    selectedFolder,
    setSelectedFolder,
    isLoading,
    error,
  } = useDocuments();

  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
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

  const handleFolderSelect = (folder: any) => {
    // Use adaptDatabaseToFolder to ensure correct typing
    const documentFolder: Folder = adaptDatabaseToFolder({
      id: folder.id,
      parent_id: folder.parent_id,
      name: folder.name,
      path: folder.path,
      created_by: folder.created_by,
      created_at: folder.created_at || new Date().toISOString(),
      updated_at: folder.updated_at || new Date().toISOString(),
      document_count: folder.document_count || 0
    });
    setSelectedFolder(documentFolder);
  };

  const handleViewDocument = (document: Document) => {
    console.log('View document:', document);
  };

  const handleEditDocument = (document: Document) => {
    console.log('Edit document:', document);
  };

  const handleDeleteDocument = (document: Document) => {
    console.log('Delete document:', document);
  };

  const handleDownloadDocument = (document: Document) => {
    console.log('Download document:', document);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              placeholder="Search documents..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" onClick={() => handleSortChange('updated_at')}>
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsUploadOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" /> Upload
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <DocumentFolders
            onSelectFolder={handleFolderSelect}
            selectedFolder={selectedFolder}
          />
        </div>
        
        <div className="md:col-span-3">
          {selectedFolder && (
            <div className="flex items-center gap-2 bg-muted/30 rounded-md p-2 mb-4">
              <FolderOpen className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Current Folder: {selectedFolder.name}</span>
              <Badge variant="outline" className="ml-2">
                {filteredDocuments.length} documents
              </Badge>
            </div>
          )}
          
          <Card>
            <CardContent className="p-0">
              <DocumentList
                documents={adaptDatabaseArray(filteredDocuments)}
                onViewDocument={handleViewDocument}
                onEditDocument={handleEditDocument}
                onDeleteDocument={handleDeleteDocument}
                onDownloadDocument={handleDownloadDocument}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <UploadDocumentDialog 
        open={isUploadOpen} 
        onOpenChange={setIsUploadOpen}
      />
    </div>
  );
};

export default DocumentRepository;
