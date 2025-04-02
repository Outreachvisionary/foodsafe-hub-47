
import React, { useState, useEffect } from 'react';
import { useDocuments } from '@/contexts/DocumentContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { WorkflowDocumentCard } from '@/components/documents/workflow/WorkflowDocumentCard';
import { WorkflowStep } from '@/components/documents/workflow/WorkflowStep';
import { format } from 'date-fns';
import { Document } from '@/types/document';
import { Clock, CheckCircle, AlertTriangle, XCircle, FileCheck, ClipboardCheck, Calendar } from 'lucide-react';

export const DocumentWorkflowDashboard: React.FC = () => {
  const { documents, setSelectedDocument } = useDocuments();
  const [activeTab, setActiveTab] = useState('pending');
  
  // Filter documents for different workflow states
  const pendingDocuments = documents.filter(doc => doc.approval_status === 'pending');
  const approvedDocuments = documents.filter(doc => doc.approval_status === 'approved');
  const rejectedDocuments = documents.filter(doc => doc.approval_status === 'rejected');
  
  // Mock workflow templates - in a real app these would come from the context or API
  const workflowTemplates = [
    { id: '1', name: 'Standard Document Approval', steps: 3 },
    { id: '2', name: 'Quality Manual Approval', steps: 5 },
    { id: '3', name: 'Policy Document Approval', steps: 4 },
  ];
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center">
              <Clock className="h-4 w-4 mr-2 text-amber-500" />
              Pending Approval
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingDocuments.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center">
              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
              Approved Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedDocuments.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center">
              <XCircle className="h-4 w-4 mr-2 text-red-500" />
              Rejected Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rejectedDocuments.length}</div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pending" className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>Pending</span>
            {pendingDocuments.length > 0 && (
              <Badge variant="secondary" className="ml-1">{pendingDocuments.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved" className="flex items-center gap-1">
            <CheckCircle className="h-4 w-4" />
            <span>Approved</span>
            {approvedDocuments.length > 0 && (
              <Badge variant="secondary" className="ml-1">{approvedDocuments.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="rejected" className="flex items-center gap-1">
            <XCircle className="h-4 w-4" />
            <span>Rejected</span>
            {rejectedDocuments.length > 0 && (
              <Badge variant="secondary" className="ml-1">{rejectedDocuments.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-1">
            <ClipboardCheck className="h-4 w-4" />
            <span>Workflow Templates</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending" className="pt-4">
          {pendingDocuments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingDocuments.map(doc => (
                <WorkflowDocumentCard 
                  key={doc.id}
                  document={doc}
                  status="pending"
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Clock className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                <h3 className="text-lg font-medium mb-1">No Pending Documents</h3>
                <p className="text-muted-foreground text-sm">
                  There are no documents pending approval at this time
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="approved" className="pt-4">
          {approvedDocuments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {approvedDocuments.map(doc => (
                <WorkflowDocumentCard 
                  key={doc.id}
                  document={doc}
                  status="approved"
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                <h3 className="text-lg font-medium mb-1">No Approved Documents</h3>
                <p className="text-muted-foreground text-sm">
                  There are no approved documents to display
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="rejected" className="pt-4">
          {rejectedDocuments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rejectedDocuments.map(doc => (
                <WorkflowDocumentCard 
                  key={doc.id}
                  document={doc}
                  status="rejected"
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <XCircle className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                <h3 className="text-lg font-medium mb-1">No Rejected Documents</h3>
                <p className="text-muted-foreground text-sm">
                  There are no rejected documents to display
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="templates" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Workflow Templates</CardTitle>
                </CardHeader>
                <CardContent>
                  {workflowTemplates.map(template => (
                    <div 
                      key={template.id}
                      className="p-3 border rounded-md mb-3 cursor-pointer hover:bg-accent/5"
                    >
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">{template.name}</h4>
                        <Badge variant="outline">{template.steps} steps</Badge>
                      </div>
                    </div>
                  ))}
                  
                  <Button variant="outline" className="w-full mt-2">
                    <ClipboardCheck className="h-4 w-4 mr-2" />
                    Create New Template
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Standard Document Approval</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <WorkflowStep
                      stepNumber={1}
                      title="Initial Review"
                      description="Document is reviewed by the department head for content accuracy"
                      role="Department Head"
                      deadline={2}
                    />
                    
                    <WorkflowStep
                      stepNumber={2}
                      title="Quality Assurance Check"
                      description="Document is reviewed for compliance with quality standards"
                      role="QA Manager"
                      deadline={3}
                    />
                    
                    <WorkflowStep
                      stepNumber={3}
                      title="Final Approval"
                      description="Document receives final approval from senior management"
                      role="Director"
                      deadline={2}
                    />
                    
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Document Release</AlertTitle>
                      <AlertDescription>
                        After approval, document will be automatically released and stakeholders notified.
                      </AlertDescription>
                    </Alert>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
