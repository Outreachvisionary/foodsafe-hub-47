
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Download, Edit, Eye, MoreVertical, Trash2, Lock, Unlock } from 'lucide-react';
import { Document } from '@/types/document';
import { formatDistanceToNow } from 'date-fns';
import { getDocumentStatusColor, formatDocumentStatus } from '@/utils/documentUtils';
import { CheckoutStatus } from '@/types/enums';
import DocumentCheckoutActions from './DocumentCheckoutActions';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DocumentGridProps {
  documents: Document[];
  onDocumentClick: (document: Document) => void;
  onDocumentEdit?: (document: Document) => void;
  onDocumentDelete?: (documentId: string) => void;
  onDocumentDownload?: (document: Document) => void;
  onDocumentMove?: (documentId: string, targetFolderId: string) => void;
  onDocumentCheckout?: (documentId: string) => void;
  onDocumentCheckin?: (documentId: string) => void;
}

const DocumentGrid: React.FC<DocumentGridProps> = ({
  documents,
  onDocumentClick,
  onDocumentEdit,
  onDocumentDelete,
  onDocumentDownload,
  onDocumentMove,
  onDocumentCheckout,
  onDocumentCheckin
}) => {
  const handleDownload = (document: Document, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDocumentDownload) {
      onDocumentDownload(document);
    } else {
      console.log('Download document:', document.id);
    }
  };

  const handleEdit = (document: Document, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDocumentEdit) {
      onDocumentEdit(document);
    }
  };

  const handleDelete = (document: Document, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDocumentDelete) {
      onDocumentDelete(document.id);
    }
  };

  const handleCheckout = (document: Document, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDocumentCheckout) {
      onDocumentCheckout(document.id);
    }
  };

  const handleCheckin = (document: Document, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDocumentCheckin) {
      onDocumentCheckin(document.id);
    }
  };

  const handleDragStart = (e: React.DragEvent, document: Document) => {
    e.dataTransfer.setData('text/plain', document.id);
    e.dataTransfer.effectAllowed = 'move';
    console.log('Drag started for document:', document.title);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetDocument: Document) => {
    e.preventDefault();
    const draggedDocumentId = e.dataTransfer.getData('text/plain');
    
    if (draggedDocumentId !== targetDocument.id && onDocumentMove) {
      const targetFolderId = targetDocument.folder_id || 'root';
      onDocumentMove(draggedDocumentId, targetFolderId);
      console.log('Document moved to folder:', targetFolderId);
    }
  };

  const isCurrentUserCheckedOut = (document: Document) => {
    return document.checkout_status === CheckoutStatus.Checked_Out && 
           document.checkout_user_name === 'current_user'; // TODO: Get from auth context
  };

  const canEdit = (document: Document) => {
    return document.checkout_status === CheckoutStatus.Available || isCurrentUserCheckedOut(document);
  };

  const canDelete = (document: Document) => {
    return document.checkout_status === CheckoutStatus.Available && 
           (document.status === 'Draft' || document.status === 'Rejected');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {documents.map((document) => (
        <Card 
          key={document.id}
          className="cursor-pointer hover:shadow-md transition-shadow group relative"
          onClick={() => onDocumentClick(document)}
          draggable
          onDragStart={(e) => handleDragStart(e, document)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, document)}
        >
          {document.checkout_status === CheckoutStatus.Checked_Out && (
            <div className="absolute top-2 right-2 z-10">
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                <Lock className="h-3 w-3 mr-1" />
                Checked Out
              </Badge>
            </div>
          )}
          
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2 flex-1 min-w-0">
                <FileText className="h-8 w-8 text-blue-500 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-sm truncate" title={document.title}>
                    {document.title}
                  </h3>
                  <p className="text-xs text-muted-foreground truncate" title={document.file_name}>
                    {document.file_name}
                  </p>
                </div>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={(e) => handleDownload(document, e)}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem onClick={() => onDocumentClick(document)}>
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  {/* Checkout/Checkin Actions */}
                  {document.checkout_status === CheckoutStatus.Available && (
                    <DropdownMenuItem onClick={(e) => handleCheckout(document, e)}>
                      <Lock className="h-4 w-4 mr-2" />
                      Check Out
                    </DropdownMenuItem>
                  )}

                  {isCurrentUserCheckedOut(document) && (
                    <DropdownMenuItem onClick={(e) => handleCheckin(document, e)}>
                      <Unlock className="h-4 w-4 mr-2" />
                      Check In
                    </DropdownMenuItem>
                  )}

                  {/* Edit Action */}
                  {canEdit(document) && onDocumentEdit && (
                    <DropdownMenuItem onClick={(e) => handleEdit(document, e)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator />

                  {/* Delete Action */}
                  {canDelete(document) && onDocumentDelete && (
                    <DropdownMenuItem 
                      onClick={(e) => handleDelete(document, e)}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">
                  {document.category}
                </Badge>
                <Badge className={`text-xs ${getDocumentStatusColor(document.status)}`}>
                  {formatDocumentStatus(document.status)}
                </Badge>
              </div>

              <div className="text-xs text-muted-foreground">
                Version {document.version}
              </div>

              <div className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(document.created_at), { addSuffix: true })}
              </div>

              {document.description && (
                <p className="text-xs text-muted-foreground line-clamp-2" title={document.description}>
                  {document.description}
                </p>
              )}

              {/* Checkout Information */}
              {document.checkout_status === CheckoutStatus.Checked_Out && (
                <div className="text-xs text-orange-600 font-medium">
                  🔒 Checked out by {document.checkout_user_name || 'Unknown User'}
                  {document.checkout_timestamp && (
                    <div className="text-gray-500">
                      {formatDistanceToNow(new Date(document.checkout_timestamp), { addSuffix: true })}
                    </div>
                  )}
                </div>
              )}

              {/* Status Indicators */}
              {(document.status === 'Pending_Approval' || document.status === 'Pending_Review') && (
                <div className="text-xs text-orange-600 font-medium">
                  ⏳ Awaiting {document.status === 'Pending_Approval' ? 'Approval' : 'Review'}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DocumentGrid;
