
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
        <Route path="/" element={<Index />} />
        <Route path="/dashboard" element={<DashboardPage />} />
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
