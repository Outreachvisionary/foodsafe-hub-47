import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  AlertCircle,
  Award,
  BarChart2,
  CheckCircle2,
  Clock,
  FileText,
  Loader,
  Users
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useTrainingContext } from '@/contexts/TrainingContext';
import OverallComplianceCard from './dashboard/OverallComplianceCard';
import ExpiringCertificationsCard from './dashboard/ExpiringCertificationsCard';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface DepartmentCompliance {
  name: string;
  compliance: number;
}

interface TrainingStatus {
  name: string;
  value: number;
  color: string;
}

interface EmployeeTraining {
  employeeName: string;
  trainingTitle: string;
  dueDate: string;
  status: string;
}

const TrainingDashboard: React.FC = () => {
  const [dateRange, setDateRange] = useState('90days');
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();
  
  const [complianceByDepartment, setComplianceByDepartment] = useState<DepartmentCompliance[]>([]);
  const [trainingStatusData, setTrainingStatusData] = useState<TrainingStatus[]>([]);
  const [employeeTrainings, setEmployeeTrainings] = useState<EmployeeTraining[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const statusColors = {
    'Completed': '#10b981',
    'In Progress': '#3b82f6',
    'Not Started': '#9ca3af',
    'Overdue': '#ef4444'
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        const { data: complianceData, error: complianceError } = await supabase
          .from('department_compliance')
          .select('name, compliance')
          .order('compliance', { ascending: false });
          
        if (complianceError) throw complianceError;
        
        const { data: statusData, error: statusError } = await supabase
          .from('training_status_distribution')
          .select('name, value');
          
        if (statusError) throw statusError;
        
        const transformedStatusData = statusData?.map(item => ({
          ...item,
          color: statusColors[item.name] || '#9ca3af'
        })) || [];
        
        const { data: trainingData, error: trainingError } = await supabase
          .from('employee_training')
          .select('employeeName, trainingTitle, dueDate, status')
          .limit(5);
          
        if (trainingError) throw trainingError;
        
        setComplianceByDepartment(complianceData || []);
        setTrainingStatusData(transformedStatusData);
        setEmployeeTrainings(trainingData || []);
        
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
        toast({
          title: 'Error',
          description: 'Failed to load dashboard data.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [dateRange]);

  const overallCompliancePercentage = 75;
  const avgTrainingScore = 88;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
        <span className="ml-2">Loading dashboard data...</span>
      </div>
    );
  }

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
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Training Dashboard</h2>
        <div className="flex items-center space-x-4">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            Export Reports
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <OverallComplianceCard 
          compliancePercentage={overallCompliancePercentage}
          avgScore={avgTrainingScore}
        />
        <ExpiringCertificationsCard />
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium flex items-center">
              <Clock className="h-5 w-5 text-amber-500 mr-2" />
              Upcoming Training
            </CardTitle>
            <CardDescription>Scheduled training sessions and deadlines</CardDescription>
          </CardHeader>
          <CardContent>
            {employeeTrainings.length > 0 ? (
              <div className="space-y-4">
                {employeeTrainings.map((training, index) => (
                  <div key={index} className="flex items-center space-x-3 border-b pb-3 last:border-0">
                    <FileText className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-grow">
                      <h4 className="text-sm font-medium">{training.trainingTitle}</h4>
                      <p className="text-xs text-muted-foreground">{training.employeeName}</p>
                      <div className="flex items-center mt-1">
                        <span className="text-xs text-muted-foreground">Due: {training.dueDate}</span>
                        <Badge variant="secondary" className="ml-2">{training.status}</Badge>
                      </div>
                    </div>
                  </div>
                ))}
                <button className="text-sm text-blue-500 hover:text-blue-700 transition-colors w-full text-center">
                  View all upcoming trainings
                </button>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p>No upcoming trainings found.</p>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium flex items-center">
              <Users className="h-5 w-5 text-sky-500 mr-2" />
              Team Performance
            </CardTitle>
            <CardDescription>Overall team training progress and scores</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium">Team A</span>
              <span className="text-sm text-muted-foreground">85% Completion</span>
            </div>
            <Progress value={85} className="h-2 mb-4" />
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium">Team B</span>
              <span className="text-sm text-muted-foreground">72% Completion</span>
            </div>
            <Progress value={72} className="h-2 mb-4" />
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium">Team C</span>
              <span className="text-sm text-muted-foreground">92% Completion</span>
            </div>
            <Progress value={92} className="h-2 mb-4" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="reports">Detailed Reports</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Compliance by Department</CardTitle>
                <CardDescription>
                  Training completion rates across departments
                </CardDescription>
              </CardHeader>
              <CardContent>
                {complianceByDepartment.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={complianceByDepartment}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="compliance" name="Compliance %" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[300px]">
                    <p className="text-muted-foreground">No compliance data available</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Training Status Distribution</CardTitle>
                <CardDescription>
                  Current status of assigned training across organization
                </CardDescription>
              </CardHeader>
              <CardContent>
                {trainingStatusData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={trainingStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {trainingStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[300px]">
                    <p className="text-muted-foreground">No training status data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Training Reports</CardTitle>
              <CardDescription>
                Comprehensive reports on training progress and outcomes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-8 flex flex-col items-center justify-center">
                <p className="text-xl font-semibold mb-4">Generate Training Reports</p>
                <p className="mb-6 text-muted-foreground">
                  Customize and generate detailed reports on training activities
                </p>
                <Button>
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Training Analytics Dashboard</CardTitle>
              <CardDescription>
                Visualize training data and identify key trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-8 flex flex-col items-center justify-center">
                <p className="text-xl font-semibold mb-4">Explore Training Analytics</p>
                <p className="mb-6 text-muted-foreground">
                  Interactive dashboards for in-depth training data analysis
                </p>
                <Button>
                  <BarChart2 className="mr-2 h-4 w-4" />
                  View Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TrainingDashboard;
