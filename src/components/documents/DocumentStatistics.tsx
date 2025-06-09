
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDocument } from '@/contexts/DocumentContext';
import { PieChart, FileCheck, BarChart2 } from 'lucide-react';
import { compareDocumentStatus } from '@/utils/documentUtils';
import { DocumentStatus } from '@/types/enums';

const DocumentStatistics = () => {
  const { documents } = useDocument();

  // Example statistics calculation
  const totalDocuments = documents.length;
  const expiredDocuments = documents.filter(doc => doc.expiry_date && new Date(doc.expiry_date) < new Date()).length;
  const pendingReviewCount = documents.filter(doc => 
    compareDocumentStatus(doc.status, DocumentStatus.PendingReview)
  ).length;
  const activeCount = documents.filter(doc => 
    compareDocumentStatus(doc.status, DocumentStatus.Published)
  ).length;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Document Statistics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <BarChart2 className="h-5 w-5 mr-2 text-blue-500" />
              Total Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalDocuments}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <FileCheck className="h-5 w-5 mr-2 text-green-500" />
              Active Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeCount}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <PieChart className="h-5 w-5 mr-2 text-amber-500" />
              Pending Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pendingReviewCount}</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Add more statistics visualizations as needed */}
    </div>
  );
};

export default DocumentStatistics;
