
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CAPAStatus } from '@/types/enums';
import { useToast } from '@/hooks/use-toast';

interface CAPAStatusFormProps {
  capaId: string;
  currentStatus: CAPAStatus;
  onUpdateStatus: (newStatus: CAPAStatus) => Promise<void>;
}

const CAPAStatusForm: React.FC<CAPAStatusFormProps> = ({
  capaId,
  currentStatus,
  onUpdateStatus
}) => {
  const [status, setStatus] = useState<CAPAStatus>(currentStatus);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();
  
  const handleStatusChange = async () => {
    if (status === currentStatus) {
      toast({
        title: 'No Change',
        description: 'Select a different status to update.',
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      await onUpdateStatus(status);
      
      toast({
        title: 'Status Updated',
        description: `CAPA status updated to ${status.toString().replace(/_/g, ' ')}`,
      });
      
      // Clear comment after update
      setComment('');
    } catch (error) {
      console.error('Error updating CAPA status:', error);
      
      toast({
        title: 'Update Failed',
        description: 'Failed to update CAPA status. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Update Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Select value={status} onValueChange={(value) => setStatus(value as CAPAStatus)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={CAPAStatus.Open}>Open</SelectItem>
                <SelectItem value={CAPAStatus.InProgress}>In Progress</SelectItem>
                <SelectItem value={CAPAStatus.Completed}>Completed</SelectItem>
                <SelectItem value={CAPAStatus.Closed}>Closed</SelectItem>
                <SelectItem value={CAPAStatus.PendingVerification}>Pending Verification</SelectItem>
                <SelectItem value={CAPAStatus.Verified}>Verified</SelectItem>
                <SelectItem value={CAPAStatus.OnHold}>On Hold</SelectItem>
                <SelectItem value={CAPAStatus.Rejected}>Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Textarea
              placeholder="Add a comment about this status change..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
          
          <Button 
            onClick={handleStatusChange} 
            className="w-full"
            disabled={isSubmitting || status === currentStatus}
          >
            {isSubmitting ? 'Updating...' : 'Update Status'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CAPAStatusForm;
