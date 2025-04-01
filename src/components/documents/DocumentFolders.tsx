
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Folder, FolderPlus, ChevronRight, ChevronDown, File, Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Folder as FolderType } from '@/types/document';

interface DocumentFoldersProps {
  onSelectFolder: (folder: FolderType | null) => void;
  selectedFolder: FolderType | null;
}

const DocumentFolders: React.FC<DocumentFoldersProps> = ({ onSelectFolder, selectedFolder }) => {
  const [folders, setFolders] = useState<FolderType[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFolders();
  }, []);

  const loadFolders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('folders')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setFolders(data || []);
    } catch (error: any) {
      console.error('Error loading folders:', error);
      toast.error('Failed to load folders');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    
    try {
      const newFolder = {
        name: newFolderName.trim(),
        parent_id: selectedFolder?.id || null,
        path: selectedFolder 
          ? `${selectedFolder.path || selectedFolder.name}/${newFolderName.trim()}`
          : newFolderName.trim(),
        created_by: 'current_user', // In a real app, this would be the current user's ID
      };

      const { data, error } = await supabase
        .from('folders')
        .insert(newFolder)
        .select()
        .single();
      
      if (error) throw error;
      
      setFolders([...folders, data]);
      setNewFolderName('');
      setIsCreateDialogOpen(false);
      toast.success('Folder created successfully');
    } catch (error: any) {
      console.error('Error creating folder:', error);
      toast.error('Failed to create folder');
    }
  };

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  };

  const getChildFolders = (parentId: string | null) => {
    return folders.filter(folder => folder.parent_id === parentId);
  };

  const renderFolder = (folder: FolderType, level = 0) => {
    const children = getChildFolders(folder.id);
    const isExpanded = expandedFolders[folder.id];
    const isSelected = selectedFolder?.id === folder.id;
    
    return (
      <div key={folder.id}>
        <div 
          className={`flex items-center p-2 cursor-pointer hover:bg-gray-100 ${isSelected ? 'bg-primary/10 font-medium' : ''}`}
          style={{ paddingLeft: `${level * 12 + 8}px` }}
        >
          {children.length > 0 ? (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-5 w-5 p-0 mr-1" 
              onClick={(e) => {
                e.stopPropagation();
                toggleFolder(folder.id);
              }}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          ) : (
            <div className="w-6"></div>
          )}
          
          <div 
            className="flex items-center flex-grow"
            onClick={() => onSelectFolder(folder)}
          >
            <Folder className="h-4 w-4 mr-2 text-blue-500" />
            <span>{folder.name}</span>
            <span className="text-xs text-muted-foreground ml-2">
              ({folder.document_count || 0})
            </span>
          </div>
        </div>
        
        {isExpanded && children.map(child => renderFolder(child, level + 1))}
      </div>
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium">Folders</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsCreateDialogOpen(true)}
          className="h-8"
        >
          <FolderPlus className="h-4 w-4 mr-1" />
          New Folder
        </Button>
      </div>
      
      <div className="border rounded-md">
        <div 
          className={`flex items-center p-2 cursor-pointer hover:bg-gray-100 ${!selectedFolder ? 'bg-primary/10 font-medium' : ''}`}
          onClick={() => onSelectFolder(null)}
        >
          <Folder className="h-4 w-4 mr-2 text-blue-500" />
          <span>All Documents</span>
        </div>
        
        <ScrollArea className="h-[300px]">
          {loading ? (
            <div className="p-4 text-center text-muted-foreground">
              Loading folders...
            </div>
          ) : folders.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No folders found
            </div>
          ) : (
            <div>
              {getChildFolders(null).map(folder => renderFolder(folder))}
            </div>
          )}
        </ScrollArea>
      </div>
      
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className="mt-2"
            />
            
            {selectedFolder && (
              <p className="text-sm text-muted-foreground mt-2">
                Parent folder: {selectedFolder.name}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateFolder}>
              Create Folder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentFolders;
