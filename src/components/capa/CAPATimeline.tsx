
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, AlertCircle, CheckCircle, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface CAPAActivity {
  id: string;
  action_type: string;
  action_description: string;
  performed_by: string;
  performed_at: string;
  old_status?: string;
  new_status?: string;
}

interface CAPATimelineProps {
  capaId?: string;
}

const CAPATimeline: React.FC<CAPATimelineProps> = ({ capaId }) => {
  const [activities, setActivities] = useState<CAPAActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for now
    const mockActivities: CAPAActivity[] = [
      {
        id: '1',
        action_type: 'create',
        action_description: 'CAPA created',
        performed_by: 'System',
        performed_at: new Date().toISOString(),
        old_status: '',
        new_status: 'Open'
      },
      {
        id: '2',
        action_type: 'update',
        action_description: 'Root cause identified',
        performed_by: 'Quality Manager',
        performed_at: new Date(Date.now() - 86400000).toISOString(),
        old_status: 'Open',
        new_status: 'In_Progress'
      }
    ];
    
    setActivities(mockActivities);
    setLoading(false);
  }, [capaId]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Activity Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center py-4">Loading activity timeline...</p>
        </CardContent>
      </Card>
    );
  }

  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Activity Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center py-4">No activities recorded yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Activity Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative border-l-2 border-gray-200 ml-4 space-y-6 py-2">
          {activities.map((activity) => (
            <div key={activity.id} className="relative pl-8 pb-4">
              <div className="absolute -left-3 h-6 w-6 rounded-full bg-white border-2 border-primary flex items-center justify-center">
                {activity.action_type === 'create' && <AlertCircle className="h-3 w-3 text-primary" />}
                {activity.action_type === 'update' && <Clock className="h-3 w-3 text-amber-500" />}
                {activity.action_type === 'complete' && <CheckCircle className="h-3 w-3 text-green-500" />}
              </div>
              
              <div className="flex flex-col">
                <h4 className="text-sm font-medium">{activity.action_description}</h4>
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <Calendar className="h-3 w-3 mr-1" />
                  {format(new Date(activity.performed_at), 'PPp')}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">By {activity.performed_by}</p>
                
                {activity.old_status && activity.new_status && (
                  <p className="text-xs mt-1">
                    Status changed from <span className="font-medium">{activity.old_status.replace('_', ' ')}</span> to{' '}
                    <span className="font-medium">{activity.new_status.replace('_', ' ')}</span>
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CAPATimeline;
