
import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DocumentBreadcrumbProps {
  path: string;
  onNavigate: (path: string) => void;
}

const DocumentBreadcrumb: React.FC<DocumentBreadcrumbProps> = ({ path, onNavigate }) => {
  const pathSegments = path.split('/').filter(segment => segment.length > 0);
  
  return (
    <nav className="flex items-center space-x-1 text-sm text-gray-600">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onNavigate('/')}
        className="flex items-center space-x-1 text-gray-600 hover:text-gray-900"
      >
        <Home className="h-4 w-4" />
        <span>Documents</span>
      </Button>
      
      {pathSegments.map((segment, index) => {
        const currentPath = '/' + pathSegments.slice(0, index + 1).join('/');
        const isLast = index === pathSegments.length - 1;
        
        return (
          <React.Fragment key={currentPath}>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate(currentPath)}
              className={`text-gray-600 hover:text-gray-900 ${isLast ? 'font-medium text-gray-900' : ''}`}
              disabled={isLast}
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
