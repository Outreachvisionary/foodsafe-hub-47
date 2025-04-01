
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, AlertTriangle } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface EditStepDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentStep: number;
  maxSteps: number;
  onConfirm: (step: number, reason: string) => Promise<void>;
}

const EditStepDialog: React.FC<EditStepDialogProps> = ({
  open,
  onOpenChange,
  currentStep,
  maxSteps,
  onConfirm
}) => {
  const [selectedStep, setSelectedStep] = useState<string>(currentStep.toString());
  const [reason, setReason] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleConfirm = async () => {
    if (!reason.trim()) {
      toast.error('Please provide a reason for changing the step');
      return;
    }
    
    try {
      setIsSubmitting(true);
      await onConfirm(parseInt(selectedStep), reason);
      setReason('');
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating step:', error);
      toast.error('Failed to update step');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Generate available steps
  const steps = [];
  for (let i = 1; i <= maxSteps; i++) {
    steps.push(i);
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Approval Step</DialogTitle>
          <DialogDescription>
            Change the current approval process step
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex items-center p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-700">
            <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
            <p className="text-sm">
              Changing the approval step will reset the approval process to the selected step. 
              All progress after this step will be lost.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="step-select">Select Step</Label>
            <Select
              value={selectedStep}
              onValueChange={setSelectedStep}
            >
              <SelectTrigger id="step-select">
                <SelectValue placeholder="Select step" />
              </SelectTrigger>
              <SelectContent>
                {steps.map(step => (
                  <SelectItem key={step} value={step.toString()}>
                    Step {step} {step === currentStep ? '(Current)' : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Change</Label>
            <Textarea
              id="reason"
              placeholder="Please provide a reason for changing the step"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={isSubmitting || !reason.trim() || selectedStep === currentStep.toString()}
          >
            {isSubmitting ? 'Updating...' : 'Confirm Change'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditStepDialog;
