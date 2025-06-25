
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import Loading from '@/components/Loading';
import MainLayout from './MainLayout';
import RealTimeNotificationSystem from '@/components/notifications/RealTimeNotificationSystem';

interface ProtectedSidebarLayoutProps {
  children: React.ReactNode;
}

const ProtectedSidebarLayout: React.FC<ProtectedSidebarLayoutProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loading message="Checking authentication..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <MainLayout>
      <RealTimeNotificationSystem />
      {children}
    </MainLayout>
  );
};

export default ProtectedSidebarLayout;
