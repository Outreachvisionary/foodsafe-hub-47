
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
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

interface DocumentListViewProps {
  documents: Document[];
  onDocumentClick?: (document: Document) => void;
  onDocumentEdit?: (document: Document) => void;
  onDocumentDelete?: (documentId: string) => void;
  onDocumentDownload?: (document: Document) => void;
  onDocumentCheckout?: (documentId: string) => void;
  onDocumentCheckin?: (documentId: string) => void;
}

const DocumentListView: React.FC<DocumentListViewProps> = ({
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
    <div className="space-y-2">
      {documents.map((document) => (
        <Card 
          key={document.id} 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onDocumentClick?.(document)}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1">
                <FileText className="h-8 w-8 text-blue-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium truncate">{document.title}</h3>
                  <p className="text-xs text-gray-500 truncate">{document.file_name}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {document.category}
                    </Badge>
                    <Badge className={`text-xs ${getStatusColor(document.status)}`}>
                      {document.status.replace('_', ' ')}
                    </Badge>
                    {isCheckedOut(document) && (
                      <Badge variant="destructive" className="text-xs">
                        <Lock className="h-3 w-3 mr-1" />
                        Checked Out
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="text-right text-xs text-gray-500 flex-shrink-0">
                  <div>v{document.version}</div>
                  <div>{formatDistanceToNow(new Date(document.created_at), { addSuffix: true })}</div>
                  <div>{formatFileSize(document.file_size)}</div>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="sm" className="flex-shrink-0">
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
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DocumentListView;
