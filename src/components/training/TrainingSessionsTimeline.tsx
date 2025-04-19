
import React from 'react';
import { TrainingSession } from '@/types/training';
import { format, isAfter, isBefore, addDays, addMonths, addWeeks } from 'date-fns';
import { Timeline, TimelineItem, TimelineContent, TimelineSeparator, TimelineDot, TimelineConnector } from '@/components/ui/timeline';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Hourglass, CheckCircle2 } from 'lucide-react';

interface TrainingSessionsTimelineProps {
  sessions: TrainingSession[];
  period: 'week' | 'month' | 'quarter';
}

const TrainingSessionsTimeline: React.FC<TrainingSessionsTimelineProps> = ({ sessions, period }) => {
  // Filter sessions based on selected period
  const now = new Date();
  let filterEndDate;
  
  switch (period) {
    case 'week':
      filterEndDate = addWeeks(now, 1);
      break;
    case 'month':
      filterEndDate = addMonths(now, 1);
      break;
    case 'quarter':
      filterEndDate = addMonths(now, 3);
      break;
  }
  
  const filteredSessions = sessions.filter(session => {
    const startDate = new Date(session.start_date);
    return isBefore(startDate, filterEndDate) && isAfter(startDate, addDays(now, -7));
  }).sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());
  
  if (filteredSessions.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        No training sessions scheduled for this period.
      </div>
    );
  }
  
  return (
    <Timeline>
      {filteredSessions.map((session) => {
        const startDate = new Date(session.start_date);
        const isUpcoming = isAfter(startDate, now);
        const isRecent = isBefore(startDate, now) && isAfter(startDate, addDays(now, -3));
        
        let dotColor: 'primary' | 'success' | 'warning' | 'secondary' = 'secondary';
        
        if (isUpcoming) {
          dotColor = 'primary';
        } else if (isRecent) {
          dotColor = 'success';
        }
        
        return (
          <TimelineItem key={session.id}>
            <TimelineSeparator>
              <TimelineDot color={dotColor} />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{session.title}</h4>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <CalendarIcon className="h-3 w-3 mr-1" />
                    {format(new Date(session.start_date), 'MMM d, yyyy')}
                  </div>
                </div>
                <Badge 
                  variant="outline" 
                  className={`capitalize ${
                    session.completion_status === 'completed' ? 'bg-green-100 text-green-800' : 
                    session.completion_status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                    session.completion_status === 'overdue' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100'
                  }`}
                >
                  {session.completion_status.replace(/-/g, ' ')}
                </Badge>
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {session.department}
              </div>
            </TimelineContent>
          </TimelineItem>
        );
      })}
    </Timeline>
  );
};

export default TrainingSessionsTimeline;
