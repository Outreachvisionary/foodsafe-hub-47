
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow, format, isValid, parseISO } from 'date-fns';
import { CalendarDays, Users, Clock } from 'lucide-react';

export interface UpcomingTrainingsProps {
  sessions: any[];
  loading?: boolean;
}

const UpcomingTrainings: React.FC<UpcomingTrainingsProps> = ({ sessions, loading = false }) => {
  // Helper function to safely parse and validate dates
  const safeParseDateAndFormat = (dateString: string | null | undefined, formatter: (date: Date) => string): string => {
    if (!dateString) return 'N/A';
    
    try {
      const parsedDate = parseISO(dateString);
      if (!isValid(parsedDate)) return 'Invalid date';
      return formatter(parsedDate);
    } catch (error) {
      console.error('Error parsing date:', dateString, error);
      return 'Invalid date';
    }
  };

  // Helper function to safely format distance to now
  const safeFormatDistanceToNow = (dateString: string | null | undefined): string => {
    if (!dateString) return 'N/A';
    
    try {
      const parsedDate = parseISO(dateString);
      if (!isValid(parsedDate)) return 'Invalid date';
      return formatDistanceToNow(parsedDate, { addSuffix: true });
    } catch (error) {
      console.error('Error formatting distance to now:', dateString, error);
      return 'Invalid date';
    }
  };

  // Filter sessions to only show upcoming (not completed) ones
  const upcomingSessions = sessions
    .filter(session => session.completion_status !== 'completed')
    .sort((a, b) => {
      // Safe date comparison
      const dateA = a.due_date ? parseISO(a.due_date) : new Date(0);
      const dateB = b.due_date ? parseISO(b.due_date) : new Date(0);
      return dateA.getTime() - dateB.getTime();
    })
    .slice(0, 5); // Just show top 5

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-center items-center h-40">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-32 mb-4"></div>
              <div className="h-20 bg-gray-200 rounded w-full mb-4"></div>
              <div className="h-20 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (upcomingSessions.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center h-40 text-center">
            <CalendarDays className="h-10 w-10 text-gray-400 mb-2" />
            <h3 className="text-lg font-medium">No Upcoming Trainings</h3>
            <p className="text-sm text-gray-500 mb-4">All scheduled trainings have been completed.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Upcoming Training Sessions</h3>
        <div className="space-y-4">
          {upcomingSessions.map(session => (
            <div key={session.id} className="border rounded-lg p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{session.title}</h4>
                  {session.department && (
                    <p className="text-sm text-gray-500">{session.department}</p>
                  )}
                </div>
                <Badge 
                  variant="outline" 
                  className={
                    session.completion_status === 'overdue' 
                      ? 'bg-red-100 text-red-800 border-red-200' 
                      : 'bg-blue-100 text-blue-800 border-blue-200'
                  }
                >
                  {session.completion_status === 'overdue' ? 'Overdue' : safeFormatDistanceToNow(session.due_date)}
                </Badge>
              </div>
              
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-500">
                <div className="flex items-center">
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  {safeParseDateAndFormat(session.due_date, (date) => format(date, 'MMM d, yyyy'))}
                </div>
                <div className="flex items-center">
                  <Users className="h-3.5 w-3.5 mr-1" />
                  {session.assigned_to?.length || 0} participants
                </div>
                <div className="flex items-center">
                  <CalendarDays className="h-3.5 w-3.5 mr-1" />
                  {session.training_type}
                </div>
              </div>
              
              <div className="mt-3">
                <Button variant="outline" size="sm" className="w-full">
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingTrainings;
