
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Folder, FolderOpen, Home } from 'lucide-react';
import { useDocument } from '@/contexts/DocumentContext';

interface FolderNavigationProps {
  selectedFolder: string | null;
  onFolderSelect: (folderId: string | null) => void;
}

const FolderNavigation: React.FC<FolderNavigationProps> = ({ 
  selectedFolder, 
  onFolderSelect 
}) => {
  // Use folders and documents from DocumentContext
  const { folders, documents } = useDocument();
  
  // Calculate document count for each folder
  const folderDocumentCounts = folders.reduce((acc, folder) => {
    const count = documents.filter(doc => doc.folder_id === folder.id).length;
    acc[folder.id] = count;
    return acc;
  }, {} as Record<string, number>);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Folder className="h-4 w-4" />
          <span className="font-medium">Folders</span>
        </div>
        <div className="space-y-1">
          <Button
            variant={selectedFolder === null ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => onFolderSelect(null)}
          >
            <Home className="h-4 w-4 mr-2" />
            All Documents
          </Button>
          {folders.map((folder) => (
            <Button
              key={folder.id}
              variant={selectedFolder === folder.id ? "secondary" : "ghost"}
              className="w-full justify-between"
              onClick={() => onFolderSelect(folder.id)}
            >
              <div className="flex items-center">
                {selectedFolder === folder.id ? (
                  <FolderOpen className="h-4 w-4 mr-2" />
                ) : (
                  <Folder className="h-4 w-4 mr-2" />
                )}
                {folder.name}
              </div>
              <span className="text-xs text-muted-foreground">
                {folderDocumentCounts[folder.id] || 0}
              </span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FolderNavigation;
