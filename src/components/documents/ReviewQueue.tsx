
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, XCircle, RefreshCcw } from 'lucide-react';
import { Document } from '@/types/document';
import { formatDistanceToNow } from 'date-fns';

interface ReviewQueueProps {
  documents: Document[];
  isLoading?: boolean;
}

const ReviewQueue: React.FC<ReviewQueueProps> = ({ documents, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <RefreshCcw className="h-8 w-8 animate-spin text-gray-400" />
        <span className="ml-2 text-lg text-gray-600">Loading review queue...</span>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border">
        <CheckCircle className="mx-auto h-12 w-12 text-green-400" />
        <h3 className="mt-2 font-medium text-lg">No documents pending review</h3>
        <p className="text-sm text-gray-500 mt-1">
          All documents are up to date
        </p>
      </div>
    );
  }

  const handleApprove = (documentId: string) => {
    console.log('Approve document:', documentId);
    // TODO: Implement approval workflow
  };

  const handleReject = (documentId: string) => {
    console.log('Reject document:', documentId);
    // TODO: Implement rejection workflow
  };

  return (
    <div className="space-y-4">
      {documents.map((document) => (
        <Card key={document.id} className="border-l-4 border-l-amber-500">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-lg">{document.title}</h3>
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                    <Clock className="h-3 w-3 mr-1" />
                    Pending Review
                  </Badge>
                </div>
                
                <p className="text-gray-600 mb-3">{document.description}</p>
                
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>Category: {document.category}</span>
                  <span>Version: v{document.version}</span>
                  <span>Created: {formatDistanceToNow(new Date(document.created_at), { addSuffix: true })}</span>
                  <span>By: {document.created_by}</span>
                </div>

                {document.pending_since && (
                  <div className="mt-2 text-sm text-amber-600">
                    Pending since: {formatDistanceToNow(new Date(document.pending_since), { addSuffix: true })}
                  </div>
                )}
              </div>
              
              <div className="flex gap-2 ml-4">
                <Button 
                  size="sm" 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => handleApprove(document.id)}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Approve
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive"
                  onClick={() => handleReject(document.id)}
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Reject
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ReviewQueue;
