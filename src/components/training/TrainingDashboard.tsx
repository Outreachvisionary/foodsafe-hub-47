
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertCircle, 
  Award, 
  BarChart3, 
  Book, 
  CalendarClock, 
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Users
} from 'lucide-react';
import { useTrainingContext } from '@/contexts/TrainingContext';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import DepartmentComplianceChart from './dashboard/DepartmentComplianceChart';
import OverallComplianceCard from './dashboard/OverallComplianceCard';
import UpcomingTrainingCard from './dashboard/UpcomingTrainingCard';
import ExpiringCertificationsCard from './dashboard/ExpiringCertificationsCard';

const TrainingDashboard = () => {
  const { departmentStats, isLoading } = useTrainingContext();
  const [showAllMetrics, setShowAllMetrics] = useState(false);
  
  // Training status data with sample values
  const trainingStatusData = [
    { name: 'Completed', value: 65, color: '#10B981' },
    { name: 'In Progress', value: 25, color: '#3B82F6' },
    { name: 'Not Started', value: 5, color: '#9CA3AF' },
    { name: 'Overdue', value: 5, color: '#EF4444' },
  ];
  
  // Critical compliance issues - sample data
  const criticalIssues = [
    { 
      title: 'Allergen Control Training', 
      description: '5 production employees need to complete allergen training by April 15th',
      priority: 'high'
    },
    { 
      title: 'HACCP Certification Expiring', 
      description: '3 team members have HACCP certifications expiring within 30 days',
      priority: 'medium'
    }
  ];

  // Summary metrics for the top cards
  const summaryMetrics = [
    { title: 'Total Employees', value: 152, icon: <Users className="h-5 w-5 text-blue-600" />, bgColor: 'bg-blue-100' },
    { title: 'Active Courses', value: 24, icon: <Book className="h-5 w-5 text-green-600" />, bgColor: 'bg-green-100' },
    { title: 'Due This Month', value: 15, icon: <Clock className="h-5 w-5 text-amber-600" />, bgColor: 'bg-amber-100' },
    { title: 'Expiring Certifications', value: 8, icon: <Award className="h-5 w-5 text-purple-600" />, bgColor: 'bg-purple-100' },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <span className="ml-3">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top summary metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                <p className="text-2xl font-bold">{metric.value}</p>
              </div>
              <div className={`${metric.bgColor} p-3 rounded-full`}>
                {metric.icon}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Critical issues notification */}
      {criticalIssues.length > 0 && (
        <Collapsible className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
              <h3 className="font-medium">Critical Training Issues Need Attention</h3>
            </div>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                <ChevronDown className="h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="pt-2">
            <div className="space-y-3">
              {criticalIssues.map((issue, index) => (
                <div key={index} className="flex items-start gap-3 border-t border-amber-200 pt-3">
                  <AlertCircle className={`h-5 w-5 mt-0.5 ${issue.priority === 'high' ? 'text-red-500' : 'text-amber-500'}`} />
                  <div className="flex-1">
                    <h4 className="font-medium">{issue.title}</h4>
                    <p className="text-sm text-muted-foreground">{issue.description}</p>
                  </div>
                  <Button size="sm" variant="outline">Take Action</Button>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Primary dashboard content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overall compliance card */}
        <OverallComplianceCard 
          compliancePercentage={84} 
          totalAssigned={398} 
          completed={335} 
        />
        
        {/* Department compliance chart */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-500" />
                Department Compliance
              </CardTitle>
              <Button variant="outline" size="sm">View All</Button>
            </div>
            <CardDescription>Training compliance by department</CardDescription>
          </CardHeader>
          <CardContent>
            <DepartmentComplianceChart />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming training card */}
        <UpcomingTrainingCard />
        
        {/* Expiring certifications card */}
        <ExpiringCertificationsCard count={8} />
      </div>

      {/* Optional metrics (hidden by default) */}
      <Collapsible open={showAllMetrics} className="border rounded-lg p-2">
        <CollapsibleTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full flex justify-between items-center" 
            onClick={() => setShowAllMetrics(!showAllMetrics)}
          >
            <span>Additional Training Metrics</span>
            {showAllMetrics ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" />
                  Training Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Food Safety Standards</span>
                    <span className="text-sm font-medium">85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">GMP Requirements</span>
                    <span className="text-sm font-medium">92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">HACCP Training</span>
                    <span className="text-sm font-medium">78%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarClock className="h-5 w-5" />
                  Training Calendar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((_, i) => (
                    <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0">
                      <div>
                        <h4 className="text-sm font-medium">Training Session {i+1}</h4>
                        <p className="text-xs text-muted-foreground">April {10+i*5}, 2025</p>
                      </div>
                      <Badge variant="outline">Scheduled</Badge>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">View Full Calendar</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </CollapsibleContent>
      </Collapsible>

      <div className="flex justify-center mt-8">
        <Button variant="outline" onClick={() => setShowAllMetrics(!showAllMetrics)}>
          {showAllMetrics ? "Show Less" : "Show More Metrics"}
        </Button>
      </div>
    </div>
  );
};

export default TrainingDashboard;
