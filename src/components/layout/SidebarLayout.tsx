
import React, { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import AppSidebar from './AppSidebar';
import TopNav from './TopNav';

interface SidebarLayoutProps {
  children?: ReactNode;
}

const SidebarLayout: React.FC<SidebarLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar />
      <div className="flex flex-col flex-1 overflow-y-auto">
        <TopNav />
        <main className="flex-1 p-4 bg-background/80">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default SidebarLayout;
