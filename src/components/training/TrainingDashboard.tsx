
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpenCheck, 
  Clock, 
  AlertCircle, 
  Award, 
  Calendar, 
  Users, 
  BookOpen, 
  ClipboardList 
} from 'lucide-react';
import OverallComplianceCard from './dashboard/OverallComplianceCard';
import UpcomingTrainingCard from './dashboard/UpcomingTrainingCard';
import DepartmentComplianceChart from './dashboard/DepartmentComplianceChart';
import ExpiringCertificationsCard from './dashboard/ExpiringCertificationsCard';
import RecentActivitiesCard from './dashboard/RecentActivitiesCard';

const TrainingDashboard: React.FC = () => {
  const trainingStats = {
    totalAssigned: 245,
    completed: 192,
    inProgress: 32,
    overdue: 21,
    compliance: 78,
    avgScore: 88,
    certExpiringCount: 8
  };

  return (
    <div className="space-y-6">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Completed Trainings" 
          value={trainingStats.completed} 
          description="Total completed" 
          icon={<BookOpenCheck className="h-5 w-5 text-green-500" />}
          trend="+3% from last month"
        />
        
        <StatsCard 
          title="In Progress" 
          value={trainingStats.inProgress} 
          description="Currently active" 
          icon={<Clock className="h-5 w-5 text-blue-500" />}
        />
        
        <StatsCard 
          title="Overdue Trainings" 
          value={trainingStats.overdue} 
          description="Require attention" 
          icon={<AlertCircle className="h-5 w-5 text-red-500" />}
          trend="+5 in last week"
          trendNegative
        />
        
        <StatsCard 
          title="Average Score" 
          value={`${trainingStats.avgScore}%`} 
          description="Across all courses" 
          icon={<Award className="h-5 w-5 text-purple-500" />}
          trend="+2.5% this quarter"
        />
      </div>
      
      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <OverallComplianceCard 
            compliancePercentage={trainingStats.compliance} 
            totalAssigned={trainingStats.totalAssigned}
            completed={trainingStats.completed}
          />
        </div>
        
        <div>
          <UpcomingTrainingCard />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DepartmentComplianceChart />
        </div>
        
        <div>
          <ExpiringCertificationsCard count={trainingStats.certExpiringCount} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivitiesCard />
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <ClipboardList className="h-5 w-5 text-blue-500 mr-2" />
              Quick Actions
            </CardTitle>
            <CardDescription>Common training management tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <QuickActionButton 
                icon={<BookOpen className="w-4 h-4" />} 
                label="Assign Training"
              />
              <QuickActionButton 
                icon={<Users className="w-4 h-4" />} 
                label="Add Employee"
              />
              <QuickActionButton 
                icon={<Award className="w-4 h-4" />} 
                label="Record Certification"
              />
              <QuickActionButton 
                icon={<Calendar className="w-4 h-4" />} 
                label="Schedule Assessment"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Helper Components
interface StatsCardProps {
  title: string;
  value: number | string;
  description: string;
  icon: React.ReactNode;
  trend?: string;
  trendNegative?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  description, 
  icon,
  trend,
  trendNegative = false
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {trend && (
          <p className={`text-xs mt-1 ${trendNegative ? 'text-red-500' : 'text-green-500'}`}>
            {trend}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

interface QuickActionButtonProps {
  icon: React.ReactNode;
  label: string;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({ icon, label }) => {
  return (
    <button className="flex items-center justify-center p-3 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors text-sm w-full">
      {icon}
      <span className="ml-2">{label}</span>
    </button>
  );
};

export default TrainingDashboard;
