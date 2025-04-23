
import React from 'react';
import { FolderOpen, ChevronRight, Folder, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Folder as FolderType } from '@/types/document';
import { cn } from '@/lib/utils';
import { useDocuments } from '@/contexts/DocumentContext';
import { Badge } from '@/components/ui/badge';

interface DocumentFoldersProps {
  onSelectFolder?: (folder: FolderType) => void;
  selectedFolder: FolderType | null;
}

const DocumentFolders: React.FC<DocumentFoldersProps> = ({
  onSelectFolder,
  selectedFolder
}) => {
  const { folders } = useDocuments();
  
  const rootFolders = folders.filter(folder => !folder.parent_id);
  
  const handleFolderClick = (folder: FolderType) => {
    if (onSelectFolder) {
      onSelectFolder(folder);
    }
  };
  
  const renderFolder = (folder: FolderType) => {
    const childFolders = folders.filter(f => f.parent_id === folder.id);
    const isSelected = selectedFolder?.id === folder.id;
    
    return (
      <div key={folder.id} className="mb-1">
        <div
          className={cn(
            "flex items-center px-2 py-1.5 rounded-md text-sm cursor-pointer hover:bg-gray-100",
            isSelected ? "bg-primary/10 font-medium" : ""
          )}
          onClick={() => handleFolderClick(folder)}
        >
          {childFolders.length > 0 ? (
            <ChevronRight className="h-4 w-4 mr-1 text-muted-foreground" />
          ) : (
            <span className="w-5" /> // Spacer
          )}
          
          {isSelected ? (
            <FolderOpen className="h-4 w-4 mr-2 text-primary" />
          ) : (
            <Folder className="h-4 w-4 mr-2 text-muted-foreground" />
          )}
          
          <span className={cn("flex-1 truncate", isSelected ? "text-primary" : "")}>
            {folder.name}
          </span>
          
          {folder.document_count > 0 && (
            <Badge variant="secondary" className="ml-1 h-5 px-1.5 rounded-full">
              {folder.document_count}
            </Badge>
          )}
        </div>
        
        {childFolders.length > 0 && (
          <div className="ml-6 pl-2 border-l border-gray-100">
            {childFolders.map(childFolder => renderFolder(childFolder))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full h-full">
      <ScrollArea className="h-[60vh]">
        <div className="p-2">
          {rootFolders.map(folder => renderFolder(folder))}
          
          {rootFolders.length === 0 && (
            <div className="text-center p-4 text-muted-foreground text-sm">
              No folders available
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default DocumentFolders;
