
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Document, DocumentCategory } from '@/types/document';
import { documentWorkflowService } from '@/services/documentWorkflowService';
import { User, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface DocumentApprovalRequirementsProps {
  document: Document;
}

const DocumentApprovalRequirements: React.FC<DocumentApprovalRequirementsProps> = ({ document }) => {
  const approvalRule = documentWorkflowService.getApprovalRule(document.category);
  const isOverdue = documentWorkflowService.isApprovalOverdue(document);
  
  return (
    <Card className="mt-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <User className="h-4 w-4 text-blue-500" />
          Required Approvers
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {approvalRule.requiredApprovers.map((role, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <span>{role}</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {index === 0 ? 'Current Approver' : `Step ${index + 1}`}
              </Badge>
            </div>
          ))}
          
          <div className="mt-4 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">Escalation Threshold</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {approvalRule.escalationThresholdDays} days
              </Badge>
            </div>
            
            {isOverdue && (
              <div className="mt-3 flex items-center gap-2 p-2 bg-red-50 rounded-md text-red-700">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm">
                  Approval is overdue. Escalated to {approvalRule.escalationTargets.join(', ')}.
                </span>
              </div>
            )}
            
            {document.status === 'Approved' && (
              <div className="mt-3 flex items-center gap-2 p-2 bg-green-50 rounded-md text-green-700">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">
                  Document has been approved
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentApprovalRequirements;
