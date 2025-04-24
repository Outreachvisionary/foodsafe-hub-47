
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Clock, FileText, CheckCircle2 } from 'lucide-react';
import { useDocument } from '@/contexts/DocumentContext';
import { Badge } from '@/components/ui/badge';

const ExpiredDocuments = () => {
  const { documents } = useDocument();
  
  // Filter expired documents
  const expiredDocs = documents.filter(doc => {
    if (!doc.expiry_date) return false;
    const expiryDate = new Date(doc.expiry_date);
    return expiryDate < new Date();
  });
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <AlertTriangle className="mr-2 h-5 w-5 text-red-500" />
          Expired Documents
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {expiredDocs.length > 0 ? (
          <div className="divide-y">
            {expiredDocs.map(doc => (
              <div 
                key={doc.id}
                className="p-3 hover:bg-gray-50 cursor-pointer"
              >
                <div className="flex justify-between">
                  <div className="flex items-start gap-2">
                    <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium">{doc.title}</h4>
                      <div className="flex items-center text-xs text-red-500 mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        Expired {new Date(doc.expiry_date!).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <Badge variant="destructive" className="text-xs">Expired</Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">
            <CheckCircle2 className="mx-auto h-10 w-10 text-green-500 mb-2" />
            <p>No expired documents</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExpiredDocuments;
