
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import Index from '@/pages/Index';
import DocumentManager from '@/pages/DocumentManager';
import DocumentDetails from '@/pages/DocumentDetails';
import SupplierManagement from '@/pages/SupplierManagement';
import SupplierDetails from '@/pages/SupplierDetails';
import NonConformance from '@/pages/NonConformance';
import NonConformanceDetails from '@/pages/NonConformanceDetails';
import CAPA from '@/pages/CAPA';
import CAPADetails from '@/pages/CAPADetails';
import ComplaintsManagement from '@/pages/ComplaintsManagement';
import Traceability from '@/pages/Traceability';
import Training from '@/pages/Training';
import Audits from '@/pages/Audits';
import UserProfile from '@/pages/UserProfile';
import Reports from '@/pages/Reports';
import UserManagement from '@/pages/UserManagement';
import Settings from '@/pages/Settings';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/documents" element={<DocumentManager />} />
          <Route path="/document/:id" element={<DocumentDetails />} />
          <Route path="/suppliers" element={<SupplierManagement />} />
          <Route path="/suppliers/:id" element={<SupplierDetails />} />
          <Route path="/non-conformance" element={<NonConformance />} />
          <Route path="/non-conformance/:id" element={<NonConformanceDetails />} />
          <Route path="/capa" element={<CAPA />} />
          <Route path="/capa/:id" element={<CAPADetails />} />
          <Route path="/complaints" element={<ComplaintsManagement />} />
          <Route path="/traceability" element={<Traceability />} />
          <Route path="/training" element={<Training />} />
          <Route path="/audits" element={<Audits />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
