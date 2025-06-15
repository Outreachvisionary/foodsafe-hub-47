
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Folder, FolderPlus, ChevronRight, Edit, Trash, FolderOpen } from 'lucide-react';
import { useDocument } from '@/contexts/DocumentContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface DocumentFoldersProps {
  onSelectFolder?: (folderId: string | null, folderPath: string) => void;
  selectedFolderId?: string | null;
}

const DocumentFolders: React.FC<DocumentFoldersProps> = ({ 
  onSelectFolder, 
  selectedFolderId 
}) => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [editingFolder, setEditingFolder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  const { folders, documents, refresh, createFolder, updateFolder, deleteFolder } = useDocument();
  
  // Calculate document counts for folders
  const folderCounts = documents.reduce((acc, doc) => {
    const folderId = doc.folder_id || 'root';
    acc[folderId] = (acc[folderId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      toast.error('Please enter a folder name');
      return;
    }

    setLoading(true);
    try {
      await createFolder({
        name: newFolderName,
        path: `/${newFolderName}`,
      });
      
      setCreateDialogOpen(false);
      setNewFolderName('');
      toast.success('Folder created successfully');
      
      // Refresh documents to update folder relationships
      await refresh();
    } catch (error) {
      console.error('Error creating folder:', error);
      toast.error('Failed to create folder');
    } finally {
      setLoading(false);
    }
  };

  const handleEditFolder = async () => {
    if (!editingFolder || !newFolderName.trim()) {
      toast.error('Please enter a folder name');
      return;
    }

    setLoading(true);
    try {
      await updateFolder(editingFolder.id, {
        name: newFolderName,
        path: `/${newFolderName}`,
      });
      
      setEditDialogOpen(false);
      setEditingFolder(null);
      setNewFolderName('');
      toast.success('Folder updated successfully');
    } catch (error) {
      console.error('Error updating folder:', error);
      toast.error('Failed to update folder');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFolder = async (folder: any) => {
    const documentCount = folderCounts[folder.id] || 0;
    
    if (documentCount > 0) {
      toast.error('Cannot delete folder with documents');
      return;
    }

    if (!confirm(`Are you sure you want to delete the folder "${folder.name}"?`)) {
      return;
    }

    setLoading(true);
    try {
      await deleteFolder(folder.id);
      toast.success('Folder deleted successfully');
    } catch (error) {
      console.error('Error deleting folder:', error);
      toast.error('Failed to delete folder');
    } finally {
      setLoading(false);
    }
  };
  
  const handleFolderClick = (folder: any) => {
    if (onSelectFolder) {
      onSelectFolder(folder.id, folder.path);
    }
  };

  const openEditDialog = (folder: any) => {
    setEditingFolder(folder);
    setNewFolderName(folder.name);
    setEditDialogOpen(true);
  };

  // Show "All Documents" option
  const rootDocumentCount = folderCounts['root'] || folderCounts['null'] || 0;
  
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-medium">Document Folders</CardTitle>
          <Button variant="outline" size="sm" onClick={() => setCreateDialogOpen(true)}>
            <FolderPlus className="h-4 w-4 mr-1" />
            New
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {/* All Documents option */}
            <div 
              className={cn(
                "p-3 flex justify-between items-center hover:bg-gray-50 cursor-pointer group",
                selectedFolderId === null && "bg-blue-50 border-l-4 border-l-blue-500"
              )}
              onClick={() => onSelectFolder?.(null, '/')}
            >
              <div className="flex items-center space-x-2 flex-1">
                <FolderOpen className="h-4 w-4 text-blue-500" />
                <span className="font-medium">All Documents</span>
                <span className="text-xs text-gray-500">({rootDocumentCount})</span>
              </div>
            </div>

            {/* Folder list */}
            {folders.map(folder => {
              const documentCount = folderCounts[folder.id] || 0;
              const isSelected = selectedFolderId === folder.id;
              
              return (
                <div 
                  key={folder.id} 
                  className={cn(
                    "p-3 flex justify-between items-center hover:bg-gray-50 cursor-pointer group",
                    isSelected && "bg-blue-50 border-l-4 border-l-blue-500"
                  )}
                  onClick={() => handleFolderClick(folder)}
                >
                  <div className="flex items-center space-x-2 flex-1">
                    {isSelected ? (
                      <FolderOpen className="h-4 w-4 text-blue-500" />
                    ) : (
                      <Folder className="h-4 w-4 text-blue-500" />
                    )}
                    <span className={cn(
                      "font-medium",
                      isSelected && "text-blue-700"
                    )}>
                      {folder.name}
                    </span>
                    <span className="text-xs text-gray-500">({documentCount})</span>
                  </div>
                  <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!folder.is_system_folder && (
                      <>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 w-7 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditDialog(folder);
                          }}
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 w-7 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteFolder(folder);
                          }}
                        >
                          <Trash className="h-3.5 w-3.5" />
                        </Button>
                      </>
                    )}
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              );
            })}
            
            {folders.length === 0 && (
              <div className="p-6 text-center text-gray-500">
                <Folder className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="font-medium">No folders found</p>
                <p className="text-sm mt-1">Create a new folder to organize your documents</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => setCreateDialogOpen(true)}
                >
                  <FolderPlus className="h-4 w-4 mr-2" />
                  Create Folder
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Create Folder Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Folder Name</Label>
              <Input
                id="name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Enter folder name"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !loading) {
                    handleCreateFolder();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateFolder} disabled={!newFolderName.trim() || loading}>
              {loading ? 'Creating...' : 'Create Folder'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Folder Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Folder</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Folder Name</Label>
              <Input
                id="edit-name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Enter folder name"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !loading) {
                    handleEditFolder();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditFolder} disabled={!newFolderName.trim() || loading}>
              {loading ? 'Updating...' : 'Update Folder'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DocumentFolders;
