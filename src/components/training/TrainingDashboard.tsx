
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useTrainingContext } from '@/contexts/TrainingContext';
import DepartmentComplianceChart from './DepartmentComplianceChart';
import TrainingSessionsTimeline from './TrainingSessionsTimeline';
import UpcomingTrainings from './UpcomingTrainings';
import { Check, AlertTriangle, Calendar, Users, BookOpen, BarChart } from 'lucide-react';
import { DepartmentStat } from '@/types/training';

const TrainingDashboard: React.FC = () => {
  const { sessions, departmentStats, isLoading } = useTrainingContext();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter'>('month');
  
  // Ensure departmentStats matches the required format for DepartmentComplianceChart
  const formattedDepartmentStats: DepartmentStat[] = departmentStats.map(stat => ({
    ...stat,
    name: stat.department,
    complianceRate: stat.compliance
  }));
  
  // Calculate overall compliance
  const totalAssigned = departmentStats.reduce((sum, dept) => sum + dept.totalAssigned, 0);
  const totalCompleted = departmentStats.reduce((sum, dept) => sum + dept.completed, 0);
  const totalOverdue = departmentStats.reduce((sum, dept) => sum + dept.overdue, 0);
  const overallCompliance = totalAssigned > 0 
    ? Math.round((totalCompleted / totalAssigned) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h2 className="text-3xl font-bold">Training Dashboard</h2>
          <p className="text-muted-foreground">Monitor compliance and training activities across departments</p>
        </div>
        <div className="flex items-center space-x-2 mt-2 sm:mt-0">
          <Button variant="outline" className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Training
          </Button>
          <Button className="flex items-center">
            <BookOpen className="mr-2 h-4 w-4" />
            New Training Plan
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Overall Compliance</p>
                <div className="flex items-baseline mt-1">
                  <p className="text-3xl font-bold">{overallCompliance}%</p>
                  {overallCompliance >= 90 ? (
                    <Badge variant="outline" className="ml-2 bg-green-100 text-green-800">Good</Badge>
                  ) : overallCompliance >= 75 ? (
                    <Badge variant="outline" className="ml-2 bg-amber-100 text-amber-800">Average</Badge>
                  ) : (
                    <Badge variant="outline" className="ml-2 bg-red-100 text-red-800">Needs Improvement</Badge>
                  )}
                </div>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                <BarChart className="h-7 w-7 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed Trainings</p>
                <div className="flex items-baseline mt-1">
                  <p className="text-3xl font-bold">{totalCompleted}</p>
                  <p className="text-sm text-muted-foreground ml-2">of {totalAssigned}</p>
                </div>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="h-7 w-7 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Overdue Trainings</p>
                <div className="flex items-baseline mt-1">
                  <p className="text-3xl font-bold">{totalOverdue}</p>
                  <p className="text-sm text-muted-foreground ml-2">needs attention</p>
                </div>
              </div>
              <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-7 w-7 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {totalOverdue > 0 && (
        <Alert className="bg-amber-50 border-amber-200">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription>
            There are {totalOverdue} overdue trainings that require immediate attention.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Department Compliance</CardTitle>
            <CardDescription>Training compliance rate across departments</CardDescription>
          </CardHeader>
          <CardContent>
            <DepartmentComplianceChart departmentStats={formattedDepartmentStats} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>Training Timeline</CardTitle>
              <CardDescription>Recent and upcoming training sessions</CardDescription>
            </div>
            <Tabs value={selectedPeriod} onValueChange={(v) => setSelectedPeriod(v as any)} className="w-auto">
              <TabsList className="grid w-full grid-cols-3 h-8">
                <TabsTrigger value="week" className="text-xs">Week</TabsTrigger>
                <TabsTrigger value="month" className="text-xs">Month</TabsTrigger>
                <TabsTrigger value="quarter" className="text-xs">Quarter</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <TrainingSessionsTimeline sessions={sessions} period={selectedPeriod} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Employee Training Status
            </CardTitle>
            <CardDescription>Training status by department</CardDescription>
          </CardHeader>
          <CardContent>
            <UpcomingTrainings sessions={sessions} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TrainingDashboard;
