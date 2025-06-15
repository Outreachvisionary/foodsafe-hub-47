
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import DashboardHeader from '@/components/DashboardHeader';
import Loading from '@/components/Loading';

const Dashboard: React.FC = () => {
  const { user, profile, loading, isAuthenticated } = useAuth();
  
  console.log('Dashboard render:', { 
    hasUser: !!user, 
    hasProfile: !!profile, 
    loading, 
    isAuthenticated 
  });
  
  const getUserDisplayName = () => {
    if (!user) return 'Guest';
    if (profile?.full_name) return profile.full_name;
    return user.email?.split('@')[0] || 'User';
  };

  // Show loading if still fetching auth state
  if (loading) {
    return <Loading message="Loading dashboard..." size="md" fullScreen={false} />;
  }

  // Additional safety check - this should be handled by ProtectedSidebarLayout
  if (!isAuthenticated) {
    return <Loading message="Redirecting to authentication..." size="md" fullScreen={false} />;
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
