
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import DashboardHeader from '@/components/DashboardHeader';

const Dashboard: React.FC = () => {
  const { user, profile } = useAuth();
  
  const getUserDisplayName = () => {
    if (!user) return 'Guest';
    if (profile?.full_name) return profile.full_name;
    return user.email?.split('@')[0] || 'User';
  };

  return (
    <div className="space-y-6">
      <DashboardHeader
        title={`Welcome back, ${getUserDisplayName()}!`}
        subtitle="Here's your food safety management overview"
      />
      <DashboardOverview />
    </div>
  );
};

export default Dashboard;
