
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
      activeSessions: sessions.filter(s => s.status === 'Active').length,
      completedRecords: records.filter(r => r.status === 'Completed').length,
      overdueSessions: records.filter(r => 
        r.status === 'Assigned' && new Date(r.due_date) < new Date()
      ).length,
      averageScore: records
        .filter(r => r.score !== null)
        .reduce((acc, r) => acc + (r.score || 0), 0) / 
        records.filter(r => r.score !== null).length || 0
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
                <p className="text-2xl font-bold text-purple-600">{stats.averageScore.toFixed(1)}%</p>
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
                        <p className="text-sm text-muted-foreground">{session.training_type}</p>
                      </div>
                      <Badge className={getStatusColor(session.status || 'Draft')}>
                        {session.status || 'Draft'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Due Dates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {records
                    .filter(r => r.status === 'Assigned')
                    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
                    .slice(0, 5)
                    .map((record) => (
                      <div key={record.id} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <p className="font-medium">{record.employee_name}</p>
                          <p className="text-sm text-muted-foreground">
                            Session: {sessions.find(s => s.id === record.session_id)?.title}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{formatDate(record.due_date)}</p>
                          <Badge className={
                            new Date(record.due_date) < new Date() 
                              ? getStatusColor('Overdue')
                              : getStatusColor('Assigned')
                          }>
                            {new Date(record.due_date) < new Date() ? 'Overdue' : 'Due Soon'}
                          </Badge>
                        </div>
                      </div>
                    ))}
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
                session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                session.description?.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((session) => (
                <Card key={session.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2">{session.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                          {session.description || 'No description available'}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4" />
                            {session.training_type}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {records.filter(r => r.session_id === session.id).length} assigned
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
                        <Badge className={getStatusColor(session.status || 'Draft')}>
                          {session.status || 'Draft'}
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
          </div>
        </TabsContent>

        <TabsContent value="records" className="space-y-4">
          <div className="grid gap-4">
            {records.map((record) => {
              const session = sessions.find(s => s.id === record.session_id);
              return (
                <Card key={record.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold">{record.employee_name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          Training: {session?.title || 'Unknown Session'}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Assigned: {formatDate(record.assigned_date)}</span>
                          <span>Due: {formatDate(record.due_date)}</span>
                          {record.completion_date && (
                            <span>Completed: {formatDate(record.completion_date)}</span>
                          )}
                          {record.score !== null && (
                            <span className="font-medium">Score: {record.score}%</span>
                          )}
                        </div>
                      </div>
                      <Badge className={getStatusColor(record.status)}>
                        {record.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TrainingDashboard;
