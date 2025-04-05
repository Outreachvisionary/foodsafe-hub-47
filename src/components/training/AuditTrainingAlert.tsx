
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface AuditTrainingAlertProps {
  count: number;
  criticalTasks: number;
}

const AuditTrainingAlert: React.FC<AuditTrainingAlertProps> = ({ count, criticalTasks }) => {
  if (count === 0) return null;
  
  return (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Audit-Related Training Required</AlertTitle>
      <AlertDescription>
        You have {count} training tasks pending from recent audits
        {criticalTasks > 0 && `, including ${criticalTasks} critical tasks that require immediate attention`}.
      </AlertDescription>
    </Alert>
  );
};

export default AuditTrainingAlert;
