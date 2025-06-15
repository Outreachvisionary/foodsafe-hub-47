
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Folder, FolderOpen, Plus } from 'lucide-react';
import { useDocument } from '@/contexts/DocumentContext';

interface FolderNavigationProps {
  selectedFolder: string | null;
  onFolderSelect: (folderId: string | null) => void;
}

const FolderNavigation: React.FC<FolderNavigationProps> = ({
  selectedFolder,
  onFolderSelect
}) => {
  const { folders, documents } = useDocument();

  const getFolderDocumentCount = (folderId: string | null) => {
    if (!documents) return 0;
    if (folderId === null) {
      return documents.filter(doc => !doc.folder_id || doc.folder_id === 'root').length;
    }
    return documents.filter(doc => doc.folder_id === folderId).length;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Folders</CardTitle>
          <Button variant="ghost" size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {/* All Documents */}
          <div
            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
              selectedFolder === null 
                ? 'bg-primary/10 text-primary border border-primary/20' 
                : 'hover:bg-muted/50'
            }`}
            onClick={() => onFolderSelect(null)}
          >
            <div className="flex items-center space-x-3">
              {selectedFolder === null ? (
                <FolderOpen className="h-5 w-5" />
              ) : (
                <Folder className="h-5 w-5" />
              )}
              <span className="font-medium">All Documents</span>
            </div>
            <Badge variant="secondary">
              {getFolderDocumentCount(null)}
            </Badge>
          </div>

          {/* Folder List */}
          {folders && folders.length > 0 ? (
            folders.map((folder) => (
              <div
                key={folder.id}
                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedFolder === folder.id 
                    ? 'bg-primary/10 text-primary border border-primary/20' 
                    : 'hover:bg-muted/50'
                }`}
                onClick={() => onFolderSelect(folder.id)}
              >
                <div className="flex items-center space-x-3">
                  {selectedFolder === folder.id ? (
                    <FolderOpen className="h-5 w-5" />
                  ) : (
                    <Folder className="h-5 w-5" />
                  )}
                  <span className="font-medium truncate" title={folder.name}>
                    {folder.name}
                  </span>
                </div>
                <Badge variant="secondary">
                  {getFolderDocumentCount(folder.id)}
                </Badge>
              </div>
            ))
          ) : (
            <div className="text-center py-6">
              <Folder className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No folders found</p>
              <Button variant="outline" size="sm" className="mt-2">
                <Plus className="h-3 w-3 mr-1" />
                Create Folder
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FolderNavigation;
