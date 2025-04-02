
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DocumentWorkflow, DocumentWorkflowStep } from '@/types/document';
import { WorkflowStep } from './WorkflowStep';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlusCircle, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

interface ApprovalStepEditorProps {
  workflow?: DocumentWorkflow | null;
  onSave: (workflow: DocumentWorkflow) => void;
  onCancel: () => void;
}

export const ApprovalStepEditor: React.FC<ApprovalStepEditorProps> = ({
  workflow,
  onSave,
  onCancel
}) => {
  const [name, setName] = useState(workflow?.name || '');
  const [description, setDescription] = useState(workflow?.description || '');
  const [steps, setSteps] = useState<DocumentWorkflowStep[]>(workflow?.steps || []);
  const { toast } = useToast();

  // Create a new step
  const addStep = () => {
    const newStep: DocumentWorkflowStep = {
      id: uuidv4(),
      name: `Step ${steps.length + 1}`,
      description: '',
      approvers: [],
      required_approvals: 1,
      is_final: steps.length === 0, // First step is final by default if no steps exist
      deadline_days: 7
    };
    
    setSteps([...steps, newStep]);
  };

  // Update an existing step
  const updateStep = (updatedStep: DocumentWorkflowStep) => {
    setSteps(steps.map(step => step.id === updatedStep.id ? updatedStep : step));
  };

  // Delete a step
  const deleteStep = (stepId: string) => {
    setSteps(steps.filter(step => step.id !== stepId));
  };

  // Move a step up or down
  const moveStep = (stepId: string, direction: 'up' | 'down') => {
    const currentIndex = steps.findIndex(step => step.id === stepId);
    if (
      (direction === 'up' && currentIndex === 0) || 
      (direction === 'down' && currentIndex === steps.length - 1)
    ) {
      return; // Can't move further in this direction
    }
    
    const newSteps = [...steps];
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    // Swap the steps
    [newSteps[currentIndex], newSteps[targetIndex]] = [newSteps[targetIndex], newSteps[currentIndex]];
    
    setSteps(newSteps);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Validation Error",
        description: "Workflow name is required",
        variant: "destructive"
      });
      return;
    }
    
    if (steps.length === 0) {
      toast({
        title: "Validation Error",
        description: "At least one approval step is required",
        variant: "destructive"
      });
      return;
    }
    
    const newWorkflow: DocumentWorkflow = {
      id: workflow?.id || uuidv4(),
      name,
      description,
      steps,
      created_by: 'current_user',
      created_at: workflow?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    onSave(newWorkflow);
    toast({
      title: "Workflow Saved",
      description: `Workflow "${name}" has been saved successfully`
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl">
            {workflow ? 'Edit Approval Workflow' : 'Create New Approval Workflow'}
          </CardTitle>
          <CardDescription>
            Define the approval steps and requirements for document reviews
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="workflow-name" className="text-right">
                Workflow Name
              </Label>
              <Input
                id="workflow-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                placeholder="E.g., Standard Document Approval"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="workflow-description" className="text-right self-start pt-2">
                Description
              </Label>
              <Textarea
                id="workflow-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
                placeholder="Describe the purpose of this workflow"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Approval Steps</h3>
          <Button 
            type="button"
            onClick={addStep}
            className="flex items-center gap-1"
          >
            <PlusCircle className="h-4 w-4" />
            Add Step
          </Button>
        </div>
        
        {steps.length > 0 ? (
          <ScrollArea className="h-[400px] border rounded-md p-4">
            <div className="space-y-6">
              {steps.map((step, index) => (
                <WorkflowStep
                  key={step.id}
                  step={step}
                  index={index}
                  onChange={updateStep}
                  onDelete={deleteStep}
                  onMoveUp={index > 0 ? () => moveStep(step.id, 'up') : undefined}
                  onMoveDown={index < steps.length - 1 ? () => moveStep(step.id, 'down') : undefined}
                />
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="border rounded-md p-8 text-center">
            <p className="text-muted-foreground mb-4">
              No approval steps defined yet. Add steps to create your workflow.
            </p>
            <Button 
              type="button"
              onClick={addStep}
              className="flex items-center gap-1"
            >
              <PlusCircle className="h-4 w-4" />
              Add First Step
            </Button>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="flex items-center gap-1"
        >
          <X className="h-4 w-4" />
          Cancel
        </Button>
        <Button 
          type="submit"
          className="flex items-center gap-1"
        >
          <Save className="h-4 w-4" />
          Save Workflow
        </Button>
      </div>
    </form>
  );
};
