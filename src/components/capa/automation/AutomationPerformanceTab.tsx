
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const AutomationPerformanceTab: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Automation Efficiency</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Overdue Detection</span>
                <span>100%</span>
              </div>
              <Progress value={100} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Auto Assignment</span>
                <span>95%</span>
              </div>
              <Progress value={95} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Review Scheduling</span>
                <span>98%</span>
              </div>
              <Progress value={98} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Escalation Processing</span>
                <span>92%</span>
              </div>
              <Progress value={92} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Processing Times</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm">Deadline Checks</span>
              <span className="text-sm font-medium">1.2s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Status Updates</span>
              <span className="text-sm font-medium">0.8s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Notifications</span>
              <span className="text-sm font-medium">2.1s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Report Generation</span>
              <span className="text-sm font-medium">5.3s</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AutomationPerformanceTab;
