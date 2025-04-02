
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Document } from '@/types/document';
import { formatDate, truncateText } from '@/lib/utils';
import { Clock, Download, Eye, Pencil, Trash2, FileText, CheckCircle, XCircle, Clock as ClockIcon } from 'lucide-react';

interface DocumentListProps {
  documents: Document[];
  onViewDocument?: (document: Document) => void;
  onEditDocument?: (document: Document) => void;
  onDeleteDocument?: (document: Document) => void;
  onDownloadDocument?: (document: Document) => void;
}

const DocumentList: React.FC<DocumentListProps> = ({
  documents = [],
  onViewDocument,
  onEditDocument,
  onDeleteDocument,
  onDownloadDocument
}) => {
  // Helper function to get status badge
  const getStatusBadge = (document: Document) => {
    if (!document) return null;
    
    if (document.is_expired) {
      return <Badge variant="destructive">Expired</Badge>;
    }
    
    switch (document.approval_status) {
      case 'approved':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">Pending</Badge>;
      default:
        return <Badge variant="outline">Draft</Badge>;
    }
  };
  
  // Helper function to get icon based on document type
  const getDocumentIcon = (document: Document) => {
    if (!document || !document.file_type) return <FileText className="h-5 w-5 text-gray-500" />;
    
    switch (document.file_type) {
      case 'pdf':
        return <FileText className="h-5 w-5 text-red-500" />;
      case 'docx':
      case 'doc':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'xlsx':
      case 'xls':
        return <FileText className="h-5 w-5 text-green-500" />;
      case 'pptx':
      case 'ppt':
        return <FileText className="h-5 w-5 text-orange-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };
  
  // Ensure documents is an array or use an empty array as fallback
  const safeDocuments = Array.isArray(documents) ? documents : [];
  
  return (
    <div className="overflow-hidden w-full">
      <table className="w-full caption-bottom text-sm">
        <thead className="[&_tr]:border-b bg-muted/50">
          <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
            <th className="h-12 px-4 text-left align-middle font-medium [&:has([role=checkbox])]:pr-0">
              Document
            </th>
            <th className="h-12 px-4 text-left align-middle font-medium hidden md:table-cell">
              Category
            </th>
            <th className="h-12 px-4 text-left align-middle font-medium hidden lg:table-cell">
              Status
            </th>
            <th className="h-12 px-4 text-left align-middle font-medium hidden lg:table-cell">
              Last Updated
            </th>
            <th className="h-12 px-4 text-right align-middle font-medium min-w-[150px]">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="[&_tr:last-child]:border-0">
          {safeDocuments.length > 0 ? safeDocuments.map((document) => (
            <tr 
              key={document.id}
              className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
            >
              <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                <div className="flex items-center gap-3">
                  {getDocumentIcon(document)}
                  <div>
                    <div className="font-medium">{truncateText(document.title || 'Untitled Document', 40)}</div>
                    <div className="text-xs text-muted-foreground">{document.file_name || ''}</div>
                  </div>
                </div>
              </td>
              <td className="p-4 align-middle hidden md:table-cell">
                <Badge variant="outline">{document.category || 'Uncategorized'}</Badge>
              </td>
              <td className="p-4 align-middle hidden lg:table-cell">
                {getStatusBadge(document)}
              </td>
              <td className="p-4 align-middle hidden lg:table-cell">
                <div className="flex items-center">
                  <ClockIcon className="mr-1 h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {document.updated_at ? formatDate(document.updated_at, true) : 'N/A'}
                  </span>
                </div>
              </td>
              <td className="p-4 align-middle text-right">
                <div className="flex justify-end gap-1">
                  {onViewDocument && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onViewDocument(document)}
                      className="h-8 w-8"
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View</span>
                    </Button>
                  )}
                  
                  {onEditDocument && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onEditDocument(document)}
                      className="h-8 w-8"
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                  )}
                  
                  {onDownloadDocument && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onDownloadDocument(document)}
                      className="h-8 w-8"
                    >
                      <Download className="h-4 w-4" />
                      <span className="sr-only">Download</span>
                    </Button>
                  )}
                  
                  {onDeleteDocument && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onDeleteDocument(document)}
                      className="h-8 w-8 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan={5} className="text-center py-8">
                <p className="text-muted-foreground">No documents available</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      
      {!safeDocuments.length ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No documents available</p>
        </div>
      ) : null}
    </div>
  );
};

export default DocumentList;
