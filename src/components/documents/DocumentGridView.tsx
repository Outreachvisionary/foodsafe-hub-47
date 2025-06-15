
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

interface DocumentGridViewProps {
  documents: Document[];
  onDocumentClick?: (document: Document) => void;
  onDocumentEdit?: (document: Document) => void;
  onDocumentDelete?: (documentId: string) => void;
  onDocumentDownload?: (document: Document) => void;
  onDocumentCheckout?: (documentId: string) => void;
  onDocumentCheckin?: (documentId: string) => void;
}

const DocumentGridView: React.FC<DocumentGridViewProps> = ({
  documents,
  onDocumentClick,
  onDocumentEdit,
  onDocumentDelete,
  onDocumentDownload,
  onDocumentCheckout,
  onDocumentCheckin,
}) => {
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'Draft':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Pending_Approval':
      case 'Pending Approval':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Approved':
      case 'Published':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Archived':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Expired':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const isCheckedOut = (document: Document): boolean => {
    return document.checkout_status === 'Checked_Out' || document.is_locked;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {documents.map((document) => (
        <Card 
          key={document.id} 
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => onDocumentClick?.(document)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <FileText className="h-8 w-8 text-blue-500" />
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    onDocumentClick?.(document);
                  }}>
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    onDocumentDownload?.(document);
                  }}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    onDocumentEdit?.(document);
                  }}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  {isCheckedOut(document) ? (
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      onDocumentCheckin?.(document.id);
                    }}>
                      <Unlock className="h-4 w-4 mr-2" />
                      Check In
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      onDocumentCheckout?.(document.id);
                    }}>
                      <Lock className="h-4 w-4 mr-2" />
                      Check Out
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDocumentDelete?.(document.id);
                    }}
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
            <p className="text-xs text-gray-500 truncate" title={document.file_name}>
              {document.file_name}
            </p>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <Badge variant="outline" className="text-xs">
                  {document.category}
                </Badge>
                <span className="text-gray-500">v{document.version}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <Badge className={`text-xs ${getStatusColor(document.status)}`}>
                  {document.status.replace('_', ' ')}
                </Badge>
                {isCheckedOut(document) && (
                  <Badge variant="destructive" className="text-xs">
                    <Lock className="h-3 w-3 mr-1" />
                    Locked
                  </Badge>
                )}
              </div>
              
              <div className="text-xs text-gray-500">
                <div>{formatFileSize(document.file_size)}</div>
                <div>{formatDistanceToNow(new Date(document.created_at), { addSuffix: true })}</div>
              </div>
              
              {document.description && (
                <p className="text-xs text-gray-600 line-clamp-2" title={document.description}>
                  {document.description}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DocumentGridView;
