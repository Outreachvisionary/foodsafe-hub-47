
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import Loading from '@/components/Loading';
import SidebarLayout from './SidebarLayout';
import RealTimeNotificationSystem from '@/components/notifications/RealTimeNotificationSystem';

interface ProtectedSidebarLayoutProps {
  children: React.ReactNode;
}

const ProtectedSidebarLayout: React.FC<ProtectedSidebarLayoutProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading message="Checking authentication..." />;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <SidebarLayout>
      <RealTimeNotificationSystem />
      {children}
    </SidebarLayout>
  );
};

export default ProtectedSidebarLayout;
