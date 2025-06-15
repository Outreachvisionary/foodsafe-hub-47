
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Download, 
  Edit, 
  Trash2, 
  Lock, 
  Unlock,
  Eye,
  Clock,
  User,
  FolderOpen
} from 'lucide-react';
import { Document } from '@/types/document';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface DocumentGridProps {
  documents: Document[];
  onDocumentClick?: (document: Document) => void;
  onDocumentEdit?: (document: Document) => void;
  onDocumentDelete?: (documentId: string) => void;
  onDocumentDownload?: (document: Document) => void;
  onDocumentMove?: (documentId: string, targetFolderId: string) => void;
  onDocumentCheckout?: (documentId: string) => void;
  onDocumentCheckin?: (documentId: string) => void;
  viewMode?: 'grid' | 'list';
}

const DocumentGrid: React.FC<DocumentGridProps> = ({
  documents,
  onDocumentClick,
  onDocumentEdit,
  onDocumentDelete,
  onDocumentDownload,
  onDocumentMove,
  onDocumentCheckout,
  onDocumentCheckin,
  viewMode = 'grid'
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Published':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'Draft':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
      case 'Pending Review':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'Pending Approval':
        return 'bg-orange-100 text-orange-800 hover:bg-orange-100';
      case 'Approved':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'Rejected':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      case 'Archived':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'SOP':
        return '📋';
      case 'Policy':
        return '📜';
      case 'Manual':
        return '📖';
      case 'Form':
        return '📝';
      case 'Report':
        return '📊';
      case 'Certificate':
        return '🏆';
      default:
        return '📄';
    }
  };

  const isDocumentExpiring = (document: Document) => {
    if (!document.expiry_date) return false;
    const expiryDate = new Date(document.expiry_date);
    const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    return expiryDate <= thirtyDaysFromNow;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (viewMode === 'list') {
    return (
      <div className="space-y-2">
        {documents.map((document) => (
          <Card 
            key={document.id} 
            className={cn(
              "hover:shadow-md transition-shadow cursor-pointer",
              document.checkout_status === 'Checked Out' && "border-orange-200 bg-orange-50",
              isDocumentExpiring(document) && "border-red-200 bg-red-50"
            )}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="text-2xl">
                    {getCategoryIcon(document.category)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h3 
                        className="font-medium text-gray-900 truncate cursor-pointer hover:text-blue-600"
                        onClick={() => onDocumentClick?.(document)}
                      >
                        {document.title}
                      </h3>
                      {document.checkout_status === 'Checked Out' && (
                        <Lock className="h-4 w-4 text-orange-500" />
                      )}
                      {isDocumentExpiring(document) && (
                        <Clock className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-4 mt-1">
                      <Badge variant="outline" className={getStatusColor(document.status)}>
                        {document.status}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        v{document.version}
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatFileSize(document.file_size)}
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatDistanceToNow(new Date(document.updated_at), { addSuffix: true })}
                      </span>
                    </div>
                    
                    {document.description && (
                      <p className="text-sm text-gray-600 mt-1 truncate">
                        {document.description}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDocumentClick?.(document)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  
                  {document.checkout_status === 'Available' ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDocumentCheckout?.(document.id)}
                    >
                      <Unlock className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDocumentCheckin?.(document.id)}
                      disabled={document.checkout_user_id !== 'current_user'} // Replace with actual user check
                    >
                      <Lock className="h-4 w-4" />
                    </Button>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDocumentEdit?.(document)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDocumentDownload?.(document)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDocumentDelete?.(document.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {document.checkout_status === 'Checked Out' && document.checkout_user_name && (
                <div className="mt-3 flex items-center space-x-2 text-sm text-orange-600">
                  <User className="h-4 w-4" />
                  <span>Checked out by {document.checkout_user_name}</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {documents.map((document) => (
        <Card 
          key={document.id} 
          className={cn(
            "hover:shadow-lg transition-all duration-200 cursor-pointer group",
            document.checkout_status === 'Checked Out' && "border-orange-200 bg-orange-50",
            isDocumentExpiring(document) && "border-red-200 bg-red-50"
          )}
          onClick={() => onDocumentClick?.(document)}
        >
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="text-3xl">
                {getCategoryIcon(document.category)}
              </div>
              <div className="flex items-center space-x-1">
                {document.checkout_status === 'Checked Out' && (
                  <Lock className="h-4 w-4 text-orange-500" />
                )}
                {isDocumentExpiring(document) && (
                  <Clock className="h-4 w-4 text-red-500" />
                )}
              </div>
            </div>
            
            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {document.title}
            </h3>
            
            {document.description && (
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {document.description}
              </p>
            )}
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className={getStatusColor(document.status)}>
                  {document.status}
                </Badge>
                <span className="text-xs text-gray-500">v{document.version}</span>
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{formatFileSize(document.file_size)}</span>
                <span>{document.file_type.toUpperCase()}</span>
              </div>
              
              <div className="text-xs text-gray-500">
                Updated {formatDistanceToNow(new Date(document.updated_at), { addSuffix: true })}
              </div>
            </div>
            
            {document.checkout_status === 'Checked Out' && document.checkout_user_name && (
              <div className="mb-4 flex items-center space-x-2 text-xs text-orange-600">
                <User className="h-3 w-3" />
                <span>Checked out by {document.checkout_user_name}</span>
              </div>
            )}
            
            <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDocumentEdit?.(document);
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDocumentDownload?.(document);
                  }}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex space-x-1">
                {document.checkout_status === 'Available' ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDocumentCheckout?.(document.id);
                    }}
                  >
                    <Unlock className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDocumentCheckin?.(document.id);
                    }}
                    disabled={document.checkout_user_id !== 'current_user'} // Replace with actual user check
                  >
                    <Lock className="h-4 w-4" />
                  </Button>
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDocumentDelete?.(document.id);
                  }}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DocumentGrid;
