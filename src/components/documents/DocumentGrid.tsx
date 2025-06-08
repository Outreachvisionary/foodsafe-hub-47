
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Eye, Calendar, User } from 'lucide-react';
import { Document } from '@/types/document';
import { Button } from '@/components/ui/button';

interface DocumentGridProps {
  documents: Document[];
  onDocumentClick?: (document: Document) => void;
}

const DocumentGrid: React.FC<DocumentGridProps> = ({ documents, onDocumentClick }) => {
  const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString();
  };

  const formatFileSize = (bytes: number): string => {
    const kb = bytes / 1024;
    return `${kb.toFixed(1)} KB`;
  };

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'draft':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'pending review':
      case 'pending approval':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'expired':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'archived':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (documents.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border">
        <FileText className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 font-medium text-lg">No documents found</h3>
        <p className="text-sm text-gray-500 mt-1">
          Upload documents or create a new folder to get started
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {documents.map((document) => (
        <Card 
          key={document.id} 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onDocumentClick?.(document)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2 flex-1 min-w-0">
                <FileText className="h-5 w-5 text-blue-500 flex-shrink-0" />
                <CardTitle className="text-sm font-medium truncate">
                  {document.title}
                </CardTitle>
              </div>
              <Badge className={`${getStatusColor(document.status)} text-xs flex-shrink-0 ml-2`}>
                {document.status}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-3">
            <div className="text-xs text-muted-foreground">
              <div className="flex items-center space-x-1 mb-1">
                <span className="font-medium">{document.category}</span>
                <span>•</span>
                <span>v{document.version}</span>
              </div>
              <div className="truncate">{document.file_name}</div>
              <div>{formatFileSize(document.file_size)}</div>
            </div>
            
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <User className="h-3 w-3" />
                <span className="truncate max-w-[80px]">{document.created_by}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(document.created_at)}</span>
              </div>
            </div>
            
            {document.description && (
              <p className="text-xs text-muted-foreground line-clamp-2">
                {document.description}
              </p>
            )}
            
            <div className="flex space-x-1 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs h-7"
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle view action
                }}
              >
                <Eye className="h-3 w-3 mr-1" />
                View
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs h-7"
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle download action
                }}
              >
                <Download className="h-3 w-3 mr-1" />
                Download
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DocumentGrid;
