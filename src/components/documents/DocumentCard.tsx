
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Download, 
  Edit, 
  Eye, 
  Trash2,
  Clock,
  User,
  Calendar
} from 'lucide-react';
import { Document } from '@/types/document';
import { format } from 'date-fns';

interface DocumentCardProps {
  document: Document;
  onAction: (action: string, documentId: string) => void;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ document, onAction }) => {
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
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg truncate">{document.title}</CardTitle>
              {document.description && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {document.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Status and Category */}
          <div className="flex flex-wrap gap-2">
            <Badge className={getStatusColor(document.status)}>
              {document.status.replace('_', ' ')}
            </Badge>
            <Badge variant="outline">
              {document.category}
            </Badge>
            <Badge variant="secondary">
              v{document.version}
            </Badge>
          </div>
          
          {/* Document Info */}
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>{document.created_by}</span>
              </div>
              <span>{formatFileSize(document.file_size)}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>Modified: {format(new Date(document.updated_at), 'MMM dd, yyyy')}</span>
            </div>
            
            {document.expiry_date && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>Expires: {format(new Date(document.expiry_date), 'MMM dd, yyyy')}</span>
              </div>
            )}
          </div>
          
          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => onAction('view', document.id)}
            >
              <Eye className="h-3 w-3 mr-1" />
              View
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onAction('download', document.id)}
            >
              <Download className="h-3 w-3" />
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onAction('edit', document.id)}
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onAction('delete', document.id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentCard;
