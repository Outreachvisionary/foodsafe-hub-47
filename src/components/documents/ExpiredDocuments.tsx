
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Calendar, RefreshCcw, Upload } from 'lucide-react';
import { Document } from '@/types/document';
import { formatDistanceToNow } from 'date-fns';

interface ExpiredDocumentsProps {
  documents: Document[];
  isLoading?: boolean;
}

const ExpiredDocuments: React.FC<ExpiredDocumentsProps> = ({ documents, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <RefreshCcw className="h-8 w-8 animate-spin text-gray-400" />
        <span className="ml-2 text-lg text-gray-600">Loading expiring documents...</span>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border">
        <Calendar className="mx-auto h-12 w-12 text-green-400" />
        <h3 className="mt-2 font-medium text-lg">No documents expiring soon</h3>
        <p className="text-sm text-gray-500 mt-1">
          All documents are current and valid
        </p>
      </div>
    );
  }

  const handleRenew = (documentId: string) => {
    console.log('Renew document:', documentId);
    // TODO: Implement document renewal workflow
  };

  const getDaysUntilExpiry = (expiryDate: string) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getUrgencyLevel = (daysUntilExpiry: number) => {
    if (daysUntilExpiry < 0) return { level: 'expired', color: 'bg-red-100 text-red-800 border-red-200' };
    if (daysUntilExpiry <= 7) return { level: 'critical', color: 'bg-red-100 text-red-800 border-red-200' };
    if (daysUntilExpiry <= 15) return { level: 'warning', color: 'bg-amber-100 text-amber-800 border-amber-200' };
    return { level: 'notice', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
  };

  return (
    <div className="space-y-4">
      {documents.map((document) => {
        const daysUntilExpiry = document.expiry_date ? getDaysUntilExpiry(document.expiry_date) : null;
        const urgency = daysUntilExpiry !== null ? getUrgencyLevel(daysUntilExpiry) : null;
        
        return (
          <Card key={document.id} className="border-l-4 border-l-red-500">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{document.title}</h3>
                    {urgency && (
                      <Badge className={urgency.color}>
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        {daysUntilExpiry !== null && daysUntilExpiry < 0 
                          ? 'Expired' 
                          : `${daysUntilExpiry} days left`}
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-gray-600 mb-3">{document.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Category: {document.category}</span>
                    <span>Version: v{document.version}</span>
                    <span>Created: {formatDistanceToNow(new Date(document.created_at), { addSuffix: true })}</span>
                    <span>By: {document.created_by}</span>
                  </div>

                  {document.expiry_date && (
                    <div className="mt-2 text-sm text-red-600">
                      Expires: {new Date(document.expiry_date).toLocaleDateString()}
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2 ml-4">
                  <Button 
                    size="sm" 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleRenew(document.id)}
                  >
                    <Upload className="h-4 w-4 mr-1" />
                    Renew
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ExpiredDocuments;
