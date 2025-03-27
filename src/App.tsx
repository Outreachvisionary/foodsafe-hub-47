
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';

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
import ComplaintManagement from './pages/ComplaintManagement';
import Reports from './pages/Reports';
import Standards from './pages/Standards';
import NotFound from './pages/NotFound';

// Non-Conformance Module
import NonConformanceModule from './pages/NonConformance';
import NonConformanceFormPage from './pages/NonConformanceForm';

// Organization & Facility Management
import OrganizationManagement from './pages/OrganizationManagement';
import FacilitiesList from './pages/FacilitiesList';
import FacilityManagement from './pages/FacilityManagement';

const App = () => {
  return (
    <div className="app">
      <Toaster />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/documents/*" element={<Documents />} />
        <Route path="/haccp" element={<HaccpModule />} />
        <Route path="/training" element={<TrainingModule />} />
        <Route path="/internal-audits" element={<InternalAudits />} />
        <Route path="/supplier-management" element={<SupplierManagement />} />
        <Route path="/traceability" element={<Traceability />} />
        <Route path="/capa" element={<CAPA />} />
        <Route path="/complaint-management" element={<ComplaintManagement />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/standards" element={<Standards />} />
        
        {/* Non-Conformance Module Routes */}
        <Route path="/non-conformance" element={<NonConformanceModule />} />
        <Route path="/non-conformance/:id" element={<NonConformanceModule />} />
        <Route path="/non-conformance/new" element={<NonConformanceFormPage />} />
        <Route path="/non-conformance/edit/:id" element={<NonConformanceFormPage />} />
        
        {/* Organization & Facility Management Routes */}
        <Route path="/organization" element={<OrganizationManagement />} />
        <Route path="/facilities" element={<FacilitiesList />} />
        <Route path="/facilities/:id" element={<FacilityManagement />} />
        <Route path="/facilities/new" element={<FacilityManagement />} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;
