
import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DocumentBreadcrumbProps {
  path: string;
  onNavigate: (path: string) => void;
}

const DocumentBreadcrumb: React.FC<DocumentBreadcrumbProps> = ({
  path,
  onNavigate
}) => {
  const pathSegments = path.split('/').filter(segment => segment !== '');
  
  const buildPath = (index: number) => {
    return '/' + pathSegments.slice(0, index + 1).join('/');
  };

  return (
    <nav className="flex items-center space-x-1 text-sm">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onNavigate('/')}
        className="h-8 px-2"
      >
        <Home className="h-4 w-4" />
        <span className="ml-1">Documents</span>
      </Button>
      
      {pathSegments.map((segment, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate(buildPath(index))}
            className="h-8 px-2"
          >
            {segment}
          </Button>
        </React.Fragment>
      ))}
    </nav>
  );
};

export default DocumentBreadcrumb;
