
import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { LoadingOverlay } from '@/components/ui/loading-overlay';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useUser();
  const location = useLocation();

  if (loading) {
    // Show a loading overlay while checking authentication
    return <LoadingOverlay message="Checking authentication..." />;
  }

  if (!user) {
    // Redirect to login page with the return URL
    return <Navigate to={`/auth?returnUrl=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // Return children if they exist, otherwise use Outlet
  return <>{children ? children : <Outlet />}</>;
};

export default ProtectedRoute;
