
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  FileText, 
  Download, 
  Edit, 
  Trash2, 
  Eye, 
  Lock, 
  Unlock,
  MoreVertical
} from 'lucide-react';
import { Document } from '@/types/document';
import { formatDistanceToNow } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DocumentTableViewProps {
  documents: Document[];
  onAction: (action: string, documentId: string) => void;
}

const DocumentTableView: React.FC<DocumentTableViewProps> = ({ documents, onAction }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft':
        return 'bg-gray-100 text-gray-800';
      case 'Pending_Approval':
      case 'Pending Approval':
        return 'bg-blue-100 text-blue-800';
      case 'Approved':
      case 'Published':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      case 'Archived':
        return 'bg-purple-100 text-purple-800';
      case 'Expired':
        return 'bg-yellow-100 text-yellow-800';
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
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((document) => {
            const isCheckedOut = document.checkout_status === 'Checked_Out' || document.is_locked;
            
            return (
              <TableRow key={document.id} className="hover:bg-muted/50">
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <FileText className="h-4 w-4 text-blue-600" />
                      {isCheckedOut && <Lock className="h-3 w-3 text-red-500" />}
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium truncate" title={document.title}>
                        {document.title}
                      </div>
                      <div className="text-sm text-muted-foreground truncate" title={document.file_name}>
                        {document.file_name}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">
                    {document.category}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={`text-xs ${getStatusColor(document.status)}`}>
                    {document.status.replace('_', ' ')}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm font-mono">v{document.version}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {formatFileSize(document.file_size)}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>{formatDistanceToNow(new Date(document.created_at), { addSuffix: true })}</div>
                    <div className="text-xs text-muted-foreground">by {document.created_by}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onAction('view', document.id)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onAction('download', document.id)}>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onAction('edit', document.id)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      {isCheckedOut ? (
                        <DropdownMenuItem onClick={() => onAction('checkin', document.id)}>
                          <Unlock className="h-4 w-4 mr-2" />
                          Check In
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={() => onAction('checkout', document.id)}>
                          <Lock className="h-4 w-4 mr-2" />
                          Check Out
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem 
                        onClick={() => onAction('delete', document.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default DocumentTableView;
