
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, LucideIcon } from 'lucide-react';

interface Activity {
  icon: React.ReactNode;
  action: string;
  time: string;
  user: string;
}

interface RecentActivitiesCardProps {
  activities: Activity[];
}

const RecentActivitiesCard: React.FC<RecentActivitiesCardProps> = ({ activities }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span>Recent Activities</span>
          <FileText className="h-5 w-5 text-gray-400" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((item, i) => (
            <div key={i} className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-fsms-blue/10 flex items-center justify-center text-fsms-blue mr-3">
                {item.icon}
              </div>
              <div>
                <div className="text-sm font-medium">{item.action}</div>
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <span>{item.time}</span>
                  <span className="inline-block w-1 h-1 rounded-full bg-gray-300"></span>
                  <span>{item.user}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivitiesCard;
