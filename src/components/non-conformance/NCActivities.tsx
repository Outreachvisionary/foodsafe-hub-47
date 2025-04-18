
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchNCActivities } from '@/services/nonConformanceService';
import { NCActivity } from '@/types/non-conformance';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { Loader, AlertCircle } from 'lucide-react';

interface NCActivitiesProps {
  nonConformanceId: string;
}

const NCActivities: React.FC<NCActivitiesProps> = ({ nonConformanceId }) => {
  const [activities, setActivities] = useState<NCActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadActivities = async () => {
      try {
        setLoading(true);
        const data = await fetchNCActivities(nonConformanceId);
        setActivities(data);
      } catch (err) {
        console.error('Error loading NC activities:', err);
        setError('Failed to load activity history');
        toast.error('Failed to load activity history');
      } finally {
        setLoading(false);
      }
    };
    
    loadActivities();
  }, [nonConformanceId]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-8 bg-red-50 border border-red-100 rounded flex items-center">
        <AlertCircle className="h-6 w-6 text-red-500 mr-2" />
        <span className="text-red-700">{error}</span>
      </div>
    );
  }
  
  if (activities.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">No activity records found for this non-conformance.</p>
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
        <div className="space-y-4">
          {activities.map((activity) => (
            <div 
              key={activity.id} 
              className="border-l-2 border-primary pl-4 pb-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-gray-500">
                    by {activity.performed_by}
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  {formatDistanceToNow(new Date(activity.performed_at), { addSuffix: true })}
                </div>
              </div>
              
              {activity.previous_status && activity.new_status && (
                <div className="mt-2 text-sm">
                  <span className="text-gray-600">Status changed: </span>
                  <span className="font-medium">{activity.previous_status}</span>
                  <span className="text-gray-600"> → </span>
                  <span className="font-medium">{activity.new_status}</span>
                </div>
              )}
              
              {activity.comments && (
                <div className="mt-2 text-sm text-gray-700 bg-gray-50 p-2 rounded">
                  {activity.comments}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default NCActivities;
