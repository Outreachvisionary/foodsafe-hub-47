
import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import SidebarLayout from './SidebarLayout';
import Loading from '@/components/Loading';

interface ProtectedSidebarLayoutProps {
  children?: ReactNode;
}

const ProtectedSidebarLayout: React.FC<ProtectedSidebarLayoutProps> = ({ children }) => {
  const { user, loading, isAuthenticated, session } = useAuth();
  
  console.log('ProtectedSidebarLayout render:', { 
    loading, 
    isAuthenticated, 
    hasUser: !!user, 
    hasSession: !!session,
    userId: user?.id 
  });
  
  // Show loading indicator while checking authentication
  if (loading) {
    console.log('ProtectedSidebarLayout: Showing loading state');
    return <Loading message="Checking authentication..." />;
  }
  
  // Redirect to auth if not authenticated
  if (!isAuthenticated || !user || !session) {
    console.log('ProtectedSidebarLayout: Redirecting to auth - not authenticated');
    return <Navigate to="/auth" replace />;
  }
  
  console.log('ProtectedSidebarLayout: Rendering sidebar layout for authenticated user');
  
  // Show the sidebar layout with the children
  return (
    <SidebarLayout>
      {children}
    </SidebarLayout>
  );
};

export default ProtectedSidebarLayout;
