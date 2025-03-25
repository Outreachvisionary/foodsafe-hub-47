
import React, { useState, useEffect } from 'react';
import { fetchNCActivities } from '@/services/nonConformanceService';
import { NCActivity } from '@/types/non-conformance';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, AlertCircle, Clock, ShieldAlert, Package } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NCActivityTimelineProps {
  nonConformanceId: string;
}

const NCActivityTimeline: React.FC<NCActivityTimelineProps> = ({ nonConformanceId }) => {
  const [activities, setActivities] = useState<NCActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadActivities = async () => {
      try {
        setLoading(true);
        const activitiesData = await fetchNCActivities(nonConformanceId);
        setActivities(activitiesData);
      } catch (error) {
        console.error('Error loading activities:', error);
        toast({
          title: 'Failed to load activity timeline',
          description: 'There was an error fetching the activity data.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadActivities();
  }, [nonConformanceId, toast]);

  const getActivityIcon = (activity: NCActivity) => {
    if (activity.action.includes('Status changed')) {
      if (activity.new_status === 'Released') {
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      } else if (activity.new_status === 'On Hold') {
        return <AlertCircle className="h-5 w-5 text-orange-500" />;
      } else if (activity.new_status === 'Under Review') {
        return <Clock className="h-5 w-5 text-blue-500" />;
      } else if (activity.new_status === 'Disposed') {
        return <ShieldAlert className="h-5 w-5 text-gray-500" />;
      }
    } else if (activity.action.includes('quantity')) {
      return <Package className="h-5 w-5 text-purple-500" />;
    }
    
    return <Clock className="h-5 w-5 text-gray-500" />;
  };

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500">No activity recorded yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <div key={activity.id} className="relative">
          <div className="flex items-start">
            <div className="flex items-center h-9">
              {getActivityIcon(activity)}
            </div>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium">{activity.action}</p>
              {activity.comments && (
                <p className="text-sm text-gray-500">{activity.comments}</p>
              )}
              <div className="flex items-center text-xs text-gray-500">
                <span>{new Date(activity.performed_at || '').toLocaleString()}</span>
                <span className="mx-2">•</span>
                <span>By {activity.performed_by}</span>
              </div>
            </div>
          </div>
          {index < activities.length - 1 && (
            <Separator className="my-4" />
          )}
        </div>
      ))}
    </div>
  );
};

export default NCActivityTimeline;
