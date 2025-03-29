
import React from 'react';
import { useParams, Navigate, Outlet } from 'react-router-dom';
import StandardSidebar from '@/components/standards/StandardSidebar';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import DashboardHeader from '@/components/DashboardHeader';

const StandardsPage: React.FC = () => {
  const { standardId, moduleId } = useParams<{ standardId?: string; moduleId?: string }>();
  
  // Redirect to SQF standard by default if no standard is selected
  if (!standardId) {
    return <Navigate to="/standards-modules/sqf" replace />;
  }
  
  // Validate the standardId against our known standards
  const validStandards = ['sqf', 'iso22000', 'fssc22000', 'haccp', 'brcgs2'];
  if (!validStandards.includes(standardId)) {
    return <Navigate to="/standards-modules/sqf" replace />;
  }
  
  // Format the standard name for display
  const getStandardDisplayName = () => {
    switch(standardId) {
      case 'sqf': return 'SQF';
      case 'iso22000': return 'ISO 22000';
      case 'fssc22000': return 'FSSC 22000';
      case 'haccp': return 'HACCP';
      case 'brcgs2': return 'BRC GS2';
      default: return standardId.toUpperCase();
    }
  };
  
  return (
    <div className="container mx-auto p-4">
      <DashboardHeader 
        title={`${getStandardDisplayName()} Standard`} 
        subtitle={`Review and manage compliance with ${getStandardDisplayName()} requirements`}
      />
      
      <div className="flex h-full mt-6">
        <StandardSidebar />
        
        <div className="flex-1 ml-6">
          <Separator className="mb-6" />
          
          {!moduleId ? (
            // Show standard overview when no module is selected
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Standard Overview</h2>
              <p className="text-muted-foreground mb-4">
                Select a module from the sidebar to view detailed requirements and compliance information.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                <StandardMetricCard 
                  title="Compliance Score" 
                  value="87%" 
                  trend="up" 
                  description="Overall compliance with standard requirements" 
                />
                <StandardMetricCard 
                  title="Open Items" 
                  value="12" 
                  trend="down" 
                  description="Non-conformances requiring attention" 
                />
                <StandardMetricCard 
                  title="Last Audit" 
                  value="42 days ago" 
                  description="Time since most recent compliance audit" 
                />
              </div>
            </Card>
          ) : (
            // Outlet will render the module-specific content
            <Outlet />
          )}
        </div>
      </div>
    </div>
  );
};

interface StandardMetricCardProps {
  title: string;
  value: string;
  trend?: 'up' | 'down';
  description: string;
}

const StandardMetricCard: React.FC<StandardMetricCardProps> = ({ 
  title, 
  value, 
  trend,
  description 
}) => {
  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      <div className="flex items-center mt-2">
        <span className="text-2xl font-bold">{value}</span>
        {trend && (
          <span className={`ml-2 text-sm ${trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
            {trend === 'up' ? '↑' : '↓'}
          </span>
        )}
      </div>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </div>
  );
};

export default StandardsPage;
