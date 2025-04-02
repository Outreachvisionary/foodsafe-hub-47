
import React from 'react';
import { DocumentVersion } from '@/types/document';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { History, Download, Eye, ArrowDown } from 'lucide-react';
import { format } from 'date-fns';

interface VersionHistoryItemProps {
  version: DocumentVersion;
  isLatest?: boolean;
  onViewVersion?: (version: DocumentVersion) => void;
  onDownloadVersion?: (version: DocumentVersion) => void;
  onRevertToVersion?: (version: DocumentVersion) => void;
}

export const VersionHistoryItem: React.FC<VersionHistoryItemProps> = ({
  version,
  isLatest = false,
  onViewVersion,
  onDownloadVersion,
  onRevertToVersion
}) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex-1">
            <div className="flex items-start">
              <History className="h-5 w-5 mr-2 mt-1 text-primary" />
              <div>
                <div className="flex items-center flex-wrap gap-2">
                  <h4 className="font-medium">
                    Version {version.version}
                  </h4>
                  {isLatest && (
                    <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                      Latest
                    </Badge>
                  )}
                </div>
                
                <p className="text-sm text-muted-foreground mt-1">
                  {version.file_name}
                </p>
              </div>
            </div>
            
            <div className="mt-3 space-y-1">
              {version.created_at && (
                <div className="flex items-center text-sm">
                  <span className="text-muted-foreground">Created: </span>
                  <span className="ml-1">
                    {format(new Date(version.created_at), 'PPP')}
                  </span>
                </div>
              )}
              
              {version.created_by && (
                <div className="flex items-center text-sm">
                  <span className="text-muted-foreground">By: </span>
                  <span className="ml-1">{version.created_by}</span>
                </div>
              )}
              
              {version.change_notes && (
                <div className="text-sm mt-2">
                  <span className="text-muted-foreground">Changes: </span>
                  <span className="ml-1">{version.change_notes}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-row md:flex-col gap-2 justify-end">
            {onViewVersion && (
              <Button variant="outline" size="sm" onClick={() => onViewVersion(version)}>
                <Eye className="h-3.5 w-3.5 mr-1.5" />
                View
              </Button>
            )}
            
            {onDownloadVersion && (
              <Button variant="outline" size="sm" onClick={() => onDownloadVersion(version)}>
                <Download className="h-3.5 w-3.5 mr-1.5" />
                Download
              </Button>
            )}
            
            {onRevertToVersion && !isLatest && (
              <Button variant="outline" size="sm" onClick={() => onRevertToVersion(version)}>
                <ArrowDown className="h-3.5 w-3.5 mr-1.5" />
                Revert
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
