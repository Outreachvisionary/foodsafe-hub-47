
import React, { ReactNode, useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AppSidebar from './AppSidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import NavigationButtons from '@/components/navigation/NavigationButtons';

interface SidebarLayoutProps {
  children?: ReactNode;
}

const SidebarLayout: React.FC<SidebarLayoutProps> = ({ children }) => {
  const [navigationHistory, setNavigationHistory] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const location = useLocation();

  useEffect(() => {
    // Track navigation history
    setNavigationHistory(prev => {
      const newHistory = [...prev];
      const currentPath = location.pathname;
      
      // If we're not at the end of history, we've navigated back and now forward
      if (currentIndex < newHistory.length - 1) {
        newHistory.splice(currentIndex + 1);
      }
      
      // Don't add duplicate consecutive paths
      if (newHistory[newHistory.length - 1] !== currentPath) {
        newHistory.push(currentPath);
        setCurrentIndex(newHistory.length - 1);
      }
      
      return newHistory;
    });
  }, [location.pathname]);

  const canGoBack = currentIndex > 0;
  const canGoNext = currentIndex < navigationHistory.length - 1;

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
          <NavigationButtons 
            showBack={canGoBack}
            showNext={canGoNext}
          />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default SidebarLayout;
