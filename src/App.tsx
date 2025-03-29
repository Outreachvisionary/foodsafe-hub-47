import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ProtectedSidebarLayout from '@/components/layout/ProtectedSidebarLayout';
import Loading from '@/components/Loading';
import Profile from '@/pages/Profile';
import ResetPassword from '@/pages/ResetPassword';
import UpdatePassword from '@/pages/UpdatePassword';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/login" element={<Loading />} />
        <Route path="/register" element={<Loading />} />
        <Route path="/forgot-password" element={<Loading />} />
        <Route path="/dashboard" element={
          <ProtectedSidebarLayout>
            <Loading />
          </ProtectedSidebarLayout>
        } />
        <Route path="/documents" element={
          <ProtectedSidebarLayout>
            <Loading />
          </ProtectedSidebarLayout>
        } />
        <Route path="/standards" element={
          <ProtectedSidebarLayout>
            <Loading />
          </ProtectedSidebarLayout>
        } />
        <Route path="/organizations" element={
          <ProtectedSidebarLayout>
            <Loading />
          </ProtectedSidebarLayout>
        } />
        <Route path="/facilities" element={
          <ProtectedSidebarLayout>
            <Loading />
          </ProtectedSidebarLayout>
        } />
        <Route path="/audits" element={
          <ProtectedSidebarLayout>
            <Loading />
          </ProtectedSidebarLayout>
        } />
        <Route path="/non-conformance" element={
          <ProtectedSidebarLayout>
            <Loading />
          </ProtectedSidebarLayout>
        } />
        <Route path="/capa" element={
          <ProtectedSidebarLayout>
            <Loading />
          </ProtectedSidebarLayout>
        } />
        <Route path="/suppliers" element={
          <ProtectedSidebarLayout>
            <Loading />
          </ProtectedSidebarLayout>
        } />
        <Route path="/training" element={
          <ProtectedSidebarLayout>
            <Loading />
          </ProtectedSidebarLayout>
        } />
        <Route path="/haccp" element={
          <ProtectedSidebarLayout>
            <Loading />
          </ProtectedSidebarLayout>
        } />
        <Route path="/traceability" element={
          <ProtectedSidebarLayout>
            <Loading />
          </ProtectedSidebarLayout>
        } />
        <Route path="/users" element={
          <ProtectedSidebarLayout>
            <Loading />
          </ProtectedSidebarLayout>
        } />
        <Route path="/roles" element={
          <ProtectedSidebarLayout>
            <Loading />
          </ProtectedSidebarLayout>
        } />
        <Route path="/departments" element={
          <ProtectedSidebarLayout>
            <Loading />
          </ProtectedSidebarLayout>
        } />
        <Route path="/profile" element={
          <ProtectedSidebarLayout>
            <Profile />
          </ProtectedSidebarLayout>
        } />
        <Route path="/reset-password" element={
          <ProtectedSidebarLayout>
            <ResetPassword />
          </ProtectedSidebarLayout>
        } />
        <Route path="/update-password" element={<UpdatePassword />} />
      </Routes>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
