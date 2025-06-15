
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search, 
  Filter,
  User,
  Calendar,
  FileText,
  MessageSquare
} from 'lucide-react';
import { useDocument } from '@/contexts/DocumentContext';
import { Document } from '@/types/document';
import { formatDistanceToNow } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const ApprovalWorkflow: React.FC = () => {
  const { 
    documents, 
    loading, 
    error,
    approveDocument,
    rejectDocument
  } = useDocument();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [processingDocs, setProcessingDocs] = useState<Set<string>>(new Set());
  const [rejectionComments, setRejectionComments] = useState<{ [key: string]: string }>({});
  const [showCommentFor, setShowCommentFor] = useState<string | null>(null);

  // Filter documents that need approval
  const pendingDocuments = useMemo(() => {
    if (!documents) return [];

    let filtered = documents.filter(doc => 
      doc.status === 'Pending_Approval' || doc.status === 'Pending_Review'
    );

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(doc =>
        doc.title.toLowerCase().includes(term) ||
        doc.description?.toLowerCase().includes(term) ||
        doc.created_by.toLowerCase().includes(term)
      );
    }

    // Apply status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(doc => doc.status === selectedStatus);
    }

    return filtered.sort((a, b) => {
      // Sort by pending_since date, oldest first
      if (a.pending_since && b.pending_since) {
        return new Date(a.pending_since).getTime() - new Date(b.pending_since).getTime();
      }
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    });
  }, [documents, searchTerm, selectedStatus]);

  const handleApprove = async (documentId: string) => {
    setProcessingDocs(prev => new Set([...prev, documentId]));
    try {
      await approveDocument(documentId);
    } catch (err) {
      console.error("Failed to approve document:", err);
    } finally {
      setProcessingDocs(prev => {
        const newSet = new Set(prev);
        newSet.delete(documentId);
        return newSet;
      });
    }
  };

  const handleReject = async (documentId: string) => {
    const comment = rejectionComments[documentId];
    if (!comment?.trim()) {
      return;
    }

    setProcessingDocs(prev => new Set([...prev, documentId]));
    try {
      await rejectDocument(documentId, comment);
      // Clear the comment after successful rejection
      setRejectionComments(prev => {
        const updated = { ...prev };
        delete updated[documentId];
        return updated;
      });
      setShowCommentFor(null);
    } catch (err) {
      console.error("Failed to reject document:", err);
    } finally {
      setProcessingDocs(prev => {
        const newSet = new Set(prev);
        newSet.delete(documentId);
        return newSet;
      });
    }
  };

  const handleCommentChange = (documentId: string, comment: string) => {
    setRejectionComments(prev => ({
      ...prev,
      [documentId]: comment
    }));
  };

  const toggleCommentBox = (documentId: string) => {
    setShowCommentFor(showCommentFor === documentId ? null : documentId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending_Approval':
        return 'bg-orange-100 text-orange-800';
      case 'Pending_Review':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityLevel = (doc: Document) => {
    if (!doc.pending_since) return 'normal';
    const daysPending = Math.floor(
      (Date.now() - new Date(doc.pending_since).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysPending > 7) return 'high';
    if (daysPending > 3) return 'medium';
    return 'normal';
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2 text-orange-600" />
            Document Approval Workflow
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Clock className="h-8 w-8 animate-spin text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Loading approval queue...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-600">Approval Workflow Error</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-2" />
            <p className="text-red-600">Error: {error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-orange-600" />
              Document Approval Workflow
            </div>
            <Badge variant="outline" className="bg-orange-50 text-orange-700">
              {pendingDocuments.length} Pending
            </Badge>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Review and approve documents awaiting authorization
          </p>
        </CardHeader>
      </Card>

      {/* Filters */}
      {pendingDocuments.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Status Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Status: {selectedStatus === 'all' ? 'All' : selectedStatus.replace('_', ' ')}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setSelectedStatus('all')}>
                    All Statuses
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedStatus('Pending_Approval')}>
                    Pending Approval
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedStatus('Pending_Review')}>
                    Pending Review
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Document List */}
      <Card>
        <CardHeader>
          <CardTitle>
            Documents Awaiting Approval ({pendingDocuments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingDocuments.length > 0 ? (
            <div className="space-y-4">
              {pendingDocuments.map((doc) => {
                const isProcessing = processingDocs.has(doc.id);
                const priority = getPriorityLevel(doc);
                
                return (
                  <div key={doc.id} className="border rounded-lg p-6 bg-card space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-blue-600" />
                          <h3 className="font-semibold text-lg">{doc.title}</h3>
                          <Badge className={getStatusColor(doc.status)}>
                            {doc.status.replace('_', ' ')}
                          </Badge>
                          {priority === 'high' && (
                            <Badge variant="destructive" className="text-xs">
                              Urgent
                            </Badge>
                          )}
                          {priority === 'medium' && (
                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">
                              Overdue
                            </Badge>
                          )}
                        </div>
                        
                        {doc.description && (
                          <p className="text-muted-foreground">{doc.description}</p>
                        )}
                        
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span>Created by: {doc.created_by}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {doc.pending_since 
                                ? `Pending for ${formatDistanceToNow(new Date(doc.pending_since))}`
                                : `Created ${formatDistanceToNow(new Date(doc.created_at), { addSuffix: true })}`
                              }
                            </span>
                          </div>
                          <span>Version: {doc.version}</span>
                          <span>Category: {doc.category}</span>
                        </div>

                        {doc.approvers && doc.approvers.length > 0 && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Approvers:</span>
                            <div className="flex gap-1">
                              {doc.approvers.map((approver, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {approver}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {showCommentFor === doc.id && (
                      <div className="space-y-2 border-t pt-4">
                        <Label htmlFor={`comment-${doc.id}`}>Rejection Reason *</Label>
                        <Textarea
                          id={`comment-${doc.id}`}
                          placeholder="Please provide a detailed reason for rejection..."
                          value={rejectionComments[doc.id] || ''}
                          onChange={(e) => handleCommentChange(doc.id, e.target.value)}
                          className="min-h-[80px]"
                        />
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-2">
                      <Button
                        onClick={() => handleApprove(doc.id)}
                        disabled={isProcessing}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {isProcessing ? (
                          <>
                            <Clock className="mr-2 h-4 w-4 animate-spin" />
                            Approving...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Approve
                          </>
                        )}
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => toggleCommentBox(doc.id)}
                        disabled={isProcessing}
                      >
                        <MessageSquare className="mr-2 h-4 w-4" />
                        {showCommentFor === doc.id ? 'Hide Comment' : 'Add Rejection Reason'}
                      </Button>

                      {showCommentFor === doc.id && (
                        <Button
                          variant="destructive"
                          onClick={() => handleReject(doc.id)}
                          disabled={isProcessing || !rejectionComments[doc.id]?.trim()}
                        >
                          {isProcessing ? (
                            <>
                              <Clock className="mr-2 h-4 w-4 animate-spin" />
                              Rejecting...
                            </>
                          ) : (
                            <>
                              <XCircle className="mr-2 h-4 w-4" />
                              Reject Document
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">All documents approved</h3>
              <p className="text-muted-foreground">
                No documents currently pending approval or review.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ApprovalWorkflow;
