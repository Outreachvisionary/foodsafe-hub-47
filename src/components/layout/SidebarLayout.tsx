
import React, { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import AppSidebar from '@/components/layout/AppSidebar';
import { useIsMobile } from '@/hooks/use-mobile';

interface SidebarLayoutProps {
  children?: ReactNode;
}

const SidebarLayout: React.FC<SidebarLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex h-screen w-full bg-background">
      {/* Sidebar with proper navigation */}
      <AppSidebar />
      
      {/* Main content - adjusted to respect sidebar width */}
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          {children ? children : <Outlet />}
        </div>
      </div>
    </div>
  );
};

export default SidebarLayout;
