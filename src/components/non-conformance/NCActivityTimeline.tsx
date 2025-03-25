
import React, { useState, useEffect } from 'react';
import { NCActivity } from '@/types/non-conformance';
import { AlertTriangle, CheckCircle, Clock, Trash2, MessageSquare, User } from 'lucide-react';
import { fetchNCActivities } from '@/services/nonConformanceService';

interface NCActivityTimelineProps {
  nonConformanceId: string;
}

const NCActivityTimeline: React.FC<NCActivityTimelineProps> = ({ nonConformanceId }) => {
  const [activities, setActivities] = useState<NCActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadActivities = async () => {
      try {
        setLoading(true);
        const activitiesData = await fetchNCActivities(nonConformanceId);
        setActivities(activitiesData);
      } catch (error) {
        console.error('Error loading activities:', error);
      } finally {
        setLoading(false);
      }
    };

    loadActivities();
  }, [nonConformanceId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="text-center p-6">
        <p className="text-gray-500">No activity recorded yet.</p>
      </div>
    );
  }

  const getStatusIcon = (status: string | undefined) => {
    if (!status) return null;
    
    switch (status) {
      case 'On Hold':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'Under Review':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'Released':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'Disposed':
        return <Trash2 className="h-4 w-4 text-gray-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <div key={activity.id} className="relative pl-6 pb-4">
          {/* Timeline connector */}
          {index !== activities.length - 1 && (
            <div className="absolute left-2 top-2 bottom-0 w-0.5 bg-gray-200"></div>
          )}
          
          {/* Timeline dot */}
          <div className="absolute left-0 top-2 bg-white border-2 border-gray-300 rounded-full w-4 h-4 flex items-center justify-center">
            {activity.action.includes('Status changed') ? (
              getStatusIcon(activity.new_status)
            ) : (
              <MessageSquare className="h-2 w-2 text-gray-500" />
            )}
          </div>
          
          {/* Activity content */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{activity.action}</span>
              </div>
              <span className="text-xs text-gray-500">
                {activity.performed_at ? new Date(activity.performed_at).toLocaleString() : ''}
              </span>
            </div>
            
            <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
              <User className="h-3 w-3" />
              <span>{activity.performed_by}</span>
            </div>
            
            {activity.comments && (
              <div className="mt-2 text-sm text-gray-700 bg-white p-2 rounded border">
                {activity.comments}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default NCActivityTimeline;
