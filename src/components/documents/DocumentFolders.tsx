
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Folder, FolderPlus, ChevronRight, Edit, Trash } from 'lucide-react';
import { useDocument } from '@/contexts/DocumentContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface DocumentFolder {
  id: string;
  name: string;
  parent_id?: string;
  path: string;
  document_count: number;
  created_by: string;
  created_at: string;
}

interface DocumentFoldersProps {
  onSelectFolder?: (folderId: string, folderPath: string) => void;
}

const DocumentFolders: React.FC<DocumentFoldersProps> = ({ onSelectFolder }) => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [editingFolder, setEditingFolder] = useState<DocumentFolder | null>(null);
  const [folders, setFolders] = useState<DocumentFolder[]>([]);
  const [loading, setLoading] = useState(false);
  
  const { documents, refresh } = useDocument();
  
  // Calculate document counts for folders based on actual documents
  useEffect(() => {
    const folderCounts = documents.reduce((acc, doc) => {
      const folderId = doc.folder_id || 'root';
      acc[folderId] = (acc[folderId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Mock folders with real document counts
    const mockFolders: DocumentFolder[] = [
      { 
        id: '1', 
        name: 'Quality Control', 
        path: '/Quality Control', 
        document_count: folderCounts['1'] || 0,
        created_by: 'system',
        created_at: new Date().toISOString()
      },
      { 
        id: '2', 
        name: 'HACCP Plans', 
        path: '/HACCP Plans', 
        document_count: folderCounts['2'] || 0,
        created_by: 'system',
        created_at: new Date().toISOString()
      },
      { 
        id: '3', 
        name: 'SOPs', 
        path: '/SOPs', 
        document_count: folderCounts['3'] || 0,
        created_by: 'system',
        created_at: new Date().toISOString()
      },
      { 
        id: '4', 
        name: 'Training Materials', 
        path: '/Training Materials', 
        document_count: folderCounts['4'] || 0,
        created_by: 'system',
        created_at: new Date().toISOString()
      }
    ];
    
    setFolders(mockFolders);
  }, [documents]);
  
  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      toast.error('Please enter a folder name');
      return;
    }

    setLoading(true);
    try {
      // TODO: Replace with actual API call when backend is ready
      const newFolder: DocumentFolder = {
        id: Date.now().toString(),
        name: newFolderName,
        path: `/${newFolderName}`,
        document_count: 0,
        created_by: 'current_user',
        created_at: new Date().toISOString()
      };
      
      setFolders(prev => [...prev, newFolder]);
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
      // TODO: Replace with actual API call
      setFolders(prev => prev.map(folder => 
        folder.id === editingFolder.id 
          ? { ...folder, name: newFolderName, path: `/${newFolderName}` }
          : folder
      ));
      
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

  const handleDeleteFolder = async (folder: DocumentFolder) => {
    if (folder.document_count > 0) {
      toast.error('Cannot delete folder with documents');
      return;
    }

    if (!confirm(`Are you sure you want to delete the folder "${folder.name}"?`)) {
      return;
    }

    setLoading(true);
    try {
      // TODO: Replace with actual API call
      setFolders(prev => prev.filter(f => f.id !== folder.id));
      toast.success('Folder deleted successfully');
    } catch (error) {
      console.error('Error deleting folder:', error);
      toast.error('Failed to delete folder');
    } finally {
      setLoading(false);
    }
  };
  
  const handleFolderClick = (folder: DocumentFolder) => {
    if (onSelectFolder) {
      onSelectFolder(folder.id, folder.path);
    }
  };

  const openEditDialog = (folder: DocumentFolder) => {
    setEditingFolder(folder);
    setNewFolderName(folder.name);
    setEditDialogOpen(true);
  };
  
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-md font-medium">Document Folders</CardTitle>
          <Button variant="outline" size="sm" onClick={() => setCreateDialogOpen(true)}>
            <FolderPlus className="h-4 w-4 mr-1" />
            New
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {folders.map(folder => (
              <div 
                key={folder.id} 
                className="p-3 flex justify-between items-center hover:bg-gray-50 cursor-pointer group"
                onClick={() => handleFolderClick(folder)}
              >
                <div className="flex items-center space-x-2 flex-1">
                  <Folder className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">{folder.name}</span>
                  <span className="text-xs text-gray-500">({folder.document_count})</span>
                </div>
                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
            
            {folders.length === 0 && (
              <div className="p-6 text-center text-gray-500">
                <p>No folders found</p>
                <p className="text-sm mt-1">Create a new folder to organize your documents</p>
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
