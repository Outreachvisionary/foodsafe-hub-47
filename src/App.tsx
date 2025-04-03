
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserProvider } from './contexts/UserContext';
import { PermissionProvider } from './contexts/PermissionContext';
import React, { Suspense, lazy } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { useTranslation } from 'react-i18next';
import Loading from '@/components/Loading';
import AuthLayout from '@/layouts/AuthLayout';
import MainLayout from '@/layouts/MainLayout';
import UpdatePassword from '@/pages/UpdatePassword';

// Pages
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import Profile from './pages/Profile';
import DatabaseConnectionTest from './pages/DatabaseConnectionTest';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <PermissionProvider>
          <Router>
            <Routes>
              <Route element={<AuthLayout />}>
                <Route path="/" element={<Home />} />
              </Route>
              <Route element={<MainLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/users" element={<UserManagement />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/db-test" element={<DatabaseConnectionTest />} />
              </Route>
              <Route path="/update-password" element={<UpdatePassword />} />
            </Routes>
            <Toaster />
          </Router>
        </PermissionProvider>
      </UserProvider>
    </QueryClientProvider>
  );
}

export default App;
