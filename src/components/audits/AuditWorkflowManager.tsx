
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { CheckCircle, Clock, AlertTriangle, User, FileText } from 'lucide-react';

interface WorkflowStep {
  id: string;
  name: string;
  status: 'pending' | 'in-progress' | 'completed' | 'rejected';
  assignedTo: string;
  dueDate: string;
  completedAt?: string;
  comments?: string;
  required: boolean;
}

interface AuditWorkflowManagerProps {
  auditId: string;
  currentStep: number;
  steps: WorkflowStep[];
  onStepUpdate: (stepId: string, status: string, comments?: string) => void;
}

const AuditWorkflowManager: React.FC<AuditWorkflowManagerProps> = ({
  auditId,
  currentStep,
  steps,
  onStepUpdate
}) => {
  const { toast } = useToast();
  const [selectedStep, setSelectedStep] = useState<string | null>(null);
  const [comments, setComments] = useState('');
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'complete'>('complete');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'rejected':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStepAction = (stepId: string) => {
    if (!comments.trim() && actionType === 'reject') {
      toast({
        title: "Comments Required",
        description: "Please provide comments when rejecting a step",
        variant: "destructive"
      });
      return;
    }

    const newStatus = actionType === 'reject' ? 'rejected' : 'completed';
    onStepUpdate(stepId, newStatus, comments);
    
    toast({
      title: "Step Updated",
      description: `Audit step has been ${actionType}d successfully`
    });

    setSelectedStep(null);
    setComments('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Audit Workflow Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`border rounded-lg p-4 ${
                selectedStep === step.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusIcon(step.status)}
                    <h4 className="font-medium">{step.name}</h4>
                    <Badge className={getStatusColor(step.status)}>
                      {step.status.replace('-', ' ')}
                    </Badge>
                    {step.required && (
                      <Badge variant="outline" className="text-xs">Required</Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{step.assignedTo}</span>
                    </div>
                    <span>Due: {new Date(step.dueDate).toLocaleDateString()}</span>
                  </div>

                  {step.comments && (
                    <div className="bg-gray-50 p-2 rounded text-sm">
                      <strong>Comments:</strong> {step.comments}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  {step.status === 'pending' && (
                    <Button
                      size="sm"
                      onClick={() => setSelectedStep(step.id)}
                      disabled={index > currentStep}
                    >
                      Take Action
                    </Button>
                  )}
                  {step.status === 'in-progress' && (
                    <Button
                      size="sm"
                      onClick={() => setSelectedStep(step.id)}
                    >
                      Update
                    </Button>
                  )}
                </div>
              </div>

              {selectedStep === step.id && (
                <div className="mt-4 p-4 border-t space-y-3">
                  <div>
                    <label className="text-sm font-medium">Action</label>
                    <Select value={actionType} onValueChange={(value: any) => setActionType(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="complete">Complete Step</SelectItem>
                        <SelectItem value="approve">Approve</SelectItem>
                        <SelectItem value="reject">Reject</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Comments</label>
                    <Textarea
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      placeholder="Enter comments about this step..."
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleStepAction(step.id)}
                    >
                      Submit {actionType}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedStep(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AuditWorkflowManager;
