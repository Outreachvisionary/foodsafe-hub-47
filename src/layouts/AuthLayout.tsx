
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Toaster } from '@/components/ui/toaster';

const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </div>
      <Toaster />
    </div>
  );
};

export default AuthLayout;
