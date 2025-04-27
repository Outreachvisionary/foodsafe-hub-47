
import React from 'react';
import { Document } from '@/types/document';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

interface DocumentListProps {
  documents: Document[];
  showStatus?: boolean;
  onSelect?: (document: Document) => void;
}

const DocumentList: React.FC<DocumentListProps> = ({ 
  documents, 
  showStatus = false, 
  onSelect 
}) => {
  if (!documents || documents.length === 0) {
    return <p className="text-muted-foreground">No documents available</p>;
  }

  const getStatusBadgeColor = (status: string) => {
    const statusLower = status.replace('_', ' ').toLowerCase();
    
    switch(statusLower) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'pending review':
      case 'pending approval':
        return 'bg-blue-100 text-blue-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'active':
        return 'bg-emerald-100 text-emerald-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'expired':
        return 'bg-amber-100 text-amber-800';
      case 'archived':
        return 'bg-purple-100 text-purple-800';
      case 'published':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status: string) => {
    return status.replace('_', ' ');
  };

  return (
    <div className="space-y-4">
      {documents.map((doc) => (
        <Card 
          key={doc.id} 
          className="hover:bg-gray-50 transition-colors cursor-pointer"
          onClick={() => onSelect && onSelect(doc)}
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium">{doc.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{doc.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-gray-500">
                    {doc.file_type.toUpperCase()} • {(doc.file_size / 1024).toFixed(2)} KB
                  </span>
                  <span className="text-xs text-gray-500">
                    Updated {formatDistanceToNow(new Date(doc.updated_at), { addSuffix: true })}
                  </span>
                  {showStatus && (
                    <Badge className={getStatusBadgeColor(doc.status)}>
                      {formatStatus(doc.status)}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DocumentList;
