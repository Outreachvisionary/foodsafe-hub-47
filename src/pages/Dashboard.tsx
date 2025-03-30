
import React, { useEffect } from 'react';
import DashboardContent from '@/components/dashboard/DashboardOverview';
import DashboardHeader from '@/components/DashboardHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/contexts/UserContext';
import AssignRoleButton from '@/components/role/AssignRoleButton';
import useProfileRealtime from '@/hooks/useProfileRealtime';
import { LayoutDashboard } from 'lucide-react';

const Dashboard = () => {
  const { user } = useUser();
  const { isListening } = useProfileRealtime();
  
  useEffect(() => {
    console.log('Dashboard mounted, user:', user?.email);
    console.log('Profile listener active:', isListening);
  }, [user, isListening]);
  
  return (
    <div className="container mx-auto p-4">
      <DashboardHeader 
        title={
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6 text-accent" />
            <span>Dashboard</span>
          </div>
        } 
        subtitle="Overview of your compliance status" 
      />
      
      <Card className="mb-6 bg-gradient-to-br from-accent/5 to-primary/5 border border-border/60 mt-6 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">Welcome to Compliance Core</CardTitle>
          <CardDescription>
            Your comprehensive solution for food safety management and compliance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            The dashboard provides an overview of your compliance status across all modules. 
            Use the sidebar to navigate to specific features.
          </p>
        </CardContent>
      </Card>
      
      <DashboardContent />
    </div>
  );
};

export default Dashboard;
