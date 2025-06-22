
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Workflow, 
  Plus, 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Users,
  Settings
} from 'lucide-react';
import { useModuleRelationships } from '@/hooks/useModuleRelationships';
import RelationshipViewer from '@/components/shared/RelationshipViewer';
import WorkflowOrchestrationService, { WorkflowTemplate } from '@/services/workflowOrchestrationService';
import { toast } from 'sonner';

interface EnhancedAuditWorkflowManagerProps {
  auditId: string;
  auditTitle: string;
  currentStatus: string;
  findings: any[];
  onWorkflowUpdate: () => void;
}

const EnhancedAuditWorkflowManager: React.FC<EnhancedAuditWorkflowManagerProps> = ({
  auditId,
  auditTitle,
  currentStatus,
  findings,
  onWorkflowUpdate
}) => {
  const [showWorkflowDialog, setShowWorkflowDialog] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowTemplate | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const { relationships } = useModuleRelationships(auditId, 'audit');
  const availableWorkflows = WorkflowOrchestrationService.getAvailableWorkflows();

  const handleExecuteWorkflow = async (workflowId: string, findingId: string) => {
    setIsExecuting(true);
    try {
      const finding = findings.find(f => f.id === findingId);
      const success = await WorkflowOrchestrationService.executeWorkflow(workflowId, findingId, {
        title: finding?.description || 'Audit Finding',
        description: finding?.details || '',
        severity: finding?.severity || 'medium',
        userId: 'current-user',
        source: 'Audit Finding'
      });

      if (success) {
        onWorkflowUpdate();
        setShowWorkflowDialog(false);
      }
    } catch (error) {
      toast.error('Failed to execute workflow');
    } finally {
      setIsExecuting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-gray-400" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
    }
  };

  const criticalFindings = findings.filter(f => f.severity === 'critical' || f.severity === 'major');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Workflow className="h-5 w-5" />
              Enhanced Audit Workflow Manager
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => setShowWorkflowDialog(true)}
                disabled={criticalFindings.length === 0}
              >
                <Plus className="h-4 w-4 mr-2" />
                Initiate Workflow
              </Button>
              <Button size="sm" variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Configure
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="relationships">Related Items</TabsTrigger>
              <TabsTrigger value="workflows">Active Workflows</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Findings</p>
                        <p className="text-2xl font-bold">{findings.length}</p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Critical/Major</p>
                        <p className="text-2xl font-bold text-red-600">{criticalFindings.length}</p>
                      </div>
                      <AlertTriangle className="h-8 w-8 text-red-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Related Items</p>
                        <p className="text-2xl font-bold">{relationships.length}</p>
                      </div>
                      <Users className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {criticalFindings.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Critical/Major Findings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {criticalFindings.map((finding) => (
                        <div key={finding.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            {getStatusIcon('pending')}
                            <div>
                              <div className="font-medium">{finding.description}</div>
                              <div className="text-sm text-muted-foreground">
                                Severity: {finding.severity}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant={finding.severity === 'critical' ? 'destructive' : 'secondary'}>
                              {finding.severity}
                            </Badge>
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedWorkflow(availableWorkflows[0]);
                                setShowWorkflowDialog(true);
                              }}
                            >
                              Create NC
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="relationships">
              <RelationshipViewer
                sourceId={auditId}
                sourceType="audit"
                sourceTitle={auditTitle}
              />
            </TabsContent>

            <TabsContent value="workflows">
              <Card>
                <CardHeader>
                  <CardTitle>Active Workflows</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center text-muted-foreground py-8">
                    No active workflows
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Workflow Execution Dialog */}
      <Dialog open={showWorkflowDialog} onOpenChange={setShowWorkflowDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Initiate Workflow</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Available Workflows</h4>
              <div className="space-y-2">
                {availableWorkflows.map((workflow) => (
                  <div key={workflow.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h5 className="font-medium">{workflow.name}</h5>
                        <p className="text-sm text-muted-foreground mt-1">
                          {workflow.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline">{workflow.steps.length} steps</Badge>
                          <ArrowRight className="h-3 w-3 text-muted-foreground" />
                          <div className="text-xs text-muted-foreground">
                            {workflow.steps.map(s => s.name).join(' → ')}
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        disabled={isExecuting || criticalFindings.length === 0}
                        onClick={() => {
                          if (criticalFindings.length > 0) {
                            handleExecuteWorkflow(workflow.id, criticalFindings[0].id);
                          }
                        }}
                      >
                        {isExecuting ? 'Executing...' : 'Execute'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnhancedAuditWorkflowManager;
