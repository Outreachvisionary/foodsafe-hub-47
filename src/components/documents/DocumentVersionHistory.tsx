
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { History, Download, Eye, Calendar, User } from 'lucide-react';
import { DocumentVersion } from '@/types/document';

interface DocumentVersionHistoryProps {
  versions: DocumentVersion[];
  onVersionSelect: (version: DocumentVersion) => void;
  currentDocId: string;
}

const DocumentVersionHistory: React.FC<DocumentVersionHistoryProps> = ({
  versions,
  onVersionSelect,
  currentDocId
}) => {
  const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleString();
  };

  const formatFileSize = (bytes: number): string => {
    const kb = bytes / 1024;
    return `${kb.toFixed(1)} KB`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Version History ({versions.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {versions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <History className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No version history available</p>
          </div>
        ) : (
          <div className="space-y-4">
            {versions.map((version, index) => (
              <div
                key={version.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={index === 0 ? "default" : "secondary"}>
                      Version {version.version}
                      {index === 0 && " (Current)"}
                    </Badge>
                    <Badge variant="outline">
                      {version.version_type}
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    <div className="flex items-center gap-1 mb-1">
                      <User className="h-3 w-3" />
                      <span>{version.created_by}</span>
                      <span>•</span>
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(version.created_at)}</span>
                    </div>
                    <div className="mb-1">
                      <span className="font-medium">{version.file_name}</span>
                      <span className="ml-2">({formatFileSize(version.file_size)})</span>
                    </div>
                    {version.change_summary && (
                      <p className="text-xs">{version.change_summary}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onVersionSelect(version)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Handle download for this version
                      console.log('Download version:', version.id);
                    }}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentVersionHistory;
