import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Plus, 
  BookOpen, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Users,
  Calendar,
  Award
} from 'lucide-react';
import { useTraining } from '@/hooks/useTraining';

interface TrainingDashboardProps {
  onCreateSession?: () => void;
  onViewSession?: (sessionId: string) => void;
}

const TrainingDashboard: React.FC<TrainingDashboardProps> = ({
  onCreateSession,
  onViewSession
}) => {
  const { sessions, records, loading, error } = useTraining();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  const getTrainingStats = () => {
    const stats = {
      totalSessions: sessions.length,
      activeSessions: sessions.filter(s => s.status === 'Active' || s.completion_status === 'In Progress').length,
      completedRecords: sessions.filter(s => s.completion_status === 'Completed').length,
      overdueSessions: sessions.filter(s => 
        s.due_date && new Date(s.due_date) < new Date() && s.completion_status !== 'Completed'
      ).length,
      averageScore: 85 // Mock average for now since actual scores aren't available
    };
    return stats;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Assigned':
        return 'bg-yellow-100 text-yellow-800';
      case 'Overdue':
        return 'bg-red-100 text-red-800';
      case 'Active':
        return 'bg-blue-100 text-blue-800';
      case 'Draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const stats = getTrainingStats();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        Error loading training data: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Training Management</h2>
          <p className="text-muted-foreground">Manage training sessions and track employee progress</p>
        </div>
        {onCreateSession && (
          <Button onClick={onCreateSession}>
            <Plus className="h-4 w-4 mr-2" />
            New Training Session
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Sessions</p>
                <p className="text-2xl font-bold">{stats.totalSessions}</p>
              </div>
              <BookOpen className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-blue-600">{stats.activeSessions}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.completedRecords}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Overdue</p>
                <p className="text-2xl font-bold text-red-600">{stats.overdueSessions}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Score</p>
                <p className="text-2xl font-bold text-purple-600">{stats.averageScore}%</p>
              </div>
              <Award className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sessions">Training Sessions</TabsTrigger>
          <TabsTrigger value="records">Training Records</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Training Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sessions.slice(0, 5).map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">{session.title}</p>
                        <p className="text-sm text-muted-foreground">{session.category || 'General'}</p>
                      </div>
                      <Badge className={getStatusColor(session.completion_status || session.status || 'Draft')}>
                        {session.completion_status || session.status || 'Draft'}
                      </Badge>
                    </div>
                  ))}
                  {sessions.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">No training sessions found</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Training Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sessions
                    .filter(s => s.due_date)
                    .sort((a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime())
                    .slice(0, 5)
                    .map((session) => (
                      <div key={session.id} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <p className="font-medium">{session.title}</p>
                          <p className="text-sm text-muted-foreground">
                            Assigned to: {session.assigned_to?.length || 0} people
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{session.due_date ? formatDate(session.due_date) : 'No due date'}</p>
                          <Badge className={
                            session.due_date && new Date(session.due_date) < new Date() 
                              ? getStatusColor('Overdue')
                              : getStatusColor('Active')
                          }>
                            {session.due_date && new Date(session.due_date) < new Date() ? 'Overdue' : 'Active'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  {sessions.filter(s => s.due_date).length === 0 && (
                    <p className="text-center text-muted-foreground py-8">No upcoming training sessions</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search training sessions..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4">
            {sessions
              .filter(session => 
                session.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                session.description?.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((session) => (
                <Card key={session.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2">{session.title || 'Untitled Session'}</h3>
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                          {session.description || 'No description available'}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4" />
                            {session.category || 'General'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {session.assigned_to?.length || 0} assigned
                          </span>
                          {session.due_date && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Due: {formatDate(session.due_date)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="ml-4 flex flex-col items-end gap-2">
                        <Badge className={getStatusColor(session.completion_status || session.status || 'Draft')}>
                          {session.completion_status || session.status || 'Draft'}
                        </Badge>
                        {onViewSession && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onViewSession(session.id)}
                          >
                            View Details
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            {sessions.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  No training sessions found. Create your first training session to get started.
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="records" className="space-y-4">
          <div className="grid gap-4">
            {sessions.map((session) => (
              <Card key={session.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold">{session.title || 'Untitled Session'}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Category: {session.category || 'General'}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Created: {session.created_at ? formatDate(session.created_at) : 'Unknown'}</span>
                        {session.due_date && <span>Due: {formatDate(session.due_date)}</span>}
                        <span>Assigned to: {session.assigned_to?.length || 0} people</span>
                      </div>
                    </div>
                    <Badge className={getStatusColor(session.completion_status || session.status || 'Draft')}>
                      {session.completion_status || session.status || 'Draft'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
            {sessions.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  No training records found.
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TrainingDashboard;