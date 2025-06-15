
import React, { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import AppSidebar from './AppSidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

interface MainLayoutProps {
  children?: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <main className="flex-1">
            {children || <Outlet />}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
