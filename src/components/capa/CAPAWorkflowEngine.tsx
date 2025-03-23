
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { 
  AlertCircle, 
  CheckCircle2, 
  CircleX, 
  Clock, 
  FileCheck, 
  FileWarning, 
  LockKeyhole, 
  UserCheck, 
  Users
} from 'lucide-react';

// Types of roles in the workflow
type ApprovalRole = 'Quality Manager' | 'Department Head' | 'Food Safety Director' | 'Operations Manager';

// Approval status
type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'not_required';

// Step in the workflow
interface WorkflowStep {
  id: string;
  name: string;
  role: ApprovalRole;
  status: ApprovalStatus;
  comments?: string;
  approvedBy?: string;
  approvedAt?: string;
  required: boolean;
}

interface CAPAWorkflowEngineProps {
  capaId: string;
  title: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  requiredSignoffs: ApprovalRole[];
  initialStatus?: 'draft' | 'in_review' | 'approved' | 'rejected';
  onStatusChange?: (status: string) => void;
}

const CAPAWorkflowEngine: React.FC<CAPAWorkflowEngineProps> = ({
  capaId,
  title,
  priority,
  requiredSignoffs = ['Quality Manager'],
  initialStatus = 'draft',
  onStatusChange
}) => {
  const [status, setStatus] = useState(initialStatus);
  const [approvalComment, setApprovalComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Generate workflow steps based on the required signoffs
  const generateWorkflowSteps = (): WorkflowStep[] => {
    const allPossibleSteps: WorkflowStep[] = [
      {
        id: 'step1',
        name: 'Quality Manager Approval',
        role: 'Quality Manager',
        status: 'pending',
        required: requiredSignoffs.includes('Quality Manager')
      },
      {
        id: 'step2',
        name: 'Department Head Approval',
        role: 'Department Head',
        status: 'pending',
        required: requiredSignoffs.includes('Department Head')
      },
      {
        id: 'step3',
        name: 'Food Safety Director Approval',
        role: 'Food Safety Director',
        status: 'pending',
        required: requiredSignoffs.includes('Food Safety Director')
      },
      {
        id: 'step4',
        name: 'Operations Manager Approval',
        role: 'Operations Manager',
        status: 'pending',
        required: requiredSignoffs.includes('Operations Manager')
      }
    ];
    
    // For this demo, if the status is already 'approved', mark steps as approved
    if (status === 'approved') {
      return allPossibleSteps.map(step => ({
        ...step,
        status: step.required ? 'approved' : 'not_required',
        approvedBy: step.required ? 'John Doe' : undefined,
        approvedAt: step.required ? new Date().toISOString() : undefined,
        comments: step.required ? 'Approved as per requirements' : undefined
      }));
    }
    
    return allPossibleSteps;
  };
  
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>(generateWorkflowSteps());
  
  // Calculate progress percentage
  const calculateProgress = (): number => {
    const requiredSteps = workflowSteps.filter(step => step.required);
    if (requiredSteps.length === 0) return 100;
    
    const completedSteps = requiredSteps.filter(step => 
      step.status === 'approved' || step.status === 'rejected'
    );
    
    return Math.round((completedSteps.length / requiredSteps.length) * 100);
  };
  
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'critical':
        return <Badge className="bg-red-100 text-red-800">Critical</Badge>;
      case 'high':
        return <Badge className="bg-amber-100 text-amber-800">High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-800">Low</Badge>;
      default:
        return null;
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge className="bg-gray-100 text-gray-800">Draft</Badge>;
      case 'in_review':
        return <Badge className="bg-blue-100 text-blue-800">In Review</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return null;
    }
  };
  
  const getStepStatusIcon = (status: ApprovalStatus) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'rejected':
        return <CircleX className="h-5 w-5 text-red-600" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-amber-600" />;
      case 'not_required':
        return <CheckCircle2 className="h-5 w-5 text-gray-400" />;
      default:
        return null;
    }
  };
  
  const submitForApproval = () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setStatus('in_review');
      if (onStatusChange) {
        onStatusChange('in_review');
      }
      toast.success("CAPA submitted for approval");
      setIsSubmitting(false);
    }, 1000);
  };
  
  const approveCAPA = () => {
    if (!approvalComment.trim()) {
      toast.error("Please provide approval comments");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      // Update the first pending step (in a real app, this would be the current user's step)
      const updatedSteps = [...workflowSteps];
      const pendingStepIndex = updatedSteps.findIndex(step => step.required && step.status === 'pending');
      
      if (pendingStepIndex !== -1) {
        updatedSteps[pendingStepIndex] = {
          ...updatedSteps[pendingStepIndex],
          status: 'approved',
          comments: approvalComment,
          approvedBy: 'John Doe (Current User)',
          approvedAt: new Date().toISOString()
        };
        
        setWorkflowSteps(updatedSteps);
        
        // Check if all required steps are approved
        const allApproved = updatedSteps
          .filter(step => step.required)
          .every(step => step.status === 'approved');
        
        if (allApproved) {
          setStatus('approved');
          if (onStatusChange) {
            onStatusChange('approved');
          }
          toast.success("All approvals complete - CAPA approved");
        } else {
          toast.success("Approval step completed");
        }
      }
      
      setApprovalComment('');
      setIsSubmitting(false);
    }, 1000);
  };
  
  const rejectCAPA = () => {
    if (!approvalComment.trim()) {
      toast.error("Please provide rejection reason");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      // Update the first pending step
      const updatedSteps = [...workflowSteps];
      const pendingStepIndex = updatedSteps.findIndex(step => step.required && step.status === 'pending');
      
      if (pendingStepIndex !== -1) {
        updatedSteps[pendingStepIndex] = {
          ...updatedSteps[pendingStepIndex],
          status: 'rejected',
          comments: approvalComment,
          approvedBy: 'John Doe (Current User)',
          approvedAt: new Date().toISOString()
        };
        
        setWorkflowSteps(updatedSteps);
        setStatus('rejected');
        if (onStatusChange) {
          onStatusChange('rejected');
        }
        toast.error("CAPA has been rejected");
      }
      
      setApprovalComment('');
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center text-base">
              <FileCheck className="h-5 w-5 mr-2 text-blue-600" />
              Approval Workflow
            </CardTitle>
            <CardDescription>
              CAPA {capaId}: {title}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {getPriorityBadge(priority)}
            {getStatusBadge(status)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-sm">Approval Progress</div>
          <div className="text-sm font-medium">{calculateProgress()}%</div>
        </div>
        <Progress value={calculateProgress()} className="h-2" />
        
        <div className="space-y-4 mt-4">
          {workflowSteps.map((step, index) => (
            <div key={step.id} className={step.required ? '' : 'opacity-50'}>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {getStepStatusIcon(step.status)}
                  <div className="ml-2">
                    <div className="text-sm font-medium">{step.name}</div>
                    <div className="text-xs text-gray-500">{step.role}</div>
                  </div>
                </div>
                <div>
                  {!step.required && (
                    <Badge variant="outline" className="text-xs">Not Required</Badge>
                  )}
                  {step.status === 'approved' && (
                    <Badge className="bg-green-100 text-green-800 text-xs">Approved</Badge>
                  )}
                  {step.status === 'rejected' && (
                    <Badge className="bg-red-100 text-red-800 text-xs">Rejected</Badge>
                  )}
                  {step.status === 'pending' && step.required && (
                    <Badge className="bg-amber-100 text-amber-800 text-xs">Pending</Badge>
                  )}
                </div>
              </div>
              
              {step.comments && (
                <div className="mt-2 text-xs bg-gray-50 p-2 rounded-md">
                  <div className="font-medium">Comments:</div>
                  <div>{step.comments}</div>
                  {step.approvedBy && step.approvedAt && (
                    <div className="mt-1 text-gray-500">
                      By {step.approvedBy} on {new Date(step.approvedAt).toLocaleString()}
                    </div>
                  )}
                </div>
              )}
              
              {index < workflowSteps.length - 1 && <Separator className="my-3" />}
            </div>
          ))}
        </div>
        
        {status === 'draft' && (
          <div className="mt-4">
            <Alert>
              <FileWarning className="h-4 w-4" />
              <AlertTitle>Ready for Review</AlertTitle>
              <AlertDescription>
                This CAPA is in draft status. Submit it for approval to start the workflow process.
              </AlertDescription>
            </Alert>
            
            <div className="flex justify-end mt-4">
              <Button 
                onClick={submitForApproval} 
                disabled={isSubmitting}
                className="flex items-center"
              >
                <Users className="h-4 w-4 mr-2" />
                Submit for Approval
              </Button>
            </div>
          </div>
        )}
        
        {status === 'in_review' && (
          <div className="mt-4 space-y-4">
            <Alert className="bg-blue-50 border-blue-200">
              <UserCheck className="h-4 w-4" />
              <AlertTitle>Awaiting Your Approval</AlertTitle>
              <AlertDescription>
                This CAPA requires your review and approval as {workflowSteps.find(step => step.required && step.status === 'pending')?.role}.
              </AlertDescription>
            </Alert>
            
            <div>
              <div className="flex items-center mb-2">
                <LockKeyhole className="h-4 w-4 mr-2 text-amber-600" />
                <p className="text-sm font-medium">Electronic Signature Required (21 CFR Part 11 Compliant)</p>
              </div>
              <Textarea
                placeholder="Enter your approval comments or rejection reason..."
                value={approvalComment}
                onChange={(e) => setApprovalComment(e.target.value)}
                className="min-h-[80px]"
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={rejectCAPA} 
                disabled={isSubmitting}
                className="flex items-center text-red-600"
              >
                <CircleX className="h-4 w-4 mr-2" />
                Reject
              </Button>
              <Button 
                onClick={approveCAPA} 
                disabled={isSubmitting}
                className="flex items-center"
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Approve
              </Button>
            </div>
          </div>
        )}
        
        {status === 'approved' && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Fully Approved</AlertTitle>
            <AlertDescription>
              This CAPA has been approved by all required signatories and is now active.
            </AlertDescription>
          </Alert>
        )}
        
        {status === 'rejected' && (
          <Alert className="bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>CAPA Rejected</AlertTitle>
            <AlertDescription>
              This CAPA has been rejected and needs revision before resubmission.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="text-xs text-gray-500 border-t pt-4">
        <div className="flex items-center">
          <LockKeyhole className="h-3 w-3 mr-1" />
          All approval actions are logged for compliance with 21 CFR Part 11
        </div>
      </CardFooter>
    </Card>
  );
};

export default CAPAWorkflowEngine;
