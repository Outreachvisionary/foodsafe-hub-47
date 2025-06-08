
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, XCircle, Clock, User } from 'lucide-react';
import { Document } from '@/types/document';
import { DocumentStatus } from '@/types/enums';
import { documentStatusToString } from '@/utils/typeAdapters';
import { useToast } from '@/hooks/use-toast';

interface DocumentApproverProps {
  document: Document;
  currentUserId: string;
  currentUserName: string;
  canApprove?: boolean;
  onApprovalAction?: (action: 'approve' | 'reject', comment?: string) => void;
  onStatusUpdate?: (status: DocumentStatus) => void;
}

const DocumentApprover: React.FC<DocumentApproverProps> = ({
  document,
  currentUserId,
  currentUserName,
  canApprove = false,
  onApprovalAction,
  onStatusUpdate
}) => {
  const { toast } = useToast();
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newStatus, setNewStatus] = useState<DocumentStatus>(document.status);

  const handleApprove = async () => {
    setIsSubmitting(true);
    try {
      if (onApprovalAction) {
        await onApprovalAction('approve', comment);
      }
      
      toast({
        title: 'Document Approved',
        description: 'The document has been successfully approved.',
      });
      
      setComment('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to approve document. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!comment.trim()) {
      toast({
        title: 'Comment Required',
        description: 'Please provide a reason for rejecting this document.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      if (onApprovalAction) {
        await onApprovalAction('reject', comment);
      }
      
      toast({
        title: 'Document Rejected',
        description: 'The document has been rejected with comments.',
      });
      
      setComment('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reject document. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async () => {
    if (newStatus === document.status) return;
    
    setIsSubmitting(true);
    try {
      if (onStatusUpdate) {
        await onStatusUpdate(newStatus);
      }
      
      toast({
        title: 'Status Updated',
        description: `Document status changed to ${newStatus.replace('_', ' ')}.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update document status. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusIcon = (status: DocumentStatus) => {
    switch (status) {
      case DocumentStatus.Approved:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case DocumentStatus.Rejected:
        return <XCircle className="h-4 w-4 text-red-500" />;
      case DocumentStatus.Pending_Approval:
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: DocumentStatus) => {
    switch (status) {
      case DocumentStatus.Approved:
        return 'bg-green-100 text-green-800';
      case DocumentStatus.Rejected:
        return 'bg-red-100 text-red-800';
      case DocumentStatus.Pending_Approval:
        return 'bg-yellow-100 text-yellow-800';
      case DocumentStatus.Draft:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getStatusIcon(document.status)}
          Document Approval
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Current Status</Label>
          <Badge className={getStatusColor(document.status)}>
            {document.status.replace('_', ' ')}
          </Badge>
        </div>

        {document.approvers && document.approvers.length > 0 && (
          <div className="space-y-2">
            <Label>Approvers</Label>
            <div className="space-y-1">
              {document.approvers.map((approver, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <User className="h-3 w-3" />
                  {approver}
                </div>
              ))}
            </div>
          </div>
        )}

        {canApprove && document.status === DocumentStatus.Pending_Approval && (
          <div className="space-y-4 border-t pt-4">
            <div className="space-y-2">
              <Label htmlFor="approval-comment">Comments</Label>
              <Textarea
                id="approval-comment"
                placeholder="Add your approval comments or feedback..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleApprove}
                disabled={isSubmitting}
                className="flex-1"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {isSubmitting ? 'Approving...' : 'Approve'}
              </Button>
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={isSubmitting}
                className="flex-1"
              >
                <XCircle className="h-4 w-4 mr-2" />
                {isSubmitting ? 'Rejecting...' : 'Reject'}
              </Button>
            </div>
          </div>
        )}

        {onStatusUpdate && (
          <div className="space-y-4 border-t pt-4">
            <div className="space-y-2">
              <Label htmlFor="status-select">Update Status</Label>
              <Select 
                value={documentStatusToString(newStatus)} 
                onValueChange={(value) => setNewStatus(value as DocumentStatus)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={documentStatusToString(DocumentStatus.Draft)}>Draft</SelectItem>
                  <SelectItem value={documentStatusToString(DocumentStatus.Pending_Approval)}>Pending Approval</SelectItem>
                  <SelectItem value={documentStatusToString(DocumentStatus.Approved)}>Approved</SelectItem>
                  <SelectItem value={documentStatusToString(DocumentStatus.Published)}>Published</SelectItem>
                  <SelectItem value={documentStatusToString(DocumentStatus.Archived)}>Archived</SelectItem>
                  <SelectItem value={documentStatusToString(DocumentStatus.Expired)}>Expired</SelectItem>
                  <SelectItem value={documentStatusToString(DocumentStatus.Rejected)}>Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {newStatus !== document.status && (
              <Button 
                onClick={handleStatusChange}
                disabled={isSubmitting}
                variant="outline"
                className="w-full"
              >
                {isSubmitting ? 'Updating...' : 'Update Status'}
              </Button>
            )}
          </div>
        )}

        {!canApprove && document.status === DocumentStatus.Pending_Approval && (
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              This document is pending approval and cannot be modified.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentApprover;
