
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, Loader2, MessageSquare } from 'lucide-react';
import { useDocument } from '@/contexts/DocumentContext';

export function ApprovalWorkflow() {
  const { 
    documents, 
    loading, 
    error,
    approveDocument,
    rejectDocument
  } = useDocument();
  
  const [isApproving, setIsApproving] = useState<string | null>(null);
  const [isRejecting, setIsRejecting] = useState<string | null>(null);
  const [rejectionComments, setRejectionComments] = useState<{ [key: string]: string }>({});
  const [showCommentFor, setShowCommentFor] = useState<string | null>(null);

  // Filter documents that need approval
  const pendingDocuments = documents.filter(doc => 
    doc.status === 'Pending_Approval' || doc.status === 'Pending_Review'
  );

  const handleApprove = async (documentId: string) => {
    setIsApproving(documentId);
    try {
      await approveDocument(documentId);
    } catch (err) {
      console.error("Failed to approve document:", err);
    } finally {
      setIsApproving(null);
    }
  };

  const handleReject = async (documentId: string) => {
    setIsRejecting(documentId);
    try {
      const rejectionReason = rejectionComments[documentId] || "Document rejected by reviewer";
      await rejectDocument(documentId, rejectionReason);
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
      setIsRejecting(null);
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

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Approval Workflow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading documents...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Approval Workflow</CardTitle>
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
          Document Approval Workflow
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Review and approve pending documents
        </p>
      </CardHeader>
      <CardContent>
        {pendingDocuments && pendingDocuments.length > 0 ? (
          <div className="space-y-4">
            {pendingDocuments.map((doc) => (
              <div key={doc.id} className="border rounded-lg p-4 bg-card">
                <div className="flex flex-col space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium text-lg">{doc.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {doc.description || 'No description available'}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span>Version: {doc.version}</span>
                        <span>Created by: {doc.created_by}</span>
                        <span>Status: {doc.status.replace('_', ' ')}</span>
                      </div>
                    </div>
                  </div>

                  {showCommentFor === doc.id && (
                    <div className="space-y-2">
                      <Label htmlFor={`comment-${doc.id}`}>Rejection Reason</Label>
                      <Textarea
                        id={`comment-${doc.id}`}
                        placeholder="Enter reason for rejection..."
                        value={rejectionComments[doc.id] || ''}
                        onChange={(e) => handleCommentChange(doc.id, e.target.value)}
                        className="min-h-[80px]"
                      />
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => handleApprove(doc.id)}
                      disabled={isApproving === doc.id || isRejecting === doc.id}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isApproving === doc.id ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
                      disabled={isApproving === doc.id || isRejecting === doc.id}
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      {showCommentFor === doc.id ? 'Hide Comment' : 'Add Comment'}
                    </Button>

                    <Button
                      variant="destructive"
                      onClick={() => handleReject(doc.id)}
                      disabled={isApproving === doc.id || isRejecting === doc.id}
                    >
                      {isRejecting === doc.id ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Rejecting...
                        </>
                      ) : (
                        <>
                          <XCircle className="mr-2 h-4 w-4" />
                          Reject
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">All documents approved</h3>
            <p className="text-muted-foreground">
              No documents currently pending approval.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default ApprovalWorkflow;
