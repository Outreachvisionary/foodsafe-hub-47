import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader, Plus, UserPlus, CheckCircle, Clock } from 'lucide-react';
import documentWorkflowService from '@/services/documentWorkflowService';

interface ApprovalRequirementsProps {
  documentId: string;
  onUpdate?: () => void;
}

const ApprovalRequirements: React.FC<ApprovalRequirementsProps> = ({ 
  documentId,
  onUpdate
}) => {
  const [workflow, setWorkflow] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadWorkflowInstance = async () => {
      try {
        setLoading(true);
        const instance = await documentWorkflowService.getDocumentWorkflowInstance(documentId);
        setWorkflow(instance);
      } catch (err) {
        console.error('Error loading workflow instance:', err);
        setError('Failed to load approval requirements');
      } finally {
        setLoading(false);
      }
    };

    if (documentId) {
      loadWorkflowInstance();
    }
  }, [documentId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Approval Requirements</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-6">
            <Loader className="h-5 w-5 animate-spin text-primary mr-2" />
            <span>Loading approval requirements...</span>
          </div>
        ) : error ? (
          <div className="text-red-500 py-4">{error}</div>
        ) : !workflow ? (
          <div>
            <p className="text-muted-foreground mb-4">No approval workflow set for this document.</p>
            <Button size="sm" className="gap-1">
              <Plus className="h-4 w-4" />
              Add Approval Workflow
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">{workflow.workflow.name}</h4>
                <p className="text-sm text-muted-foreground">{workflow.workflow.description}</p>
              </div>
              <Badge variant="outline" className="px-2 py-1">
                Step {workflow.current_step + 1} of {workflow.workflow.steps.length}
              </Badge>
            </div>
            
            <div className="space-y-2">
              {workflow.workflow.steps.map((step: any, index: number) => (
                <div 
                  key={index}
                  className={`p-3 border rounded-md flex items-center justify-between ${
                    index === workflow.current_step 
                      ? 'bg-blue-50 border-blue-200' 
                      : index < workflow.current_step 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {index < workflow.current_step ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : index === workflow.current_step ? (
                      <Clock className="h-5 w-5 text-blue-500" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-gray-300 flex items-center justify-center">
                        {index + 1}
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{step.name}</p>
                      <p className="text-xs text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                  
                  {index === workflow.current_step && (
                    <Button variant="outline" size="sm">
                      <UserPlus className="h-4 w-4 mr-1" />
                      Assign
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ApprovalRequirements;
