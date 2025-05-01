
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Timeline, 
  TimelineItem, 
  TimelineConnector, 
  TimelineHeader, 
  TimelineIcon, 
  TimelineBody 
} from '@/components/ui/timeline';
import { Loader2, AlertCircle, CheckCircle, XCircle, PenTool, Eye } from 'lucide-react';
import { CAPAStatus } from '@/types/enums';
import { formatEnumValue } from '@/utils/typeAdapters';

export interface CAPAActivity {
  id: string;
  capa_id: string;
  action_type: string;
  action_description: string;
  performed_at: string;
  performed_by: string;
  old_status?: CAPAStatus;
  new_status?: CAPAStatus;
  metadata?: Record<string, any>;
}

interface CAPAActivityListProps {
  capaId: string;
  activities: CAPAActivity[];
  loading?: boolean;
}

const getActivityIcon = (actionType: string) => {
  switch (actionType) {
    case 'status_change':
      return <PenTool className="h-4 w-4" />;
    case 'verification':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'rejection':
      return <XCircle className="h-4 w-4 text-red-500" />;
    case 'comment':
      return <PenTool className="h-4 w-4 text-blue-500" />;
    case 'review':
      return <Eye className="h-4 w-4 text-amber-500" />;
    default:
      return <PenTool className="h-4 w-4" />;
  }
};

const getStatusColor = (status: string | CAPAStatus) => {
  if (!status) return 'bg-gray-200 text-gray-700';
  
  switch (status.toString()) {
    case CAPAStatus.Open:
      return 'bg-blue-100 text-blue-800';
    case CAPAStatus.InProgress:
      return 'bg-amber-100 text-amber-800';
    case CAPAStatus.Completed:
      return 'bg-green-100 text-green-800';
    case CAPAStatus.Closed:
      return 'bg-gray-100 text-gray-800';
    case CAPAStatus.Rejected:
      return 'bg-red-100 text-red-800';
    case CAPAStatus.OnHold:
      return 'bg-purple-100 text-purple-800';
    case CAPAStatus.Overdue:
      return 'bg-red-100 text-red-800';
    case CAPAStatus.PendingVerification:
      return 'bg-amber-100 text-amber-800';
    case CAPAStatus.Verified:
      return 'bg-green-100 text-green-800';
    case CAPAStatus.UnderReview:
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const CAPAActivityList: React.FC<CAPAActivityListProps> = ({ capaId, activities, loading = false }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };
  
  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-6">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }
  
  if (!activities || activities.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-6">
          <div className="text-center">
            <AlertCircle className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-2 text-muted-foreground">No activity recorded for this CAPA</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardContent className="py-4">
        <Timeline>
          {activities.map((activity, index) => (
            <TimelineItem key={activity.id}>
              {index < activities.length - 1 && <TimelineConnector />}
              <TimelineHeader>
                <TimelineIcon>
                  {getActivityIcon(activity.action_type)}
                </TimelineIcon>
                <div className="flex flex-col">
                  <p className="text-sm font-medium">{activity.action_description}</p>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(activity.performed_at)} by {activity.performed_by}
                  </span>
                </div>
              </TimelineHeader>
              <TimelineBody>
                <div className="text-sm space-y-2">
                  {activity.old_status && activity.new_status && (
                    <div className="flex items-center gap-2 text-xs">
                      <span className={`px-2 py-1 rounded ${getStatusColor(activity.old_status)}`}>
                        {formatEnumValue(activity.old_status.toString())}
                      </span>
                      <span className="text-muted-foreground">→</span>
                      <span className={`px-2 py-1 rounded ${getStatusColor(activity.new_status)}`}>
                        {formatEnumValue(activity.new_status.toString())}
                      </span>
                    </div>
                  )}
                  {activity.metadata && (
                    <div className="text-xs text-muted-foreground">
                      {Object.entries(activity.metadata).map(([key, value]) => (
                        <div key={key}>
                          <span className="font-medium">{key}: </span>
                          {typeof value === 'string' ? value : JSON.stringify(value)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TimelineBody>
            </TimelineItem>
          ))}
        </Timeline>
      </CardContent>
    </Card>
  );
};

export default CAPAActivityList;
