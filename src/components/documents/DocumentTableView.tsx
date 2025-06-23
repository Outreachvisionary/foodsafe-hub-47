
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Download, 
  Edit, 
  Eye, 
  Trash2,
  FileText
} from 'lucide-react';
import { Document } from '@/types/document';
import { format } from 'date-fns';

interface DocumentTableViewProps {
  documents: Document[];
  onAction: (action: string, documentId: string) => void;
}

const DocumentTableView: React.FC<DocumentTableViewProps> = ({ documents, onAction }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Published':
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Draft':
        return 'bg-blue-100 text-blue-800';
      case 'Pending_Approval':
      case 'Pending_Review':
        return 'bg-yellow-100 text-yellow-800';
      case 'Archived':
        return 'bg-gray-100 text-gray-800';
      case 'Expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Document</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Version</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Modified</TableHead>
            <TableHead>Created By</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((document) => (
            <TableRow key={document.id} className="hover:bg-muted/50">
              <TableCell>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <div>
                    <div className="font-medium">{document.title}</div>
                    {document.description && (
                      <div className="text-sm text-muted-foreground truncate max-w-xs">
                        {document.description}
                      </div>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{document.category}</Badge>
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(document.status)}>
                  {document.status.replace('_', ' ')}
                </Badge>
              </TableCell>
              <TableCell>v{document.version}</TableCell>
              <TableCell>{formatFileSize(document.file_size)}</TableCell>
              <TableCell>
                {format(new Date(document.updated_at), 'MMM dd, yyyy')}
              </TableCell>
              <TableCell>{document.created_by}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onAction('view', document.id)}
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onAction('download', document.id)}
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onAction('edit', document.id)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onAction('delete', document.id)}
                  >
                    <Trash2 className="h-3 w-3" />
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

export default DocumentTableView;
