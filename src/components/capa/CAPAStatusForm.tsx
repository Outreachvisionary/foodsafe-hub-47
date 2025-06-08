
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CAPAStatus, EffectivenessRating } from '@/types/enums';
import { useToast } from '@/hooks/use-toast';
import { formatEnumValue } from '@/utils/typeAdapters';

interface CAPAStatusFormProps {
  capaId: string;
  currentStatus: CAPAStatus;
  onUpdateStatus: (status: CAPAStatus) => void;
}

const CAPAStatusForm: React.FC<CAPAStatusFormProps> = ({ 
  capaId, 
  currentStatus, 
  onUpdateStatus 
}) => {
  const { toast } = useToast();
  const [selectedStatus, setSelectedStatus] = useState<CAPAStatus>(currentStatus);
  const [comments, setComments] = useState('');

  const getNextAllowedStatuses = (current: CAPAStatus): CAPAStatus[] => {
    switch (current) {
      case CAPAStatus.Open:
        return [CAPAStatus.In_Progress, CAPAStatus.Cancelled];
      case CAPAStatus.In_Progress:
        return [CAPAStatus.Pending_Verification, CAPAStatus.Cancelled];
      case CAPAStatus.Pending_Verification:
        return [CAPAStatus.Closed, CAPAStatus.In_Progress];
      case CAPAStatus.Closed:
        return [];
      case CAPAStatus.Cancelled:
        return [CAPAStatus.Open];
      default:
        return [];
    }
  };

  const handleStatusUpdate = () => {
    if (selectedStatus === currentStatus) {
      toast({
        title: 'No Change',
        description: 'Status is already set to the selected value',
        variant: 'default',
      });
      return;
    }

    onUpdateStatus(selectedStatus);
    setComments('');
    
    toast({
      title: 'Status Updated',
      description: `CAPA status changed to ${formatEnumValue(selectedStatus)}`,
    });
  };

  const allowedStatuses = getNextAllowedStatuses(currentStatus);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="current-status">Current Status</Label>
          <div className="p-2 bg-muted rounded">
            {formatEnumValue(currentStatus)}
          </div>
        </div>

        {allowedStatuses.length > 0 && (
          <div className="space-y-2">
            <Label htmlFor="new-status">New Status</Label>
            <Select 
              value={selectedStatus} 
              onValueChange={(value: CAPAStatus) => setSelectedStatus(value)}
            >
              <SelectTrigger id="new-status">
                <SelectValue placeholder="Select new status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={currentStatus}>
                  {formatEnumValue(currentStatus)} (Current)
                </SelectItem>
                {allowedStatuses.map(status => (
                  <SelectItem key={status} value={status}>
                    {formatEnumValue(status)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="comments">Comments (Optional)</Label>
          <Textarea
            id="comments"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Add any comments about this status change..."
            rows={3}
          />
        </div>

        {allowedStatuses.length > 0 ? (
          <Button 
            onClick={handleStatusUpdate} 
            className="w-full"
            disabled={selectedStatus === currentStatus}
          >
            Update Status
          </Button>
        ) : (
          <div className="text-sm text-muted-foreground text-center py-2">
            No status changes allowed from current state
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CAPAStatusForm;
