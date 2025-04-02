
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, User } from 'lucide-react';

interface WorkflowStepProps {
  stepNumber: number;
  title: string;
  description: string;
  role: string;
  deadline: number;
  isCompleted?: boolean;
  isActive?: boolean;
}

export const WorkflowStep: React.FC<WorkflowStepProps> = ({
  stepNumber,
  title,
  description,
  role,
  deadline,
  isCompleted = false,
  isActive = false
}) => {
  return (
    <Card className={`
      border-l-4 
      ${isCompleted ? 'border-l-green-500' : 
        isActive ? 'border-l-blue-500' : 'border-l-gray-200'}
    `}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <div className={`
                w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium
                ${isCompleted ? 'bg-green-100 text-green-800' : 
                  isActive ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}
              `}>
                {stepNumber}
              </div>
              <h4 className="font-medium">{title}</h4>
              {isCompleted && (
                <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                  Completed
                </Badge>
              )}
              {isActive && (
                <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                  Active
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {description}
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
          <div className="flex items-center">
            <User className="h-3.5 w-3.5 mr-1" />
            <span>{role}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-3.5 w-3.5 mr-1" />
            <span>Due within {deadline} {deadline === 1 ? 'day' : 'days'}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
