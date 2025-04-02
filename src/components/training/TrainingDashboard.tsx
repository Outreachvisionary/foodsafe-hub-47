import React, { useState, useEffect } from 'react';
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
  ClipboardList,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import OverallComplianceCard from './dashboard/OverallComplianceCard';
import UpcomingTrainingCard from './dashboard/UpcomingTrainingCard';
import DepartmentComplianceChart from './dashboard/DepartmentComplianceChart';
import ExpiringCertificationsCard from './dashboard/ExpiringCertificationsCard';
import RecentActivitiesCard from './dashboard/RecentActivitiesCard';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

// Define type for training stats
interface TrainingStats {
  totalAssigned: number;
  completed: number;
  inProgress: number;
  overdue: number;
  compliance: number;
  avgScore: number;
  certExpiringCount: number;
}

const TrainingDashboard: React.FC = () => {
  // State for training stats
  const [trainingStats, setTrainingStats] = useState<TrainingStats>({
    totalAssigned: 0,
    completed: 0,
    inProgress: 0,
    overdue: 0,
    compliance: 0,
    avgScore: 0,
    certExpiringCount: 0
  });
  
  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch training stats on component mount
  useEffect(() => {
    const fetchTrainingStats = async () => {
      try {
        setLoading(true);
        
        // Fetch training stats from Supabase
        const { data, error } = await supabase
          .from('training_statistics')
          .select('*')
          .single();
        
        if (error) {
          throw error;
        }
        
        // Update state with fetched data
        if (data) {
          setTrainingStats(data);
        }
        
      } catch (err) {
        console.error('Error fetching training statistics:', err);
        setError('Failed to load training statistics. Please try again later.');
        toast({
          title: 'Error',
          description: 'Failed to load training statistics.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchTrainingStats();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading training dashboard...</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <AlertCircle className="text-red-500 h-10 w-10 mb-2" />
        <p className="text-red-500">{error}</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Training Dashboard</h2>
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Assigned Trainings" 
          value={trainingStats.totalAssigned.toString()} 
          icon={<BookOpen className="h-4 w-4" />} 
        />
        <StatsCard 
          title="Completed" 
          value={trainingStats.completed.toString()} 
          icon={<BookOpenCheck className="h-4 w-4" />} 
        />
        <StatsCard 
          title="In Progress" 
          value={trainingStats.inProgress.toString()} 
          icon={<Clock className="h-4 w-4" />} 
        />
        <StatsCard 
          title="Overdue" 
          value={trainingStats.overdue.toString()} 
          icon={<AlertCircle className="h-4 w-4" />} 
        />
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Overall Compliance */}
        <div className="lg:col-span-2">
          <OverallComplianceCard 
            compliancePercentage={trainingStats.compliance} 
            avgScore={trainingStats.avgScore}
          />
        </div>
        
        {/* Expiring Certifications */}
        <div>
          <ExpiringCertificationsCard count={trainingStats.certExpiringCount} />
        </div>
      </div>
      
      {/* Additional Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Compliance */}
        <DepartmentComplianceChart />
        
        {/* Upcoming Training */}
        <UpcomingTrainingCard />
      </div>
      
      {/* Recent Activities */}
      <RecentActivitiesCard />
    </div>
  );
};

// StatsCard Component
interface StatsCardProps {
  title: string;
  value: string;
  trend?: string;
  icon: React.ReactNode;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, trend, icon }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p className="text-xs text-muted-foreground">{trend}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default TrainingDashboard;
