
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getCAPAActivities } from '@/services/capa/capaActivityService';
import { format } from 'date-fns';

interface CAPATimelineProps {
  capaId: string;
}

const CAPATimeline: React.FC<CAPATimelineProps> = ({ capaId }) => {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const data = await getCAPAActivities(capaId);
        setActivities(data);
      } catch (err) {
        setError('Failed to load CAPA timeline');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [capaId]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Timeline</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <p className="text-muted-foreground">Loading activity timeline...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Timeline</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Timeline</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <p className="text-muted-foreground">No activity records found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <div className="absolute top-0 bottom-0 left-6 w-1 bg-gray-200"></div>
          <div className="space-y-6">
            {activities.map((activity) => (
              <div key={activity.id} className="relative pl-14">
                <div className="flex items-center">
                  <div className="absolute left-4 -ml-px h-4 w-4 rounded-full bg-primary border-4 border-white"></div>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(activity.performed_at), 'PPpp')}
                  </p>
                </div>
                <div className="mt-2">
                  <p className="text-sm font-medium">{activity.action_description}</p>
                  {activity.old_status && activity.new_status && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Status changed from <span className="font-medium">{activity.old_status}</span> to{' '}
                      <span className="font-medium">{activity.new_status}</span>
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    By: {activity.performed_by}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CAPATimeline;
