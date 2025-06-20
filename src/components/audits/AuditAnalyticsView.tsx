
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

const AuditAnalyticsView: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Audit Analytics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500">Advanced analytics and reporting coming soon</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuditAnalyticsView;
