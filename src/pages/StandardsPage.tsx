
import React from 'react';
import { useParams, Navigate, Outlet } from 'react-router-dom';
import StandardSidebar from '@/components/standards/StandardSidebar';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';

const StandardsPage: React.FC = () => {
  const { standardId, moduleId } = useParams<{ standardId?: string; moduleId?: string }>();
  
  // Redirect to SQF standard by default if no standard is selected
  if (!standardId) {
    return <Navigate to="/standards/sqf" replace />;
  }
  
  // Validate the standardId against our known standards
  const validStandards = ['sqf', 'iso22000', 'fssc22000', 'haccp', 'brcgs2'];
  if (!validStandards.includes(standardId)) {
    return <Navigate to="/standards/sqf" replace />;
  }
  
  return (
    <div className="flex h-screen bg-background">
      <StandardSidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="container py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight">
              {standardId.toUpperCase()} Standard
            </h1>
            <p className="text-muted-foreground">
              Review and manage compliance with {standardId.toUpperCase()} requirements
            </p>
          </div>
          
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
