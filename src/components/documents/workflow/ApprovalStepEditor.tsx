
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { WorkflowStep } from '@/components/documents/workflow/WorkflowStep';
import { DocumentWorkflowStep } from '@/types/document';
import { Plus, Save, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface ApprovalStepEditorProps {
  steps: DocumentWorkflowStep[];
  onSave: (steps: DocumentWorkflowStep[]) => void;
}

const ApprovalStepEditor: React.FC<ApprovalStepEditorProps> = ({ steps, onSave }) => {
  const [workflowSteps, setWorkflowSteps] = useState<DocumentWorkflowStep[]>(steps || []);

  const handleAddStep = () => {
    const newStep: DocumentWorkflowStep = {
      id: uuidv4(),
      name: 'New Step',
      description: 'Step description',
      approvers: [],
      required_approvals: 1,
      deadline_days: 3,
      is_final: false
    };
    
    setWorkflowSteps([...workflowSteps, newStep]);
  };

  const handleStepChange = (updatedStep: DocumentWorkflowStep) => {
    setWorkflowSteps(workflowSteps.map(step => 
      step.id === updatedStep.id ? updatedStep : step
    ));
  };

  const handleDeleteStep = (stepId: string) => {
    setWorkflowSteps(workflowSteps.filter(step => step.id !== stepId));
  };

  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    
    const newSteps = [...workflowSteps];
    const temp = newSteps[index];
    newSteps[index] = newSteps[index - 1];
    newSteps[index - 1] = temp;
    
    setWorkflowSteps(newSteps);
  };

  const handleMoveDown = (index: number) => {
    if (index >= workflowSteps.length - 1) return;
    
    const newSteps = [...workflowSteps];
    const temp = newSteps[index];
    newSteps[index] = newSteps[index + 1];
    newSteps[index + 1] = temp;
    
    setWorkflowSteps(newSteps);
  };

  const handleSave = () => {
    onSave(workflowSteps);
  };

  // This method simply handles rendering a workflow step for editing,
  // not to be confused with the actual WorkflowStep component
  const renderStepEditor = (step: DocumentWorkflowStep, index: number) => {
    return (
      <Card key={step.id} className="mb-4 border-l-4 border-l-primary">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex justify-between items-center">
            <span>Step {index + 1}</span>
            <div className="flex gap-1">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 w-7 p-0" 
                onClick={() => handleMoveUp(index)}
                disabled={index === 0}
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 w-7 p-0" 
                onClick={() => handleMoveDown(index)}
                disabled={index === workflowSteps.length - 1}
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 w-7 p-0 text-destructive" 
                onClick={() => handleDeleteStep(step.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor={`step-name-${step.id}`}>Step Name</Label>
            <Input 
              id={`step-name-${step.id}`} 
              value={step.name} 
              onChange={(e) => handleStepChange({
                ...step,
                name: e.target.value
              })}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor={`step-desc-${step.id}`}>Description</Label>
            <Textarea 
              id={`step-desc-${step.id}`}
              value={step.description || ''}
              onChange={(e) => handleStepChange({
                ...step,
                description: e.target.value
              })}
              className="min-h-[80px] resize-none"
            />
          </div>
          
          {/* For simplicity, I'm using this to render a preview of the step */}
          <WorkflowStep
            key={step.id}
            step={step}
            index={index}
            onChange={handleStepChange}
            onDelete={handleDeleteStep}
            onMoveUp={() => handleMoveUp(index)}
            onMoveDown={() => handleMoveDown(index)}
            stepNumber={index + 1}
            title={step.name}
            description={step.description || ''}
            role={`${step.required_approvals} Approver(s) Required`}
            deadline={step.deadline_days || 3}
            isActive={index === 0}
          />
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Workflow Steps</h3>
        <Button onClick={handleSave} size="sm">
          <Save className="h-4 w-4 mr-1.5" />
          Save Workflow
        </Button>
      </div>
      
      <div className="space-y-4">
        {workflowSteps.map((step, index) => renderStepEditor(step, index))}
        
        <Button variant="outline" onClick={handleAddStep} className="w-full">
          <Plus className="h-4 w-4 mr-1.5" />
          Add Step
        </Button>
      </div>
    </div>
  );
};

export default ApprovalStepEditor;
