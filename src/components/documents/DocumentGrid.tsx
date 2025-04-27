
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Document, DocumentStatus } from '@/types/document';
import {
  FileText,
  FileArchive,
  FileCog,
  FileX,
  FileCheck,
  FileQuestion,
  Calendar,
} from 'lucide-react';
import { mapDbToAppDocStatus } from '@/utils/documentTypeAdapter';

interface DocumentGridProps {
  documents: Document[];
  onDocumentClick: (document: Document) => void;
}

const DocumentGrid: React.FC<DocumentGridProps> = ({
  documents,
  onDocumentClick,
}) => {
  const getDocumentIcon = (document: Document) => {
    switch (document.status) {
      case 'Active':
        return <FileCheck className="w-10 h-10 text-green-500" />;
      case 'Archived':
        return <FileArchive className="w-10 h-10 text-gray-500" />;
      case 'Draft':
        return <FileCog className="w-10 h-10 text-blue-500" />;
      case 'Rejected':
        return <FileX className="w-10 h-10 text-red-500" />;
      case 'Pending_Review':
        return <FileQuestion className="w-10 h-10 text-amber-500" />;
      default:
        return <FileText className="w-10 h-10 text-gray-500" />;
    }
  };

  const getStatusColor = (status: DocumentStatus) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Archived':
        return 'bg-gray-100 text-gray-800';
      case 'Draft':
        return 'bg-blue-100 text-blue-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      case 'Pending_Review':
        return 'bg-amber-100 text-amber-800';
      case 'Expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Helper function to format document status for display
  const formatStatus = (status: DocumentStatus): string => {
    return status.replace('_', ' ');
  };

  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <FileText className="w-16 h-16 text-gray-300 mb-4" />
        <h3 className="text-xl font-medium text-gray-400">No documents found</h3>
        <p className="text-gray-400">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {documents.map((document) => (
        <Card
          key={document.id}
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onDocumentClick(document)}
        >
          <CardContent className="p-4">
            <div className="flex items-start space-x-4">
              <div className="mt-1">{getDocumentIcon(document)}</div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium truncate pr-2">{document.title}</h3>
                </div>

                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <Badge className={getStatusColor(document.status)}>
                    {formatStatus(document.status)}
                  </Badge>
                  <Badge variant="outline">{document.category}</Badge>
                </div>

                {document.description && (
                  <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                    {document.description}
                  </p>
                )}

                <div className="flex items-center text-xs text-gray-500">
                  <Calendar className="h-3 w-3 mr-1" />
                  {document.updated_at
                    ? new Date(document.updated_at).toLocaleDateString()
                    : new Date(document.created_at || '').toLocaleDateString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DocumentGrid;
