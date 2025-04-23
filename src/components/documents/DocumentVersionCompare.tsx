
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { DocumentVersion } from '@/types/document';
import { format } from 'date-fns';

interface DocumentVersionCompareProps {
  versions: {
    previousVersion: DocumentVersion;
    currentVersion: DocumentVersion;
  };
}

const DocumentVersionCompare: React.FC<DocumentVersionCompareProps> = ({ versions }) => {
  const { previousVersion, currentVersion } = versions;

  // Helper function to format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'MMM d, yyyy h:mm a');
  };

  // Helper function to get version number (handling both version and version_number)
  const getVersionNumber = (version: DocumentVersion) => {
    return version.version_number || version.version;
  };

  // Helper function to get change notes (handling both change_notes and change_summary)
  const getChangeNotes = (version: DocumentVersion) => {
    return version.change_summary || version.change_notes || 'No change notes provided';
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted">
        <CardTitle className="text-lg">Version Comparison</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-2 divide-x">
          {/* Previous Version */}
          <div className="p-4">
            <div className="mb-4">
              <h3 className="text-md font-medium flex items-center justify-between">
                <span>Previous Version</span>
                <Badge variant="outline" className="bg-muted">
                  v{getVersionNumber(previousVersion)}
                </Badge>
              </h3>
              <p className="text-sm text-muted-foreground">
                {formatDate(previousVersion.created_at)}
              </p>
            </div>
            
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-1">Change Notes</h4>
              <p className="text-sm bg-muted p-2 rounded">
                {getChangeNotes(previousVersion)}
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-1">Created By</h4>
              <p className="text-sm">{previousVersion.created_by}</p>
            </div>
          </div>
          
          {/* Current Version */}
          <div className="p-4">
            <div className="mb-4">
              <h3 className="text-md font-medium flex items-center justify-between">
                <span>Current Version</span>
                <Badge variant="outline" className="bg-primary/10 text-primary">
                  v{getVersionNumber(currentVersion)}
                </Badge>
              </h3>
              <p className="text-sm text-muted-foreground">
                {formatDate(currentVersion.created_at)}
              </p>
            </div>
            
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-1">Change Notes</h4>
              <p className="text-sm bg-muted p-2 rounded">
                {getChangeNotes(currentVersion)}
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-1">Created By</h4>
              <p className="text-sm">{currentVersion.created_by}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentVersionCompare;
