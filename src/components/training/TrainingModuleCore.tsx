import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { GraduationCap, Users, BookOpen, Award, Clock, CheckCircle, AlertCircle, Upload, Shield } from 'lucide-react';
import { useTraining } from '@/hooks/useTraining';
import TrainingMaterialUpload from './TrainingMaterialUpload';
import TrainingComplianceTracker from './TrainingComplianceTracker';

const TrainingModuleCore: React.FC = () => {
  const { sessions, records, loading, createTrainingSession } = useTraining();
  const { toast } = useToast();
  
  const [newSession, setNewSession] = useState({
    title: '',
    description: '',
    training_type: '',
    training_category: '',
    department: '',
    assigned_to: [] as string[],
    due_date: '',
    priority: 'Medium' as 'Low' | 'Medium' | 'High'
  });

  const trainingStats = {
    totalSessions: sessions.length,
    activeSessions: sessions.filter(s => s.completion_status === 'In Progress' || s.status === 'Active').length,
    completedSessions: sessions.filter(s => s.completion_status === 'Completed').length,
    overdueRecords: sessions.filter(s => s.due_date && new Date(s.due_date) < new Date() && s.completion_status !== 'Completed').length,
    complianceRate: sessions.length > 0 
      ? Math.round((sessions.filter(s => s.completion_status === 'Completed').length / sessions.length) * 100)
      : 0
  };

  const handleCreateSession = async () => {
    if (!newSession.title || !newSession.training_type || !newSession.due_date) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      await createTrainingSession({
        ...newSession,
        created_by: 'current_user',
        start_date: new Date().toISOString(),
        required_roles: [],
        is_recurring: false
      });

      // Reset form
      setNewSession({
        title: '',
        description: '',
        training_type: '',
        training_category: '',
        department: '',
        assigned_to: [],
        due_date: '',
        priority: 'Medium' as 'Low' | 'Medium' | 'High'
      });

      toast({
        title: "Training Session Created",
        description: `${newSession.title} has been created and assigned`
      });
    } catch (error) {
      console.error('Error creating session:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'In Progress':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'Overdue':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Training Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
              <Clock className="h-8 w-8 text-orange-600" />
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
                <p className="text-2xl font-bold">{trainingStats.overdueRecords}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Compliance</p>
                <p className="text-2xl font-bold">{trainingStats.complianceRate}%</p>
              </div>
              <Award className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sessions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="records">Records</TabsTrigger>
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="create">Create</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="sessions">
          <Card>
            <CardHeader>
              <CardTitle>Training Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sessions.map((session) => (
                  <div key={session.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{session.title}</h4>
                          <Badge className="bg-yellow-100 text-yellow-800">
                            {session.category || 'General'}
                          </Badge>
                          <Badge variant="outline">
                            {session.category || 'General'}
                          </Badge>
                        </div>
                        
                        {session.description && (
                          <p className="text-sm text-muted-foreground mb-2">
                            {session.description}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Due: {session.due_date ? new Date(session.due_date).toLocaleDateString() : 'Not set'}</span>
                          <span>Department: {session.department || 'All'}</span>
                          <span>Assigned to: {session.assigned_to?.length || 0} people</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">{session.completion_status || session.status || 'Draft'}</span>
                      </div>
                    </div>
                  </div>
                ))}
                
                {sessions.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No training sessions found. Create your first session to get started.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="records">
          <Card>
            <CardHeader>
              <CardTitle>Training Records</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sessions.map((session) => (
                  <div key={session.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{session.title || 'Untitled Session'}</h4>
                          <Badge variant="outline">
                            {session.category || 'General'}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Due: {session.due_date ? new Date(session.due_date).toLocaleDateString() : 'Not set'}</span>
                          <span>Created: {session.created_at ? new Date(session.created_at).toLocaleDateString() : 'Unknown'}</span>
                          <span>Assigned to: {session.assigned_to?.length || 0} people</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">{session.completion_status || session.status || 'Draft'}</span>
                      </div>
                    </div>
                    
                    {session.completion_status && session.completion_status !== 'Not Started' && (
                      <div className="mt-3">
                        <Progress 
                          value={session.completion_status === 'Completed' ? 100 : 50} 
                          className="w-full"
                        />
                      </div>
                    )}
                  </div>
                ))}
                
                {sessions.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No training records found.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="materials">
          <TrainingMaterialUpload onUploadComplete={() => toast({ title: "Success", description: "Material uploaded successfully" })} />
        </TabsContent>

        <TabsContent value="compliance">
          <TrainingComplianceTracker />
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Training Analytics & Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Shield className="h-12 w-12 mx-auto mb-4" />
                <p>Advanced analytics and GFSI compliance reporting coming soon.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create Training Session</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Title *</label>
                    <Input
                      value={newSession.title}
                      onChange={(e) => setNewSession({...newSession, title: e.target.value})}
                      placeholder="Enter training title"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Training Type *</label>
                    <Select
                      value={newSession.training_type}
                      onValueChange={(value) => setNewSession({...newSession, training_type: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Mandatory">Mandatory</SelectItem>
                        <SelectItem value="Optional">Optional</SelectItem>
                        <SelectItem value="Refresher">Refresher</SelectItem>
                        <SelectItem value="Certification">Certification</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Category</label>
                    <Select
                      value={newSession.training_category}
                      onValueChange={(value) => setNewSession({...newSession, training_category: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Food_Safety">Food Safety</SelectItem>
                        <SelectItem value="Quality_Management">Quality</SelectItem>
                        <SelectItem value="HACCP">HACCP</SelectItem>
                        <SelectItem value="GMP">GMP</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Department</label>
                    <Select
                      value={newSession.department}
                      onValueChange={(value) => setNewSession({...newSession, department: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Production">Production</SelectItem>
                        <SelectItem value="Quality">Quality</SelectItem>
                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                        <SelectItem value="Warehouse">Warehouse</SelectItem>
                        <SelectItem value="All">All Departments</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Priority</label>
                    <Select
                      value={newSession.priority}
                      onValueChange={(value: 'Low' | 'Medium' | 'High') => setNewSession({...newSession, priority: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Due Date *</label>
                    <Input
                      type="date"
                      value={newSession.due_date}
                      onChange={(e) => setNewSession({...newSession, due_date: e.target.value})}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={newSession.description}
                    onChange={(e) => setNewSession({...newSession, description: e.target.value})}
                    placeholder="Enter training description and objectives..."
                    rows={3}
                  />
                </div>
                
                <Button onClick={handleCreateSession} className="w-full">
                  Create Training Session
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TrainingModuleCore;