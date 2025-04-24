
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle } from 'lucide-react';
import { useDocumentContext } from '@/context/DocumentContext';
import { supabase } from '@/integrations/supabase/client';

interface ApprovalWorkflowProps {
  documentId: string;
  onComplete: () => void;
}

export const ApprovalWorkflow: React.FC<ApprovalWorkflowProps> = ({ 
  documentId, 
  onComplete 
}) => {
  const [comment, setComment] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionForm, setShowRejectionForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { approveDocument, rejectDocument } = useDocumentContext();
  const { toast } = useToast();

  const handleApprove = async () => {
    try {
      setIsSubmitting(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');
      
      await approveDocument(documentId, user.id, comment);
      
      toast({
        title: 'Document Approved',
        description: 'The document has been successfully approved',
      });
      
      onComplete();
    } catch (error: any) {
      toast({
        title: 'Approval Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    try {
      if (!rejectionReason) {
        toast({
          title: 'Rejection Failed',
          description: 'Please provide a reason for rejection',
          variant: 'destructive',
        });
        return;
      }
      
      setIsSubmitting(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');
      
      await rejectDocument(documentId, user.id, rejectionReason);
      
      toast({
        title: 'Document Rejected',
        description: 'The document has been rejected',
      });
      
      onComplete();
    } catch (error: any) {
      toast({
        title: 'Rejection Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
      setShowRejectionForm(false);
    }
  };

  if (showRejectionForm) {
    return (
      <div className="space-y-4 border rounded-md p-4">
        <h3 className="font-medium">Reject Document</h3>
        <Textarea
          placeholder="Please provide a reason for rejection..."
          value={rejectionReason}
          onChange={(e) => setRejectionReason(e.target.value)}
          rows={4}
          required
        />
        <div className="flex justify-end gap-2">
          <Button 
            variant="outline" 
            onClick={() => setShowRejectionForm(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleReject}
            disabled={isSubmitting || !rejectionReason}
          >
            {isSubmitting ? 'Rejecting...' : 'Confirm Rejection'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 border rounded-md p-4">
      <h3 className="font-medium">Document Approval</h3>
      <Textarea
        placeholder="Add comments (optional)..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
      />
      <div className="flex justify-end gap-2">
        <Button 
          variant="outline" 
          onClick={() => setShowRejectionForm(true)}
          disabled={isSubmitting}
        >
          <XCircle className="h-4 w-4 mr-2" />
          Reject
        </Button>
        <Button 
          variant="default" 
          onClick={handleApprove}
          disabled={isSubmitting}
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          Approve
        </Button>
      </div>
    </div>
  );
};
