import React, { useEffect } from 'react';
import DashboardContent from '@/components/dashboard/DashboardOverview';
import DashboardHeader from '@/components/DashboardHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/contexts/UserContext';
import AssignRoleButton from '@/components/role/AssignRoleButton';
import useProfileRealtime from '@/hooks/useProfileRealtime';
const Dashboard = () => {
  const {
    user
  } = useUser();
  const {
    isListening
  } = useProfileRealtime();
  useEffect(() => {
    console.log('Dashboard mounted, user:', user?.email);
    console.log('Profile listener active:', isListening);
  }, [user, isListening]);
  return <div className="container mx-auto p-4">
      <DashboardHeader title="Dashboard" subtitle="Overview of your compliance status" />
      
      {/* Developer Access Card */}
      <Card className="mb-6 bg-muted/50">
        
        
      </Card>
      
      <DashboardContent />
    </div>;
};
export default Dashboard;