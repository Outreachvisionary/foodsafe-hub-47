
import React from 'react';
import { Outlet } from 'react-router-dom';
import AppSidebar from '@/components/layout/AppSidebar';
import { useIsMobile } from '@/hooks/use-mobile';

const SidebarLayout: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar with proper navigation */}
      <AppSidebar />
      
      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default SidebarLayout;
