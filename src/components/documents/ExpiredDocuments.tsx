
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useDocument } from '@/contexts/DocumentContext';
import { format, differenceInDays } from 'date-fns';
import { Calendar, AlertTriangle, XCircle, CheckCircle } from 'lucide-react';

const ExpiredDocuments = () => {
  const { documents } = useDocument();
  const [expiredDocs, setExpiredDocs] = useState<any[]>([]);
  const [nearingExpiryDocs, setNearingExpiryDocs] = useState<any[]>([]);

  useEffect(() => {
    if (!documents || documents.length === 0) return;

    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);
    
    const expired = documents.filter(doc => 
      doc.expiry_date && new Date(doc.expiry_date) < today
    ).sort((a, b) => new Date(a.expiry_date).getTime() - new Date(b.expiry_date).getTime());
    
    const nearingExpiry = documents.filter(doc => 
      doc.expiry_date && 
      new Date(doc.expiry_date) >= today &&
      new Date(doc.expiry_date) <= thirtyDaysFromNow
    ).sort((a, b) => new Date(a.expiry_date).getTime() - new Date(b.expiry_date).getTime());
    
    setExpiredDocs(expired);
    setNearingExpiryDocs(nearingExpiry);
  }, [documents]);

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-red-500" />
          Document Expirations
        </CardTitle>
      </CardHeader>
      <CardContent>
        {expiredDocs.length === 0 && nearingExpiryDocs.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">All Documents Valid</h3>
            <p className="text-sm text-gray-500 max-w-xs mx-auto mt-2">
              No documents are expired or nearing expiry dates.
            </p>
          </div>
        ) : (
          <div>
            {expiredDocs.length > 0 && (
              <div className="space-y-3 mb-6">
                <h3 className="font-medium flex items-center text-red-600">
                  <XCircle className="h-4 w-4 mr-1.5" />
                  Expired Documents ({expiredDocs.length})
                </h3>
                <div className="space-y-2">
                  {expiredDocs.slice(0, 4).map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-2 border rounded-md bg-red-50">
                      <div className="flex-grow">
                        <p className="text-sm font-medium line-clamp-1">{doc.title}</p>
                        <div className="flex items-center text-xs mt-1">
                          <Badge variant="outline" className="font-normal text-xs bg-red-100 text-red-800 mr-2">
                            Expired
                          </Badge>
                          <span className="text-gray-500">
                            {format(new Date(doc.expiry_date), 'MMM d, yyyy')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {expiredDocs.length > 4 && (
                    <p className="text-xs text-center text-gray-500">And {expiredDocs.length - 4} more expired documents</p>
                  )}
                </div>
              </div>
            )}
            
            {nearingExpiryDocs.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-medium flex items-center text-amber-600">
                  <AlertTriangle className="h-4 w-4 mr-1.5" />
                  Expiring Soon ({nearingExpiryDocs.length})
                </h3>
                <div className="space-y-2">
                  {nearingExpiryDocs.slice(0, 4).map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-2 border rounded-md bg-amber-50">
                      <div className="flex-grow">
                        <p className="text-sm font-medium line-clamp-1">{doc.title}</p>
                        <div className="flex items-center text-xs mt-1">
                          <Badge variant="outline" className="font-normal text-xs bg-amber-100 text-amber-800 mr-2">
                            {differenceInDays(new Date(doc.expiry_date), new Date())} days left
                          </Badge>
                          <span className="text-gray-500">
                            {format(new Date(doc.expiry_date), 'MMM d, yyyy')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {nearingExpiryDocs.length > 4 && (
                    <p className="text-xs text-center text-gray-500">And {nearingExpiryDocs.length - 4} more documents expiring soon</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0">
        <Button variant="outline" className="w-full" size="sm">
          View All Expirations
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ExpiredDocuments;
