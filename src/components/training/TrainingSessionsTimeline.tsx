
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, addDays, isBefore, isAfter, parseISO } from 'date-fns';
import { Check, Clock, AlertTriangle } from 'lucide-react';

interface TrainingSessionsTimelineProps {
  sessions: any[];
  period: 'week' | 'month' | 'quarter';
}

const TrainingSessionsTimeline: React.FC<TrainingSessionsTimelineProps> = ({ 
  sessions, 
  period 
}) => {
  // Calculate date range based on selected period
  const today = new Date();
  const endDate = period === 'week' 
    ? addDays(today, 7) 
    : period === 'month' 
      ? addDays(today, 30) 
      : addDays(today, 90);
  
  // Helper function to safely parse dates
  const safeParseDate = (dateString: string | null | undefined): Date | null => {
    if (!dateString) return null;
    try {
      // Try to parse the ISO string to a Date
      return parseISO(dateString);
    } catch (e) {
      console.error(`Invalid date: ${dateString}`, e);
      return null;
    }
  };
  
  // Filter sessions within the date range
  const filteredSessions = sessions.filter(session => {
    const sessionDate = safeParseDate(session.due_date);
    // Only include sessions with valid dates that are within the range
    return sessionDate && isAfter(sessionDate, today) && isBefore(sessionDate, endDate);
  });

  if (filteredSessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-center p-4">
        <Clock className="h-10 w-10 text-gray-400 mb-2" />
        <h3 className="text-lg font-medium">No Upcoming Sessions</h3>
        <p className="text-sm text-gray-500">
          No training sessions scheduled for this {period}.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredSessions.map((session) => {
        const sessionDueDate = safeParseDate(session.due_date);
        // Skip rendering if date is invalid
        if (!sessionDueDate) return null;
        
        const isOverdue = isAfter(today, sessionDueDate);
        const statusDisplay = session.completion_status === 'completed' 
          ? 'Completed' 
          : isOverdue 
            ? 'Overdue'
            : 'Upcoming';
            
        const statusClass = session.completion_status === 'completed' 
          ? 'bg-green-100 text-green-800 border-green-200' 
          : isOverdue
            ? 'bg-red-100 text-red-800 border-red-200'
            : 'bg-blue-100 text-blue-800 border-blue-200';
            
        const statusIcon = session.completion_status === 'completed' 
          ? <Check className="h-5 w-5 text-green-600" />
          : isOverdue 
            ? <AlertTriangle className="h-5 w-5 text-red-600" />
            : <Clock className="h-5 w-5 text-primary" />;
            
        return (
          <div key={session.id} className="flex items-start">
            <div className="mr-4 flex flex-col items-center">
              <div className="h-10 w-10 rounded-full flex items-center justify-center bg-primary/10">
                {statusIcon}
              </div>
              <div className="h-full w-px bg-gray-200 my-2"></div>
            </div>
            
            <div className="w-full pb-4">
              <div className="bg-white rounded-lg border p-3 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{session.title}</h4>
                    <p className="text-xs text-gray-500">
                      {format(sessionDueDate, 'MMMM d, yyyy')}
                    </p>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={statusClass}
                  >
                    {statusDisplay}
                  </Badge>
                </div>
                <div className="mt-2 flex items-center text-xs text-gray-500">
                  <span className="mr-2">{session.training_type}</span>
                  <span>•</span>
                  <span className="ml-2">{session.assigned_to?.length || 0} participants</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TrainingSessionsTimeline;
