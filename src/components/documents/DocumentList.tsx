
import React from 'react';
import { Document } from '@/types/document';
import { Badge } from '@/components/ui/badge';

interface DocumentListProps {
  documents: Document[];
  showStatus?: boolean;
  onSelect?: (document: Document) => void;
}

const DocumentList: React.FC<DocumentListProps> = ({ 
  documents, 
  showStatus = true,
  onSelect 
}) => {
  if (!documents || documents.length === 0) {
    return <p className="text-muted-foreground">No documents available</p>;
  }

  const handleClick = (document: Document) => {
    if (onSelect) {
      onSelect(document);
    }
  };

  return (
    <div className="space-y-2">
      {documents.map((doc) => (
        <div 
          key={doc.id}
          className={`p-3 border rounded-md hover:bg-accent/5 ${onSelect ? 'cursor-pointer' : ''}`}
          onClick={() => handleClick(doc)}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{doc.title}</h3>
              {doc.description && (
                <p className="text-sm text-muted-foreground line-clamp-1">{doc.description}</p>
              )}
              <div className="flex gap-2 mt-1.5">
                <Badge variant="outline">{doc.category}</Badge>
                {showStatus && (
                  <Badge variant="secondary">{doc.status.replace(/_/g, ' ')}</Badge>
                )}
                {doc.version && (
                  <span className="text-xs text-muted-foreground">v{doc.version}</span>
                )}
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              {new Date(doc.updated_at || doc.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DocumentList;
