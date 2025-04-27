
import React, { useEffect, useState } from 'react';
import { useDocument } from '@/contexts/DocumentContext';
import { Document } from '@/types/document';
import DocumentList from './DocumentList';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export const ReviewQueue: React.FC = () => {
  const { documents, loading, error } = useDocument();
  const [pendingDocuments, setPendingDocuments] = useState<Document[]>([]);
  
  useEffect(() => {
    if (documents?.length) {
      // Filter documents that need review
      const pending = documents.filter(doc => 
        doc.status === 'Pending_Review' || 
        doc.status === 'Pending_Approval' || 
        (doc.next_review_date && new Date(doc.next_review_date) <= new Date())
      );
      setPendingDocuments(pending);
    }
  }, [documents]);
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Documents Pending Review</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-40 flex items-center justify-center">
              <p className="text-muted-foreground">Loading documents...</p>
            </div>
          ) : error ? (
            <div className="h-40 flex items-center justify-center">
              <p className="text-red-500">Error: {error}</p>
            </div>
          ) : pendingDocuments.length === 0 ? (
            <div className="h-40 flex items-center justify-center">
              <p className="text-muted-foreground">No documents pending review</p>
            </div>
          ) : (
            <DocumentList documents={pendingDocuments} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewQueue;
