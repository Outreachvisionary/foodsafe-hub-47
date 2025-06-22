
import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import Sidebar from './Sidebar';
import RealTimeNotificationSystem from '@/components/notifications/RealTimeNotificationSystem';

interface MainLayoutProps {
  children?: ReactNode;
  className?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, className }) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header with notifications */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        <div className="container flex h-14 items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold">Quality Management System</h2>
          </div>
          <div className="flex items-center space-x-4">
            <RealTimeNotificationSystem />
          </div>
        </div>
      </header>

      <div className="flex">
        <Sidebar />
        <main className={cn("flex-1 overflow-hidden", className)}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
