
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CAPAStatus, CAPAEffectivenessRating } from '@/types/enums';
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
  const [selectedStatus, setSelectedStatus] = useState<CAPAStatus | ''>('');
  const [effectivenessRating, setEffectivenessRating] = useState<CAPAEffectivenessRating | ''>('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Function to get available status options based on current status
  const getAvailableStatuses = (): CAPAStatus[] => {
    switch (currentStatus) {
      case CAPAStatus.Open:
        return [CAPAStatus.InProgress, CAPAStatus.OnHold, CAPAStatus.Rejected];
      case CAPAStatus.InProgress:
        return [CAPAStatus.Open, CAPAStatus.OnHold, CAPAStatus.Completed];
      case CAPAStatus.Completed:
        return [CAPAStatus.PendingVerification, CAPAStatus.InProgress, CAPAStatus.Closed];
      case CAPAStatus.PendingVerification:
        return [CAPAStatus.Verified, CAPAStatus.InProgress];
      case CAPAStatus.OnHold:
        return [CAPAStatus.InProgress, CAPAStatus.Open, CAPAStatus.Rejected];
      case CAPAStatus.Rejected:
        return [CAPAStatus.Open];
      case CAPAStatus.Verified:
        return [CAPAStatus.Closed];
      case CAPAStatus.Closed:
        return [CAPAStatus.InProgress]; // Can reopen
      case CAPAStatus.Overdue:
        return [CAPAStatus.InProgress, CAPAStatus.OnHold, CAPAStatus.Rejected];
      case CAPAStatus.UnderReview:
        return [CAPAStatus.InProgress, CAPAStatus.PendingVerification, CAPAStatus.Rejected];
      default:
        return [];
    }
  };

  // Check if verification form should be shown
  const showVerificationForm = selectedStatus === CAPAStatus.Verified;

  // Format status for display
  const formatStatus = (status: string): string => {
    return status.replace(/_/g, ' ');
  };

  // Handle status update submission
  const handleSubmit = async () => {
    if (!selectedStatus) {
      toast({
        title: "Error",
        description: "Please select a status",
        variant: "destructive",
      });
      return;
    }

    if (showVerificationForm && !effectivenessRating) {
      toast({
        title: "Error",
        description: "Please select an effectiveness rating",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Call the update function passed from parent
      await onUpdateStatus(selectedStatus);
      
      toast({
        title: "Status Updated",
        description: `CAPA status changed to ${formatStatus(selectedStatus)}`,
      });
      
      // Reset form
      setSelectedStatus('');
      setEffectivenessRating('');
      setComment('');
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Update Failed",
        description: "There was an error updating the status",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="status-select">Change status to</Label>
          <Select 
            value={selectedStatus} 
            onValueChange={(value) => setSelectedStatus(value as CAPAStatus)}
          >
            <SelectTrigger id="status-select">
              <SelectValue placeholder="Select new status" />
            </SelectTrigger>
            <SelectContent>
              {getAvailableStatuses().map((status) => (
                <SelectItem key={status} value={status}>
                  {formatStatus(status)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {showVerificationForm && (
          <div>
            <Label htmlFor="effectiveness-rating">Effectiveness Rating</Label>
            <Select 
              value={effectivenessRating} 
              onValueChange={(value) => setEffectivenessRating(value as CAPAEffectivenessRating)}
            >
              <SelectTrigger id="effectiveness-rating">
                <SelectValue placeholder="Select effectiveness rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={CAPAEffectivenessRating.NotEffective}>
                  Not Effective
                </SelectItem>
                <SelectItem value={CAPAEffectivenessRating.PartiallyEffective}>
                  Partially Effective
                </SelectItem>
                <SelectItem value={CAPAEffectivenessRating.Effective}>
                  Effective
                </SelectItem>
                <SelectItem value={CAPAEffectivenessRating.HighlyEffective}>
                  Highly Effective
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        
        <div>
          <Label htmlFor="comment">Comment (optional)</Label>
          <Textarea
            id="comment"
            placeholder="Add a comment about this status change"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSubmit}
          disabled={!selectedStatus || isSubmitting || (showVerificationForm && !effectivenessRating)}
        >
          {isSubmitting ? 'Updating...' : 'Update Status'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CAPAStatusForm;
