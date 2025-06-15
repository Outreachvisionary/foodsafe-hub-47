
import React from 'react';
import { Button } from '@/components/ui/button';
import { FolderPlus, Upload, RefreshCw } from 'lucide-react';
import DocumentBreadcrumb from './DocumentBreadcrumb';
import DocumentViewModeToggle from './DocumentViewModeToggle';

interface DocumentHeaderProps {
  currentPath: string;
  viewMode: 'grid' | 'list';
  loading: boolean;
  onNavigate: (path: string) => void;
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onUpload: () => void;
  onCreateFolder: () => void;
  onRefresh: () => void;
}

const DocumentHeader: React.FC<DocumentHeaderProps> = ({
  currentPath,
  viewMode,
  loading,
  onNavigate,
  onViewModeChange,
  onUpload,
  onCreateFolder,
  onRefresh
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <DocumentBreadcrumb path={currentPath} onNavigate={onNavigate} />
      <div className="flex items-center gap-2">
        <DocumentViewModeToggle viewMode={viewMode} onViewModeChange={onViewModeChange} />
        <Button
          variant="outline"
          size="sm"
          onClick={onUpload}
          className="flex items-center"
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onCreateFolder}
          className="flex items-center"
        >
          <FolderPlus className="h-4 w-4 mr-2" />
          New Folder
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
    </div>
  );
};

export default DocumentHeader;
