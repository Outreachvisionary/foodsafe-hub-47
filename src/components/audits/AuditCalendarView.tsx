
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

const AuditCalendarView: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Audit Calendar
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500">Calendar view for scheduled audits coming soon</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuditCalendarView;
