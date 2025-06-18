
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FileText, AlertTriangle, CheckSquare, BarChart3, Settings } from 'lucide-react';
import type { QuickAction } from '@/types/dashboard';

interface QuickActionsPanelProps {
  onRefreshData: () => void;
}

const QuickActionsPanel: React.FC<QuickActionsPanelProps> = ({ onRefreshData }) => {
  const quickActions: QuickAction[] = [
    {
      id: 'new-complaint',
      title: 'New Complaint',
      description: 'Report a customer complaint',
      icon: 'AlertTriangle',
      action: () => console.log('Navigate to new complaint form')
    },
    {
      id: 'new-capa',
      title: 'Create CAPA',
      description: 'Start corrective action',
      icon: 'CheckSquare',
      action: () => console.log('Navigate to new CAPA form')
    },
    {
      id: 'upload-document',
      title: 'Upload Document',
      description: 'Add new documentation',
      icon: 'FileText',
      action: () => console.log('Open document upload')
    },
    {
      id: 'view-reports',
      title: 'View Reports',
      description: 'Access analytics dashboard',
      icon: 'BarChart3',
      action: () => console.log('Navigate to reports')
    }
  ];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'AlertTriangle': return <AlertTriangle className="h-4 w-4" />;
      case 'CheckSquare': return <CheckSquare className="h-4 w-4" />;
      case 'FileText': return <FileText className="h-4 w-4" />;
      case 'BarChart3': return <BarChart3 className="h-4 w-4" />;
      default: return <Plus className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {quickActions.map((action) => (
            <Button
              key={action.id}
              variant="outline"
              className="h-auto p-4 flex flex-col items-start gap-2"
              onClick={action.action}
              disabled={action.disabled}
            >
              <div className="flex items-center gap-2 w-full">
                {getIcon(action.icon)}
                <span className="font-medium">{action.title}</span>
              </div>
              <span className="text-xs text-muted-foreground text-left">
                {action.description}
              </span>
            </Button>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <Button 
            onClick={onRefreshData} 
            variant="secondary" 
            className="w-full"
          >
            Refresh Dashboard Data
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActionsPanel;
