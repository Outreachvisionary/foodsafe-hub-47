
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { DocumentProvider } from '@/contexts/DocumentContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { TrainingProvider } from '@/contexts/TrainingContext';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';
import Documents from '@/pages/Documents';
import CAPA from '@/pages/CAPA';
import NonConformance from '@/pages/NonConformance';
import TrainingModule from '@/pages/TrainingModule';
import Traceability from '@/pages/Traceability';
import SupplierManagement from '@/pages/SupplierManagement';
import AuditsModule from '@/pages/AuditsModule';
import DatabaseConnectionTest from '@/pages/DatabaseConnectionTest';
import Tasks from '@/pages/Tasks';
import Facilities from '@/pages/Facilities';
import Standards from '@/pages/Standards';
import Complaints from '@/pages/Complaints';
import KPIs from '@/pages/KPIs';
import HACCP from '@/pages/HACCP';
import Testing from '@/pages/Testing';
import Reports from '@/pages/Reports';
import Analytics from '@/pages/Analytics';
import Performance from '@/pages/Performance';
import Users from '@/pages/Users';
import Organizations from '@/pages/Organizations';
import Departments from '@/pages/Departments';
import Roles from '@/pages/Roles';
import Certifications from '@/pages/Certifications';
import Settings from '@/pages/Settings';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NotificationProvider>
          <DocumentProvider>
            <TrainingProvider>
              <div className="min-h-screen bg-background">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/test-db" element={<DatabaseConnectionTest />} />
                  <Route 
                    path="/dashboard" 
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/documents" 
                    element={
                      <ProtectedRoute>
                        <Documents />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/documents/:id" 
                    element={
                      <ProtectedRoute>
                        <Documents />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/tasks" 
                    element={
                      <ProtectedRoute>
                        <Tasks />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/capa" 
                    element={
                      <ProtectedRoute>
                        <CAPA />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/capa/:id" 
                    element={
                      <ProtectedRoute>
                        <CAPA />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/non-conformance" 
                    element={
                      <ProtectedRoute>
                        <NonConformance />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/non-conformance/:id" 
                    element={
                      <ProtectedRoute>
                        <NonConformance />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/training" 
                    element={
                      <ProtectedRoute>
                        <TrainingModule />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/training/:id" 
                    element={
                      <ProtectedRoute>
                        <TrainingModule />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/facilities" 
                    element={
                      <ProtectedRoute>
                        <Facilities />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/audits" 
                    element={
                      <ProtectedRoute>
                        <AuditsModule />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/audits/:id" 
                    element={
                      <ProtectedRoute>
                        <AuditsModule />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/standards" 
                    element={
                      <ProtectedRoute>
                        <Standards />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/complaints" 
                    element={
                      <ProtectedRoute>
                        <Complaints />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/kpis" 
                    element={
                      <ProtectedRoute>
                        <KPIs />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/haccp" 
                    element={
                      <ProtectedRoute>
                        <HACCP />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/traceability" 
                    element={
                      <ProtectedRoute>
                        <Traceability />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/traceability/:id" 
                    element={
                      <ProtectedRoute>
                        <Traceability />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/suppliers" 
                    element={
                      <ProtectedRoute>
                        <SupplierManagement />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/suppliers/:id" 
                    element={
                      <ProtectedRoute>
                        <SupplierManagement />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/testing" 
                    element={
                      <ProtectedRoute>
                        <Testing />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/reports" 
                    element={
                      <ProtectedRoute>
                        <Reports />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/analytics" 
                    element={
                      <ProtectedRoute>
                        <Analytics />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/performance" 
                    element={
                      <ProtectedRoute>
                        <Performance />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/users" 
                    element={
                      <ProtectedRoute>
                        <Users />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/organizations" 
                    element={
                      <ProtectedRoute>
                        <Organizations />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/departments" 
                    element={
                      <ProtectedRoute>
                        <Departments />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/roles" 
                    element={
                      <ProtectedRoute>
                        <Roles />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/database-test" 
                    element={
                      <ProtectedRoute>
                        <DatabaseConnectionTest />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/certifications" 
                    element={
                      <ProtectedRoute>
                        <Certifications />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/settings" 
                    element={
                      <ProtectedRoute>
                        <Settings />
                      </ProtectedRoute>
                    } 
                  />
                </Routes>
                <Toaster />
              </div>
            </TrainingProvider>
          </DocumentProvider>
        </NotificationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
