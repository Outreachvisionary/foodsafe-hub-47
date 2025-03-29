// src/App.tsx
// ... imports remain the same

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
          <Route path="/capa" element={<CAPA />} />
          <Route path="/capa/:id" element={<CAPADetailsPage />} />
          <Route path="/complaint-management" element={<ComplaintManagement />} />
          <Route path="/reports" element={<Reports />} />
          
          {/* Non-Conformance Module Routes - FIXED ORDER */}
          <Route path="/non-conformance/dashboard" element={<NonConformanceDashboard />} />
          <Route path="/non-conformance/new" element={<NonConformanceFormPage />} />
          <Route path="/non-conformance/edit/:id" element={<NonConformanceFormPage />} />
          <Route path="/non-conformance/:id" element={<NonConformanceModule />} />
          <Route path="/non-conformance" element={<NonConformanceModule />} />
          
          {/* Organization & Facility Management Routes */}
          <Route path="/organization" element={<OrganizationManagement />} />
          <Route path="/organizations" element={<Organizations />} />
          <Route path="/facilities" element={<FacilitiesList />} />
          <Route path="/facilities/:id" element={<FacilityManagement />} />
          <Route path="/facilities/new" element={<FacilityManagement />} />
        </Route>
        
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
