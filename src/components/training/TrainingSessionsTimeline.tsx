
import React from 'react';
import { TrainingSession } from '@/types/training';
import { 
  Timeline, 
  TimelineItem, 
  TimelineContent, 
  TimelineSeparator, 
  TimelineDot, 
  TimelineConnector 
} from '@/components/ui/timeline';
import { Card } from '@/components/ui/card';
import { formatDistanceToNow, format, isBefore, isAfter, subDays, addDays } from 'date-fns';
import { BookOpen, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TrainingSessionsTimelineProps {
  sessions: TrainingSession[];
  period: 'week' | 'month' | 'quarter';
}

const TrainingSessionsTimeline: React.FC<TrainingSessionsTimelineProps> = ({ sessions, period }) => {
  const now = new Date();
  
  // Filter sessions based on the selected period
  const filteredSessions = sessions.filter(session => {
    const dueDate = new Date(session.due_date);
    
    if (period === 'week') {
      return isAfter(dueDate, subDays(now, 7)) && isBefore(dueDate, addDays(now, 7));
    }
    if (period === 'month') {
      return isAfter(dueDate, subDays(now, 30)) && isBefore(dueDate, addDays(now, 30));
    }
    if (period === 'quarter') {
      return isAfter(dueDate, subDays(now, 90)) && isBefore(dueDate, addDays(now, 90));
    }
    return true;
  }).sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());

  if (filteredSessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <Clock className="h-12 w-12 mb-4 opacity-20" />
        <p>No training sessions in this time period</p>
      </div>
    );
  }

  return (
    <Timeline>
      {filteredSessions.map((session) => {
        const dueDate = new Date(session.due_date);
        const isPast = isBefore(dueDate, now);
        const isCompleted = session.completion_status === 'completed';
        
        // Determine icon and color for timeline dot
        let icon = <BookOpen className="h-4 w-4" />;
        let color: 'primary' | 'secondary' | 'error' | 'success' | 'warning' = 'primary';
        
        if (isCompleted) {
          icon = <CheckCircle className="h-4 w-4" />;
          color = 'success';
        } else if (isPast) {
          icon = <AlertTriangle className="h-4 w-4" />;
          color = 'error';
        }
        
        return (
          <TimelineItem key={session.id}>
            <TimelineSeparator>
              <TimelineDot color={color}>
                {icon}
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Card className="p-3 mb-4 shadow-sm border">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{session.title}</div>
                    <div className="text-sm text-gray-500">{session.department}</div>
                  </div>
                  <div className="flex flex-col items-end">
                    {session.completion_status === 'completed' ? (
                      <Badge variant="outline" className="bg-green-100 text-green-800">
                        Completed
                      </Badge>
                    ) : isPast ? (
                      <Badge variant="outline" className="bg-red-100 text-red-800">
                        Overdue
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-blue-100 text-blue-800">
                        {formatDistanceToNow(dueDate, { addSuffix: true })}
                      </Badge>
                    )}
                    <div className="text-xs text-gray-500 mt-1">
                      {format(dueDate, 'MMM d, yyyy')}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  {session.assigned_to.length} participants
                </div>
              </Card>
            </TimelineContent>
          </TimelineItem>
        );
      })}
    </Timeline>
  );
};

export default TrainingSessionsTimeline;
