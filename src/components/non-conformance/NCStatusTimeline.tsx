import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  User, 
  MessageSquare,
  Edit3,
  Plus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { fetchNCActivities } from '@/services/nonConformanceService';
import { NCActivity } from '@/types/non-conformance';
import { toast } from 'sonner';

interface NCStatusTimelineProps {
  nonConformanceId: string;
}

const NCStatusTimeline: React.FC<NCStatusTimelineProps> = ({ nonConformanceId }) => {
  const [activities, setActivities] = useState<NCActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [newActivity, setNewActivity] = useState({
    action: '',
    comments: '',
    new_status: ''
  });

  useEffect(() => {
    loadActivities();
  }, [nonConformanceId]);

  const loadActivities = async () => {
    try {
      setLoading(true);
      const data = await fetchNCActivities(nonConformanceId);
      setActivities(data);
    } catch (error) {
      console.error('Error loading activities:', error);
      toast.error('Failed to load activity timeline');
    } finally {
      setLoading(false);
    }
  };

  const handleAddActivity = async () => {
    if (!newActivity.action.trim()) {
      toast.error('Please enter an action description');
      return;
    }

    try {
      // In a real implementation, you would call an API to create the activity
      // For now, we'll simulate it
      const mockActivity: NCActivity = {
        id: Date.now().toString(),
        non_conformance_id: nonConformanceId,
        action: newActivity.action,
        comments: newActivity.comments,
        performed_at: new Date().toISOString(),
        performed_by: 'Current User', // In real app, get from auth
        previous_status: null,
        new_status: newActivity.new_status as any || null
      };

      setActivities(prev => [mockActivity, ...prev]);
      setNewActivity({ action: '', comments: '', new_status: '' });
      setShowAddActivity(false);
      toast.success('Activity added successfully');
    } catch (error) {
      console.error('Error adding activity:', error);
      toast.error('Failed to add activity');
    }
  };

  const getActivityIcon = (action: string) => {
    if (action.toLowerCase().includes('status')) {
      return <Edit3 className="h-4 w-4" />;
    }
    if (action.toLowerCase().includes('comment') || action.toLowerCase().includes('note')) {
      return <MessageSquare className="h-4 w-4" />;
    }
    if (action.toLowerCase().includes('created') || action.toLowerCase().includes('reported')) {
      return <Plus className="h-4 w-4" />;
    }
    return <CheckCircle className="h-4 w-4" />;
  };

  const getActivityColor = (action: string, newStatus?: string) => {
    if (newStatus) {
      switch (newStatus.toLowerCase()) {
        case 'resolved':
        case 'closed':
          return 'text-success border-success bg-success/10';
        case 'on hold':
          return 'text-destructive border-destructive bg-destructive/10';
        case 'under investigation':
        case 'under review':
          return 'text-warning border-warning bg-warning/10';
        default:
          return 'text-primary border-primary bg-primary/10';
      }
    }
    return 'text-muted-foreground border-muted bg-muted/10';
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const statusOptions = [
    'On Hold',
    'Under Investigation',
    'Under Review',
    'Approved for Use',
    'Released',
    'Disposed',
    'Resolved',
    'Closed'
  ];

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Activity Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="flex space-x-4">
                  <div className="w-8 h-8 bg-muted rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Activity Timeline</span>
          </CardTitle>
          <Dialog open={showAddActivity} onOpenChange={setShowAddActivity}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Activity
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Timeline Activity</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Action Description *</Label>
                  <Textarea
                    value={newActivity.action}
                    onChange={(e) => setNewActivity(prev => ({ ...prev, action: e.target.value }))}
                    placeholder="Describe what happened..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Comments</Label>
                  <Textarea
                    value={newActivity.comments}
                    onChange={(e) => setNewActivity(prev => ({ ...prev, comments: e.target.value }))}
                    placeholder="Additional comments or details..."
                    rows={2}
                  />
                </div>

                <div>
                  <Label>Status Change (Optional)</Label>
                  <Select 
                    value={newActivity.new_status} 
                    onValueChange={(value) => setNewActivity(prev => ({ ...prev, new_status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select new status if applicable" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowAddActivity(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddActivity}>
                    Add Activity
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No activities recorded yet</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-4"
              onClick={() => setShowAddActivity(true)}
            >
              Add First Activity
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {activities.map((activity, index) => {
              const { date, time } = formatDateTime(activity.performed_at);
              const iconColor = getActivityColor(activity.action, activity.new_status || undefined);
              
              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative flex space-x-4"
                >
                  {/* Timeline Line */}
                  {index < activities.length - 1 && (
                    <div className="absolute left-4 top-8 w-px h-16 bg-border"></div>
                  )}
                  
                  {/* Activity Icon */}
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center ${iconColor}`}>
                    {getActivityIcon(activity.action)}
                  </div>
                  
                  {/* Activity Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">
                          {activity.action}
                        </p>
                        
                        {activity.comments && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {activity.comments}
                          </p>
                        )}
                        
                        {(activity.previous_status || activity.new_status) && (
                          <div className="flex items-center space-x-2 mt-2">
                            {activity.previous_status && (
                              <Badge variant="outline" className="text-xs">
                                From: {activity.previous_status}
                              </Badge>
                            )}
                            {activity.new_status && (
                              <Badge variant="default" className="text-xs">
                                To: {activity.new_status}
                              </Badge>
                            )}
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <User className="h-3 w-3" />
                            <span>{activity.performed_by}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{date} at {time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NCStatusTimeline;