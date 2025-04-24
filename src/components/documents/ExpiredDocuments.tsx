
import React, { useEffect, useState } from 'react';
import { Document as DocumentType } from '@/types/document';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarX, Clock, RotateCw } from 'lucide-react';
import DocumentList from '@/components/documents/DocumentList';
import { useDocuments } from '@/contexts/DocumentContext';
import { format, isAfter, isBefore, addDays, parseISO } from 'date-fns';
import { toast } from '@/hooks/use-toast';

const ExpiredDocuments: React.FC = () => {
  const { documents, isLoading, updateDocument, refreshData } = useDocuments();
  const [expiredDocs, setExpiredDocs] = useState<DocumentType[]>([]);
  const [expiringDocs, setExpiringDocs] = useState<DocumentType[]>([]);
  const [activeTab, setActiveTab] = useState('expired');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!documents) return;
    
    const now = new Date();
    const thirtyDaysFromNow = addDays(now, 30);
    
    const expired: DocumentType[] = [];
    const expiringSoon: DocumentType[] = [];
    
    documents.forEach(doc => {
      if (doc.expiry_date) {
        const expiryDate = parseISO(doc.expiry_date);
        
        if (isBefore(expiryDate, now)) {
          expired.push(doc);
        } else if (isBefore(expiryDate, thirtyDaysFromNow)) {
          expiringSoon.push(doc);
        }
      }
    });
    
    setExpiredDocs(expired);
    setExpiringDocs(expiringSoon);
  }, [documents]);

  const handleExtendExpiry = async (doc: DocumentType) => {
    if (!doc.expiry_date) return;
    
    // Extend by 90 days from current expiry
    const currentExpiry = parseISO(doc.expiry_date);
    const newExpiry = addDays(currentExpiry, 90);
    
    try {
      await updateDocument({
        ...doc,
        expiry_date: newExpiry.toISOString(),
        last_review_date: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error extending document expiry:', error);
    }
  };

  const handleViewDocument = (doc: DocumentType) => {
    console.log('View document:', doc);
    // Logic to view document (TBD)
  };

  const handleRenewDocument = async (doc: DocumentType) => {
    try {
      // Update document status to indicate it needs renewal
      await updateDocument({
        ...doc,
        status: 'Draft',
        last_action: 'Marked for renewal',
        updated_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error marking document for renewal:', error);
    }
  };

  const handleUpdateReviewDate = async (doc: DocumentType) => {
    try {
      setProcessing(true);
      
      // Calculate next review date (6 months from now)
      const nextReview = new Date();
      nextReview.setMonth(nextReview.getMonth() + 6);
      
      const updatedDoc = {
        ...doc,
        updated_at: new Date().toISOString(),
        next_review_date: nextReview.toISOString()
      };
      
      await updateDocument(updatedDoc);
      
      toast({
        title: "Review Date Updated",
        description: `Next review date for "${doc.title}" has been set to ${format(nextReview, 'PP')}`,
      });
      
      if (refreshData) {
        refreshData();
      }
    } catch (error) {
      console.error('Error updating review date:', error);
      toast({
        title: "Error",
        description: "Failed to update review date",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-6">
          <TabsList>
            <TabsTrigger value="expired" className="flex items-center gap-2">
              <CalendarX className="h-4 w-4" />
              Expired Documents
              {expiredDocs.length > 0 && (
                <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {expiredDocs.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="expiring" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Expiring Soon
              {expiringDocs.length > 0 && (
                <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {expiringDocs.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="expired">
          <Card>
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="text-lg font-medium flex items-center">
                <CalendarX className="h-5 w-5 mr-2 text-red-500" />
                Expired Documents
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex justify-center items-center p-12">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mr-3"></div>
                  <span>Loading...</span>
                </div>
              ) : expiredDocs.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center">
                  <CalendarX className="h-12 w-12 text-gray-400 mb-3" />
                  <h3 className="text-lg font-medium text-gray-900">No expired documents</h3>
                  <p className="text-gray-500 mt-1">
                    All your documents are up to date.
                  </p>
                </div>
              ) : (
                <DocumentList
                  documents={expiredDocs}
                  onViewDocument={handleViewDocument}
                  onEditDocument={handleRenewDocument}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="expiring">
          <Card>
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="text-lg font-medium flex items-center">
                <Clock className="h-5 w-5 mr-2 text-yellow-500" />
                Documents Expiring Soon
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex justify-center items-center p-12">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mr-3"></div>
                  <span>Loading...</span>
                </div>
              ) : expiringDocs.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center">
                  <Clock className="h-12 w-12 text-gray-400 mb-3" />
                  <h3 className="text-lg font-medium text-gray-900">No documents expiring soon</h3>
                  <p className="text-gray-500 mt-1">
                    No documents are scheduled to expire within the next 30 days.
                  </p>
                </div>
              ) : (
                <DocumentList
                  documents={expiringDocs}
                  onViewDocument={handleViewDocument}
                  onEditDocument={doc => handleExtendExpiry(doc)}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExpiredDocuments;
