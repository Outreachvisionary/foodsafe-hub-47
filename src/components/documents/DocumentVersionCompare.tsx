import React from 'react';
import { DocumentVersion } from '@/types/document';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { Diff } from 'lucide-react';

interface DocumentVersionCompareProps {
  currentVersion: DocumentVersion;
  previousVersion?: DocumentVersion;
}

const DocumentVersionCompare: React.FC<DocumentVersionCompareProps> = ({
  currentVersion,
  previousVersion
}) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PPP');
    } catch (e) {
      return dateString;
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <Diff className="h-5 w-5 mr-2" />
          Version Comparison
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="border rounded-md p-4 bg-gray-50">
            <h3 className="font-medium mb-2">Version {currentVersion.version}</h3>
            <p className="text-sm">{currentVersion.change_summary || 'No summary available'}</p>
            <div className="mt-2 text-sm text-muted-foreground whitespace-pre-wrap">
              {currentVersion.change_notes || 'No detailed change notes available'}
            </div>
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>Created by: {currentVersion.created_by}</span>
              <span>Date: {formatDate(currentVersion.created_at)}</span>
            </div>
          </div>
          
          {previousVersion && (
            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-2">Version {previousVersion.version}</h3>
              <p className="text-sm">{previousVersion.change_summary || 'No summary available'}</p>
              <div className="mt-2 text-sm text-muted-foreground whitespace-pre-wrap">
                {previousVersion.change_notes || 'No detailed change notes available'}
              </div>
              <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                <span>Created by: {previousVersion.created_by}</span>
                <span>Date: {formatDate(previousVersion.created_at)}</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentVersionCompare;
