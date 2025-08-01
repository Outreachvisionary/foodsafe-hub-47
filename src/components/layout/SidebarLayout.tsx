
import React, { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import AppSidebar from './AppSidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

interface SidebarLayoutProps {
  children?: ReactNode;
}

const SidebarLayout: React.FC<SidebarLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <main className="flex-1 p-8">
            <div className="max-w-7xl mx-auto">
              {children || <Outlet />}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default SidebarLayout;
