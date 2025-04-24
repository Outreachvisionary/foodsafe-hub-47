
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, ExternalLink } from 'lucide-react';

interface RelatedDocumentsListProps {
  documentIds: string[];
}

export const RelatedDocumentsList: React.FC<RelatedDocumentsListProps> = ({ documentIds }) => {
  if (!documentIds || documentIds.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Related Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No documents attached</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Related Documents</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {documentIds.map((docId) => (
            <li key={docId} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-blue-500" />
                <span className="text-sm">Document {docId}</span>
              </div>
              <Button variant="ghost" size="sm">
                <ExternalLink className="h-3 w-3 mr-1" />
                View
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default RelatedDocumentsList;
