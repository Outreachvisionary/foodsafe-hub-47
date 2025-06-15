
import React from 'react';
import { Button } from '@/components/ui/button';
import { Grid3x3, List } from 'lucide-react';

interface DocumentViewModeToggleProps {
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

const DocumentViewModeToggle: React.FC<DocumentViewModeToggleProps> = ({
  viewMode,
  onViewModeChange
}) => {
  return (
    <div className="flex items-center border rounded-lg">
      <Button
        variant={viewMode === 'grid' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange('grid')}
        className="rounded-r-none"
      >
        <Grid3x3 className="h-4 w-4" />
      </Button>
      <Button
        variant={viewMode === 'list' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange('list')}
        className="rounded-l-none"
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default DocumentViewModeToggle;
