import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle, 
  Clock, 
  User, 
  FileText, 
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  RefreshCw
} from 'lucide-react';
import { CAPA } from '@/types/capa';
import { toast } from 'sonner';
import { useWorkflowSteps } from '@/hooks/useWorkflowSteps';

interface CAPASimpleWorkflowProps {
  capa: CAPA;
  onWorkflowUpdate?: () => void;
}

const CAPASimpleWorkflow: React.FC<CAPASimpleWorkflowProps> = ({
  capa,
  onWorkflowUpdate
}) => {
  const { steps, isLoading, updateStep, isUpdating } = useWorkflowSteps(capa.id);
  const [comment, setComment] = useState('');
  const [isInitializing, setIsInitializing] = useState(false);

  const completedSteps = steps.filter(step => 
    step.status === 'completed' || step.status === 'approved'
  ).length;
  
  const progress = steps.length > 0 ? Math.round((completedSteps / steps.length) * 100) : 0;

  const currentStep = steps.find(step => step.status === 'pending');

  // Auto-initialize workflow if no steps exist
  useEffect(() => {
    if (!isLoading && steps.length === 0) {
      console.log('No workflow steps found, they should be auto-initialized');
    }
  }, [isLoading, steps.length]);

  const handleApprove = async () => {
    if (!currentStep || !comment.trim()) {
      toast.error('Please add a comment before approving');
      return;
    }

    updateStep({
      stepId: currentStep.id,
      status: 'approved',
      comments: comment,
      completedBy: 'Current User' // Should be actual user
    });
    
    setComment('');
    if (onWorkflowUpdate) onWorkflowUpdate();
  };

  const handleReject = async () => {
    if (!currentStep || !comment.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    updateStep({
      stepId: currentStep.id,
      status: 'rejected',
      comments: comment,
      completedBy: 'Current User' // Should be actual user
    });
    
    setComment('');
    if (onWorkflowUpdate) onWorkflowUpdate();
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'rejected':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-amber-600" />;
    }
  };

  const getStepColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'approved':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'rejected':
        return 'text-red-700 bg-red-50 border-red-200';
      default:
        return 'text-amber-700 bg-amber-50 border-amber-200';
    }
  };

  const getStepTitle = (stepName: string) => {
    const titles: Record<string, string> = {
      investigation: 'Root Cause Analysis',
      action_plan: 'Corrective Action Plan',
      approval: 'Management Approval',
      implementation: 'Implementation',
      verification: 'Effectiveness Verification'
    };
    return titles[stepName] || stepName;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            CAPA Workflow Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 justify-center py-8">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Loading workflow...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show message if no workflow steps exist
  if (steps.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            CAPA Workflow Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Workflow steps are being initialized for this CAPA. Please refresh the page if they don't appear shortly.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          CAPA Workflow Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Overview */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Overall Progress</span>
            <span className="font-medium">{progress}% Complete</span>
          </div>
          <Progress value={progress} className="h-3" />
          <p className="text-xs text-muted-foreground">
            {completedSteps} of {steps.length} steps completed
          </p>
        </div>

        {/* Workflow Steps */}
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`p-4 rounded-lg border ${getStepColor(step.status)}`}
            >
              <div className="flex items-start gap-3">
                {getStepIcon(step.status)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{getStepTitle(step.step_name)}</h4>
                    <Badge variant="outline" className="text-xs">
                      Step {step.step_order}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {step.description}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {step.assigned_to}
                    </div>
                    {step.completed_at && (
                      <div>
                        Completed: {new Date(step.completed_at).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  {step.comments && (
                    <div className="mt-2 p-2 bg-white/50 rounded text-xs">
                      <strong>Comments:</strong> {step.comments}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Current Action Required */}
        {currentStep && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Action Required:</strong> {getStepTitle(currentStep.step_name)} is pending approval
            </AlertDescription>
          </Alert>
        )}

        {/* Approval Actions */}
        {currentStep && currentStep.step_name === 'approval' && (
          <div className="space-y-4 p-4 bg-blue-50 rounded-lg border">
            <h4 className="font-medium text-blue-900">Management Approval Required</h4>
            <p className="text-sm text-blue-700">
              Please review the CAPA plan and provide your approval or feedback.
            </p>
            
            <div className="space-y-3">
              <div>
                <Label htmlFor="approval-comment">Comments</Label>
                <Textarea
                  id="approval-comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add your comments or feedback..."
                  className="mt-1"
                  rows={3}
                />
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={handleApprove}
                  disabled={isUpdating || !comment.trim()}
                  className="flex items-center gap-2"
                >
                  <ThumbsUp className="h-4 w-4" />
                  Approve
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleReject}
                  disabled={isUpdating || !comment.trim()}
                  className="flex items-center gap-2 text-red-600 border-red-300 hover:bg-red-50"
                >
                  <ThumbsDown className="h-4 w-4" />
                  Request Changes
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Other step actions (for investigation, action_plan, etc.) */}
        {currentStep && currentStep.step_name !== 'approval' && (
          <div className="space-y-4 p-4 bg-amber-50 rounded-lg border">
            <h4 className="font-medium text-amber-900">
              {getStepTitle(currentStep.step_name)} - Action Required
            </h4>
            <p className="text-sm text-amber-700">
              This step needs to be completed before proceeding to the next stage.
            </p>
            
            <div className="space-y-3">
              <div>
                <Label htmlFor="step-comment">Comments</Label>
                <Textarea
                  id="step-comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add your comments or notes..."
                  className="mt-1"
                  rows={3}
                />
              </div>
              
              <Button 
                onClick={() => {
                  if (!comment.trim()) {
                    toast.error('Please add a comment before completing this step');
                    return;
                  }
                  updateStep({
                    stepId: currentStep.id,
                    status: 'completed',
                    comments: comment,
                    completedBy: 'Current User'
                  });
                  setComment('');
                  if (onWorkflowUpdate) onWorkflowUpdate();
                }}
                disabled={isUpdating || !comment.trim()}
                className="flex items-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Mark as Complete
              </Button>
            </div>
          </div>
        )}

        {/* Workflow Complete */}
        {progress === 100 && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>CAPA Workflow Complete!</strong> All steps have been successfully completed and verified.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default CAPASimpleWorkflow;
