
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Clock } from 'lucide-react';
import { CAPAActivity } from '@/types/capa';
import { formatEnumValue } from '@/utils/typeAdapters';

interface CAPAActivityListProps {
  activities: CAPAActivity[];
  loading?: boolean;
}

const CAPAActivityList: React.FC<CAPAActivityListProps> = ({ activities = [], loading = false }) => {
  // Get activity type badge
  const getActivityTypeBadge = (type: string) => {
    switch (type) {
      case 'status_update':
        return <Badge className="bg-blue-100 text-blue-800">Status Update</Badge>;
      case 'comment':
        return <Badge className="bg-gray-100 text-gray-800">Comment</Badge>;
      case 'assignment':
        return <Badge className="bg-purple-100 text-purple-800">Assignment</Badge>;
      case 'document_upload':
        return <Badge className="bg-green-100 text-green-800">Document Upload</Badge>;
      case 'verification':
        return <Badge className="bg-amber-100 text-amber-800">Verification</Badge>;
      case 'creation':
        return <Badge className="bg-indigo-100 text-indigo-800">Creation</Badge>;
      default:
        return <Badge>{type.replace('_', ' ')}</Badge>;
    }
  };
  
  // Format relative time
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };
  
  // Get initials for avatar
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Example activity data for preview if none provided
  const mockActivities: CAPAActivity[] = [
    {
      id: '1',
      capa_id: 'capa-123',
      action_type: 'status_update',
      action_description: 'Changed status from Open to In Progress',
      performed_at: new Date().toISOString(),
      performed_by: 'John Doe',
      old_status: 'Open',
      new_status: 'In_Progress'
    },
    {
      id: '2',
      capa_id: 'capa-123',
      action_type: 'comment',
      action_description: 'Added a comment: "Initial investigation completed, root cause identified as improper sanitization procedure"',
      performed_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      performed_by: 'Jane Smith'
    },
    {
      id: '3',
      capa_id: 'capa-123',
      action_type: 'creation',
      action_description: 'CAPA created',
      performed_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      performed_by: 'System'
    }
  ];

  // Use provided activities or mock data if none
  const displayActivities = activities.length > 0 ? activities : mockActivities;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Activity History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-6">
            <p className="text-muted-foreground">Loading activities...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity History</CardTitle>
      </CardHeader>
      <CardContent>
        {displayActivities.length === 0 ? (
          <div className="flex justify-center py-6">
            <p className="text-muted-foreground">No activity recorded yet</p>
          </div>
        ) : (
          <div className="relative space-y-5">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 bottom-0 border-l border-dashed border-gray-200 ml-[7px]"></div>
            
            {/* Activities */}
            {displayActivities.map((activity, index) => (
              <div key={activity.id} className="flex gap-4">
                <div className="relative flex-shrink-0 mt-1">
                  <Avatar className="h-6 w-6 bg-white border">
                    <AvatarFallback className="text-xs">
                      {getInitials(activity.performed_by)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">
                        {activity.performed_by}
                      </span>
                      {getActivityTypeBadge(activity.action_type)}
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatRelativeTime(activity.performed_at)}
                    </div>
                  </div>
                  
                  <p className="text-sm">{activity.action_description}</p>
                  
                  {activity.old_status && activity.new_status && (
                    <div className="mt-1.5 flex items-center text-xs">
                      <Badge variant="outline" className="bg-gray-50">
                        {formatEnumValue(activity.old_status.toString())}
                      </Badge>
                      <span className="mx-2">&rarr;</span>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        {formatEnumValue(activity.new_status.toString())}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CAPAActivityList;
