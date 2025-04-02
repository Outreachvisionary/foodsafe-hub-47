
import React from 'react';
import { DocumentWorkflow } from '@/types/document';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Copy, Trash, Users } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface WorkflowTemplatesListProps {
  templates: DocumentWorkflow[];
  onEdit: (workflow: DocumentWorkflow) => void;
  onDuplicate?: (workflow: DocumentWorkflow) => void;
  onDelete?: (workflowId: string) => void;
}

export const WorkflowTemplatesList: React.FC<WorkflowTemplatesListProps> = ({
  templates,
  onEdit,
  onDuplicate,
  onDelete
}) => {
  const { toast } = useToast();

  const handleDuplicate = (workflow: DocumentWorkflow) => {
    if (onDuplicate) {
      onDuplicate(workflow);
    } else {
      toast({
        title: "Duplicate Workflow",
        description: `Duplicated "${workflow.name}" workflow template`,
      });
    }
  };

  const handleDelete = (workflowId: string, workflowName: string) => {
    if (onDelete) {
      onDelete(workflowId);
    } else {
      toast({
        title: "Delete Workflow",
        description: `Deleted "${workflowName}" workflow template`,
      });
    }
  };

  if (templates.length === 0) {
    return (
      <div className="text-center py-16">
        <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No Workflow Templates</h3>
        <p className="text-muted-foreground mt-1 mb-6">
          Create your first approval workflow template to streamline document reviews
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {templates.map(workflow => (
        <Card key={workflow.id}>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex-1">
                <h4 className="text-lg font-medium">
                  {workflow.name}
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {workflow.description || 'No description available'}
                </p>
                
                <div className="mt-3">
                  <div className="flex items-center text-sm">
                    <span className="text-muted-foreground mr-2">Steps:</span>
                    <Badge variant="outline">{workflow.steps.length}</Badge>
                  </div>
                  
                  {workflow.created_at && (
                    <div className="flex items-center text-sm mt-1">
                      <span className="text-muted-foreground mr-2">Created:</span>
                      <span>
                        {formatDistanceToNow(new Date(workflow.created_at))} ago 
                        by {workflow.created_by}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-2 mt-3">
                    {workflow.steps.map((step, index) => (
                      <Badge key={step.id} variant="secondary">
                        {index + 1}. {step.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-row md:flex-col gap-2 justify-end">
                <Button 
                  variant="default" 
                  onClick={() => onEdit(workflow)}
                  className="flex items-center gap-1"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
                {onDuplicate && (
                  <Button 
                    variant="outline" 
                    onClick={() => handleDuplicate(workflow)}
                    className="flex items-center gap-1"
                  >
                    <Copy className="h-4 w-4" />
                    Duplicate
                  </Button>
                )}
                {onDelete && (
                  <Button 
                    variant="outline" 
                    onClick={() => handleDelete(workflow.id, workflow.name)}
                    className="flex items-center gap-1 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash className="h-4 w-4" />
                    Delete
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
