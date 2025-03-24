
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Document } from '@/types/document';
import { documentWorkflowService } from '@/services/documentWorkflowService';
import { ClipboardList, AlertTriangle, CheckCircle2, Info } from 'lucide-react';

interface DocumentApprovalRequirementsProps {
  document: Document;
}

const DocumentApprovalRequirements: React.FC<DocumentApprovalRequirementsProps> = ({ document }) => {
  const requiredApprovers = documentWorkflowService.getRequiredApprovers(document.category);
  const rule = documentWorkflowService.getApprovalRule(document.category);
  
  const isOverdue = documentWorkflowService.isApprovalOverdue(document);
  
  return (
    <Card className="mt-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-blue-500" />
          Approval Requirements
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Required Approvers</h4>
          <div className="flex flex-wrap gap-2">
            {requiredApprovers.map((role) => (
              <Badge key={role} variant="outline" className="bg-blue-50 text-blue-700">
                {role}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Approval Rules</h4>
          <div className="space-y-1 text-sm">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-500 mt-0.5" />
              <p>Approval must be completed by all required approvers</p>
            </div>
            
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />
              <p>Escalation after {rule.escalationThresholdDays} days to {rule.escalationTargets.join(', ')}</p>
            </div>
            
            {isOverdue && (
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />
                <p className="text-red-600 font-medium">This document is overdue for approval!</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Document Status</h4>
          <div className="flex items-center space-x-2">
            {document.status === 'Pending Approval' ? (
              <>
                <span className="bg-yellow-100 p-1 rounded-full">
                  <AlertTriangle className="h-4 w-4 text-yellow-700" />
                </span>
                <span>Awaiting approval</span>
              </>
            ) : document.status === 'Approved' ? (
              <>
                <span className="bg-green-100 p-1 rounded-full">
                  <CheckCircle2 className="h-4 w-4 text-green-700" />
                </span>
                <span>Document approved</span>
              </>
            ) : (
              <>
                <span className="bg-gray-100 p-1 rounded-full">
                  <Info className="h-4 w-4 text-gray-700" />
                </span>
                <span>{document.status}</span>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentApprovalRequirements;
