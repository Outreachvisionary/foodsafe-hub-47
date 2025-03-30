
import React, { useState } from 'react';
import { Document } from '@/types/document';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ClipboardCheck, XCircle, Clock } from 'lucide-react';

interface DocumentApproverProps {
  document: Document;
  onApprove: (document: Document, comment: string) => void;
  onReject: (document: Document) => void;
}

const DocumentApprover: React.FC<DocumentApproverProps> = ({ 
  document, 
  onApprove, 
  onReject 
}) => {
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApprove = async () => {
    try {
      setIsSubmitting(true);
      await onApprove(document, comment);
    } catch (error) {
      console.error('Error approving document:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    try {
      setIsSubmitting(true);
      onReject(document);
    } catch (error) {
      console.error('Error rejecting document:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Document must be in "Pending Approval" status to be approved
  if (document.status !== 'Pending Approval') {
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
          <p className="text-sm mb-1 font-medium">Add review comments (optional):</p>
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
          disabled={isSubmitting}
          className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
        >
          <XCircle className="mr-2 h-4 w-4" />
          Reject
        </Button>
        <Button 
          variant="default" 
          onClick={handleApprove}
          disabled={isSubmitting}
        >
          <ClipboardCheck className="mr-2 h-4 w-4" />
          Approve Document
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DocumentApprover;
