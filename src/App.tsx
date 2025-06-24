
import React from 'react';
import './App.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Sonner } from '@/components/ui/sonner';
import Index from './pages/Index';
import DashboardPage from './pages/DashboardPage';
import TestingDashboard from './pages/TestingDashboard';
import DatabaseTestPage from './pages/DatabaseTestPage';
import BackendTestsPage from './pages/BackendTestsPage';
import SystemDiagnosticsPage from './pages/SystemDiagnosticsPage';
import TestingVerification from './pages/TestingVerification';
import DatabaseConnectionTest from './pages/DatabaseConnectionTest';

function App() {
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

export default App;
