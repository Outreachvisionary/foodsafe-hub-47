import React from 'react';
import { DocumentWorkflowStep } from '@/types/document';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface ApprovalRequirementsProps {
  steps: DocumentWorkflowStep[];
  currentStep?: number;
  approvals?: Record<string, string[]>;
}

const ApprovalRequirements: React.FC<ApprovalRequirementsProps> = ({ 
  steps, 
  currentStep = 0,
  approvals = {}
}) => {
  if (!steps || steps.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Approval Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No approval steps defined for this document.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Approval Requirements</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {steps.map((step, index) => {
            const isCurrentStep = index === currentStep;
            const isPastStep = index < currentStep;
            const stepApprovals = approvals[step.id] || [];
            const approvalCount = stepApprovals.length;
            const isComplete = approvalCount >= step.required_approvals;
            
            return (
              <div 
                key={step.id} 
                className={`p-4 ${isCurrentStep ? 'bg-muted/50' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="mt-0.5">
                      {isPastStep ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : isCurrentStep ? (
                        <Clock className="h-5 w-5 text-blue-500" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-gray-300" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">{step.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{step.description}</p>
                      
                      <div className="mt-2">
                        <Badge variant="outline" className="text-xs">
                          {approvalCount} of {step.required_approvals} approvals
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex -space-x-2">
                    {step.approvers.map((approver, i) => (
                      <Avatar key={i} className="h-6 w-6 border-2 border-background">
                        <AvatarImage src={`https://avatar.vercel.sh/${approver}.png`} />
                        <AvatarFallback className="text-xs">
                          {approver.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                </div>
                
                {stepApprovals.length > 0 && (
                  <div className="mt-3 pl-8">
                    <p className="text-xs font-medium mb-1">Approved by:</p>
                    <div className="flex flex-wrap gap-1">
                      {stepApprovals.map((approver, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {approver}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ApprovalRequirements;
