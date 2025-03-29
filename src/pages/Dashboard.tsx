
import React, { useEffect } from 'react';
import DashboardContent from '@/components/dashboard/DashboardOverview';
import DashboardHeader from '@/components/DashboardHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/contexts/UserContext';
import AssignRoleButton from '@/components/role/AssignRoleButton';
import useProfileRealtime from '@/hooks/useProfileRealtime';

const Dashboard = () => {
  const { user } = useUser();
  const { isListening } = useProfileRealtime();
  
  useEffect(() => {
    console.log('Dashboard mounted, user:', user?.email);
    console.log('Profile listener active:', isListening);
  }, [user, isListening]);
  
  return (
    <div className="container mx-auto p-4">
      <DashboardHeader title="Dashboard" subtitle="Overview of your compliance status" />
      
      {/* Developer Access Card */}
      <Card className="mb-6 bg-muted/50">
        <CardHeader>
          <CardTitle>Developer Access</CardTitle>
          <CardDescription>
            Get full access to all platform features by assigning yourself the Developer role
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm mb-2">Current role: <span className="font-medium">{user?.role || 'None'}</span></p>
              <p className="text-xs text-muted-foreground">
                Developer role gives you complete access to all system functions
              </p>
            </div>
            <AssignRoleButton />
          </div>
        </CardContent>
      </Card>
      
      <DashboardContent />
    </div>
  );
};

export default Dashboard;
