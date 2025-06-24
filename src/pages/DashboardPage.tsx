
import React from 'react';
import ProtectedSidebarLayout from '@/components/layout/ProtectedSidebarLayout';
import OptimizedDashboard from '@/components/dashboard/OptimizedDashboard';

const DashboardPage: React.FC = () => {
  return (
    <ProtectedSidebarLayout>
      <div className="container mx-auto p-6 max-w-7xl">
        <OptimizedDashboard />
      </div>
    </ProtectedSidebarLayout>
  );
};

export default DashboardPage;
