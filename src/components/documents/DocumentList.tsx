
import React from 'react';
import { Document } from '@/types/document';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, Download, Trash } from 'lucide-react';

interface DocumentListProps {
  documents: Document[];
  onViewDocument?: (document: Document) => void;
  onEditDocument?: (document: Document) => void;
  onDeleteDocument?: (document: Document) => void;
  onDownloadDocument?: (document: Document) => void;
}

const DocumentList: React.FC<DocumentListProps> = ({
  documents,
  onViewDocument,
  onEditDocument,
  onDeleteDocument,
  onDownloadDocument,
}) => {
  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'pending_approval':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead>Version</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((doc) => (
            <TableRow key={doc.id}>
              <TableCell className="font-medium">{doc.title}</TableCell>
              <TableCell>{doc.category}</TableCell>
              <TableCell>
                <Badge className={getStatusBadgeColor(doc.status)} variant="outline">
                  {doc.status}
                </Badge>
              </TableCell>
              <TableCell>{new Date(doc.updated_at).toLocaleDateString()}</TableCell>
              <TableCell>v{doc.version}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  {onViewDocument && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onViewDocument(doc)}
                      className="h-8 w-8"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}
                  {onEditDocument && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEditDocument(doc)}
                      className="h-8 w-8"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  {onDownloadDocument && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDownloadDocument(doc)}
                      className="h-8 w-8"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
                  {onDeleteDocument && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteDocument(doc)}
                      className="h-8 w-8 text-red-500 hover:text-red-700"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  )}
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
