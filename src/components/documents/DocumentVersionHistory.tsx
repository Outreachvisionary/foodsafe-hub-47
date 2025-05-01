
import React from 'react';
import { DocumentVersion } from '@/types/document';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Clock, Download, Eye } from 'lucide-react';

export interface DocumentVersionHistoryProps {
  versions: DocumentVersion[];
  onVersionSelect: (version: DocumentVersion) => void;
  currentDocId: string;
}

const DocumentVersionHistory: React.FC<DocumentVersionHistoryProps> = ({
  versions,
  onVersionSelect,
  currentDocId,
}) => {
  // Format the version number for display
  const formatVersion = (version: number, versionType?: 'major' | 'minor'): string => {
    const isMinor = versionType === 'minor';
    return isMinor ? `v${version}.${version}` : `v${version}.0`;
  };

  // Format the change date
  const formatDate = (date: string): string => {
    return format(new Date(date), 'MMM d, yyyy h:mm a');
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Version History</h3>
      
      {versions.length === 0 ? (
        <p className="text-sm text-gray-500">No version history available</p>
      ) : (
        <ul className="space-y-3">
          {versions.map((version) => (
            <li 
              key={version.id} 
              className="p-3 border rounded-md hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium">
                    {formatVersion(version.version, version.version_type)}
                    {version.version_type === 'major' && (
                      <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                        Major
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-500 mt-1">
                    <Clock className="inline-block mr-1 h-3 w-3" />
                    {formatDate(version.created_at)}
                  </p>
                  
                  {version.change_summary && (
                    <p className="text-sm mt-2">{version.change_summary}</p>
                  )}
                  
                  {version.modified_by_name && (
                    <p className="text-xs text-gray-500 mt-1">
                      by {version.modified_by_name}
                    </p>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onVersionSelect(version)}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DocumentVersionHistory;
