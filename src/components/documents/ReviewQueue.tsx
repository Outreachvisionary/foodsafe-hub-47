
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDocument } from '@/contexts/DocumentContext';
import { AlertTriangle } from 'lucide-react';

const ReviewQueue = () => {
  const { documents, loading, error } = useDocument();
  
  // Filter documents that need review
  const documentsForReview = documents?.filter(doc => 
    doc.status === 'Pending Review' || 
    (doc.next_review_date && new Date(doc.next_review_date) <= new Date())
  ) || [];

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Documents for Review</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-6">
          Loading review queue...
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Documents for Review</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-6 text-destructive">
          <AlertTriangle className="mx-auto h-8 w-8 mb-2" />
          <p>Failed to load documents for review</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Documents for Review</CardTitle>
      </CardHeader>
      <CardContent>
        {documentsForReview.length === 0 ? (
          <p className="text-center py-6 text-gray-500">
            No documents pending review.
          </p>
        ) : (
          <ul className="divide-y">
            {documentsForReview.map(doc => (
              <li key={doc.id} className="py-3">
                <div>
                  <h3 className="font-medium">{doc.title}</h3>
                  <div className="mt-1 flex justify-between text-sm">
                    <span className="text-gray-500">
                      Last reviewed: {doc.last_review_date ? new Date(doc.last_review_date).toLocaleDateString() : 'Never'}
                    </span>
                    <span className="text-gray-500">
                      Next review: {doc.next_review_date ? new Date(doc.next_review_date).toLocaleDateString() : 'Not set'}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default ReviewQueue;
