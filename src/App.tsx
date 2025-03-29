
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import ProtectedRoute from './components/layout/ProtectedRoute';
import SidebarLayout from './components/layout/SidebarLayout';
import { Outlet } from 'react-router-dom';

// Import all your page components
import Index from './pages/Index';
import Auth from './pages/Auth';
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
import NonConformanceModule from './pages/NonConformance';
import NonConformanceFormPage from './pages/NonConformanceForm';
import OrganizationManagement from './pages/OrganizationManagement';
import Organizations from './pages/Organizations';
import FacilitiesList from './pages/FacilitiesList';
import FacilityManagement from './pages/FacilityManagement';
import StandardsPage from './pages/StandardsPage';
import Products from './pages/Products';
import Solutions from './pages/Solutions';
import NotFound from './pages/NotFound';

// Create a layout route component
const ProtectedSidebarLayout = () => (
  <ProtectedRoute>
    <SidebarLayout>
      <Outlet />
    </SidebarLayout>
  </ProtectedRoute>
);

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
        <Route path="/standards" element={<StandardsPage />} />
        <Route path="/standards/:standardId" element={<StandardsPage />} />
        <Route path="/standards/:standardId/:moduleId" element={<StandardsPage />} />
        
        {/* Platform and Industry routes */}
        <Route path="/platform/:moduleType" element={<Products />} />
        <Route path="/platform" element={<Products />} />
        <Route path="/industries/:industryType" element={<Solutions />} />
        <Route path="/industries" element={<Solutions />} />
        <Route path="/solutions/:solutionType" element={<Solutions />} />
        <Route path="/solutions" element={<Solutions />} />
        <Route path="/products/:productType" element={<Products />} />
        <Route path="/products" element={<Products />} />
        
        {/* Protected routes with sidebar layout */}
        <Route element={<ProtectedSidebarLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/documents/*" element={<Documents />} />
          <Route path="/haccp" element={<HaccpModule />} />
          <Route path="/training" element={<TrainingModule />} />
          <Route path="/internal-audits" element={<InternalAudits />} />
          <Route path="/supplier-management" element={<SupplierManagement />} />
          <Route path="/traceability" element={<Traceability />} />
          <Route path="/capa" element={<CAPA />} />
          <Route path="/capa/:id" element={<CAPADetailsPage />} />
          <Route path="/complaint-management" element={<ComplaintManagement />} />
          <Route path="/reports" element={<Reports />} />
          
          {/* Non-Conformance Module Routes */}
          <Route path="/non-conformance" element={<NonConformanceModule />} />
          <Route path="/non-conformance/:id" element={<NonConformanceModule />} />
          <Route path="/non-conformance/new" element={<NonConformanceFormPage />} />
          <Route path="/non-conformance/edit/:id" element={<NonConformanceFormPage />} />
          
          {/* Organization & Facility Management Routes */}
          <Route path="/organization" element={<OrganizationManagement />} />
          <Route path="/organizations" element={<Organizations />} />
          <Route path="/facilities" element={<FacilitiesList />} />
          <Route path="/facilities/:id" element={<FacilityManagement />} />
          <Route path="/facilities/new" element={<FacilityManagement />} />
          {/* Add any other routes that should have the sidebar */}
        </Route>
        
        {/* Resource Routes */}
        <Route path="/resources/:resourceType" element={<NotFound />} />
        <Route path="/resources" element={<NotFound />} />
        
        {/* About Route */}
        <Route path="/about" element={<NotFound />} />
        
        {/* Integration Routes */}
        <Route path="/integrations/:integrationType" element={<NotFound />} />
        <Route path="/integrations" element={<NotFound />} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;
