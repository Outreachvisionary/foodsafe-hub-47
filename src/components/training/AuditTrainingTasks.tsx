
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, ClipboardList, Calendar } from 'lucide-react';

interface AuditTrainingTask {
  id: string;
  title: string;
  description: string;
  due_date: string;
  status: string;
  priority: string;
  audit_id: string;
  assigned_to: string;
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
  if (tasks.length === 0) return null;
  
  const getPriorityBadge = (priority: string) => {
    switch(priority) {
      case 'critical':
        return (
          <Badge variant="destructive" className="text-xs">
            Critical
          </Badge>
        );
      case 'high':
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100 text-xs">
            High
          </Badge>
        );
      case 'medium':
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100 text-xs">
            Medium
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-xs">
            {priority}
          </Badge>
        );
    }
  };
  
  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-amber-500" />
          Audit Training Tasks
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            {criticalTasks > 0 && `${criticalTasks} critical, `}
            {highPriorityTasks > 0 && `${highPriorityTasks} high priority, `}
            {tasks.length} total tasks
          </p>
        </div>
        
        {/* Show up to 3 critical or high priority tasks */}
        <div className="space-y-3">
          {tasks
            .filter(task => task.priority === 'critical' || task.priority === 'high')
            .slice(0, 3)
            .map(task => (
              <div key={task.id} className="flex items-start gap-3 rounded-md border p-3">
                <AlertCircle className={`h-5 w-5 mt-0.5 ${task.priority === 'critical' ? 'text-red-500' : 'text-amber-500'}`} />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">{task.title}</h4>
                    {getPriorityBadge(task.priority)}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                  <div className="flex gap-2 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      Due: {new Date(task.due_date).toLocaleDateString()}
                    </span>
                    <span>Assigned to: {task.assigned_to}</span>
                  </div>
                </div>
              </div>
            ))}
        </div>
        
        <div className="mt-4 flex justify-end">
          <Button variant="outline" onClick={onViewDetails}>
            View All Tasks
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuditTrainingTasks;
