
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';

const AutomationScheduleTab: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Automation Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Daily Tasks</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Check overdue CAPAs (Every hour)</li>
                <li>• Process effectiveness reviews (Daily at 9 AM)</li>
                <li>• Generate performance reports (Daily at 6 PM)</li>
                <li>• Send deadline warnings (Daily at 8 AM)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Weekly Tasks</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Escalate stuck CAPAs (Mondays at 10 AM)</li>
                <li>• Comprehensive analytics (Fridays at 5 PM)</li>
                <li>• System health check (Sundays at midnight)</li>
                <li>• Archive completed CAPAs (Sundays at 2 AM)</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <span className="font-medium">Next Scheduled Tasks</span>
            </div>
            <div className="space-y-1 text-sm">
              <div>Overdue check in 45 minutes</div>
              <div>Daily reports in 6 hours</div>
              <div>Weekly escalation in 2 days</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AutomationScheduleTab;
