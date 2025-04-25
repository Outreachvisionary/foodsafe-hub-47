
import React from 'react';
import { Outlet } from 'react-router-dom';
import AppSidebar from './AppSidebar';

const SidebarLayout = () => {
  return (
    <div className="min-h-screen flex w-full">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <main className="flex-1 overflow-y-auto bg-background/95">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SidebarLayout;
