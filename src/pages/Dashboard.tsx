
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import EnhancedDashboard from '@/components/dashboard/EnhancedDashboard';
import Loading from '@/components/Loading';

const Dashboard: React.FC = () => {
  const { loading, isAuthenticated } = useAuth();
  
  console.log('Dashboard render:', { 
    loading, 
    isAuthenticated 
  });
  
  // Show loading if still fetching auth state
  if (loading) {
    return <Loading message="Loading dashboard..." size="md" fullScreen={false} />;
  }

  return (
    <div className="space-y-6 p-6">
      <EnhancedDashboard />
    </div>
  );
};

export default Dashboard;
