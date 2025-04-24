
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Chart, PieChart, BarChart } from 'lucide-react';
import { useDocument } from '@/contexts/DocumentContext';

const DocumentStatistics = () => {
  const { documents } = useDocument();
  
  // Calculate document statistics
  const stats = {
    totalDocuments: documents.length,
    byCategory: {} as Record<string, number>,
    byStatus: {} as Record<string, number>,
    averageAge: 0
  };
  
  // Process documents
  if (documents.length > 0) {
    // Group by category
    documents.forEach(doc => {
      const category = doc.category || 'Uncategorized';
      stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;
      
      const status = doc.status || 'Unknown';
      stats.byStatus[status] = (stats.byStatus[status] || 0) + 1;
    });
    
    // Calculate average age
    const totalAgeInDays = documents.reduce((sum, doc) => {
      const createdDate = doc.created_at ? new Date(doc.created_at) : new Date();
      const ageInDays = (new Date().getTime() - createdDate.getTime()) / (1000 * 3600 * 24);
      return sum + ageInDays;
    }, 0);
    
    stats.averageAge = Math.round(totalAgeInDays / documents.length);
  }
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <Chart className="mr-2 h-5 w-5 text-primary" />
          Document Statistics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="text-sm text-gray-500">Total Documents</div>
              <div className="text-2xl font-bold">{stats.totalDocuments}</div>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="text-sm text-gray-500">Average Age (days)</div>
              <div className="text-2xl font-bold">{stats.averageAge}</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Documents by Category</h3>
            <div className="space-y-1">
              {Object.entries(stats.byCategory).map(([category, count]) => (
                <div key={category} className="flex items-center justify-between">
                  <span className="text-sm">{category}</span>
                  <span className="text-sm font-medium">{count}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Documents by Status</h3>
            <div className="space-y-1">
              {Object.entries(stats.byStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <span className="text-sm">{status}</span>
                  <span className="text-sm font-medium">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentStatistics;
