// src/components/layout/ProtectedSidebarLayout.tsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import SidebarLayout from './SidebarLayout';

const ProtectedSidebarLayout: React.FC = () => {
  const { user, loading } = useUser();
  
  // Show nothing while checking authentication
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  // Show the sidebar layout with nested routes
  return <SidebarLayout />;
};

export default ProtectedSidebarLayout;
