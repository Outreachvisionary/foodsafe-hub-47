
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Folder, FolderPlus, ChevronRight, Edit, Trash } from 'lucide-react';
import { useDocument } from '@/contexts/DocumentContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface DocumentFoldersProps {
  onSelectFolder?: (folderId: string, folderPath: string) => void;
}

const DocumentFolders: React.FC<DocumentFoldersProps> = ({ onSelectFolder }) => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [folders, setFolders] = useState<any[]>([]);
  
  const { documents } = useDocument();
  
  // Mock implementation
  useEffect(() => {
    // This would normally fetch folders from an API
    setFolders([
      { id: '1', name: 'Quality Control', documentCount: 12 },
      { id: '2', name: 'HACCP Plans', documentCount: 8 },
      { id: '3', name: 'SOPs', documentCount: 15 },
      { id: '4', name: 'Training Materials', documentCount: 6 }
    ]);
  }, []);
  
  const handleCreateFolder = () => {
    // This would normally make an API call
    const newFolder = {
      id: Date.now().toString(),
      name: newFolderName,
      documentCount: 0
    };
    
    setFolders(prev => [...prev, newFolder]);
    setCreateDialogOpen(false);
    setNewFolderName('');
    toast.success('Folder created successfully');
  };
  
  const handleFolderClick = (folder: any) => {
    if (onSelectFolder) {
      onSelectFolder(folder.id, folder.name);
    }
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
                className="p-3 flex justify-between items-center hover:bg-gray-50 cursor-pointer"
                onClick={() => handleFolderClick(folder)}
              >
                <div className="flex items-center space-x-2">
                  <Folder className="h-4 w-4 text-blue-500" />
                  <span>{folder.name}</span>
                  <span className="text-xs text-gray-500">({folder.documentCount})</span>
                </div>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
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
            <Button onClick={handleCreateFolder} disabled={!newFolderName.trim()}>
              Create Folder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DocumentFolders;
