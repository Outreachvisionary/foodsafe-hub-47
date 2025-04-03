
import React from 'react';
import { Outlet } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

const SidebarLayout: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className={`${isMobile ? 'hidden' : 'w-64'} bg-muted p-4 border-r border-border`}>
        {/* Sidebar content */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Dashboard</h2>
          {/* Navigation links would go here */}
        </div>
      </div>

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
