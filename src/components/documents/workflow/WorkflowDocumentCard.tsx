
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Document } from '@/types/document';
import { Clock, CheckCircle, XCircle, Eye, FileText } from 'lucide-react';
import { format } from 'date-fns';

export interface WorkflowDocumentCardProps {
  document: Document;
  status: string;
  onView?: (document: Document) => void;
  onApprove?: (document: Document) => void;
  onReject?: (document: Document) => void;
}

export const WorkflowDocumentCard: React.FC<WorkflowDocumentCardProps> = ({
  document,
  status,
  onView,
  onApprove,
  onReject
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-amber-500" />;
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200">Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-800 border-red-200">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex flex-col space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              {getStatusIcon()}
              <div>
                <h3 className="font-medium">{document.title}</h3>
                <p className="text-sm text-muted-foreground">{document.file_name}</p>
              </div>
            </div>
            {getStatusBadge()}
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-3.5 w-3.5 mr-1.5" />
            <span>
              {document.updated_at
                ? `Updated ${format(new Date(document.updated_at), 'PP')}`
                : 'No update date'}
            </span>
          </div>
          
          <div className="flex justify-end space-x-2">
            {onView && (
              <Button variant="outline" size="sm" onClick={() => onView(document)}>
                <Eye className="h-3.5 w-3.5 mr-1.5" />
                View
              </Button>
            )}
            
            {status === 'pending' && onApprove && (
              <Button variant="outline" size="sm" onClick={() => onApprove(document)} className="border-green-200 text-green-700 hover:bg-green-50">
                <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                Approve
              </Button>
            )}
            
            {status === 'pending' && onReject && (
              <Button variant="outline" size="sm" onClick={() => onReject(document)} className="border-red-200 text-red-700 hover:bg-red-50">
                <XCircle className="h-3.5 w-3.5 mr-1.5" />
                Reject
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
