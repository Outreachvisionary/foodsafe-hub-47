import React from 'react';
import { DocumentWorkflowStep } from '@/types/document';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CheckCircle, FileCheck, User } from 'lucide-react';

interface ApprovalRequirementsProps {
  workflowSteps: DocumentWorkflowStep[];
}

const ApprovalRequirements: React.FC<ApprovalRequirementsProps> = ({ workflowSteps }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Approval Requirements</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y divide-border">
          {workflowSteps.map((step, index) => (
            <li key={step.id} className="px-4 py-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-foreground">{step.name}</h3>
                  <p className="text-xs text-foreground-muted mt-1">{step.description}</p>
                  <div className="flex items-center mt-2 space-x-2">
                    {step.approvers.map((approver, approverIndex) => (
                      <Avatar key={approverIndex} className="h-5 w-5">
                        <AvatarImage src={`https://avatar.vercel.sh/${approver}.png`} />
                        <AvatarFallback>{approver.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    ))}
                    {step.approvers.length === 0 && (
                      <div className="flex items-center text-xs text-foreground-muted">
                        <User className="h-3 w-3 mr-1" />
                        No approvers assigned
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center text-xs text-green-500">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Approved
                </div>
              </div>
            </li>
          ))}
        </ul>
        {workflowSteps.length === 0 && (
          <div className="p-4 text-center text-foreground-muted">
            No approval steps defined.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ApprovalRequirements;
