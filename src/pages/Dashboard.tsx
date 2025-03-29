import React from 'react';
import { ComplianceOverviewCard } from '@/components/dashboard/ComplianceOverviewCard';
import { OpenIssuesCard } from '@/components/dashboard/OpenIssuesCard';
import { DocumentStatusCard } from '@/components/dashboard/DocumentStatusCard';
import { UpcomingAuditsCard } from '@/components/dashboard/UpcomingAuditsCard';
import { RecentActivitiesCard } from '@/components/dashboard/RecentActivitiesCard';
import { TeamPerformanceCard } from '@/components/dashboard/TeamPerformanceCard';
import { ComplianceTrendChart } from '@/components/dashboard/ComplianceTrendChart';
import { DashboardHeader } from '@/components/DashboardHeader';
import { DashboardOverview } from '@/components/dashboard/DashboardOverview';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/contexts/UserContext';
import AssignRoleButton from '@/components/role/AssignRoleButton';

const Dashboard = () => {
  const { user } = useUser();
  
  return (
    <div className="container mx-auto p-4">
      <DashboardHeader />
      
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
      
      <DashboardOverview />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <ComplianceOverviewCard />
        <OpenIssuesCard />
        <DocumentStatusCard />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-2">
          <ComplianceTrendChart />
        </div>
        <UpcomingAuditsCard />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <RecentActivitiesCard />
        </div>
        <TeamPerformanceCard />
      </div>
    </div>
  );
};

export default Dashboard;
