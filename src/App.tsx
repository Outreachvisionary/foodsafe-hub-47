
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserProvider } from './contexts/UserContext';
import { PermissionProvider } from './contexts/PermissionContext';
import React from 'react';
import { Toaster } from '@/components/ui/toaster';
import AuthLayout from '@/layouts/AuthLayout';
import MainLayout from '@/layouts/MainLayout';
import UpdatePassword from '@/pages/UpdatePassword';
import ProtectedRoute from '@/components/ProtectedRoute';

// Pages
import Home from '@/pages/Home';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import Profile from './pages/Profile';
import DatabaseConnectionTest from './pages/DatabaseConnectionTest';
import Auth from './pages/Auth';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <PermissionProvider>
          <Routes>
            <Route element={<AuthLayout />}>
              <Route path="/" element={<Home />} />
            </Route>
            <Route path="/auth" element={<Auth />} />
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/users" element={
                <ProtectedRoute>
                  <UserManagement />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/db-test" element={
                <ProtectedRoute>
                  <DatabaseConnectionTest />
                </ProtectedRoute>
              } />
            </Route>
            <Route path="/update-password" element={<UpdatePassword />} />
          </Routes>
          <Toaster />
        </PermissionProvider>
      </UserProvider>
    </QueryClientProvider>
  );
}

export default App;
