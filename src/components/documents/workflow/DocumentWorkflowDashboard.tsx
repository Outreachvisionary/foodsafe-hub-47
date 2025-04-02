
import React, { useState, useEffect } from 'react';
import { useDocuments } from '@/contexts/DocumentContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Document, DocumentWorkflow } from '@/types/document';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ClipboardCheck, AlertTriangle, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { WorkflowDocumentCard } from './WorkflowDocumentCard';
import { ApprovalStepEditor } from './ApprovalStepEditor';
import { WorkflowTemplatesList } from './WorkflowTemplatesList';
import { WorkflowStep } from './WorkflowStep';

export const DocumentWorkflowDashboard: React.FC = () => {
  const { documents, fetchDocuments, workflowTemplates } = useDocuments();
  const [pendingApprovalDocs, setPendingApprovalDocs] = useState<Document[]>([]);
  const [expiringDocs, setExpiringDocs] = useState<Document[]>([]);
  const [myApprovalsDocs, setMyApprovalsDocs] = useState<Document[]>([]);
  const [showWorkflowEditor, setShowWorkflowEditor] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<DocumentWorkflow | null>(null);

  // Filter documents based on workflow status
  useEffect(() => {
    // Filter pending approval documents
    const pending = documents.filter(doc => doc.status === 'Pending Approval');
    setPendingApprovalDocs(pending);

    // Filter expiring documents (within 30 days)
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);
    
    const expiring = documents.filter(doc => {
      if (!doc.expiry_date) return false;
      const expiryDate = new Date(doc.expiry_date);
      return expiryDate > today && expiryDate <= thirtyDaysFromNow;
    });
    setExpiringDocs(expiring);

    // In a real application, we would filter approvals for the current user
    // For now, just show the first 5 pending approval documents
    setMyApprovalsDocs(pending.slice(0, 5));
  }, [documents]);

  const handleCreateWorkflow = () => {
    setSelectedWorkflow(null);
    setShowWorkflowEditor(true);
  };

  const handleEditWorkflow = (workflow: DocumentWorkflow) => {
    setSelectedWorkflow(workflow);
    setShowWorkflowEditor(true);
  };

  return (
    <div className="space-y-6">
      {showWorkflowEditor ? (
        <ApprovalStepEditor 
          workflow={selectedWorkflow}
          onSave={() => {
            setShowWorkflowEditor(false);
            // In a real app, we would refresh the workflows here
          }}
          onCancel={() => setShowWorkflowEditor(false)}
        />
      ) : (
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="mb-4">
            <TabsTrigger value="pending" className="flex items-center gap-1">
              <ClipboardCheck className="h-4 w-4" />
              Pending Approval
              <Badge variant="secondary" className="ml-1">{pendingApprovalDocs.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="my-approvals" className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4" />
              My Approvals
              <Badge variant="secondary" className="ml-1">{myApprovalsDocs.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="expiring" className="flex items-center gap-1">
              <AlertTriangle className="h-4 w-4" />
              Expiring Soon
              <Badge variant="secondary" className="ml-1">{expiringDocs.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="workflow-templates" className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Workflow Templates
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <ClipboardCheck className="h-5 w-5 mr-2" />
                  Documents Pending Approval
                </CardTitle>
                <CardDescription>
                  {pendingApprovalDocs.length === 0 
                    ? 'No documents are currently awaiting approval' 
                    : `${pendingApprovalDocs.length} documents are waiting for approval`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pendingApprovalDocs.length > 0 ? (
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-4">
                      {pendingApprovalDocs.map(doc => (
                        <WorkflowDocumentCard 
                          key={doc.id} 
                          document={doc} 
                          showApprovalButtons={true} 
                        />
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 mx-auto text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">All Clear!</h3>
                    <p className="mt-1 text-muted-foreground">
                      There are no documents waiting for approval
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="my-approvals" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Documents Requiring Your Approval
                </CardTitle>
                <CardDescription>
                  {myApprovalsDocs.length === 0 
                    ? 'You have no documents awaiting your approval' 
                    : `${myApprovalsDocs.length} documents are waiting for your approval`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {myApprovalsDocs.length > 0 ? (
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-4">
                      {myApprovalsDocs.map(doc => (
                        <WorkflowDocumentCard 
                          key={doc.id} 
                          document={doc} 
                          showApprovalButtons={true} 
                          isPersonal={true}
                        />
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 mx-auto text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">All Clear!</h3>
                    <p className="mt-1 text-muted-foreground">
                      You have no documents waiting for your approval
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="expiring" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Documents Expiring Soon
                </CardTitle>
                <CardDescription>
                  {expiringDocs.length === 0 
                    ? 'No documents are expiring soon' 
                    : `${expiringDocs.length} documents will expire in the next 30 days`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {expiringDocs.length > 0 ? (
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-4">
                      {expiringDocs.map(doc => (
                        <WorkflowDocumentCard 
                          key={doc.id} 
                          document={doc} 
                          showExpiryActions={true}
                        />
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 mx-auto text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">No Expiring Documents</h3>
                    <p className="mt-1 text-muted-foreground">
                      All your documents are valid for more than 30 days
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="workflow-templates" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    Approval Workflow Templates
                  </CardTitle>
                  <CardDescription>
                    Configure and manage document approval workflow templates
                  </CardDescription>
                </div>
                <Button onClick={handleCreateWorkflow}>
                  Create New Workflow
                </Button>
              </CardHeader>
              <CardContent>
                <WorkflowTemplatesList 
                  templates={workflowTemplates || []} 
                  onEdit={handleEditWorkflow}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};
