
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  FileEdit, 
  CheckCircle, 
  Clock, 
  User, 
  FileText, 
  Filter,
  Search,
  Eye,
  X,
  AlertCircle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Document, DocumentStatus } from '@/types/document';
import { documentWorkflowService } from '@/services/documentWorkflowService';
import DocumentApprovalRequirements from './DocumentApprovalRequirements';

interface ApprovalItem {
  id: string;
  documentTitle: string;
  documentType: string;
  requestedBy: string;
  requestedDate: string;
  dueDate: string;
  stage: string;
  progress: number;
  avatarSrc?: string;
  document: Document; // Link to the actual document
}

// Sample documents for workflow demo
const generateSampleApprovals = (): { pending: ApprovalItem[], initiated: ApprovalItem[], completed: ApprovalItem[] } => {
  // Create sample document for SOP type
  const sopDocument: Document = {
    id: "sample-1",
    title: "Raw Material Receiving SOP",
    fileName: "raw_material_receiving_sop_v3.pdf",
    fileSize: 2456000,
    fileType: "application/pdf",
    category: "SOP",
    status: "Pending Approval",
    version: 3,
    createdBy: "John Doe",
    createdAt: "2023-04-15T10:30:00Z",
    updatedAt: "2023-06-20T14:15:00Z",
    expiryDate: "2024-06-20T14:15:00Z",
    linkedModule: "haccp",
    tags: ['receiving', 'materials', 'procedures'],
    pendingSince: "2023-06-21T10:00:00Z",
  };

  // Create sample document for Policy type
  const policyDocument: Document = {
    id: "sample-2",
    title: "Allergen Control Program",
    fileName: "allergen_control_program_v2.docx",
    fileSize: 1245000,
    fileType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    category: "Policy",
    status: "Pending Approval",
    version: 2,
    createdBy: "Jane Smith",
    createdAt: "2023-03-10T09:45:00Z",
    updatedAt: "2023-05-22T11:30:00Z",
    expiryDate: "2024-05-22T11:30:00Z",
    linkedModule: "haccp",
    tags: ['allergen', 'control', 'food safety'],
    pendingSince: "2023-05-25T09:45:00Z",
  };

  // Create sample document for Audit Report type
  const auditDocument: Document = {
    id: "sample-3",
    title: "Supplier Quality Audit Checklist",
    fileName: "supplier_quality_audit_checklist_v1.xlsx",
    fileSize: 985000,
    fileType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    category: "Audit Report",
    status: "Pending Approval",
    version: 1,
    createdBy: "Sarah Johnson",
    createdAt: "2023-05-05T13:20:00Z",
    updatedAt: "2023-05-05T13:20:00Z",
    expiryDate: "2024-05-05T13:20:00Z",
    linkedModule: "suppliers",
    tags: ['supplier', 'audit', 'checklist'],
    pendingSince: "2023-05-06T09:00:00Z",
  };

  // Create completed sample documents
  const completedSopDocument: Document = {
    ...sopDocument,
    id: "sample-4",
    title: "Sanitation Procedures - Production Line 1",
    status: "Approved",
    pendingSince: undefined,
  };

  const completedPolicyDocument: Document = {
    ...policyDocument,
    id: "sample-5",
    title: "Supplier Approval Process",
    status: "Approved",
    pendingSince: undefined,
  };

  // Generate approval items
  const pendingApprovals: ApprovalItem[] = [
    {
      id: '1',
      documentTitle: sopDocument.title,
      documentType: sopDocument.category,
      requestedBy: "John Doe",
      requestedDate: new Date(sopDocument.pendingSince || "").toISOString().split('T')[0],
      dueDate: '2023-10-25',
      stage: 'Awaiting Your Approval',
      progress: 50,
      avatarSrc: '',
      document: sopDocument
    },
    {
      id: '2',
      documentTitle: policyDocument.title,
      documentType: policyDocument.category,
      requestedBy: "Jane Smith",
      requestedDate: new Date(policyDocument.pendingSince || "").toISOString().split('T')[0],
      dueDate: '2023-10-22',
      stage: 'Awaiting Your Approval',
      progress: 75,
      avatarSrc: '',
      document: policyDocument
    },
    {
      id: '3',
      documentTitle: auditDocument.title,
      documentType: auditDocument.category,
      requestedBy: "Mike Brown",
      requestedDate: new Date(auditDocument.pendingSince || "").toISOString().split('T')[0],
      dueDate: '2023-10-20',
      stage: 'Awaiting Quality Manager',
      progress: 25,
      avatarSrc: '',
      document: auditDocument
    }
  ];

  const initiated: ApprovalItem[] = [
    {
      id: '4',
      documentTitle: "Environmental Monitoring Program",
      documentType: "SOP",
      requestedBy: "You",
      requestedDate: "2023-10-18",
      dueDate: "2023-10-28",
      stage: "Awaiting Department Head",
      progress: 25,
      avatarSrc: '',
      document: {
        ...sopDocument,
        id: "sample-6",
        title: "Environmental Monitoring Program",
      }
    },
    {
      id: '5',
      documentTitle: "HACCP Plan - Raw Materials v3",
      documentType: "HACCP Plan",
      requestedBy: "You",
      requestedDate: "2023-10-08",
      dueDate: "2023-10-18",
      stage: "Awaiting CEO Approval",
      progress: 75,
      avatarSrc: '',
      document: {
        ...sopDocument,
        id: "sample-7",
        title: "HACCP Plan - Raw Materials v3",
        category: "HACCP Plan",
      }
    }
  ];

  const completed: ApprovalItem[] = [
    {
      id: '6',
      documentTitle: completedSopDocument.title,
      documentType: completedSopDocument.category,
      requestedBy: "Sarah Johnson",
      requestedDate: "2023-09-25",
      dueDate: "2023-10-05",
      stage: "Published",
      progress: 100,
      avatarSrc: '',
      document: completedSopDocument
    },
    {
      id: '7',
      documentTitle: completedPolicyDocument.title,
      documentType: completedPolicyDocument.category,
      requestedBy: "You",
      requestedDate: "2023-09-20",
      dueDate: "2023-09-30",
      stage: "Published",
      progress: 100,
      avatarSrc: '',
      document: completedPolicyDocument
    }
  ];

  return { pending: pendingApprovals, initiated, completed };
};

