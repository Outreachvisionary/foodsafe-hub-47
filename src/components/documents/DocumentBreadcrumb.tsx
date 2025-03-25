
import React from 'react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Folder, Home } from 'lucide-react';

export interface DocumentBreadcrumbProps {
  folders: { id: string; name: string; parent_id?: string; document_count: number; path: string }[];
  selectedFolder: string | null;
  onFolderClick: (id: string | null) => void;
}

const DocumentBreadcrumb: React.FC<DocumentBreadcrumbProps> = ({ 
  folders,
  selectedFolder, 
  onFolderClick 
}) => {
  if (!selectedFolder) {
    return (
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink className="flex items-center">
              <Home className="h-4 w-4 mr-2" />
              All Documents
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  // Find the current folder
  const currentFolder = folders.find(folder => folder.id === selectedFolder);
  if (!currentFolder) return null;
  
  // Build the breadcrumb path
  const buildPath = (folder: typeof currentFolder) => {
    const path = [folder];
    let currentParent = folder?.parent_id;
    
    while (currentParent) {
      const parentFolder = folders.find(f => f.id === currentParent);
      if (parentFolder) {
        path.unshift(parentFolder);
        currentParent = parentFolder.parent_id;
      } else {
        break;
      }
    }
    
    return path;
  };
  
  const path = currentFolder ? buildPath(currentFolder) : [];

  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink 
            className="flex items-center cursor-pointer" 
            onClick={() => onFolderClick(null)}
          >
            <Home className="h-4 w-4 mr-2" />
            All Documents
          </BreadcrumbLink>
        </BreadcrumbItem>
        
        {path.map((folder, index) => (
          <React.Fragment key={folder.id}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink 
                className={`flex items-center ${index === path.length - 1 ? 'font-semibold' : 'cursor-pointer'}`}
                onClick={() => index !== path.length - 1 && onFolderClick(folder.id)}
              >
                <Folder className="h-4 w-4 mr-2" />
                {folder.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default DocumentBreadcrumb;
