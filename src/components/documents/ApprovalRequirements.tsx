
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DocumentWorkflowStep } from '@/types/document';
import documentWorkflowService from '@/services/documentWorkflowService';
import { Loader2, UserPlus } from 'lucide-react';

interface ApprovalRequirementsProps {
  steps: DocumentWorkflowStep[];
  onStepsChange: (steps: DocumentWorkflowStep[]) => void;
  isLoading?: boolean;
}

const ApprovalRequirements: React.FC<ApprovalRequirementsProps> = ({
  steps,
  onStepsChange,
  isLoading = false
}) => {
  const [availableApprovers, setAvailableApprovers] = useState<any[]>([]);
  const [loadingApprovers, setLoadingApprovers] = useState(false);

  useEffect(() => {
    const loadApprovers = async () => {
      setLoadingApprovers(true);
      try {
        const approvers = await documentWorkflowService.getAvailableApprovers();
        setAvailableApprovers(approvers);
      } catch (error) {
        console.error('Error loading approvers:', error);
      } finally {
        setLoadingApprovers(false);
      }
    };

    loadApprovers();
  }, []);

  const handleAddApprover = (stepId: string, approverId: string) => {
    const updatedSteps = steps.map(step => {
      if (step.id === stepId) {
        return {
          ...step,
          approvers: [...step.approvers, approverId]
        };
      }
      return step;
    });
    onStepsChange(updatedSteps);
  };

  const handleRemoveApprover = (stepId: string, approverId: string) => {
    const updatedSteps = steps.map(step => {
      if (step.id === stepId) {
        return {
          ...step,
          approvers: step.approvers.filter(id => id !== approverId)
        };
      }
      return step;
    });
    onStepsChange(updatedSteps);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Approval Requirements</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center p-6">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="ml-2">Loading approval workflow...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Approval Requirements</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {steps.map((step, index) => (
          <div key={step.id} className="border rounded-md p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Step {index + 1}: {step.name}</h3>
              <span className="text-sm text-muted-foreground">
                {step.required_approvals} approval{step.required_approvals !== 1 ? 's' : ''} required
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{step.description}</p>
            
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2 mb-2">
                {step.approvers.length === 0 ? (
                  <div className="text-sm text-muted-foreground">No approvers assigned</div>
                ) : (
                  step.approvers.map(approverId => {
                    const approver = availableApprovers.find(a => a.id === approverId);
                    return (
                      <div key={approverId} className="flex items-center gap-2 border rounded-md px-2 py-1 bg-gray-50">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback>{approver?.name.charAt(0) || 'U'}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{approver?.name || 'Unknown User'}</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-5 w-5 p-0 rounded-full" 
                          onClick={() => handleRemoveApprover(step.id, approverId)}
                        >
                          &times;
                        </Button>
                      </div>
                    );
                  })
                )}
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-2"
                disabled={loadingApprovers}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                {loadingApprovers ? 'Loading approvers...' : 'Add Approver'}
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ApprovalRequirements;
