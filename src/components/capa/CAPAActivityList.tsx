
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CAPAActivity } from '@/types/capa';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';

interface CAPAActivityListProps {
  capaId: string;
  activities: CAPAActivity[];
  loading: boolean;
  onActivityChange?: () => void;
}

const CAPAActivityList: React.FC<CAPAActivityListProps> = ({
  capaId,
  activities,
  loading,
  onActivityChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Activity History</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : activities.length > 0 ? (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="border-b border-gray-100 pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{activity.action_description || "Action performed"}</p>
                    <p className="text-sm text-gray-500">
                      {activity.action_type?.replace(/_/g, ' ') || "Activity"}
                    </p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {format(new Date(activity.performed_at || new Date()), 'MMM d, yyyy h:mm a')}
                  </div>
                </div>
                <p className="text-sm mt-1">By: {activity.performed_by || "Unknown user"}</p>
                {activity.old_status && activity.new_status && (
                  <p className="text-xs mt-1 text-gray-600">
                    Status changed from{' '}
                    <span className="font-medium">{activity.old_status.replace(/_/g, ' ')}</span> to{' '}
                    <span className="font-medium">{activity.new_status.replace(/_/g, ' ')}</span>
                  </p>
                )}
                {activity.metadata && activity.metadata.comments && (
                  <p className="text-sm mt-1 italic">"{activity.metadata.comments}"</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center py-4 text-gray-500">No activity recorded yet</p>
        )}
      </CardContent>
    </Card>
  );
};

export default CAPAActivityList;
