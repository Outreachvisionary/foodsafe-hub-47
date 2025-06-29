
import React, { useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { UserProvider } from '@/contexts/UserContext';
import { moduleConnector } from '@/services/moduleConnector';
import Index from './pages/Index';
import DashboardPage from './pages/DashboardPage';
import TestingDashboard from './pages/TestingDashboard';
import DatabaseTestPage from './pages/DatabaseTestPage';
import BackendTestsPage from './pages/BackendTestsPage';
import SystemDiagnosticsPage from './pages/SystemDiagnosticsPage';
import TestingVerification from './pages/TestingVerification';
import DatabaseConnectionTest from './pages/DatabaseConnectionTest';

// Import all the module pages
import AuthPage from './pages/AuthPage';
import Documents from './pages/Documents';
import CAPA from './pages/CAPA';
import NonConformance from './pages/NonConformance';
import Training from './pages/Training';
import Audits from './pages/Audits';
import Standards from './pages/Standards';
import Complaints from './pages/Complaints';
import Traceability from './pages/Traceability';
import Facilities from './pages/Facilities';
import Analytics from './pages/Analytics';
import Performance from './pages/Performance';
import Users from './pages/Users';
import Settings from './pages/Settings';
import Create from './pages/Create';
import ProtectedSidebarLayout from './components/layout/ProtectedSidebarLayout';

function AppContent() {
  useEffect(() => {
    // Initialize modules when app starts
    const initializeSystem = async () => {
      console.log('Initializing SAAS platform modules...');
      await moduleConnector.initializeModules();
    };

    initializeSystem();
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<AuthPage />} />
        
        {/* Protected routes with sidebar layout */}
        <Route path="/dashboard" element={<ProtectedSidebarLayout><DashboardPage /></ProtectedSidebarLayout>} />
        <Route path="/create" element={<ProtectedSidebarLayout><Create /></ProtectedSidebarLayout>} />
        <Route path="/documents" element={<ProtectedSidebarLayout><Documents /></ProtectedSidebarLayout>} />
        <Route path="/capa" element={<ProtectedSidebarLayout><CAPA /></ProtectedSidebarLayout>} />
        <Route path="/non-conformance" element={<ProtectedSidebarLayout><NonConformance /></ProtectedSidebarLayout>} />
        <Route path="/audits" element={<ProtectedSidebarLayout><Audits /></ProtectedSidebarLayout>} />
        <Route path="/complaints" element={<ProtectedSidebarLayout><Complaints /></ProtectedSidebarLayout>} />
        <Route path="/training" element={<ProtectedSidebarLayout><Training /></ProtectedSidebarLayout>} />
        <Route path="/certifications" element={<ProtectedSidebarLayout><Training /></ProtectedSidebarLayout>} />
        <Route path="/traceability" element={<ProtectedSidebarLayout><Traceability /></ProtectedSidebarLayout>} />
        <Route path="/suppliers" element={<ProtectedSidebarLayout><Facilities /></ProtectedSidebarLayout>} />
        <Route path="/facilities" element={<ProtectedSidebarLayout><Facilities /></ProtectedSidebarLayout>} />
        <Route path="/analytics" element={<ProtectedSidebarLayout><Analytics /></ProtectedSidebarLayout>} />
        <Route path="/performance" element={<ProtectedSidebarLayout><Performance /></ProtectedSidebarLayout>} />
        <Route path="/users" element={<ProtectedSidebarLayout><Users /></ProtectedSidebarLayout>} />
        <Route path="/settings" element={<ProtectedSidebarLayout><Settings /></ProtectedSidebarLayout>} />
        <Route path="/standards" element={<ProtectedSidebarLayout><Standards /></ProtectedSidebarLayout>} />
        
        {/* Testing and diagnostics routes */}
        <Route path="/testing" element={<TestingDashboard />} />
        <Route path="/database-test" element={<DatabaseTestPage />} />
        <Route path="/backend-tests" element={<BackendTestsPage />} />
        <Route path="/diagnostics" element={<SystemDiagnosticsPage />} />
        <Route path="/testing-verification" element={<TestingVerification />} />
        <Route path="/database-connection-test" element={<DatabaseConnectionTest />} />
      </Routes>
      <Toaster />
      <Sonner />
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
