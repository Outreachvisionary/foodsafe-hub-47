import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { Search, Plus, FolderPlus, MoreVertical, Folder, FileText, Download } from 'lucide-react';
import { useDocuments } from '@/contexts/DocumentContext';
import { DocumentRepositoryErrorHandler } from './DocumentRepositoryErrorHandler';
import { DocumentEditor } from './DocumentEditor';
import { Document as DocumentType, Folder as FolderType } from '@/types/document';

export const DocumentRepository = () => {
  const {
    documents,
    folders,
    selectedDocument,
    selectedFolder,
    isLoading,
    error,
    fetchDocuments,
    setSelectedDocument: selectDocument,
    setSelectedFolder: selectFolder,
  } = useDocuments();

  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCreateFolder = async () => {
    try {
      if (!newFolderName.trim()) {
        toast({
          title: 'Folder name is required',
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Folder created',
        description: `"${newFolderName}" folder has been created`,
      });

      setNewFolderName('');
      setIsCreateFolderOpen(false);
    } catch (err) {
      toast({
        title: 'Failed to create folder',
        variant: 'destructive',
      });
    }
  };

  const handleDownloadDocument = (doc: DocumentType) => {
    const downloadUrl = `https://example.com/api/documents/${doc.id}/download`;
    
    const downloadLink = document.createElement('a');
    downloadLink.href = downloadUrl;
    downloadLink.download = doc.file_name;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const filteredDocuments = documents.filter(
    (doc) =>
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFolders = folders.filter(
    (folder) =>
      (selectedFolder?.id
        ? folder.parent_id === selectedFolder.id
        : folder.parent_id === null) &&
      folder.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const breadcrumbs = [];
  let currentFolder = selectedFolder;

  while (currentFolder) {
    breadcrumbs.unshift(currentFolder);
    const parentFolder = folders.find((f) => f.id === currentFolder?.parent_id);
    currentFolder = parentFolder || null;
  }

  const renderCheckoutStatus = (doc: DocumentType) => {
    if (doc.checkout_status === 'Checked_Out') {
      return (
        <div className="text-xs text-amber-600 font-medium">
          Checked out by {doc.checkout_user_name}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-full flex flex-col md:flex-row">
      <div className="w-full md:w-96 border-r p-4 overflow-auto">
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search documents..."
              className="pl-8"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Documents</h2>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" title="Create document">
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              title="Create folder"
              onClick={() => setIsCreateFolderOpen(true)}
            >
              <FolderPlus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {error ? (
          <DocumentRepositoryErrorHandler error={error} />
        ) : (
          <>
            {breadcrumbs.length > 0 && (
              <div className="mb-4 flex items-center gap-1 text-sm text-gray-500">
                <Button
                  variant="ghost"
                  className="h-auto p-0 text-gray-500 hover:text-gray-900"
                  onClick={() => selectFolder(null)}
                >
                  Root
                </Button>
                {breadcrumbs.map((folder, index) => (
                  <React.Fragment key={folder.id}>
                    <span>/</span>
                    <Button
                      variant="ghost"
                      className="h-auto p-0 text-gray-500 hover:text-gray-900"
                      onClick={() =>
                        selectFolder(
                          index === breadcrumbs.length - 1 ? null : folder
                        )
                      }
                    >
                      {folder.name}
                    </Button>
                  </React.Fragment>
                ))}
              </div>
            )}

            {isLoading ? (
              <div className="text-center py-8">Loading documents...</div>
            ) : filteredFolders.length === 0 && filteredDocuments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No documents found
              </div>
            ) : (
              <div className="space-y-2">
                {filteredFolders.map((folder) => (
                  <Card
                    key={folder.id}
                    className="p-3 cursor-pointer hover:bg-gray-50"
                    onClick={() => selectFolder(folder)}
                  >
                    <div className="flex items-center">
                      <Folder className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
                      <span className="font-medium truncate">{folder.name}</span>
                    </div>
                  </Card>
                ))}

                {filteredDocuments.map((doc) => (
                  <Card
                    key={doc.id}
                    className={`p-3 cursor-pointer hover:bg-gray-50 ${
                      selectedDocument?.id === doc.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => selectDocument(doc)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-2">
                        <FileText className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-medium">{doc.title}</div>
                          <div className="text-xs text-gray-500">
                            {new Date(doc.updated_at).toLocaleDateString()} •{' '}
                            {(doc.file_size / 1024).toFixed(2)} KB
                          </div>
                          {renderCheckoutStatus(doc)}
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleDownloadDocument(doc)}>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <div className="flex-1 p-4 overflow-auto">
        <DocumentEditor />
      </div>

      <Dialog open={isCreateFolderOpen} onOpenChange={setIsCreateFolderOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Input
                placeholder="Folder name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCreateFolderOpen(false)}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleCreateFolder}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
