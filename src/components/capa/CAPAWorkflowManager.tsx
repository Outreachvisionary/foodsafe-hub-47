
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Play, 
  Pause, 
  RotateCcw,
  Users,
  FileCheck,
  Calendar
} from 'lucide-react';
import { CAPA } from '@/types/capa';
import { WorkflowStep, initiateWorkflow, advanceWorkflow, getWorkflowConfig } from '@/services/capaWorkflowService';
import { toast } from 'sonner';

interface CAPAWorkflowManagerProps {
  capa: CAPA;
  onWorkflowUpdate: () => void;
}

const CAPAWorkflowManager: React.FC<CAPAWorkflowManagerProps> = ({
  capa,
  onWorkflowUpdate
}) => {
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([]);
  const [showActionDialog, setShowActionDialog] = useState(false);
  const [selectedStep, setSelectedStep] = useState<WorkflowStep | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject'>('approve');
  const [comments, setComments] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const workflowConfig = getWorkflowConfig(capa.priority, capa.source);

  useEffect(() => {
    loadWorkflowSteps();
  }, [capa.id]);

  const loadWorkflowSteps = async () => {
    // This would typically fetch workflow steps from the database
    // For now, generating mock steps based on the CAPA
    const mockSteps: WorkflowStep[] = [
      {
        id: 'investigation',
        name: 'Root Cause Investigation',
        status: capa.root_cause ? 'approved' : 'pending',
        assignedTo: capa.assigned_to || 'Unassigned',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        required: true,
        completedAt: capa.root_cause ? capa.updated_at : undefined
      },
      {
        id: 'approval',
        name: 'Management Approval',
        status: workflowConfig.requiresApproval ? 'pending' : 'skipped',
        assignedTo: 'Quality Manager',
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        required: workflowConfig.requiresApproval
      },
      {
        id: 'implementation',
        name: 'Action Implementation',
        status: capa.corrective_action ? 'approved' : 'pending',
        assignedTo: capa.assigned_to || 'Unassigned',
        dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
        required: true,
        completedAt: capa.corrective_action ? capa.updated_at : undefined
      },
      {
        id: 'verification',
        name: 'Effectiveness Verification',
        status: capa.effectiveness_verified ? 'approved' : 'pending',
        assignedTo: 'Quality Manager',
        dueDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString(),
        required: true,
        completedAt: capa.effectiveness_verified ? capa.verification_date : undefined
      }
    ];

    setWorkflowSteps(mockSteps);
  };

  const calculateProgress = (): number => {
    const requiredSteps = workflowSteps.filter(step => step.required);
    if (requiredSteps.length === 0) return 100;
    
    const completedSteps = requiredSteps.filter(step => 
      step.status === 'approved' || step.status === 'skipped'
    );
    
    return Math.round((completedSteps.length / requiredSteps.length) * 100);
  };

  const handleInitiateWorkflow = async () => {
    setIsProcessing(true);
    try {
      await initiateWorkflow(capa.id);
      await loadWorkflowSteps();
      onWorkflowUpdate();
      toast.success('Workflow initiated successfully');
    } catch (error) {
      toast.error('Failed to initiate workflow');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStepAction = async () => {
    if (!selectedStep) return;

    setIsProcessing(true);
    try {
      await advanceWorkflow(capa.id, selectedStep.id, actionType, comments);
      await loadWorkflowSteps();
      onWorkflowUpdate();
      setShowActionDialog(false);
      setComments('');
      toast.success(`Step ${actionType}ed successfully`);
    } catch (error) {
      toast.error('Failed to process step');
    } finally {
      setIsProcessing(false);
    }
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'rejected':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-amber-600" />;
      case 'skipped':
        return <CheckCircle2 className="h-5 w-5 text-gray-400" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStepBadge = (status: string) => {
    const variants = {
      'approved': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800',
      'pending': 'bg-amber-100 text-amber-800',
      'skipped': 'bg-gray-100 text-gray-800'
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const isOverdue = (dueDate: string): boolean => {
    return new Date(dueDate) < new Date();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-blue-600" />
            Workflow Manager
          </div>
          <div className="flex items-center gap-2">
            {workflowConfig.requiresApproval && (
              <Badge variant="outline" className="text-xs">
                Approval Required
              </Badge>
            )}
            {workflowConfig.autoAdvance && (
              <Badge variant="outline" className="text-xs">
                Auto-Advance
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Overview */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Workflow Progress</span>
            <span className="font-medium">{calculateProgress()}%</span>
          </div>
          <Progress value={calculateProgress()} className="h-2" />
        </div>

        {/* Workflow Actions */}
        <div className="flex gap-2">
          <Button 
            size="sm" 
            onClick={handleInitiateWorkflow}
            disabled={isProcessing}
            className="flex items-center gap-2"
          >
            <Play className="h-4 w-4" />
            Initiate Workflow
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={loadWorkflowSteps}
            disabled={isProcessing}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        {/* Workflow Steps */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm">Workflow Steps</h4>
          {workflowSteps.map((step, index) => (
            <div key={step.id} className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {getStepIcon(step.status)}
                  <div className="flex-1">
                    <div className="font-medium text-sm">{step.name}</div>
                    <div className="text-xs text-muted-foreground">
                      Assigned to: {step.assignedTo}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      Due: {new Date(step.dueDate).toLocaleDateString()}
                      {isOverdue(step.dueDate) && step.status === 'pending' && (
                        <Badge className="bg-red-100 text-red-800 text-xs">Overdue</Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStepBadge(step.status)}
                  {step.status === 'pending' && step.required && (
                    <div className="flex gap-1">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setSelectedStep(step);
                          setActionType('approve');
                          setShowActionDialog(true);
                        }}
                      >
                        Approve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setSelectedStep(step);
                          setActionType('reject');
                          setShowActionDialog(true);
                        }}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              
              {step.completedAt && (
                <div className="text-xs text-muted-foreground ml-8">
                  Completed on: {new Date(step.completedAt).toLocaleString()}
                </div>
              )}
              
              {index < workflowSteps.length - 1 && <Separator />}
            </div>
          ))}
        </div>

        {/* Configuration Info */}
        <Alert>
          <Users className="h-4 w-4" />
          <AlertDescription>
            <strong>Workflow Configuration:</strong> Priority-based workflow with{' '}
            {workflowConfig.requiresApproval ? 'approval required' : 'no approval required'}.
            {workflowConfig.autoAdvance && ' Auto-advance enabled.'}
          </AlertDescription>
        </Alert>

        {/* Action Dialog */}
        <Dialog open={showActionDialog} onOpenChange={setShowActionDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {actionType === 'approve' ? 'Approve' : 'Reject'} Workflow Step
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <div className="font-medium">{selectedStep?.name}</div>
                <div className="text-sm text-muted-foreground">
                  Assigned to: {selectedStep?.assignedTo}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Comments</label>
                <Textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder={`Enter ${actionType} comments...`}
                  className="mt-1"
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowActionDialog(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleStepAction}
                  disabled={isProcessing || !comments.trim()}
                  className={actionType === 'reject' ? 'bg-red-600 hover:bg-red-700' : ''}
                >
                  {actionType === 'approve' ? 'Approve' : 'Reject'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default CAPAWorkflowManager;
