
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDocument } from '@/contexts/DocumentContext';
import { ClipboardCheck, Calendar, CheckCircle2, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const ReviewQueue = () => {
  const { documents, approveDocument, rejectDocument } = useDocument();
  
  // Get documents pending review
  const pendingReviewDocs = documents.filter(doc => 
    doc.status === 'Pending Review' || doc.status === 'Pending_Review'
  );
  
  const handleApprove = async (id: string) => {
    try {
      await approveDocument(id);
    } catch (error) {
      console.error('Error approving document:', error);
    }
  };
  
  const handleReject = async (id: string) => {
    try {
      await rejectDocument(id, 'Needs corrections');
    } catch (error) {
      console.error('Error rejecting document:', error);
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <ClipboardCheck className="mr-2 h-5 w-5 text-amber-500" />
          Documents Awaiting Review
        </CardTitle>
      </CardHeader>
      <CardContent>
        {pendingReviewDocs.length > 0 ? (
          <div className="space-y-4">
            {pendingReviewDocs.map(doc => (
              <div key={doc.id} className="border rounded-md p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{doc.title}</h3>
                  <Badge variant="outline" className="bg-amber-100 text-amber-800">
                    Pending Review
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mb-3 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>
                      {doc.updated_at 
                        ? new Date(doc.updated_at).toLocaleDateString() 
                        : 'No date available'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    <span>{doc.created_by}</span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                    onClick={() => handleApprove(doc.id)}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
                    onClick={() => handleReject(doc.id)}
                  >
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-2" />
            <p className="font-medium">No documents awaiting review</p>
            <p className="text-sm text-muted-foreground">
              All documents have been reviewed
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReviewQueue;
