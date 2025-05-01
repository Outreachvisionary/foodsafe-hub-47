
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getMockDocumentWorkflowSteps } from '@/services/mockDataService';
import { DocumentWorkflowStep } from '@/services/documentWorkflowService';

interface ApprovalRequirementsProps {
  documentId?: string;
}

const ApprovalRequirements: React.FC<ApprovalRequirementsProps> = ({ documentId }) => {
  // This would fetch real data in a production environment
  const steps = getMockDocumentWorkflowSteps();
  
  const getStepIcon = (completed: boolean) => {
    if (completed) {
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    }
    return <Circle className="h-5 w-5 text-gray-300" />;
  };
  
  const getStatusBadge = (step: DocumentWorkflowStep) => {
    if (!step.status) return null;
    
    if (step.status === 'Rejected') {
      return <Badge variant="destructive">Rejected</Badge>;
    } else if (step.status === 'Approved') {
      return <Badge variant="success">Approved</Badge>;
    } else if (step.status === 'Pending') {
      return <Badge variant="outline">Pending</Badge>;
    }
    return null;
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Approval Requirements</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {steps.map((step) => (
          <div key={step.id} className="flex items-start">
            <div className="mr-3 mt-0.5">
              {getStepIcon(step.completed)}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{step.name}</h4>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
                {getStatusBadge(step)}
              </div>
              
              {step.approvers && step.approvers.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs text-muted-foreground mb-1">Approvers:</p>
                  <div className="flex -space-x-2">
                    {step.approvers.map((approver, index) => (
                      <Avatar key={index} className="border-2 border-background h-6 w-6">
                        <AvatarFallback>{approver.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ApprovalRequirements;
