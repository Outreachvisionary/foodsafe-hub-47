
import React, { useState } from 'react';
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
  ThumbsDown
} from 'lucide-react';
import { CAPA } from '@/types/capa';
import { toast } from 'sonner';

interface WorkflowStep {
  id: string;
  title: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  assignedTo: string;
  description: string;
  completedAt?: string;
  comments?: string;
}

interface CAPASimpleWorkflowProps {
  capa: CAPA;
  onWorkflowUpdate?: () => void;
}

const CAPASimpleWorkflow: React.FC<CAPASimpleWorkflowProps> = ({
  capa,
  onWorkflowUpdate
}) => {
  const [comment, setComment] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Generate simple workflow steps based on CAPA data
  const workflowSteps: WorkflowStep[] = [
    {
      id: 'investigation',
      title: 'Root Cause Analysis',
      status: capa.root_cause ? 'completed' : 'pending',
      assignedTo: capa.assigned_to || 'Quality Team',
      description: 'Investigate and identify the root cause of the issue',
      completedAt: capa.root_cause ? capa.updated_at : undefined
    },
    {
      id: 'action_plan',
      title: 'Corrective Action Plan',
      status: capa.corrective_action ? 'completed' : 'pending',
      assignedTo: capa.assigned_to || 'Quality Team',
      description: 'Define corrective and preventive actions',
      completedAt: capa.corrective_action ? capa.updated_at : undefined
    },
    {
      id: 'approval',
      title: 'Management Approval',
      status: capa.status === 'Closed' ? 'approved' : 'pending',
      assignedTo: 'Quality Manager',
      description: 'Review and approve the CAPA plan'
    },
    {
      id: 'implementation',
      title: 'Implementation',
      status: capa.completion_date ? 'completed' : 'pending',
      assignedTo: capa.assigned_to || 'Quality Team',
      description: 'Execute the approved corrective actions',
      completedAt: capa.completion_date
    },
    {
      id: 'verification',
      title: 'Effectiveness Verification',
      status: capa.effectiveness_verified ? 'completed' : 'pending',
      assignedTo: 'Quality Manager',
      description: 'Verify that actions were effective',
      completedAt: capa.verification_date
    }
  ];

  const completedSteps = workflowSteps.filter(step => 
    step.status === 'completed' || step.status === 'approved'
  ).length;
  
  const progress = Math.round((completedSteps / workflowSteps.length) * 100);

  const currentStep = workflowSteps.find(step => step.status === 'pending');

  const handleApprove = async () => {
    if (!comment.trim()) {
      toast.error('Please add a comment before approving');
      return;
    }

    setIsProcessing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Step approved successfully');
      setComment('');
      if (onWorkflowUpdate) onWorkflowUpdate();
    } catch (error) {
      toast.error('Failed to approve step');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!comment.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    setIsProcessing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Step rejected - CAPA returned for revision');
      setComment('');
      if (onWorkflowUpdate) onWorkflowUpdate();
    } catch (error) {
      toast.error('Failed to reject step');
    } finally {
      setIsProcessing(false);
    }
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
            {completedSteps} of {workflowSteps.length} steps completed
          </p>
        </div>

        {/* Workflow Steps */}
        <div className="space-y-3">
          {workflowSteps.map((step, index) => (
            <div
              key={step.id}
              className={`p-4 rounded-lg border ${getStepColor(step.status)}`}
            >
              <div className="flex items-start gap-3">
                {getStepIcon(step.status)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{step.title}</h4>
                    <Badge variant="outline" className="text-xs">
                      Step {index + 1}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {step.description}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {step.assignedTo}
                    </div>
                    {step.completedAt && (
                      <div>
                        Completed: {new Date(step.completedAt).toLocaleDateString()}
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
              <strong>Action Required:</strong> {currentStep.title} is pending approval
            </AlertDescription>
          </Alert>
        )}

        {/* Approval Actions */}
        {currentStep && currentStep.id === 'approval' && (
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
                  disabled={isProcessing || !comment.trim()}
                  className="flex items-center gap-2"
                >
                  <ThumbsUp className="h-4 w-4" />
                  Approve
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleReject}
                  disabled={isProcessing || !comment.trim()}
                  className="flex items-center gap-2 text-red-600 border-red-300 hover:bg-red-50"
                >
                  <ThumbsDown className="h-4 w-4" />
                  Request Changes
                </Button>
              </div>
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
