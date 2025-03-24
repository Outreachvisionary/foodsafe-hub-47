
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  User, 
  MessageSquare, 
  FileText,
  Users
} from 'lucide-react';
import { Document, DocumentStatus } from '@/types/document';
import { documentWorkflowService } from '@/services/documentWorkflowService';
import DocumentApprovalRequirements from './DocumentApprovalRequirements';

interface DocumentApproverProps {
  document: Document | null;
  onApprove: (doc: Document, comment: string) => void;
  onReject: (doc: Document, comment: string) => void;
}

const DocumentApprover: React.FC<DocumentApproverProps> = ({ 
  document, 
  onApprove, 
  onReject 
}) => {
  const [comment, setComment] = useState<string>('');
  const { toast } = useToast();

  const handleApprove = () => {
    if (!document) return;
    
    const approvedDoc = {
      ...document,
      status: 'Approved' as DocumentStatus,
      updatedAt: new Date().toISOString()
    };
    
    onApprove(approvedDoc, comment);
    
    toast({
      title: "Document approved",
      description: "The document has been approved successfully.",
    });
    
    setComment('');
  };

  const handleReject = () => {
    if (!document) return;
    
    const rejectedDoc = {
      ...document,
      status: 'Draft' as DocumentStatus,
      updatedAt: new Date().toISOString()
    };
    
    onReject(rejectedDoc, comment);
    
    toast({
      title: "Document rejected",
      description: "The document has been sent back for revision.",
    });
    
    setComment('');
  };

  if (!document) {
    return <div>No document selected for approval</div>;
  }

  const isOverdue = documentWorkflowService.isApprovalOverdue(document);
  const requiredApprovers = documentWorkflowService.getRequiredApprovers(document.category);

  return (
    <Card className="mt-6 animate-fade-in">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-500" />
          Document Approval
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 space-y-4">
          <div className={`flex justify-between items-center p-4 rounded-md border ${
            isOverdue ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'
          }`}>
            <div className="flex items-center gap-2">
              {isOverdue ? (
                <AlertCircle className="h-5 w-5 text-red-600" />
              ) : (
                <Clock className="h-5 w-5 text-yellow-600" />
              )}
              <div>
                <h4 className="font-medium">
                  {isOverdue ? 'Approval Overdue' : 'Awaiting Your Approval'}
                </h4>
                <p className="text-sm text-gray-600">
                  {isOverdue 
                    ? 'This document has exceeded the approval deadline'
                    : 'You need to approve or reject this document'
                  }
                </p>
              </div>
            </div>
            <Badge variant="outline" className={`
              ${isOverdue ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}
            `}>
              {isOverdue ? 'Overdue' : 'Pending Approval'}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-md border border-blue-200">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">
                Required approvers for {document.category}: {requiredApprovers.join(', ')}
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">Review Comments</h4>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add your comments or feedback here..."
              className="min-h-[100px]"
            />
          </div>
          
          <div className="pt-4 flex gap-4">
            <Button 
              variant="outline" 
              onClick={handleReject}
              className="flex items-center gap-2 border-red-200 text-red-600 hover:bg-red-50"
            >
              <AlertCircle className="h-4 w-4" />
              Reject & Request Changes
            </Button>
            <Button 
              onClick={handleApprove}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4" />
              Approve Document
            </Button>
          </div>
        </div>
        
        <div className="border-t pt-4">
          <h4 className="font-medium mb-2">Approval History</h4>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 rounded-full p-1 mt-1">
                <User className="h-4 w-4 text-blue-700" />
              </div>
              <div>
                <div className="flex items-center">
                  <span className="font-medium">Jane Smith (Quality Manager)</span>
                  <span className="text-gray-500 text-sm ml-2">• 5 days ago</span>
                </div>
                <p className="text-sm text-gray-700">Approved version 2 of this document.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-red-100 rounded-full p-1 mt-1">
                <User className="h-4 w-4 text-red-700" />
              </div>
              <div>
                <div className="flex items-center">
                  <span className="font-medium">John Doe (Compliance Officer)</span>
                  <span className="text-gray-500 text-sm ml-2">• 7 days ago</span>
                </div>
                <p className="text-sm text-gray-700">Requested changes to version 1: "Please update section 3 with the latest requirements."</p>
              </div>
            </div>
          </div>
        </div>
        
        <DocumentApprovalRequirements document={document} />
      </CardContent>
    </Card>
  );
};

export default DocumentApprover;
