
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { LoadingOverlay } from '@/components/ui/loading-overlay';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useUser();
  const location = useLocation();

  useEffect(() => {
    // Check if we're not authenticated and not loading
    if (!loading && !user) {
      console.log('User not authenticated, redirecting to login');
    }
  }, [user, loading]);

  if (loading) {
    // Show a loading overlay while checking authentication
    return <LoadingOverlay message="Checking authentication..." />;
  }

  if (!user) {
    // Redirect to login page with the return URL
    return <Navigate to={`/auth?returnUrl=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
