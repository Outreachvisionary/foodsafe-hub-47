
import React from 'react';
import { DocumentVersion } from '@/types/document';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Clock, User, ArrowDown, RotateCcw, FileSearch } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { formatFileSize } from '@/lib/utils';

interface VersionHistoryItemProps {
  version: DocumentVersion;
  isLatest?: boolean;
  onCompare?: () => void;
  onRestore?: () => void;
  onDownload?: () => void;
}

export const VersionHistoryItem: React.FC<VersionHistoryItemProps> = ({
  version,
  isLatest = false,
  onCompare,
  onRestore,
  onDownload
}) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex-1">
            <div className="flex items-center">
              <FileText className="h-5 w-5 mr-2 text-primary" />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">
                    Version {version.version}
                  </h4>
                  {isLatest && (
                    <Badge className="bg-primary">Latest</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {version.file_name}
                </p>
              </div>
            </div>
            
            <div className="mt-2 space-y-1">
              <div className="flex items-center text-sm">
                <Clock className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                <span>
                  {version.created_at 
                    ? `Created ${formatDistanceToNow(new Date(version.created_at))} ago`
                    : 'No creation date'
                  }
                </span>
                <span className="text-xs text-muted-foreground ml-1">
                  {version.created_at && `(${format(new Date(version.created_at), 'PPp')})`}
                </span>
              </div>
              
              <div className="flex items-center text-sm">
                <User className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                <span>{version.created_by}</span>
              </div>
              
              <div className="text-sm">
                <span className="text-muted-foreground">Size: </span>
                <span>{formatFileSize(version.file_size)}</span>
              </div>
              
              {version.change_summary && (
                <div className="mt-3 text-sm">
                  <span className="text-muted-foreground">Summary: </span>
                  <span>{version.change_summary}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-row md:flex-col gap-2 justify-end md:justify-start">
            {onCompare && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={onCompare}
                className="flex items-center gap-1"
              >
                <FileSearch className="h-3.5 w-3.5" />
                Compare
              </Button>
            )}
            
            {onRestore && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={onRestore}
                className="flex items-center gap-1"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Restore
              </Button>
            )}
            
            {onDownload && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={onDownload}
                className="flex items-center gap-1"
              >
                <ArrowDown className="h-3.5 w-3.5" />
                Download
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
