
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { NonConformance } from '@/types/non-conformance';

interface NCWorkflowTimelineProps {
  nonConformance: NonConformance;
}

const NCWorkflowTimeline: React.FC<NCWorkflowTimelineProps> = ({ nonConformance }) => {
  const steps = [
    {
      name: 'Created',
      completed: true,
      date: nonConformance.created_at,
      by: nonConformance.created_by,
    },
    {
      name: 'Under Review',
      completed: ['Under Review', 'Released', 'Approved', 'Resolved', 'Closed'].includes(nonConformance.status),
      date: nonConformance.review_date,
      by: nonConformance.reviewer,
    },
    {
      name: 'Disposition Decision',
      completed: ['Released', 'Disposed', 'Approved', 'Rejected', 'Resolved', 'Closed'].includes(nonConformance.status),
      date: nonConformance.updated_at,
      by: nonConformance.assigned_to,
    },
    {
      name: 'Resolved',
      completed: ['Resolved', 'Closed'].includes(nonConformance.status),
      date: nonConformance.resolution_date,
      by: nonConformance.assigned_to,
    },
    {
      name: 'Closed',
      completed: ['Closed'].includes(nonConformance.status),
      date: nonConformance.resolution_date,
      by: nonConformance.assigned_to,
    },
  ];

  return (
    <div className="space-y-2">
      {steps.map((step, index) => (
        <div
          key={index}
          className={`flex items-start space-x-3 ${
            step.completed ? 'text-gray-900' : 'text-gray-400'
          }`}
        >
          <div
            className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center ${
              step.completed
                ? 'bg-green-100 text-green-600'
                : 'bg-gray-100 text-gray-400'
            }`}
          >
            {step.completed ? (
              <CheckCircle className="h-3 w-3" />
            ) : (
              <Clock className="h-3 w-3" />
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">{step.name}</p>
            {step.completed && step.date && (
              <p className="text-xs text-gray-500 mt-0.5">
                {format(new Date(step.date), 'MMM d, yyyy')}
                {step.by && ` by ${step.by}`}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default NCWorkflowTimeline;
