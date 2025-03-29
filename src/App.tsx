
// src/App.tsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import ProtectedSidebarLayout from './components/layout/ProtectedSidebarLayout';

// Main pages
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import Documents from './pages/Documents';
import HaccpModule from './pages/HaccpModule';
import TrainingModule from './pages/TrainingModule';
import InternalAudits from './pages/InternalAudits';
import SupplierManagement from './pages/SupplierManagement';
import Traceability from './pages/Traceability';
import CAPA from './pages/CAPA';
import CAPADetailsPage from './pages/CAPADetails';
import ComplaintManagement from './pages/ComplaintManagement';
import Reports from './pages/Reports';
import Standards from './pages/Standards';
import ModuleContent from './components/standards/ModuleContent';
import NotFound from './pages/NotFound';
import Auth from './pages/Auth';
import Solutions from './pages/Solutions';
import Products from './pages/Products';
import Organizations from './pages/Organizations';

// Non-Conformance Module
import NonConformanceModule from './pages/NonConformance';
import NonConformanceFormPage from './pages/NonConformanceForm';
import NonConformanceDashboard from './pages/NonConformanceDashboard';

// Organization & Facility Management
import OrganizationManagement from './pages/OrganizationManagement';
import FacilitiesList from './pages/FacilitiesList';
import FacilityManagement from './pages/FacilityManagement';

const App = () => {
  return (
    <div className="app">
      <Toaster />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth />} />
        <Route path="/demo" element={<Auth />} />
        
        {/* Public product/marketing pages */}
        <Route path="/standards" element={<Standards />} />
        <Route path="/standards/:standardId" element={<Standards />} />
        
        <Route path="/platform/:moduleType" element={<Products />} />
        <Route path="/platform" element={<Products />} />
        <Route path="/industries/:industryType" element={<Solutions />} />
        <Route path="/industries" element={<Solutions />} />
        <Route path="/solutions/:solutionType" element={<Solutions />} />
        <Route path="/solutions" element={<Solutions />} />
        <Route path="/products/:productType" element={<Products />} />
        <Route path="/products" element={<Products />} />
        
        {/* Protected routes with SidebarLayout */}
        <Route element={<ProtectedSidebarLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/documents/*" element={<Documents />} />
          <Route path="/haccp" element={<HaccpModule />} />
          <Route path="/training" element={<TrainingModule />} />
          <Route path="/internal-audits" element={<InternalAudits />} />
          <Route path="/audits" element={<InternalAudits />} /> 
          <Route path="/supplier-management" element={<SupplierManagement />} />
          <Route path="/suppliers" element={<SupplierManagement />} /> 
          <Route path="/traceability" element={<Traceability />} />
          
          {/* CAPA Module Routes */}
          <Route path="/capa" element={<CAPA />} />
          <Route path="/capa/:id" element={<CAPADetailsPage />} />
          
          <Route path="/complaint-management" element={<ComplaintManagement />} />
          <Route path="/reports" element={<Reports />} />
          
          {/* Non-Conformance Module Routes - Well-Organized */}
          <Route path="/non-conformance" element={<NonConformanceModule />} />
          <Route path="/non-conformance/dashboard" element={<NonConformanceDashboard />} />
          <Route path="/non-conformance/new" element={<NonConformanceFormPage />} />
          <Route path="/non-conformance/edit/:id" element={<NonConformanceFormPage />} />
          <Route path="/non-conformance/:id" element={<NonConformanceModule />} />
          
          {/* Organization & Facility Management Routes */}
          <Route path="/organization" element={<OrganizationManagement />} />
          <Route path="/organizations" element={<Organizations />} />
          <Route path="/facilities" element={<FacilitiesList />} />
          <Route path="/facilities/new" element={<FacilityManagement />} />
          <Route path="/facilities/:id" element={<FacilityManagement />} />
        </Route>

        <Route path="/documents/link/:sourceType/:sourceId" element={<DocumentLinkPage />} />

{/* Document linking route */}
<Route path="/documents/link/:sourceType/:sourceId" element={<DocumentLinkPage />} />
        
        {/* Misc routes */}
        <Route path="/resources/:resourceType" element={<NotFound />} />
        <Route path="/resources" element={<NotFound />} />
        <Route path="/about" element={<NotFound />} />
        <Route path="/integrations/:integrationType" element={<NotFound />} />
        <Route path="/integrations" element={<NotFound />} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;
