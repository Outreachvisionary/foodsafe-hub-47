
import React from 'react';
import ProtectedSidebarLayout from '@/components/layout/ProtectedSidebarLayout';
import OptimizedDashboard from '@/components/dashboard/OptimizedDashboard';

const DashboardPage: React.FC = () => {
  return (
    <ProtectedSidebarLayout>
      <OptimizedDashboard />
    </ProtectedSidebarLayout>
  );
};

export default DashboardPage;
