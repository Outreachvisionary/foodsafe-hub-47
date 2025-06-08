
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useDocument } from '@/contexts/DocumentContext';

export function ApprovalWorkflow() {
  const { 
    documents, 
    loading, 
    error
  } = useDocument();
  
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [currentComment, setCurrentComment] = useState("");

  const handleApprove = async (documentId: string) => {
    setIsApproving(true);
    try {
      // Simple approval logic - would be implemented in context
      console.log('Approving document:', documentId, currentComment);
      setCurrentComment("");
    } catch (err) {
      console.error("Failed to approve document:", err);
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async (documentId: string) => {
    setIsRejecting(true);
    try {
      // Simple rejection logic - would be implemented in context
      console.log('Rejecting document:', documentId, currentComment);
      setCurrentComment("");
    } catch (err) {
      console.error("Failed to reject document:", err);
    } finally {
      setIsRejecting(false);
    }
  };

  if (loading) {
    return <p>Loading documents...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Approval Workflow</CardTitle>
      </CardHeader>
      <CardContent>
        {documents && documents.length > 0 ? (
          <ul>
            {documents.map((doc) => (
              <li key={doc.id} className="py-2 border-b">
                <div className="flex justify-between items-center">
                  <span>{doc.title}</span>
                  <div>
                    <Button
                      variant="ghost"
                      onClick={() => handleApprove(doc.id)}
                      disabled={isApproving}
                    >
                      {isApproving ? (
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
                      variant="ghost"
                      onClick={() => handleReject(doc.id)}
                      disabled={isRejecting}
                    >
                      {isRejecting ? (
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
              </li>
            ))}
          </ul>
        ) : (
          <p>No documents to approve.</p>
        )}
      </CardContent>
    </Card>
  );
}

export default ApprovalWorkflow;
