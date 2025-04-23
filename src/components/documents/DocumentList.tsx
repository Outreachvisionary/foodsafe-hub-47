
import React from 'react';
import { Document } from '@/types/document';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, Download, Trash, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

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
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'pending approval':
      case 'pending_approval':  
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'approved':
      case 'published':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'archived':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const handleViewClick = (doc: Document) => {
    console.log("View document clicked:", doc);
    if (onViewDocument) {
      onViewDocument(doc);
    }
  };

  const handleEditClick = (doc: Document) => {
    console.log("Edit document clicked:", doc);
    if (onEditDocument) {
      onEditDocument(doc);
    }
  };

  const handleDeleteClick = (doc: Document) => {
    console.log("Delete document clicked:", doc);
    if (onDeleteDocument) {
      onDeleteDocument(doc);
    }
  };

  const handleDownloadClick = (doc: Document) => {
    console.log("Download document clicked:", doc);
    if (onDownloadDocument) {
      onDownloadDocument(doc);
    }
  };

  return (
    <div className="w-full">
      {documents.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center border border-dashed border-gray-300 rounded-lg bg-gray-50">
          <FileText className="h-12 w-12 text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-500">No documents found</h3>
          <p className="text-sm text-gray-500 mt-1">
            Upload new documents to get started.
          </p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="font-semibold">Title</TableHead>
                <TableHead className="font-semibold">Category</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Updated</TableHead>
                <TableHead className="font-semibold">Version</TableHead>
                <TableHead className="text-right font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{doc.title}</TableCell>
                  <TableCell>{doc.category}</TableCell>
                  <TableCell>
                    <Badge 
                      className={cn("font-medium border", getStatusBadgeColor(doc.status))}
                    >
                      {doc.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {doc.updated_at ? format(new Date(doc.updated_at), 'MMM d, yyyy') : 'N/A'}
                  </TableCell>
                  <TableCell>v{doc.version || 1}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      {onViewDocument && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewClick(doc)}
                          className="h-8 w-8 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                          title="View document"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      {onEditDocument && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditClick(doc)}
                          className="h-8 w-8 text-amber-600 hover:text-amber-800 hover:bg-amber-50"
                          title="Edit document"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      {onDownloadDocument && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDownloadClick(doc)}
                          className="h-8 w-8 text-green-600 hover:text-green-800 hover:bg-green-50"
                          title="Download document"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                      {onDeleteDocument && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(doc)}
                          className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                          title="Delete document"
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
      )}
    </div>
  );
};

export default DocumentList;
