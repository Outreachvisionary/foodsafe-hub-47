// src/App.tsx
import { Routes, Route } from 'react-router-dom';
import SidebarLayout from '@/components/layout/SidebarLayout';
// Other imports...

const App = () => {
  return (
    <div className="app">
      <Routes>
        {/* Public routes outside SidebarLayout */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Index />} />
  <Route path="/auth" element={<Auth />} />
        {/* Protected routes with navigation sidebar */}
        <Route element={<SidebarLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/documents/*" element={<Documents />} />
    <Route path="/standards" element={<Standards />} />
    <Route path="/standards/:standardId" element={<Standards />} />
          <Route path="/organization" element={<OrganizationManagement />} />
          <Route path="/organizations" element={<Organizations />} />
          <Route path="/facilities" element={<FacilitiesList />} />
          <Route path="/facilities/:id" element={<FacilityManagement />} />
          <Route path="/audits" element={<InternalAudits />} />
          <Route path="/non-conformance" element={<NonConformanceModule />} />
          <Route path="/non-conformance/:id" element={<NonConformanceModule />} />
          <Route path="/non-conformance/new" element={<NonConformanceFormPage />} />
          <Route path="/capa" element={<CAPA />} />
          <Route path="/capa/:id" element={<CAPADetailsPage />} />
          <Route path="/suppliers" element={<SupplierManagement />} />
          <Route path="/training" element={<Training />} />
          <Route path="/haccp" element={<HACCP />} />
          <Route path="/traceability" element={<Traceability />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
