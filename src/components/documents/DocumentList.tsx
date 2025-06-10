
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Download, Edit, Trash2, RefreshCcw } from 'lucide-react';
import { Document } from '@/types/document';
import { formatDistanceToNow } from 'date-fns';
import { getDocumentStatusColor, formatDocumentStatus } from '@/utils/documentUtils';

interface DocumentListProps {
  documents: Document[];
  isLoading?: boolean;
  onDocumentClick?: (document: Document) => void;
  onDocumentEdit?: (document: Document) => void;
  onDocumentDelete?: (documentId: string) => void;
}

const DocumentList: React.FC<DocumentListProps> = ({ 
  documents, 
  isLoading = false,
  onDocumentClick,
  onDocumentEdit,
  onDocumentDelete
}) => {
  const handleDownload = (document: Document) => {
    console.log('Download document:', document.id);
    // TODO: Implement download functionality
  };

  const handleEdit = (document: Document) => {
    console.log('Edit document:', document.id);
    if (onDocumentEdit) {
      onDocumentEdit(document);
    }
  };

  const handleDelete = (document: Document) => {
    console.log('Delete document:', document.id);
    if (onDocumentDelete) {
      onDocumentDelete(document.id);
    }
  };

  const handleRowClick = (document: Document) => {
    if (onDocumentClick) {
      onDocumentClick(document);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <RefreshCcw className="h-8 w-8 animate-spin text-gray-400" />
        <span className="ml-2 text-lg text-gray-600">Loading documents...</span>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border">
        <FileText className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 font-medium text-lg">No documents found</h3>
        <p className="text-sm text-gray-500 mt-1">
          Upload documents or create a new document to get started
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Document</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Version</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((document) => (
            <TableRow 
              key={document.id}
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => handleRowClick(document)}
            >
              <TableCell>
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <div>
                    <div className="font-medium">{document.title}</div>
                    <div className="text-sm text-gray-500">{document.file_name}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{document.category}</Badge>
              </TableCell>
              <TableCell>
                <Badge className={getDocumentStatusColor(document.status)}>
                  {formatDocumentStatus(document.status)}
                </Badge>
              </TableCell>
              <TableCell>v{document.version}</TableCell>
              <TableCell>
                {formatDistanceToNow(new Date(document.created_at), { addSuffix: true })}
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(document);
                    }}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(document);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(document);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DocumentList;
