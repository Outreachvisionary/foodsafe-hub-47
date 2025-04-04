
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import Loading from '@/components/Loading';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useUser(); // Change isLoading to loading to match UserContext
  const location = useLocation();

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    // Redirect to login page if not authenticated
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
