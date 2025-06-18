
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import AuthErrorBoundary from '@/components/error/AuthErrorBoundary';
import Index from './pages/Index';
import Auth from './pages/Auth';
import SupplierManagement from './pages/SupplierManagement';
import NonConformance from './pages/NonConformance';
import CAPA from './pages/CAPA';
import CAPADetails from './pages/CAPADetails';
import ComplaintsManagement from './pages/ComplaintsManagement';
import Traceability from './pages/Traceability';
import Reports from './pages/Reports';
import UserManagement from './pages/UserManagement';
import Settings from './pages/Settings';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: (failureCount, error) => {
        // Don't retry auth errors
        if (error?.message?.toLowerCase().includes('auth')) {
          return false;
        }
        return failureCount < 3;
      },
    },
  },
});

function App() {
  return (
    <AuthErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/suppliers" element={<SupplierManagement />} />
              <Route path="/non-conformance" element={<NonConformance />} />
              <Route path="/capa" element={<CAPA />} />
              <Route path="/capa/:id" element={<CAPADetails />} />
              <Route path="/complaints" element={<ComplaintsManagement />} />
              <Route path="/traceability" element={<Traceability />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Router>
        </TooltipProvider>
      </QueryClientProvider>
    </AuthErrorBoundary>
  );
}

export default App;
