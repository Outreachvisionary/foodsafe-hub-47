
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTrainingContext } from '@/contexts/TrainingContext';
import { format, isAfter } from 'date-fns';
import { Users, Clock, CalendarClock } from 'lucide-react';

const UpcomingTrainings: React.FC = () => {
  const { sessions, departmentStats } = useTrainingContext();
  
  // Filter upcoming sessions
  const now = new Date();
  const upcomingSessions = sessions
    .filter(session => isAfter(new Date(session.due_date), now))
    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
    .slice(0, 5);
  
  return (
    <div className="space-y-4">
      {upcomingSessions.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          No upcoming training sessions.
        </div>
      ) : (
        <>
          {departmentStats.map((dept, index) => (
            <Card key={index} className="p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">{dept.name}</h4>
                    <p className="text-sm text-gray-500">
                      {dept.completed} of {dept.totalAssigned} completed
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{dept.complianceRate}%</div>
                  <div className="text-sm text-gray-500">compliance</div>
                </div>
              </div>
              
              {dept.overdue > 0 && (
                <div className="mt-2 flex items-center text-red-600 text-sm">
                  <Clock className="h-3 w-3 mr-1" />
                  {dept.overdue} overdue trainings
                </div>
              )}
            </Card>
          ))}
          
          <div className="mt-6">
            <h4 className="font-medium mb-3 flex items-center">
              <CalendarClock className="h-4 w-4 mr-2" />
              Upcoming Sessions
            </h4>
            {upcomingSessions.map(session => (
              <div key={session.id} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <div className="font-medium">{session.title}</div>
                  <div className="text-sm text-gray-500">{session.department}</div>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="mb-1">
                    {format(new Date(session.due_date), 'MMM d')}
                  </Badge>
                  <div className="text-xs text-gray-500">
                    {session.assigned_to.length} assignees
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default UpcomingTrainings;
