
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/layout/AppSidebar';
import DashboardHeader from '@/components/DashboardHeader';
import Breadcrumbs from '@/components/layout/Breadcrumbs';

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

const AppLayout: React.FC<AppLayoutProps> = ({ 
  children, 
  title = "Dashboard", 
  subtitle = "Your food safety compliance platform with integrated workflow automation" 
}) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gray-50">
        <AppSidebar />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <DashboardHeader title={title} subtitle={subtitle} />
          
          {/* Content */}
          <main className="flex-1 p-6">
            <Breadcrumbs />
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
