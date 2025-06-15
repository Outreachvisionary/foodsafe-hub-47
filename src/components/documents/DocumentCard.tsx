
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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

interface DocumentCardProps {
  document: Document;
  onAction: (action: string, documentId: string) => void;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ document, onAction }) => {
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

  const isCheckedOut = document.checkout_status === 'Checked_Out' || document.is_locked;

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-blue-600" />
            {isCheckedOut && (
              <Lock className="h-4 w-4 text-red-500" />
            )}
          </div>
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
        </div>
        <CardTitle className="text-sm truncate" title={document.title}>
          {document.title}
        </CardTitle>
        <p className="text-xs text-muted-foreground truncate" title={document.file_name}>
          {document.file_name}
        </p>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-xs">
              {document.category}
            </Badge>
            <span className="text-xs text-muted-foreground">v{document.version}</span>
          </div>
          
          <Badge className={`text-xs ${getStatusColor(document.status)}`}>
            {document.status.replace('_', ' ')}
          </Badge>
          
          <div className="text-xs text-muted-foreground space-y-1">
            <div>Size: {formatFileSize(document.file_size)}</div>
            <div>Created: {formatDistanceToNow(new Date(document.created_at), { addSuffix: true })}</div>
            <div>By: {document.created_by}</div>
          </div>
          
          {document.description && (
            <p className="text-xs text-muted-foreground line-clamp-2" title={document.description}>
              {document.description}
            </p>
          )}

          {document.tags && document.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {document.tags.slice(0, 2).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {document.tags.length > 2 && (
                <Badge variant="secondary" className="text-xs">
                  +{document.tags.length - 2} more
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentCard;
