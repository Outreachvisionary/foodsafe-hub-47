
import React, { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import MainLayout from './MainLayout';
import Loading from '@/components/Loading';

interface ProtectedSidebarLayoutProps {
  children?: ReactNode;
}

const ProtectedSidebarLayout: React.FC<ProtectedSidebarLayoutProps> = ({ children }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const [showLoading, setShowLoading] = useState(true);
  
  console.log('ProtectedSidebarLayout render:', { 
    loading, 
    isAuthenticated, 
    hasUser: !!user, 
    userId: user?.id,
    showLoading
  });
  
  // Set a timeout to stop showing loading after a reasonable time
  useEffect(() => {
    const timeout = setTimeout(() => {
      console.log('ProtectedSidebarLayout: Stopping loading after timeout');
      setShowLoading(false);
    }, 3000); // Reduced to 3 seconds

    return () => clearTimeout(timeout);
  }, []);

  // Stop showing loading when auth is no longer loading
  useEffect(() => {
    if (!loading) {
      console.log('ProtectedSidebarLayout: Auth finished loading, stopping loading state');
      setShowLoading(false);
    }
  }, [loading]);
  
  // Show loading indicator while checking authentication - but with timeout
  if (loading && showLoading) {
    console.log('ProtectedSidebarLayout: Showing loading state');
    return <Loading message="Checking authentication..." />;
  }
  
  // If we're still loading but past timeout, try to proceed anyway
  if (loading && !showLoading) {
    console.log('ProtectedSidebarLayout: Loading timeout reached, proceeding without auth check');
  }
  
  // Redirect to auth if not authenticated (only if we're not loading)
  if (!loading && (!isAuthenticated || !user)) {
    console.log('ProtectedSidebarLayout: Redirecting to auth - not authenticated');
    return <Navigate to="/auth" replace />;
  }
  
  console.log('ProtectedSidebarLayout: Rendering main layout');
  
  // Show the main layout with the children
  return (
    <MainLayout>
      {children}
    </MainLayout>
  );
};

export default ProtectedSidebarLayout;
