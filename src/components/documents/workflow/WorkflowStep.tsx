
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { DocumentWorkflowStep } from '@/types/document';
import { Trash, MoveUp, MoveDown, Plus, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface WorkflowStepProps {
  step: DocumentWorkflowStep;
  index: number;
  onChange: (step: DocumentWorkflowStep) => void;
  onDelete: (id: string) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

export const WorkflowStep: React.FC<WorkflowStepProps> = ({
  step,
  index,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown
}) => {
  const [approverInput, setApproverInput] = useState('');

  // Update the step properties
  const updateStep = (updates: Partial<DocumentWorkflowStep>) => {
    onChange({ ...step, ...updates });
  };

  // Add a new approver
  const addApprover = () => {
    if (!approverInput.trim()) return;
    
    if (!step.approvers.includes(approverInput)) {
      updateStep({ approvers: [...step.approvers, approverInput] });
    }
    
    setApproverInput('');
  };

  // Remove an approver
  const removeApprover = (approver: string) => {
    updateStep({ approvers: step.approvers.filter(a => a !== approver) });
  };

  // In a real application, we would pull this from a user/role service
  const availableApprovers = [
    'Quality Manager',
    'Operations Manager',
    'Compliance Officer',
    'Department Head',
    'CEO',
    'VP Operations',
    'Food Safety Team Leader',
    'HR Director',
    'Training Manager',
    'Audited Department Head',
    'Procurement Manager',
    'Safety Officer'
  ];

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-medium">
            Step {index + 1}
          </h4>
          <div className="flex items-center gap-2">
            {onMoveUp && (
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={onMoveUp}
                className="h-8 w-8 p-0"
              >
                <MoveUp className="h-4 w-4" />
                <span className="sr-only">Move Up</span>
              </Button>
            )}
            
            {onMoveDown && (
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={onMoveDown}
                className="h-8 w-8 p-0"
              >
                <MoveDown className="h-4 w-4" />
                <span className="sr-only">Move Down</span>
              </Button>
            )}
            
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={() => onDelete(step.id)}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        </div>
        
        <div className="grid gap-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor={`step-name-${step.id}`} className="text-right">
              Step Name
            </Label>
            <Input
              id={`step-name-${step.id}`}
              value={step.name}
              onChange={(e) => updateStep({ name: e.target.value })}
              className="col-span-3"
              placeholder="E.g., Department Review"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor={`step-description-${step.id}`} className="text-right self-start pt-2">
              Description
            </Label>
            <Textarea
              id={`step-description-${step.id}`}
              value={step.description || ''}
              onChange={(e) => updateStep({ description: e.target.value })}
              className="col-span-3"
              placeholder="Describe what happens in this step"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor={`step-deadline-${step.id}`} className="text-right">
              Deadline (Days)
            </Label>
            <Input
              id={`step-deadline-${step.id}`}
              type="number"
              min="1"
              value={step.deadline_days?.toString() || '7'}
              onChange={(e) => updateStep({ deadline_days: parseInt(e.target.value) || 7 })}
              className="col-span-3 w-32"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor={`step-required-approvals-${step.id}`} className="text-right">
              Required Approvals
            </Label>
            <Select 
              value={step.required_approvals.toString()} 
              onValueChange={(value) => updateStep({ required_approvals: parseInt(value) })}
            >
              <SelectTrigger id={`step-required-approvals-${step.id}`} className="w-32">
                <SelectValue placeholder="Required approvals" />
              </SelectTrigger>
              <SelectContent>
                {[...Array(Math.max(step.approvers.length, 1)).keys()].map(i => (
                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                    {i + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="col-span-2">
              <p className="text-sm text-muted-foreground">
                {step.required_approvals} out of {step.approvers.length} approvers must approve
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">
              Is Final Step
            </Label>
            <div className="flex items-center space-x-2">
              <Switch
                checked={step.is_final}
                onCheckedChange={(checked) => updateStep({ is_final: checked })}
                id={`step-is-final-${step.id}`}
              />
              <Label htmlFor={`step-is-final-${step.id}`}>
                {step.is_final ? 'Yes' : 'No'}
              </Label>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-4">
            <Label className="text-right self-start pt-2">
              Required Approvers
            </Label>
            <div className="col-span-3 space-y-3">
              <div className="flex gap-2">
                <Select 
                  value={approverInput} 
                  onValueChange={setApproverInput}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select approver" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableApprovers.map(approver => (
                      <SelectItem key={approver} value={approver}>
                        {approver}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={addApprover}
                  className="flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2">
                {step.approvers.length > 0 ? (
                  step.approvers.map(approver => (
                    <Badge 
                      key={approver} 
                      variant="secondary"
                      className="flex items-center gap-1 py-1 pl-2 pr-1"
                    >
                      {approver}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeApprover(approver)}
                        className="h-5 w-5 p-0 rounded-full ml-1 hover:bg-secondary-foreground/10"
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove {approver}</span>
                      </Button>
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No approvers added yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
