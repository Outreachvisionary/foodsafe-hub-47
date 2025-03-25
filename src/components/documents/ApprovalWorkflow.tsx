
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Document } from '@/types/document';
import { useDocuments } from '@/contexts/DocumentContext';
import DocumentPreviewDialog from './DocumentPreviewDialog';
import DocumentApprover from './DocumentApprover';
import { AlertCircle, CheckCircle2, Clock, Search, FileText, Users, CalendarClock, ClipboardCheck } from 'lucide-react';

const ApprovalWorkflow: React.FC = () => {
  const { documents, approveDocument, rejectDocument } = useDocuments();
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [rejectionDialog, setRejectionDialog] = useState({ open: false, document: null as Document | null, reason: '' });
  const [filterStatus, setFilterStatus] = useState<string>('pending');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter documents based on status and search query
  const filteredDocuments = documents.filter(doc => {
    const matchesStatus = 
      (filterStatus === 'pending' && doc.status === 'Pending Approval') ||
      (filterStatus === 'approved' && doc.status === 'Approved') ||
      (filterStatus === 'all');
      
    const matchesSearch = 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.tags && doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
      
    return matchesStatus && matchesSearch;
  });

  // Documents pending approval
  const pendingDocuments = documents.filter(doc => doc.status === 'Pending Approval');
  
  // Count by category for pending documents
  const categoryCount: Record<string, number> = {};
  pendingDocuments.forEach(doc => {
    if (!categoryCount[doc.category]) {
      categoryCount[doc.category] = 0;
    }
    categoryCount[doc.category]++;
  });

  const handleApprove = (doc: Document, comment: string) => {
    approveDocument(doc, comment);
    setSelectedDocument(null);
  };

  const handleReject = (doc: Document, reason: string) => {
    rejectDocument(doc, reason);
    setSelectedDocument(null);
    setRejectionDialog({ open: false, document: null, reason: '' });
  };

  const handleOpenRejectDialog = (doc: Document) => {
    setRejectionDialog({ open: true, document: doc, reason: '' });
  };

  const getPriorityBadge = (doc: Document) => {
    // Check how long the document has been pending
    if (!doc.pendingSince) return null;
    
    const pendingDate = new Date(doc.pendingSince);
    const currentDate = new Date();
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    const daysPending = Math.floor((currentDate.getTime() - pendingDate.getTime()) / millisecondsPerDay);
    
    if (daysPending >= 7) {
      return <Badge variant="destructive" className="ml-2">Overdue</Badge>;
    } else if (daysPending >= 3) {
      // Changed from "warning" to "outline" with custom amber colors
      return <Badge variant="outline" className="ml-2 bg-amber-100 text-amber-800 hover:bg-amber-100">High Priority</Badge>;
    }
    return null;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <ClipboardCheck className="mr-2 h-6 w-6" />
            Approval Workflow
          </h2>
          <p className="text-muted-foreground mt-1">
            Manage document approval requests and track their status
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 px-3 py-1">
            {pendingDocuments.length} Pending Approval
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList>
          <TabsTrigger value="list" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            Document List
          </TabsTrigger>
          <TabsTrigger value="dashboard" className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            Approver Dashboard
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-1">
            <CalendarClock className="h-4 w-4" />
            Approval History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="pt-4">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between gap-2">
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search documents..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending Approval</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="all">All Documents</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submitted On</TableHead>
                      <TableHead>Required Approvers</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocuments.length > 0 ? (
                      filteredDocuments.map((doc) => (
                        <TableRow key={doc.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              <span>{doc.title}</span>
                              {getPriorityBadge(doc)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-gray-100">
                              {doc.category}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {doc.status === 'Pending Approval' ? (
                              <div className="flex items-center">
                                <Badge variant="outline" className="bg-yellow-100 text-yellow-800 flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  Pending
                                </Badge>
                              </div>
                            ) : doc.status === 'Approved' ? (
                              <Badge variant="outline" className="bg-green-100 text-green-800 flex items-center gap-1">
                                <CheckCircle2 className="h-3 w-3" />
                                Approved
                              </Badge>
                            ) : (
                              <Badge variant="outline">{doc.status}</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {doc.pendingSince ? new Date(doc.pendingSince).toLocaleDateString() : '-'}
                          </TableCell>
                          <TableCell>
                            QA Manager, Compliance Officer
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => {
                                  setSelectedDocument(doc);
                                  setIsPreviewOpen(true);
                                }}
                              >
                                Preview
                              </Button>
                              {doc.status === 'Pending Approval' && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="text-blue-600 border-blue-200"
                                  onClick={() => setSelectedDocument(doc)}
                                >
                                  Review
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                          No documents found matching your criteria
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="dashboard" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium">Pending Approval</h3>
                    <p className="text-3xl font-bold mt-2">{pendingDocuments.length}</p>
                  </div>
                  <div className="bg-amber-100 p-3 rounded-full">
                    <Clock className="h-6 w-6 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium">Overdue</h3>
                    <p className="text-3xl font-bold mt-2">
                      {pendingDocuments.filter(doc => {
                        if (!doc.pendingSince) return false;
                        const pendingDate = new Date(doc.pendingSince);
                        const currentDate = new Date();
                        const millisecondsPerDay = 24 * 60 * 60 * 1000;
                        const daysPending = Math.floor((currentDate.getTime() - pendingDate.getTime()) / millisecondsPerDay);
                        return daysPending >= 7;
                      }).length}
                    </p>
                  </div>
                  <div className="bg-red-100 p-3 rounded-full">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium">Approved Today</h3>
                    <p className="text-3xl font-bold mt-2">
                      {documents.filter(doc => {
                        if (doc.status !== 'Approved') return false;
                        const updatedDate = new Date(doc.updatedAt);
                        const today = new Date();
                        return updatedDate.toDateString() === today.toDateString();
                      }).length}
                    </p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Pending Documents by Category</CardTitle>
              <CardDescription>
                Document approval requests grouped by category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(categoryCount).length > 0 ? (
                  Object.entries(categoryCount).map(([category, count]) => (
                    <div key={category} className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center">
                        <div className="bg-blue-100 p-2 rounded-full mr-3">
                          <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">{category}</h4>
                          <p className="text-sm text-muted-foreground">{count} document(s) pending</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">View All</Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No pending documents
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Approval Activity</CardTitle>
              <CardDescription>
                Track the approval history of documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {documents
                  .filter(doc => doc.status === 'Approved' || doc.status === 'Published')
                  .slice(0, 5)
                  .map((doc) => (
                    <div key={doc.id} className="flex items-start border-b pb-4">
                      <div className="bg-green-100 p-2 rounded-full mr-3 mt-1">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{doc.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          Approved on {new Date(doc.updatedAt).toLocaleDateString()}
                        </p>
                        <div className="flex mt-1">
                          <Badge variant="outline" className="mr-2 bg-gray-100">
                            {doc.category}
                          </Badge>
                          <Badge variant="outline" className="bg-green-100 text-green-800">
                            {doc.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                
                {documents.filter(doc => doc.status === 'Approved' || doc.status === 'Published').length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No approval history available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Document preview dialog */}
      <DocumentPreviewDialog 
        document={selectedDocument} 
        open={isPreviewOpen} 
        onOpenChange={setIsPreviewOpen} 
      />

      {/* Document approver component */}
      {selectedDocument && selectedDocument.status === 'Pending Approval' && (
        <DocumentApprover 
          document={selectedDocument} 
          onApprove={handleApprove}
          onReject={handleOpenRejectDialog}
        />
      )}

      {/* Rejection reason dialog */}
      <Dialog open={rejectionDialog.open} onOpenChange={(open) => setRejectionDialog(prev => ({ ...prev, open }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Document</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this document.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Enter rejection reason..."
            value={rejectionDialog.reason}
            onChange={(e) => setRejectionDialog(prev => ({ ...prev, reason: e.target.value }))}
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectionDialog({ open: false, document: null, reason: '' })}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => rejectionDialog.document && handleReject(rejectionDialog.document, rejectionDialog.reason)}
              disabled={!rejectionDialog.reason.trim()}
            >
              Reject Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApprovalWorkflow;
