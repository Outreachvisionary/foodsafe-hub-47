
import React from 'react';
import { Button } from '@/components/ui/button';
import { Grid3X3, List } from 'lucide-react';

interface DocumentViewModeToggleProps {
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

const DocumentViewModeToggle: React.FC<DocumentViewModeToggleProps> = ({
  viewMode,
  onViewModeChange
}) => {
  return (
    <div className="flex items-center border rounded-lg p-1 bg-gray-50">
      <Button
        variant={viewMode === 'grid' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange('grid')}
        className="h-8 w-8 p-0"
      >
        <Grid3X3 className="h-4 w-4" />
      </Button>
      <Button
        variant={viewMode === 'list' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange('list')}
        className="h-8 w-8 p-0"
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default DocumentViewModeToggle;