const ApprovalWorkflow = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [approvalItems, setApprovalItems] = useState(() => generateSampleApprovals());
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handlePreviewDocument = (document: Document) => {
    setSelectedDocument(document);
    setIsPreviewOpen(true);
  };
  
  const handleOpenApproveDialog = (document: Document) => {
    setSelectedDocument(document);
    setIsApproveDialogOpen(true);
  };
  
  const handleOpenRejectDialog = (document: Document) => {
    setSelectedDocument(document);
    setIsRejectDialogOpen(true);
  };
  
  const handleApproveDocument = () => {
    if (!selectedDocument) return;
    
    // Update document status
    const updatedDocument = {
      ...selectedDocument,
      status: 'Approved' as DocumentStatus,
      updatedAt: new Date().toISOString()
    };
    
    // Remove from pending list and add to completed list
    const updatedPending = approvalItems.pending.filter(item => 
      item.document.id !== selectedDocument.id
    );
    
    const newCompletedItem: ApprovalItem = {
      id: `completed-${Date.now()}`,
      documentTitle: updatedDocument.title,
      documentType: updatedDocument.category,
      requestedBy: approvalItems.pending.find(item => item.document.id === selectedDocument.id)?.requestedBy || "Unknown",
      requestedDate: new Date().toISOString().split('T')[0],
      dueDate: new Date().toISOString().split('T')[0],
      stage: "Approved",
      progress: 100,
      document: updatedDocument
    };
    
    setApprovalItems({
      ...approvalItems,
      pending: updatedPending,
      completed: [...approvalItems.completed, newCompletedItem]
    });
    
    // Close dialog and show toast notification
    setIsApproveDialogOpen(false);
    setComment("");
    
    toast({
      title: "Document Approved",
      description: `${updatedDocument.title} has been approved successfully.`,
    });
  };
  
  const handleRejectDocument = () => {
    if (!selectedDocument) return;
    
    // Update document status
    const updatedDocument = {
      ...selectedDocument,
      status: 'Draft' as DocumentStatus,
      updatedAt: new Date().toISOString()
    };
    
    // Remove from pending list (in a real app, it would go back to the author)
    const updatedPending = approvalItems.pending.filter(item => 
      item.document.id !== selectedDocument.id
    );
    
    setApprovalItems({
      ...approvalItems,
      pending: updatedPending
    });
    
    // Close dialog and show toast notification
    setIsRejectDialogOpen(false);
    setComment("");
    
    toast({
      title: "Document Rejected",
      description: `${updatedDocument.title} has been sent back for revision.`,
      variant: "destructive"
    });
  };

  const filteredPending = approvalItems.pending.filter(item =>
    item.documentTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.documentType.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredInitiated = approvalItems.initiated.filter(item =>
    item.documentTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.documentType.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredCompleted = approvalItems.completed.filter(item =>
    item.documentTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.documentType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="animate-fade-in">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">Document Approval Workflow</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mt-2 mb-6">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search approvals..."
              className="pl-8 w-full md:max-w-md"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        </div>
        
        <Tabs defaultValue="pending">
          <TabsList>
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Pending My Approval</span>
              <Badge className="ml-1 bg-yellow-100 text-yellow-800 hover:bg-yellow-100">{filteredPending.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="initiated" className="flex items-center gap-2">
              <FileEdit className="h-4 w-4" />
              <span>Initiated by Me</span>
              <Badge className="ml-1 bg-blue-100 text-blue-800 hover:bg-blue-100">{filteredInitiated.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              <span>Completed</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending" className="mt-4">
            <ApprovalTable 
              items={filteredPending} 
              type="pending" 
              onPreview={handlePreviewDocument} 
              onApprove={handleOpenApproveDialog} 
              onReject={handleOpenRejectDialog}
            />
          </TabsContent>
          
          <TabsContent value="initiated" className="mt-4">
            <ApprovalTable 
              items={filteredInitiated} 
              type="initiated" 
              onPreview={handlePreviewDocument}
            />
          </TabsContent>
          
          <TabsContent value="completed" className="mt-4">
            <ApprovalTable 
              items={filteredCompleted} 
              type="completed" 
              onPreview={handlePreviewDocument}
            />
          </TabsContent>
        </Tabs>
      </CardContent>

      {/* Document Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Document Preview</DialogTitle>
            <DialogDescription>
              {selectedDocument && `${selectedDocument.title} (${selectedDocument.category})`}
            </DialogDescription>
          </DialogHeader>
          
          {selectedDocument && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">{selectedDocument.title}</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Category:</span>
                  <span className="ml-2">{selectedDocument.category}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Version:</span>
                  <span className="ml-2">{selectedDocument.version}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Status:</span>
                  <span className="ml-2">{selectedDocument.status}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Created by:</span>
                  <span className="ml-2">{selectedDocument.createdBy}</span>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-md border mb-4">
                <h4 className="font-medium mb-2">Document Content Preview</h4>
                <div className="whitespace-pre-wrap text-sm">
                  {selectedDocument.description || 
                    "This is a preview of the document content. In a real application, this would show the actual document content or an embedded viewer for PDFs, Word documents, etc."}
                </div>
              </div>
              
              {selectedDocument.status === "Pending Approval" && (
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    className="border-red-200 text-red-600 hover:bg-red-50"
                    onClick={() => {
                      setIsPreviewOpen(false);
                      handleOpenRejectDialog(selectedDocument);
                    }}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Reject Document
                  </Button>
                  <Button
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      setIsPreviewOpen(false);
                      handleOpenApproveDialog(selectedDocument);
                    }}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve Document
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Approve Document Dialog */}
      <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Document</DialogTitle>
            <DialogDescription>
              You are about to approve {selectedDocument?.title}
            </DialogDescription>
          </DialogHeader>
          
          {selectedDocument && (
            <>
              <div className="py-4">
                <div className="flex items-center gap-2 mb-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <h3 className="font-medium">Confirm Approval</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  This document will be marked as approved and will be available for publishing.
                </p>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Add comments (optional):</h4>
                  <Textarea
                    placeholder="Add any approval comments here..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </div>
                
                <DocumentApprovalRequirements document={selectedDocument} />
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsApproveDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleApproveDocument} className="bg-green-600 hover:bg-green-700">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Confirm Approval
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Document Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Document</DialogTitle>
            <DialogDescription>
              You are about to reject {selectedDocument?.title}
            </DialogDescription>
          </DialogHeader>
          
          {selectedDocument && (
            <>
              <div className="py-4">
                <div className="flex items-center gap-2 mb-2 text-red-600">
                  <AlertCircle className="h-5 w-5" />
                  <h3 className="font-medium">Confirm Rejection</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  This document will be sent back to the author for revision.
                </p>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Rejection reason (required):</h4>
                  <Textarea
                    placeholder="Please provide feedback for the author..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleRejectDocument} 
                  className="bg-red-600 hover:bg-red-700"
                  disabled={!comment.trim()}
                >
                  <X className="h-4 w-4 mr-2" />
                  Confirm Rejection
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

interface ApprovalTableProps {
  items: ApprovalItem[];
  type: 'pending' | 'initiated' | 'completed';
  onPreview: (document: Document) => void;
  onApprove?: (document: Document) => void;
  onReject?: (document: Document) => void;
}

const ApprovalTable: React.FC<ApprovalTableProps> = ({ 
  items, 
  type, 
  onPreview,
  onApprove,
  onReject
}) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Document</TableHead>
            <TableHead>Requested By</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length > 0 ? (
            items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <div>
                      <div>{item.documentTitle}</div>
                      <div className="text-xs text-gray-500">{item.documentType}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={item.avatarSrc} />
                      <AvatarFallback className="text-xs">
                        {item.requestedBy.split(' ').map(name => name[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span>{item.requestedBy}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(item.dueDate) < new Date() ? (
                    <span className="text-red-500 font-medium">{new Date(item.dueDate).toLocaleDateString()}</span>
                  ) : (
                    new Date(item.dueDate).toLocaleDateString()
                  )}
                </TableCell>
                <TableCell>
                  <Badge className={`
                    ${item.stage === 'Published' || item.stage === 'Approved' ? 'bg-green-100 text-green-800' : 
                      item.stage === 'Awaiting Your Approval' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-blue-100 text-blue-800'}
                  `} variant="outline">
                    {item.stage}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="w-[100px]">
                    <Progress value={item.progress} className="h-2" />
                    <div className="text-xs text-gray-500 mt-1">{item.progress}% Complete</div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onPreview(item.document)}
                      title="Preview Document"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {type === 'pending' && (
                      <>
                        {onApprove && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-green-600"
                            onClick={() => onApprove(item.document)}
                            title="Approve Document"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                        {onReject && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-red-600"
                            onClick={() => onReject(item.document)}
                            title="Reject Document"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                No {type === 'pending' ? 'pending approvals' : type === 'initiated' ? 'documents initiated by you' : 'completed approvals'} found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ApprovalWorkflow;
