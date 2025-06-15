
import React, { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import MainLayout from './MainLayout';
import Loading from '@/components/Loading';

interface ProtectedSidebarLayoutProps {
  children?: ReactNode;
}

const ProtectedSidebarLayout: React.FC<ProtectedSidebarLayoutProps> = ({ children }) => {
  const { user, loading, isAuthenticated, session } = useAuth();
  const [showLoading, setShowLoading] = useState(true);
  
  console.log('ProtectedSidebarLayout render:', { 
    loading, 
    isAuthenticated, 
    hasUser: !!user, 
    hasSession: !!session,
    userId: user?.id,
    showLoading
  });
  
  // Set a timeout to stop showing loading after a reasonable time
  useEffect(() => {
    const timeout = setTimeout(() => {
      console.log('ProtectedSidebarLayout: Stopping loading after timeout');
      setShowLoading(false);
    }, 5000); // 5 seconds max

    return () => clearTimeout(timeout);
  }, []);

  // Stop showing loading when auth is no longer loading
  useEffect(() => {
    if (!loading) {
      setShowLoading(false);
    }
  }, [loading]);
  
  // Show loading indicator while checking authentication - but with timeout
  if (loading && showLoading) {
    console.log('ProtectedSidebarLayout: Showing loading state');
    return <Loading message="Checking authentication..." />;
  }
  
  // Redirect to auth if not authenticated
  if (!isAuthenticated || !user || !session) {
    console.log('ProtectedSidebarLayout: Redirecting to auth - not authenticated');
    return <Navigate to="/auth" replace />;
  }
  
  console.log('ProtectedSidebarLayout: Rendering main layout for authenticated user');
  
  // Show the main layout with the children
  return (
    <MainLayout>
      {children}
    </MainLayout>
  );
};

export default ProtectedSidebarLayout;
