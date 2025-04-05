
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  CalendarClock, 
  CheckCircle2, 
  AlertCircle, 
  Users, 
  BookOpen, 
  Award, 
  Clock
} from 'lucide-react';
import { useTrainingContext } from '@/contexts/TrainingContext';
import DepartmentComplianceChart from './DepartmentComplianceChart';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const TrainingDashboard = () => {
  const { departmentStats, isLoading } = useTrainingContext();
  
  // Mock data for the charts
  const trainingStatusData = [
    { name: 'Completed', value: 65, color: '#10B981' },
    { name: 'In Progress', value: 25, color: '#3B82F6' },
    { name: 'Not Started', value: 5, color: '#9CA3AF' },
    { name: 'Overdue', value: 5, color: '#EF4444' },
  ];
  
  const upcomingTrainings = [
    { 
      id: '1', 
      title: 'Food Safety Basics', 
      dueDate: '2025-04-15', 
      assignedTo: 'Production Team', 
      status: 'upcoming' 
    },
    { 
      id: '2', 
      title: 'HACCP Principles', 
      dueDate: '2025-04-20', 
      assignedTo: 'Quality Team', 
      status: 'upcoming' 
    },
    { 
      id: '3', 
      title: 'Allergen Management', 
      dueDate: '2025-05-01', 
      assignedTo: 'Production Team', 
      status: 'upcoming' 
    },
  ];

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'upcoming':
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 flex items-center gap-1">
            <CalendarClock className="h-3 w-3" />
            Upcoming
          </Badge>
        );
      case 'completed':
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Completed
          </Badge>
        );
      case 'overdue':
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Overdue
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">{status}</Badge>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <span className="ml-3">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Employees</p>
              <p className="text-2xl font-bold">152</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Courses</p>
              <p className="text-2xl font-bold">24</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <BookOpen className="h-5 w-5 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Certifications</p>
              <p className="text-2xl font-bold">38</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Award className="h-5 w-5 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Due This Month</p>
              <p className="text-2xl font-bold">15</p>
            </div>
            <div className="bg-amber-100 p-3 rounded-full">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Department Compliance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DepartmentComplianceChart departmentStats={departmentStats} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Training Status
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <div className="w-48 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={trainingStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {trainingStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Percentage']} 
                    labelFormatter={(index) => trainingStatusData[index].name}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-5 w-full">
              {trainingStatusData.map((status) => (
                <div key={status.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: status.color }}></div>
                  <span className="text-sm">{status.name}</span>
                  <span className="text-sm font-bold ml-auto">{status.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarClock className="h-5 w-5" />
            Upcoming Training Sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="pb-2 text-left font-medium">Training</th>
                  <th className="pb-2 text-left font-medium">Due Date</th>
                  <th className="pb-2 text-left font-medium">Assigned To</th>
                  <th className="pb-2 text-left font-medium">Status</th>
                  <th className="pb-2 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {upcomingTrainings.map((training) => (
                  <tr key={training.id} className="border-b">
                    <td className="py-3 font-medium">{training.title}</td>
                    <td className="py-3">{new Date(training.dueDate).toLocaleDateString()}</td>
                    <td className="py-3">{training.assignedTo}</td>
                    <td className="py-3">{getStatusBadge(training.status)}</td>
                    <td className="py-3 text-right">
                      <Button size="sm" variant="outline">View Details</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-center">
            <Button variant="outline">View All Training</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              Overall Training Compliance
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
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">SQF Certification</span>
                <span className="text-sm font-medium">70%</span>
              </div>
              <Progress value={70} className="h-2" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Critical Compliance Issues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 rounded-md border p-3">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <h4 className="font-medium">Allergen Control Training</h4>
                  <p className="text-sm text-muted-foreground">5 production employees need to complete allergen training by April 15th</p>
                  <Button size="sm" variant="outline" className="mt-2">Take Action</Button>
                </div>
              </div>
              
              <div className="flex items-start gap-3 rounded-md border p-3">
                <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <h4 className="font-medium">HACCP Certification Expiring</h4>
                  <p className="text-sm text-muted-foreground">3 team members have HACCP certifications expiring within 30 days</p>
                  <Button size="sm" variant="outline" className="mt-2">Schedule Renewal</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TrainingDashboard;
