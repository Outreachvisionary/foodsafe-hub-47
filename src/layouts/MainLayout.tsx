
import React from 'react';
import { Outlet } from 'react-router-dom';
import SidebarLayout from '@/components/layout/SidebarLayout';

const MainLayout: React.FC = () => {
  return (
    <SidebarLayout>
      <Outlet />
    </SidebarLayout>
  );
};

export default MainLayout;
