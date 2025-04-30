
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { getCAPAActivities } from '@/services/capaService';

export interface CAPAActivity {
  id: string;
  capa_id: string;
  performed_at: string;
  old_status: string | null;
  new_status: string | null;
  action_type: string;
  action_description: string;
  performed_by: string;
  metadata?: any;
}

export interface CAPAActivityListProps {
  capaId: string;
  activities?: CAPAActivity[];
  loading?: boolean;
}

const CAPAActivityList: React.FC<CAPAActivityListProps> = ({ 
  capaId,
  activities: initialActivities,
  loading: initialLoading = false
}) => {
  const [activities, setActivities] = useState<CAPAActivity[]>(initialActivities || []);
  const [loading, setLoading] = useState<boolean>(initialLoading);

  useEffect(() => {
    if (!initialActivities) {
      fetchActivities();
    }
  }, [capaId, initialActivities]);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const fetchedActivities = await getCAPAActivities(capaId);
      setActivities(fetchedActivities);
    } catch (error) {
      console.error('Error fetching CAPA activities:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Activity Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="py-8 text-center">Loading activities...</div>
        ) : activities.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            No activities recorded for this CAPA yet.
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div 
                key={activity.id} 
                className="border-l-2 border-gray-200 pl-4 pb-4 relative"
              >
                <div className="absolute w-3 h-3 bg-gray-200 rounded-full -left-[7px] top-1"></div>
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{activity.action_description}</span>
                    <Badge variant="outline" className="text-xs">
                      {activity.action_type}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {format(new Date(activity.performed_at), 'MMM d, yyyy h:mm a')}
                  </div>
                  <div className="text-sm">
                    By: {activity.performed_by}
                  </div>
                  {activity.old_status && activity.new_status && (
                    <div className="text-sm mt-2">
                      Status changed from{' '}
                      <Badge variant="outline" className="text-xs font-normal mr-1">
                        {activity.old_status}
                      </Badge>
                      to{' '}
                      <Badge variant="outline" className="text-xs font-normal">
                        {activity.new_status}
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
