
import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DocumentBreadcrumbProps {
  path: string;
  onNavigate: (path: string) => void;
}

const DocumentBreadcrumb: React.FC<DocumentBreadcrumbProps> = ({ path, onNavigate }) => {
  const pathSegments = path.split('/').filter(Boolean);
  
  const handleNavigate = (index: number) => {
    if (index === -1) {
      onNavigate('/');
    } else {
      const newPath = '/' + pathSegments.slice(0, index + 1).join('/');
      onNavigate(newPath);
    }
  };

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleNavigate(-1)}
        className="h-8 px-2"
      >
        <Home className="h-4 w-4" />
      </Button>
      
      {pathSegments.map((segment, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="h-4 w-4" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleNavigate(index)}
            className="h-8 px-2 text-muted-foreground hover:text-foreground"
          >
            {segment}
          </Button>
        </React.Fragment>
      ))}
    </nav>
  );
};

export default DocumentBreadcrumb;
