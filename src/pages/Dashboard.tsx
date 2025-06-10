
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import SidebarLayout from '@/components/layout/SidebarLayout';
import DashboardHeader from '@/components/DashboardHeader';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  
  // Mock user metadata access - replace with actual implementation
  const getUserDisplayName = () => {
    if (!user) return 'Guest';
    // Since user_metadata might not be available, fall back to email
    return user.email?.split('@')[0] || 'User';
  };

  return (
    <SidebarLayout>
      <div className="space-y-6">
        <DashboardHeader
          title={`Welcome back, ${getUserDisplayName()}!`}
          subtitle="Here's your food safety management overview"
        />
        <DashboardOverview />
      </div>
    </SidebarLayout>
  );
};

export default Dashboard;
