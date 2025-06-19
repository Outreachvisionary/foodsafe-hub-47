
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import ProtectedSidebarLayout from '@/components/layout/ProtectedSidebarLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus,
  Search,
  Filter,
  GraduationCap,
  Clock,
  Users,
  Calendar,
  BookOpen,
  Award,
  AlertCircle,
  Play,
  CheckCircle
} from 'lucide-react';

const Training = () => {
  const { user, loading } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeTab, setActiveTab] = useState('sessions');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Enhanced mock data
  const trainingSessions = [
    {
      id: '1',
      title: 'HACCP Principles Training',
      description: 'Comprehensive training on Hazard Analysis Critical Control Points for food safety',
      category: 'Food Safety',
      status: 'active',
      assignedCount: 15,
      completedCount: 12,
      dueDate: '2024-07-15',
      duration: '4 hours',
      instructor: 'Dr. Sarah Wilson',
      department: 'All Departments',
      priority: 'High',
      type: 'Mandatory',
      recertificationPeriod: '12 months'
    },
    {
      id: '2',
      title: 'GMP Refresher Course',
      description: 'Good Manufacturing Practices annual refresher training for production staff',
      category: 'Quality',
      status: 'completed',
      assignedCount: 8,
      completedCount: 8,
      dueDate: '2024-06-30',
      duration: '2 hours',
      instructor: 'Mike Johnson',
      department: 'Production',
      priority: 'Medium',
      type: 'Mandatory',
      recertificationPeriod: '6 months'
    },
    {
      id: '3',
      title: 'Allergen Management Training',
      description: 'Training on allergen identification, control, and management procedures',
      category: 'Food Safety',
      status: 'overdue',
      assignedCount: 10,
      completedCount: 6,
      dueDate: '2024-06-01',
      duration: '3 hours',
      instructor: 'Jennifer Smith',
      department: 'QA & Production',
      priority: 'Critical',
      type: 'Mandatory',
      recertificationPeriod: '12 months'
    },
    {
      id: '4',
      title: 'Leadership Development Program',
      description: 'Advanced leadership skills for supervisors and managers',
      category: 'Professional Development',
      status: 'scheduled',
      assignedCount: 5,
      completedCount: 0,
      dueDate: '2024-08-01',
      duration: '8 hours',
      instructor: 'External Trainer',
      department: 'Management',
      priority: 'Low',
      type: 'Optional',
      recertificationPeriod: 'None'
    }
  ];

  const employees = [
    { id: '1', name: 'John Doe', department: 'Production', completedTrainings: 8, pendingTrainings: 2 },
    { id: '2', name: 'Jane Smith', department: 'Quality Assurance', completedTrainings: 12, pendingTrainings: 1 },
    { id: '3', name: 'Mike Wilson', department: 'Maintenance', completedTrainings: 6, pendingTrainings: 3 },
    { id: '4', name: 'Sarah Johnson', department: 'Administration', completedTrainings: 9, pendingTrainings: 1 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <Award className="h-4 w-4" />;
      case 'overdue': return <AlertCircle className="h-4 w-4" />;
      case 'active': return <Play className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getCompletionPercentage = (completed: number, total: number) => {
    return Math.round((completed / total) * 100);
  };

  const filteredSessions = trainingSessions.filter(session => {
    const matchesSearch = session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         session.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || session.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const trainingStats = {
    totalSessions: trainingSessions.length,
    activeSessions: trainingSessions.filter(s => s.status === 'active').length,
    completedSessions: trainingSessions.filter(s => s.status === 'completed').length,
    overdueSessions: trainingSessions.filter(s => s.status === 'overdue').length,
    totalEmployees: employees.length,
    averageCompletion: Math.round(
      trainingSessions.reduce((acc, session) => 
        acc + getCompletionPercentage(session.completedCount, session.assignedCount), 0
      ) / trainingSessions.length
    )
  };

  return (
    <ProtectedSidebarLayout>
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Training Management</h1>
              <p className="text-muted-foreground text-lg">
                Manage training programs, track employee progress, and ensure compliance
              </p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Training Session
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="sessions">Training Sessions</TabsTrigger>
            <TabsTrigger value="employees">Employee Progress</TabsTrigger>
            <TabsTrigger value="reports">Reports & Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="sessions" className="space-y-6">
            {/* Training Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Sessions</p>
                      <p className="text-2xl font-bold">{trainingStats.totalSessions}</p>
                    </div>
                    <GraduationCap className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active</p>
                      <p className="text-2xl font-bold">{trainingStats.activeSessions}</p>
                    </div>
                    <Play className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Completed</p>
                      <p className="text-2xl font-bold">{trainingStats.completedSessions}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Overdue</p>
                      <p className="text-2xl font-bold">{trainingStats.overdueSessions}</p>
                    </div>
                    <AlertCircle className="h-8 w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Employees</p>
                      <p className="text-2xl font-bold">{trainingStats.totalEmployees}</p>
                    </div>
                    <Users className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Avg Completion</p>
                      <p className="text-2xl font-bold">{trainingStats.averageCompletion}%</p>
                    </div>
                    <Award className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search training sessions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <select 
                      className="px-3 py-2 border rounded-md"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                      <option value="overdue">Overdue</option>
                      <option value="scheduled">Scheduled</option>
                    </select>
                    <Button variant="outline">
                      <Filter className="h-4 w-4 mr-2" />
                      More Filters
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Training Sessions Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredSessions.map((training) => (
                <Card key={training.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-1">{training.title}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {training.description}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-1 ml-2">
                        {getStatusIcon(training.status)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        <Badge className={getStatusColor(training.status)}>
                          {training.status}
                        </Badge>
                        <Badge variant="outline">
                          {training.category}
                        </Badge>
                        <Badge className={getPriorityColor(training.priority)}>
                          {training.priority}
                        </Badge>
                        <Badge variant="secondary">
                          {training.type}
                        </Badge>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Completion Progress</span>
                          <span>{training.completedCount}/{training.assignedCount} completed</span>
                        </div>
                        <Progress 
                          value={getCompletionPercentage(training.completedCount, training.assignedCount)} 
                          className="h-2"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>Due: {training.dueDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{training.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4" />
                          <span>{training.instructor}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span>{training.assignedCount} assigned</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          View Details
                        </Button>
                        <Button size="sm" className="flex-1">
                          Manage
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="employees" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Employee Training Progress</CardTitle>
                <CardDescription>Track individual employee training completion and compliance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {employees.map((employee) => (
                    <div key={employee.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-medium">{employee.name.split(' ').map(n => n[0]).join('')}</span>
                        </div>
                        <div>
                          <p className="font-medium">{employee.name}</p>
                          <p className="text-sm text-muted-foreground">{employee.department}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <p className="text-lg font-bold text-green-600">{employee.completedTrainings}</p>
                          <p className="text-xs text-muted-foreground">Completed</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-orange-600">{employee.pendingTrainings}</p>
                          <p className="text-xs text-muted-foreground">Pending</p>
                        </div>
                        <Button variant="outline" size="sm">
                          View Profile
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Training Completion Rates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Award className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500">Analytics dashboard coming soon</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Compliance Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500">Compliance tracking coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedSidebarLayout>
  );
};

export default Training;
