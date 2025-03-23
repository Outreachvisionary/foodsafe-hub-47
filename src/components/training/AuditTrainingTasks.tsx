
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, BookOpen } from 'lucide-react';
import CategoryIcon from './CategoryIcon';
import HazardTypeIcons from './HazardTypeIcons';
import { FoodHazardType } from '@/hooks/useAuditTraining';

interface AuditTrainingTask {
  id: string;
  auditId: string;
  courseTitle: string;
  status: string;
  dueDate: string;
  priority?: string;
  category?: string;
  hazardTypes?: FoodHazardType[];
  notes?: string;
}

interface AuditTrainingTasksProps {
  tasks: AuditTrainingTask[];
  onViewDetails: () => void;
  criticalTasks: number;
  highPriorityTasks: number;
}

const AuditTrainingTasks: React.FC<AuditTrainingTasksProps> = ({ 
  tasks, 
  onViewDetails,
  criticalTasks,
  highPriorityTasks
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned':
        return 'bg-blue-100 text-blue-800';
      case 'in-progress':
        return 'bg-amber-100 text-amber-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (tasks.length === 0) {
    return null;
  }

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-blue-600" />
          Audit-Related Training Tasks
        </CardTitle>
        <CardDescription>
          Training assignments based on audit findings and CAPAs
          {criticalTasks > 0 && ` (${criticalTasks} ${criticalTasks === 1 ? 'task requires' : 'tasks require'} immediate attention)`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tasks.map(task => (
            <div key={task.id} className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0">
              <div>
                <div className="flex items-center gap-2">
                  <CategoryIcon category={task.category} />
                  <h4 className="font-medium">{task.courseTitle}</h4>
                  <Badge className={getStatusColor(task.status)}>
                    {task.status}
                  </Badge>
                  {task.priority && (
                    <Badge className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-500">From Audit #{task.auditId}</p>
                <div className="flex items-center gap-1 mt-1 text-sm">
                  <Clock className="h-3.5 w-3.5 text-gray-400" />
                  <span className={task.status === 'overdue' ? 'text-red-600 font-medium' : ''}>
                    Due: {task.dueDate}
                  </span>
                </div>
                {task.hazardTypes && task.hazardTypes.length > 0 && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">Hazards:</span>
                    <HazardTypeIcons hazardTypes={task.hazardTypes} />
                  </div>
                )}
                {task.notes && (
                  <p className="text-xs text-gray-600 mt-1 italic">{task.notes}</p>
                )}
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={onViewDetails}
                >
                  View Details
                </Button>
                {task.status === 'assigned' && (
                  <Button 
                    variant="default" 
                    size="sm"
                  >
                    Start Training
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AuditTrainingTasks;
