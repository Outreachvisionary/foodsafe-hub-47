
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Document } from '@/types/document';

interface DocumentApprovalRequirementsProps {
  document: Document;
}

const DocumentApprovalRequirements: React.FC<DocumentApprovalRequirementsProps> = ({ document }) => {
  // Define the approval requirements based on document category
  const getRequirements = (category: string) => {
    switch (category) {
      case 'SOP':
        return [
          { name: 'Quality Manager Approval', required: true, met: false },
          { name: 'Department Head Approval', required: true, met: false },
          { name: 'Compliance Check', required: true, met: false },
          { name: 'Training Reference', required: false, met: false }
        ];
      case 'Policy':
        return [
          { name: 'Executive Approval', required: true, met: false },
          { name: 'Legal Review', required: true, met: false },
          { name: 'Regulatory Compliance', required: true, met: false }
        ];
      case 'Form':
        return [
          { name: 'Form Structure Check', required: true, met: false },
          { name: 'Data Fields Validation', required: true, met: false },
          { name: 'Department Approval', required: true, met: false }
        ];
      default:
        return [
          { name: 'Quality Check', required: true, met: false },
          { name: 'Content Review', required: true, met: false },
          { name: 'Manager Approval', required: true, met: false }
        ];
    }
  };
  
  // In a real app, we would check if requirements are met by querying approvals
  // For this demo, we'll simulate some requirements being met
  const requirements = getRequirements(document.category).map((req, index) => {
    // Simulate some requirements being met based on odd/even index
    return { ...req, met: index % 2 === 0 };
  });
  
  // Calculate completion percentage
  const completedCount = requirements.filter(r => r.met).length;
  const requiredCount = requirements.filter(r => r.required).length;
  const completionPercentage = Math.round((completedCount / requiredCount) * 100);
  
  // Determine overall status
  const allRequiredMet = requirements.filter(r => r.required).every(r => r.met);
  
  return (
    <Card className="mt-4">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Approval Requirements</h3>
            <Badge 
              variant={allRequiredMet ? "default" : "outline"}
              className={allRequiredMet 
                ? "bg-green-100 text-green-800" 
                : "bg-amber-100 text-amber-800"
              }
            >
              {allRequiredMet ? "All Requirements Met" : `${completionPercentage}% Complete`}
            </Badge>
          </div>
          
          <div className="space-y-2">
            {requirements.map((req, index) => (
              <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                <div className="flex items-center gap-2">
                  {req.met ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    req.required ? (
                      <XCircle className="h-4 w-4 text-red-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                    )
                  )}
                  <span>{req.name}</span>
                  {req.required ? (
                    <Badge variant="outline" className="text-xs">Required</Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs bg-gray-100">Optional</Badge>
                  )}
                </div>
                <Badge 
                  variant="outline" 
                  className={req.met 
                    ? "bg-green-100 text-green-800" 
                    : "bg-gray-100 text-gray-800"
                  }
                >
                  {req.met ? "Complete" : "Pending"}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentApprovalRequirements;
