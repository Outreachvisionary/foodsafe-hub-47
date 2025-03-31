
import React from 'react';
import { Document } from '@/types/document';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Edit, Trash, Share, Check, XCircle, Clock, FileText, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface DocumentListProps {
  documents: Document[];
  onViewDocument: (document: Document) => void;
  onEditDocument: (document: Document) => void;
  onDeleteDocument: (document: Document) => void;
  onDownloadDocument: (document: Document) => void;
  onShareDocument?: (document: Document) => void;
}

const DocumentList: React.FC<DocumentListProps> = ({
  documents,
  onViewDocument,
  onEditDocument,
  onDeleteDocument,
  onDownloadDocument,
  onShareDocument
}) => {
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return (
          <Badge className="bg-success/20 text-success hover:bg-success/30 px-3 py-1 flex items-center gap-1">
            <Check className="h-3 w-3" /> Approved
          </Badge>
        );
      case 'draft':
        return (
          <Badge className="bg-muted/40 text-muted-foreground hover:bg-muted/60 px-3 py-1 flex items-center gap-1">
            <Clock className="h-3 w-3" /> Draft
          </Badge>
        );
      case 'pending':
      case 'pending review':
      case 'in review':
        return (
          <Badge className="bg-warning/20 text-warning hover:bg-warning/30 px-3 py-1 flex items-center gap-1">
            <Clock className="h-3 w-3" /> In Review
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-destructive/20 text-destructive hover:bg-destructive/30 px-3 py-1 flex items-center gap-1">
            <XCircle className="h-3 w-3" /> Rejected
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="px-3 py-1">
            {status}
          </Badge>
        );
    }
  };

  return (
    <div className="overflow-auto">
      <table className="min-w-full divide-y divide-border">
        <thead className="bg-muted/20">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-base font-medium text-foreground tracking-wider">
              Document
            </th>
            <th scope="col" className="px-6 py-3 text-left text-base font-medium text-foreground tracking-wider">
              Category
            </th>
            <th scope="col" className="px-6 py-3 text-left text-base font-medium text-foreground tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-base font-medium text-foreground tracking-wider">
              Updated
            </th>
            <th scope="col" className="px-6 py-3 text-left text-base font-medium text-foreground tracking-wider">
              Version
            </th>
            <th scope="col" className="px-6 py-3 text-right text-base font-medium text-foreground tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-border">
          {documents.length > 0 ? (
            documents.map((document) => (
              <tr 
                key={document.id} 
                className="hover:bg-muted/10 transition-colors cursor-pointer"
                onClick={() => onViewDocument(document)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 text-primary">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                      <div className="text-base font-medium text-foreground">{document.title}</div>
                      {document.description && (
                        <div className="text-sm text-muted-foreground truncate max-w-sm">
                          {document.description}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant="outline" className="font-normal bg-muted/10">
                    {document.category}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(document.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                  {document.updated_at
                    ? formatDistanceToNow(new Date(document.updated_at), { addSuffix: true })
                    : 'Unknown'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge className="bg-accent/10 text-accent hover:bg-accent/20 px-2 py-1">
                    v{document.version || 1}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewDocument(document);
                      }}
                      className="text-muted-foreground hover:text-accent hover:bg-accent/10"
                      title="View"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditDocument(document);
                      }}
                      className="text-muted-foreground hover:text-primary hover:bg-primary/10"
                      title="Edit"
                      disabled={document.is_locked}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDownloadDocument(document);
                      }}
                      className="text-muted-foreground hover:text-success hover:bg-success/10"
                      title="Download"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    {onShareDocument && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          onShareDocument(document);
                        }}
                        className="text-muted-foreground hover:text-info hover:bg-info/10"
                        title="Share"
                      >
                        <Share className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteDocument(document);
                      }}
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      title="Delete"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                <div className="flex flex-col items-center">
                  <FileText className="h-12 w-12 mb-4 text-muted-foreground/50" />
                  <p className="text-lg font-medium">No documents found</p>
                  <p className="text-sm">Upload a document to get started</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DocumentList;
