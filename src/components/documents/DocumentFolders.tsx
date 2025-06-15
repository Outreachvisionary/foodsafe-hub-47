
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Folder, FolderOpen, Plus } from 'lucide-react';
import { useDocument } from '@/contexts/DocumentContext';

interface DocumentFoldersProps {
  onSelectFolder: (folderId: string | null, folderPath: string) => void;
  selectedFolderId: string | null;
}

const DocumentFolders: React.FC<DocumentFoldersProps> = ({
  onSelectFolder,
  selectedFolderId
}) => {
  const { folders } = useDocument();

  const handleFolderClick = (folderId: string | null, folderName?: string) => {
    const folderPath = folderId ? `/${folderName || 'Unnamed Folder'}` : '/';
    onSelectFolder(folderId, folderPath);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">Document Folders</CardTitle>
          <Button variant="ghost" size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {/* All Documents folder */}
        <div
          className={`flex items-center space-x-2 p-2 rounded cursor-pointer hover:bg-gray-100 ${
            selectedFolderId === null ? 'bg-blue-50 text-blue-700' : ''
          }`}
          onClick={() => handleFolderClick(null)}
        >
          {selectedFolderId === null ? (
            <FolderOpen className="h-4 w-4" />
          ) : (
            <Folder className="h-4 w-4" />
          )}
          <span className="text-sm font-medium">All Documents</span>
          <span className="text-xs text-gray-500">(0)</span>
        </div>

        {/* Folder list */}
        {folders && folders.length > 0 ? (
          folders.map((folder) => (
            <div
              key={folder.id}
              className={`flex items-center space-x-2 p-2 rounded cursor-pointer hover:bg-gray-100 ${
                selectedFolderId === folder.id ? 'bg-blue-50 text-blue-700' : ''
              }`}
              onClick={() => handleFolderClick(folder.id, folder.name)}
            >
              {selectedFolderId === folder.id ? (
                <FolderOpen className="h-4 w-4" />
              ) : (
                <Folder className="h-4 w-4" />
              )}
              <span className="text-sm truncate" title={folder.name}>
                {folder.name}
              </span>
            </div>
          ))
        ) : (
          <div className="text-center py-4">
            <Folder className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <p className="text-xs text-gray-500">No folders found</p>
            <p className="text-xs text-gray-400">Create a new folder to organize your documents</p>
            <Button variant="outline" size="sm" className="mt-2">
              <Plus className="h-3 w-3 mr-1" />
              Create Folder
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentFolders;
