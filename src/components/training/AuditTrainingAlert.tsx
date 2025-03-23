
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from 'lucide-react';

interface AuditTrainingAlertProps {
  count: number;
  criticalTasks: number;
}

const AuditTrainingAlert: React.FC<AuditTrainingAlertProps> = ({ count, criticalTasks }) => {
  if (count === 0) return null;

  return (
    <Alert className="mb-6 border-amber-200 bg-amber-50">
      <AlertTriangle className="h-4 w-4 text-amber-600" />
      <AlertTitle className="text-amber-800">Audit-Related Training</AlertTitle>
      <AlertDescription className="text-amber-700">
        There {count === 1 ? 'is' : 'are'} {count} training task{count !== 1 ? 's' : ''} assigned from audit findings.
        {criticalTasks > 0 && ` ${criticalTasks} ${criticalTasks === 1 ? 'task requires' : 'tasks require'} immediate attention.`}
      </AlertDescription>
    </Alert>
  );
};

export default AuditTrainingAlert;
