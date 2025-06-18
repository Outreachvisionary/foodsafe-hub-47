
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Clock, User, FileText, AlertTriangle, CheckCircle } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'complaint' | 'capa' | 'document' | 'system';
  title: string;
  description: string;
  timestamp: string;
  user: string;
  status?: 'success' | 'warning' | 'error' | 'info';
}

const RecentActivityFeed: React.FC = () => {
  // Mock data - in real implementation, this would come from your activity service
  const activities: ActivityItem[] = [
    {
      id: '1',
      type: 'complaint',
      title: 'New Customer Complaint',
      description: 'Product quality issue reported for Batch #2024-001',
      timestamp: '2 hours ago',
      user: 'John Smith',
      status: 'warning'
    },
    {
      id: '2',
      type: 'capa',
      title: 'CAPA Completed',
      description: 'Corrective action for equipment calibration completed',
      timestamp: '4 hours ago',
      user: 'Sarah Johnson',
      status: 'success'
    },
    {
      id: '3',
      type: 'document',
      title: 'SOP Updated',
      description: 'Standard Operating Procedure v2.1 approved',
      timestamp: '1 day ago',
      user: 'Mike Wilson',
      status: 'info'
    },
    {
      id: '4',
      type: 'system',
      title: 'System Health Check',
      description: 'Automated system diagnostics completed successfully',
      timestamp: '2 days ago',
      user: 'System',
      status: 'success'
    }
  ];

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'complaint': return <AlertTriangle className="h-4 w-4" />;
      case 'capa': return <CheckCircle className="h-4 w-4" />;
      case 'document': return <FileText className="h-4 w-4" />;
      case 'system': return <Activity className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status?: ActivityItem['status']) => {
    switch (status) {
      case 'success': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      case 'info': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <div className={`p-2 rounded-full ${getStatusColor(activity.status)} text-white`}>
                {getActivityIcon(activity.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-sm">{activity.title}</h4>
                  <Badge variant="outline" className="text-xs">
                    {activity.type}
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground mb-2">
                  {activity.description}
                </p>
                
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <User className="h-3 w-3" />
                  <span>{activity.user}</span>
                  <Clock className="h-3 w-3 ml-2" />
                  <span>{activity.timestamp}</span>
                </div>
              </div>
            </div>
          ))}
          
          {activities.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No recent activity</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivityFeed;
