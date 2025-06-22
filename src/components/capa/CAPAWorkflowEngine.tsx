
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { Workflow, Clock, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import { initiateWorkflow, advanceWorkflow } from '@/services/capaWorkflowService';

interface CAPAWorkflowEngineProps {
  capaId: string;
  priority: string;
  source: string;
  currentStatus: string;
  onStatusUpdate: (newStatus: string) => void;
}

const CAPAWorkflowEngine: React.FC<CAPAWorkflowEngineProps> = ({
  capaId,
  priority,
  source,
  currentStatus,
  onStatusUpdate
}) => {
  const { toast } = useToast();
  const [workflowSteps, setWorkflowSteps] = useState<any[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadWorkflowSteps();
  }, [capaId]);

  const loadWorkflowSteps = async () => {
    // Mock workflow steps based on priority
    const steps = getWorkflowStepsForPriority(priority);
    setWorkflowSteps(steps);
    
    // Find current step based on status
    const stepIndex = steps.findIndex(step => step.status === 'pending' || step.status === 'in-progress');
    setCurrentStepIndex(Math.max(0, stepIndex));
  };

  const getWorkflowStepsForPriority = (priority: string) => {
    const baseSteps = [
      { id: '1', name: 'Root Cause Investigation', status: 'completed', required: true },
      { id: '2', name: 'Action Plan Development', status: 'in-progress', required: true },
      { id: '3', name: 'Implementation', status: 'pending', required: true },
      { id: '4', name: 'Effectiveness Verification', status: 'pending', required: true }
    ];

    if (priority === 'Critical' || priority === 'High') {
      return [
        ...baseSteps.slice(0, 2),
        { id: '2.5', name: 'Management Approval', status: 'pending', required: true },
        ...baseSteps.slice(2)
      ];
    }

    return baseSteps;
  };

  const handleAdvanceWorkflow = async (stepId: string, action: 'approve' | 'reject', comments?: string) => {
    setLoading(true);
    try {
      await advanceWorkflow(capaId, stepId, action, comments);
      
      // Update local state
      const updatedSteps = workflowSteps.map(step => 
        step.id === stepId 
          ? { ...step, status: action === 'approve' ? 'completed' : 'rejected' }
          : step
      );
      setWorkflowSteps(updatedSteps);

      // Move to next step if approved
      if (action === 'approve') {
        const nextStepIndex = currentStepIndex + 1;
        if (nextStepIndex < workflowSteps.length) {
          setCurrentStepIndex(nextStepIndex);
        } else {
          onStatusUpdate('Pending Verification');
        }
      }

      toast({
        title: "Workflow Updated",
        description: `Step ${action}d successfully`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update workflow",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getProgressPercentage = () => {
    const completedSteps = workflowSteps.filter(step => step.status === 'completed').length;
    return (completedSteps / workflowSteps.length) * 100;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Workflow className="h-5 w-5" />
          CAPA Workflow Engine
        </CardTitle>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{Math.round(getProgressPercentage())}% Complete</span>
          </div>
          <Progress value={getProgressPercentage()} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {workflowSteps.map((step, index) => (
            <div key={step.id} className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                {step.status === 'completed' ? (
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                ) : step.status === 'in-progress' ? (
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Clock className="h-4 w-4 text-blue-600" />
                  </div>
                ) : step.status === 'rejected' ? (
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                  </div>
                ) : (
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-sm text-gray-600">{index + 1}</span>
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{step.name}</h4>
                  <div className="flex items-center gap-2">
                    <Badge variant={step.status === 'completed' ? 'default' : 'secondary'}>
                      {step.status.replace('-', ' ')}
                    </Badge>
                    {step.required && (
                      <Badge variant="outline" className="text-xs">Required</Badge>
                    )}
                  </div>
                </div>

                {index === currentStepIndex && step.status !== 'completed' && (
                  <div className="mt-2 flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleAdvanceWorkflow(step.id, 'approve')}
                      disabled={loading}
                    >
                      Complete Step
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAdvanceWorkflow(step.id, 'reject')}
                      disabled={loading}
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </div>

              {index < workflowSteps.length - 1 && (
                <ArrowRight className="h-4 w-4 text-gray-400" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CAPAWorkflowEngine;
