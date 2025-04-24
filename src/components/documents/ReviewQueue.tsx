
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDocument } from '@/contexts/DocumentContext';
import { ClipboardCheck, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ReviewQueue = () => {
  const { documents } = useDocument();

  // Filter documents that need review
  const reviewDocs = documents.filter(doc => 
    doc.status === 'Pending Review' || 
    (doc.next_review_date && new Date(doc.next_review_date) <= new Date())
  );

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Documents Pending Review</h2>
      
      {reviewDocs.length === 0 ? (
        <Card className="bg-gray-50">
          <CardContent className="p-6 text-center">
            <ClipboardCheck className="mx-auto h-12 w-12 text-green-500 mb-3" />
            <p className="text-lg font-medium">No documents pending review</p>
            <p className="text-gray-500 mt-1">All documents are up to date</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reviewDocs.map(doc => (
            <Card key={doc.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{doc.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      {doc.next_review_date ? (
                        <span>Review due: {new Date(doc.next_review_date).toLocaleDateString()}</span>
                      ) : (
                        <span>Pending approval</span>
                      )}
                    </div>
                    {doc.description && (
                      <p className="text-sm line-clamp-2">{doc.description}</p>
                    )}
                  </div>
                  <Button size="sm">Review</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewQueue;
