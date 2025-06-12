
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FolderPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useDocument } from '@/contexts/DocumentContext';

interface CreateFolderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parentPath?: string;
}

const CreateFolderDialog: React.FC<CreateFolderDialogProps> = ({
  open,
  onOpenChange,
  parentPath = '/'
}) => {
  const [folderName, setFolderName] = useState('');
  const [creating, setCreating] = useState(false);
  const { toast } = useToast();
  const { refresh } = useDocument();
  
  const handleCreate = async () => {
    if (!folderName.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a folder name',
        variant: 'destructive',
      });
      return;
    }
    
    setCreating(true);
    
    try {
      // TODO: Replace with actual API call when backend is ready
      console.log('Creating folder:', {
        name: folderName,
        parentPath
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Refresh the document list to show new folder
      await refresh();
      
      toast({
        title: 'Success',
        description: `Folder "${folderName}" created successfully`,
      });
      
      // Reset form and close dialog
      setFolderName('');
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating folder:', error);
      toast({
        title: 'Error',
        description: 'Failed to create folder',
        variant: 'destructive',
      });
    } finally {
      setCreating(false);
    }
  };

  const handleCancel = () => {
    setFolderName('');
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <FolderPlus className="h-5 w-5 mr-2" />
            Create New Folder
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="folder-name">Folder Name</Label>
            <Input
              id="folder-name"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="Enter folder name"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !creating) {
                  handleCreate();
                }
              }}
            />
          </div>
          
          <div className="text-sm text-muted-foreground">
            Location: {parentPath}
          </div>
        </div>
        <DialogFooter className="sm:justify-end">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={creating}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!folderName.trim() || creating}
          >
            {creating ? 'Creating...' : 'Create Folder'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateFolderDialog;
