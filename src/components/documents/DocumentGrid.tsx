
import React from 'react';
import { Document } from '@/types/document';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { FileText, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface DocumentGridProps {
  documents: Document[];
}

const DocumentGrid: React.FC<DocumentGridProps> = ({ documents }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {documents.map((doc) => (
        <Card key={doc.id} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-6 w-6 text-blue-600" />
              <div className="font-medium truncate">{doc.title}</div>
            </div>
            <p className="mt-2 text-sm text-gray-500 line-clamp-2">
              {doc.description || 'No description available'}
            </p>
          </CardContent>
          <CardFooter className="bg-gray-50 px-4 py-2 flex justify-between items-center">
            <div className="flex items-center text-xs text-gray-500">
              <Calendar className="h-3 w-3 mr-1" />
              {new Date(doc.created_at || '').toLocaleDateString()}
            </div>
            <Badge variant="outline">{doc.status}</Badge>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default DocumentGrid;
