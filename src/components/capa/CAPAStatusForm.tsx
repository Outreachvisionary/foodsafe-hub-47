
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CAPAStatus } from '@/types/enums';
import { Loader2 } from 'lucide-react';

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
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (status === currentStatus) return;
    
    setIsSubmitting(true);
    try {
      await onUpdateStatus(status);
      setNotes('');
    } catch (error) {
      console.error('Error updating status:', error);
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="status" className="text-sm font-medium">
              Status
            </label>
            <Select 
              value={status} 
              onValueChange={(value) => setStatus(value as CAPAStatus)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={CAPAStatus.Open}>Open</SelectItem>
                <SelectItem value={CAPAStatus.InProgress}>In Progress</SelectItem>
                <SelectItem value={CAPAStatus.Completed}>Completed</SelectItem>
                <SelectItem value={CAPAStatus.Closed}>Closed</SelectItem>
                <SelectItem value={CAPAStatus.OnHold}>On Hold</SelectItem>
                <SelectItem value={CAPAStatus.PendingVerification}>Pending Verification</SelectItem>
                <SelectItem value={CAPAStatus.Verified}>Verified</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="notes" className="text-sm font-medium">
              Status Update Notes
            </label>
            <Textarea
              id="notes"
              placeholder="Add notes about this status change..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[80px]"
            />
          </div>
          
          <Button 
            type="submit" 
            disabled={status === currentStatus || isSubmitting}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              'Update Status'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CAPAStatusForm;
