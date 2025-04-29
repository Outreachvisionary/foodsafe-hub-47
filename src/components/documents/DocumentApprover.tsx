import React, { useState } from 'react';
import { Document } from '@/types/document';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ClipboardCheck, XCircle, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DocumentStatus } from '@/types/enums';

interface DocumentApproverProps {
  document: Document;
  onApprove: (document: Document, comment: string) => void;
  onReject: (document: Document, reason: string) => void;
}

const DocumentApprover: React.FC<DocumentApproverProps> = ({ 
  document, 
  onApprove, 
  onReject 
}) => {
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Debug function
  const debugLog = (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DocumentApprover] ${message}`, data ? data : '');
    }
  };

  const handleApprove = async () => {
    debugLog('Approve clicked', { document });
    
    if (!document || !document.id) {
      toast({
        title: "Error",
        description: "Cannot approve: Invalid document data",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      debugLog('Approving document', { id: document.id, comment });
      await onApprove(document, comment);
      
      toast({
        title: "Document approved",
        description: "The document has been approved successfully"
      });
    } catch (error) {
      console.error('Error approving document:', error);
      toast({
        title: "Error approving document",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    debugLog('Reject clicked', { document });
    
    if (!document || !document.id) {
      toast({
        title: "Error",
        description: "Cannot reject: Invalid document data",
        variant: "destructive"
      });
      return;
    }

    if (!comment.trim()) {
      toast({
        title: "Comment required",
        description: "Please provide a reason for rejecting this document",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      debugLog('Rejecting document', { id: document.id, reason: comment });
      await onReject(document, comment);
      
      toast({
        title: "Document rejected",
        description: "The document has been rejected"
      });
    } catch (error) {
      console.error('Error rejecting document:', error);
      toast({
        title: "Error rejecting document",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Document must be in "Pending Approval" status to be approved
  if (!document) {
    debugLog('No document provided');
    return (
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center">
            <AlertCircle className="mr-2 h-5 w-5 text-destructive" />
            No Document Selected
          </CardTitle>
          <CardDescription>
            Please select a document for review
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  debugLog('Rendering with document', { id: document.id, status: document.status });

  // Fix the status check to use enum instead of string literal
  if (document.status !== DocumentStatus.PendingApproval) {
    return (
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center">
            <ClipboardCheck className="mr-2 h-5 w-5 text-primary" />
            Document Review
          </CardTitle>
          <CardDescription>
            This document is not pending approval. Current status: 
            <Badge variant="outline" className="ml-2">
              {document.status}
            </Badge>
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center">
          <ClipboardCheck className="mr-2 h-5 w-5 text-primary" />
          Document Review
        </CardTitle>
        <CardDescription>
          Review and approve or reject this document
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">{document.title}</h3>
            <p className="text-sm text-muted-foreground">
              Version {document.version} • {document.category}
            </p>
          </div>
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            Pending Approval
          </Badge>
        </div>

        <div>
          <p className="text-sm mb-1 font-medium">Add review comments (required for rejection):</p>
          <Textarea
            placeholder="Enter any comments regarding your approval decision..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button 
          variant="outline" 
          onClick={handleReject}
          disabled={isSubmitting || !comment.trim()}
          className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
        >
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <XCircle className="mr-2 h-4 w-4" />}
          Reject
        </Button>
        <Button 
          variant="default" 
          onClick={handleApprove}
          disabled={isSubmitting}
        >
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ClipboardCheck className="mr-2 h-4 w-4" />}
          Approve Document
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DocumentApprover;
