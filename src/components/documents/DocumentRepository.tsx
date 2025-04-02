
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
import { useToast } from '@/hooks/use-toast';
import DocumentPreviewDialogWrapper from '@/components/documents/DocumentPreviewDialogWrapper';
import { useTranslation } from 'react-i18next';
import DocumentRepositoryHeader from './DocumentRepositoryHeader';

const DocumentRepository: React.FC = () => {
  const {
    documents = [],
    folders = [],
    selectedFolder,
    setSelectedFolder,
    isLoading,
    error,
    setSelectedDocument,
    refreshData,
    deleteDocument
  } = useDocuments();

  const { t } = useTranslation();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('documentList');
  const [filteredDocuments, setFilteredDocuments] = useState<DocumentType[]>([]);
  const [sortBy, setSortBy] = useState<'title' | 'updated_at'>('updated_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [previewDocument, setPreviewDocument] = useState<DocumentType | null>(null);

  useEffect(() => {
    const docArray = Array.isArray(documents) ? documents : [];
    const folderArray = Array.isArray(folders) ? folders : [];
    
    let filtered = [...docArray];
    
    if (selectedFolder) {
      filtered = filtered.filter(doc => doc.folder_id === selectedFolder.id);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(doc => 
        (doc.title && doc.title.toLowerCase().includes(query)) || 
        (doc.description && doc.description.toLowerCase().includes(query)) ||
        (doc.tags && Array.isArray(doc.tags) && doc.tags.some(tag => tag.toLowerCase().includes(query))) ||
        (doc.category && doc.category.toLowerCase().includes(query))
      );
    }
    
    filtered = filtered.sort((a, b) => {
      if (sortBy === 'title') {
        return sortDirection === 'asc' 
          ? (a.title || '').localeCompare(b.title || '') 
          : (b.title || '').localeCompare(a.title || '');
      } else {
        const dateA = a.updated_at ? new Date(a.updated_at).getTime() : 0;
        const dateB = b.updated_at ? new Date(b.updated_at).getTime() : 0;
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      }
    });
    
    setFilteredDocuments(filtered);
  }, [documents, searchQuery, selectedFolder, sortBy, sortDirection, folders]);

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
    if (document) {
      setPreviewDocument(document);
      setSelectedDocument(document);
    }
  };

  const handleEditDocument = (document: DocumentType) => {
    if (document) {
      setSelectedDocument(document);
      // Navigate to the edit tab in the parent component
      // This will be handled in Documents.tsx
    }
  };

  const handleDeleteDocument = async (document: DocumentType) => {
    if (!document || !document.id) {
      toast({
        title: t('notifications.error'),
        description: t('documents.errors.invalidDocument'),
        variant: "destructive",
      });
      return;
    }

    try {
      if (typeof deleteDocument === 'function') {
        await deleteDocument(document.id);
        toast({
          title: t('notifications.success'),
          description: t('documents.deleteSuccess'),
        });
      } else {
        // Fallback if deleteDocument is not implemented
        toast({
          title: t('notifications.error'),
          description: t('documents.errors.operationNotSupported'),
          variant: "destructive",
        });
      }
      
      // Refresh the documents list to ensure UI is updated
      if (typeof refreshData === 'function') {
        await refreshData();
      }
    } catch (error) {
      console.error("Error in delete operation:", error);
      toast({
        title: t('notifications.error'),
        description: t('documents.errors.deleteFailed'),
        variant: "destructive",
      });
    }
  };

  const handleDownloadDocument = (document: DocumentType) => {
    if (!document || !document.title) {
      toast({
        title: t('notifications.error'),
        description: t('documents.errors.invalidDocument'),
        variant: "destructive",
      });
      return;
    }
    
    // Implement download logic or open in a new tab
    toast({
      title: t('documents.downloadStarted'),
      description: t('documents.downloadingFile', { title: document.title }),
    });
  };

  return (
    <div className="p-6 bg-white">
      <DocumentRepositoryHeader />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="dashboard">{t('dashboard.title')}</TabsTrigger>
          <TabsTrigger value="documentList">{t('documents.repository')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard">
          <div className="text-center py-8">
            <h3 className="text-xl font-medium mb-4">{t('documents.controlSystem')}</h3>
            <p className="text-muted-foreground mb-4">
              {t('documents.subtitle')}
            </p>
            <Button onClick={() => setActiveTab('documentList')}>
              {t('documents.viewDocuments')}
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
                    placeholder={t('documents.search')}
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
                    <span className="hidden sm:inline">{t('buttons.sort')}</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="gap-1"
                    onClick={() => setSortBy(sortBy === 'title' ? 'updated_at' : 'title')}
                  >
                    <Filter className="h-4 w-4" />
                    <span className="hidden sm:inline">{t('buttons.filter')}</span>
                  </Button>
                  
                  <Button 
                    className="gap-1"
                    onClick={() => setIsUploadOpen(true)}
                  >
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">{t('buttons.upload')}</span>
                  </Button>
                </div>
              </div>
              
              {selectedFolder && (
                <div className="flex items-center gap-2 bg-muted/30 rounded-md p-2">
                  <FolderOpen className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">{t('documents.currentFolder')}: {selectedFolder.name}</span>
                  <Badge variant="outline" className="ml-2">
                    {Array.isArray(filteredDocuments) ? filteredDocuments.length : 0} {t('documents.documentsCount')}
                  </Badge>
                </div>
              )}
              
              {Array.isArray(filteredDocuments) && filteredDocuments.length > 0 ? (
                <ScrollArea className="h-[calc(100vh-350px)] border rounded-md">
                  <DocumentList 
                    documents={filteredDocuments} 
                    onViewDocument={handleViewDocument}
                    onEditDocument={handleEditDocument}
                    onDeleteDocument={handleDeleteDocument}
                    onDownloadDocument={handleDownloadDocument}
                  />
                </ScrollArea>
              ) : (
                <div className="border rounded-md p-12 text-center">
                  <div className="mx-auto bg-muted/20 rounded-full w-20 h-20 flex items-center justify-center mb-4">
                    <FolderOpen className="h-10 w-10 text-muted-foreground/60" />
                  </div>
                  <h3 className="text-lg font-medium">{t('documents.noDocumentsFound')}</h3>
                  {selectedFolder ? (
                    <p className="text-muted-foreground mt-1 mb-4">
                      {t('documents.emptyFolder')}
                    </p>
                  ) : (
                    <p className="text-muted-foreground mt-1 mb-4">
                      {t('documents.noMatchingDocuments')}
                    </p>
                  )}
                  <Button 
                    onClick={() => setIsUploadOpen(true)}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    {t('documents.uploadFirstDocument')}
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

      {previewDocument && (
        <DocumentPreviewDialogWrapper
          document={previewDocument}
          open={!!previewDocument}
          onOpenChange={(open) => {
            if (!open) setPreviewDocument(null);
          }}
        />
      )}
    </div>
  );
};

export default DocumentRepository;
