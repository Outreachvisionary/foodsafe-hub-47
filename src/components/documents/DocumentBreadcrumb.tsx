
import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DocumentBreadcrumbProps {
  path: string;
  onNavigate: (path: string) => void;
}

const DocumentBreadcrumb: React.FC<DocumentBreadcrumbProps> = ({ path, onNavigate }) => {
  const pathSegments = path.split('/').filter(Boolean);
  
  return (
    <nav className="flex items-center space-x-1 text-sm">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onNavigate('/')}
        className="flex items-center space-x-1 text-muted-foreground hover:text-foreground"
      >
        <Home className="h-4 w-4" />
        <span>Documents</span>
      </Button>
      
      {pathSegments.map((segment, index) => {
        const segmentPath = '/' + pathSegments.slice(0, index + 1).join('/');
        const isLast = index === pathSegments.length - 1;
        
        return (
          <React.Fragment key={segmentPath}>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate(segmentPath)}
              className={`text-sm ${
                isLast 
                  ? 'text-foreground font-medium' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {segment}
            </Button>
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default DocumentBreadcrumb;
