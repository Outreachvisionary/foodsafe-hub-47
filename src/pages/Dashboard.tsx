
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import DashboardHeader from '@/components/DashboardHeader';

const Dashboard: React.FC = () => {
  const { user, profile, loading } = useAuth();
  
  console.log('Dashboard render:', { hasUser: !!user, hasProfile: !!profile, loading });
  
  const getUserDisplayName = () => {
    if (!user) return 'Guest';
    if (profile?.full_name) return profile.full_name;
    return user.email?.split('@')[0] || 'User';
  };

  // Show loading if still fetching auth state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <DashboardHeader
        title={`Welcome back, ${getUserDisplayName()}!`}
        subtitle="Here's your food safety management overview"
      />
      <DashboardOverview />
    </div>
  );
};

export default Dashboard;
