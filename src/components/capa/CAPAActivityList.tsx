
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CAPAActivity } from '@/types/capa';
import { CircleDot } from 'lucide-react';
import { format } from 'date-fns';

interface CAPAActivityListProps {
  capaId: string;
  activities: CAPAActivity[];
  loading: boolean;
}

const CAPAActivityList: React.FC<CAPAActivityListProps> = ({
  capaId,
  activities = [],
  loading = false
}) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Activity Log</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-4 text-center text-muted-foreground">
            Loading activity history...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Activity Log</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="py-4 text-center text-muted-foreground">
            No activities recorded yet.
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={activity.id} className="relative pl-6">
                {index < activities.length - 1 && (
                  <div className="absolute top-3 left-[7px] bottom-0 w-[1px] bg-gray-200" />
                )}
                <div className="absolute top-1 left-0 rounded-full bg-primary w-3.5 h-3.5 flex items-center justify-center">
                  <CircleDot className="h-2.5 w-2.5 text-white" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">{activity.action_description}</p>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>by {activity.performed_by}</span>
                    <span>{format(new Date(activity.performed_at), 'MMM d, yyyy h:mm a')}</span>
                  </div>
                  {activity.old_status && activity.new_status && (
                    <div className="text-xs mt-1">
                      Status changed from{' '}
                      <span className="font-medium">{activity.old_status.replace(/_/g, ' ')}</span>{' '}
                      to{' '}
                      <span className="font-medium">{activity.new_status.replace(/_/g, ' ')}</span>
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
