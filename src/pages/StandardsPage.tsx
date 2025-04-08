import React from 'react';
import { useParams, Navigate, Outlet } from 'react-router-dom';
import StandardSidebar from '@/components/standards/StandardSidebar';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import DashboardHeader from '@/components/DashboardHeader';
import { 
  ClipboardCheck, 
  FileCheck, 
  LineChart, 
  Award, 
  TrendingUp, 
  TrendingDown, 
  Clock
} from 'lucide-react';

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
  
  const getStandardIcon = () => {
    switch(standardId) {
      case 'sqf': return <ClipboardCheck className="h-5 w-5 text-blue-500" />;
      case 'iso22000': return <FileCheck className="h-5 w-5 text-green-500" />;
      case 'fssc22000': return <ClipboardCheck className="h-5 w-5 text-purple-500" />;
      case 'haccp': return <LineChart className="h-5 w-5 text-orange-500" />;
      case 'brcgs2': return <Award className="h-5 w-5 text-red-500" />;
      default: return <ClipboardCheck className="h-5 w-5 text-blue-500" />;
    }
  };
  
  return (
    <div className="flex h-full">
      <StandardSidebar />
      
      <div className="flex-1 overflow-auto">
        <DashboardHeader 
          title={
            <div className="flex items-center gap-2">
              {getStandardIcon()}
              <span>{getStandardDisplayName()} Standard</span>
            </div>
          } 
          subtitle={`Review and manage compliance with ${getStandardDisplayName()} requirements`}
        />
        
        <div className="p-6">
          <Separator className="mb-6" />
          
          {!moduleId ? (
            // Show standard overview when no module is selected
            <Card className="p-6 bg-gradient-to-br from-white to-secondary/40 border border-border/60">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                {getStandardIcon()}
                <span>Standard Overview</span>
              </h2>
              <p className="text-muted-foreground mb-6">
                Select a module from the sidebar to view detailed requirements and compliance information.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                <StandardMetricCard 
                  title="Compliance Score" 
                  value="87%" 
                  trend="up" 
                  description="Overall compliance with standard requirements" 
                  icon={<TrendingUp className="h-5 w-5 text-emerald-500" />}
                  color="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200/40"
                />
                <StandardMetricCard 
                  title="Open Items" 
                  value="12" 
                  trend="down" 
                  description="Non-conformances requiring attention" 
                  icon={<TrendingDown className="h-5 w-5 text-rose-500" />}
                  color="bg-gradient-to-br from-rose-50 to-pink-50 border-rose-200/40"
                />
                <StandardMetricCard 
                  title="Last Audit" 
                  value="42 days ago" 
                  description="Time since most recent compliance audit" 
                  icon={<Clock className="h-5 w-5 text-blue-500" />}
                  color="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200/40"
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
  icon: React.ReactNode;
  color?: string;
}

const StandardMetricCard: React.FC<StandardMetricCardProps> = ({ 
  title, 
  value, 
  trend,
  description,
  icon,
  color = "bg-card"
}) => {
  return (
    <div className={`rounded-lg border border-border/60 p-4 shadow-sm ${color}`}>
      <div className="flex justify-between items-start">
        <h3 className="text-sm font-medium text-foreground">{title}</h3>
        {icon}
      </div>
      <div className="flex items-center mt-2">
        <span className="text-2xl font-bold">{value}</span>
        {trend && (
          <span className={`ml-2 text-sm flex items-center ${trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
            {trend === 'up' ? '↑' : '↓'}
          </span>
        )}
      </div>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </div>
  );
};

export default StandardsPage;
