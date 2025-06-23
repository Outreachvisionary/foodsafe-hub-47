
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import AuthErrorBoundary from '@/components/error/AuthErrorBoundary';

// Core Pages
import Index from './pages/Index';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';

// Quality Management
import Documents from './pages/Documents';
import NonConformance from './pages/NonConformance';
import CAPA from './pages/CAPA';
import CAPADetails from './pages/CAPADetails';
import ComplaintsManagement from './pages/ComplaintsManagement';

// Auditing & Compliance
import Audits from './pages/Audits';
import Standards from './pages/Standards';

// Training & Performance
import Training from './pages/Training';
import Performance from './pages/Performance';
import Analytics from './pages/Analytics';

// Operations
import Tasks from './pages/Tasks';
import Traceability from './pages/Traceability';
import SupplierManagement from './pages/SupplierManagement';
import Facilities from './pages/Facilities';

// Reporting & Administration
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
        <Toaster />
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />

            {/* Core Dashboard */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Quality Management */}
            <Route path="/documents" element={<Documents />} />
            <Route path="/non-conformance" element={<NonConformance />} />
            <Route path="/capa" element={<CAPA />} />
            <Route path="/capa/:id" element={<CAPADetails />} />
            <Route path="/complaints" element={<ComplaintsManagement />} />

            {/* Auditing & Compliance */}
            <Route path="/audits" element={<Audits />} />
            <Route path="/standards" element={<Standards />} />

            {/* Training & Performance */}
            <Route path="/training" element={<Training />} />
            <Route path="/performance" element={<Performance />} />
            <Route path="/analytics" element={<Analytics />} />

            {/* Operations */}
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/traceability" element={<Traceability />} />
            <Route path="/suppliers" element={<SupplierManagement />} />
            <Route path="/facilities" element={<Facilities />} />

            {/* Reporting & Administration */}
            <Route path="/reports" element={<Reports />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Router>
      </QueryClientProvider>
    </AuthErrorBoundary>
  );
}

export default App;
