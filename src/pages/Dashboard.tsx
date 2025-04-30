
import React, { useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '@/components/DashboardHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ArrowRight, FileText, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, loading } = useUser();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user) {
      console.info('Dashboard mounted, user:', user.email);
    }
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Get user name from email or profile
  const userName = user?.user_metadata?.full_name || user?.email || 'User';

  return (
    <div>
      <DashboardHeader title={`Welcome, ${userName}`} subtitle="Your compliance management dashboard" />
      
      <div className="container py-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-primary" />
                    Documents
                  </CardTitle>
                  <CardDescription>Document management overview</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Documents</span>
                      <span className="font-medium">0</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pending Review</span>
                      <span className="font-medium">0</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Expiring Soon</span>
                      <span className="font-medium">0</span>
                    </div>
                    <Button variant="outline" className="w-full" onClick={() => navigate('/documents')}>
                      View Documents <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
                    CAPAs
                  </CardTitle>
                  <CardDescription>Corrective and preventive actions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Open CAPAs</span>
                      <span className="font-medium">0</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Overdue</span>
                      <span className="font-medium">0</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Completed This Month</span>
                      <span className="font-medium">0</span>
                    </div>
                    <Button variant="outline" className="w-full" onClick={() => navigate('/capa')}>
                      Manage CAPAs <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-amber-500" />
                    Upcoming Tasks
                  </CardTitle>
                  <CardDescription>Tasks requiring your attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Document Reviews</span>
                      <span className="font-medium">0</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Training Sessions</span>
                      <span className="font-medium">0</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Audits</span>
                      <span className="font-medium">0</span>
                    </div>
                    <Button variant="outline" className="w-full" onClick={() => navigate('/tasks')}>
                      View Tasks <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Alert className="mt-6">
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>System Status</AlertTitle>
              <AlertDescription>All systems are operational.</AlertDescription>
            </Alert>
          </TabsContent>
          
          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>Document Management</CardTitle>
                <CardDescription>
                  Manage your documents, SOPs, and other compliance files
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="mb-4">Access all documents in the document repository.</p>
                  <Button onClick={() => navigate('/documents')}>Go to Documents</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="tasks">
            <Card>
              <CardHeader>
                <CardTitle>Task Management</CardTitle>
                <CardDescription>
                  View and manage your assigned tasks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="mb-4">You have no pending tasks at this time.</p>
                  <Button onClick={() => navigate('/tasks')}>View All Tasks</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
