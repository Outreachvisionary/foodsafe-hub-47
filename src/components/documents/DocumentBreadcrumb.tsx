
import React from 'react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { FolderOpen, Home } from 'lucide-react';

interface DocumentBreadcrumbProps {
  path: string;
  onNavigate: (path: string) => void;
}

const DocumentBreadcrumb: React.FC<DocumentBreadcrumbProps> = ({ path, onNavigate }) => {
  const parts = path.split('/').filter(Boolean);
  
  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink onClick={() => onNavigate('/')} className="flex items-center gap-1">
            <Home className="h-4 w-4" />
            <span>Root</span>
          </BreadcrumbLink>
        </BreadcrumbItem>
        
        {parts.map((part, index) => {
          const currentPath = '/' + parts.slice(0, index + 1).join('/');
          return (
            <React.Fragment key={index}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink 
                  onClick={() => onNavigate(currentPath)}
                  className="flex items-center gap-1"
                >
                  <FolderOpen className="h-4 w-4" />
                  <span>{part}</span>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default DocumentBreadcrumb;
