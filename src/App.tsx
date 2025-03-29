import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import ProtectedSidebarLayout from '@/components/layout/ProtectedSidebarLayout';
import Loading from '@/components/Loading';
import Profile from '@/pages/Profile';
import ResetPassword from '@/pages/ResetPassword';
import UpdatePassword from '@/pages/UpdatePassword';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';
import Standards from '@/pages/Standards';
import StandardsPage from '@/pages/StandardsPage';
import ModuleContent from '@/components/standards/ModuleContent';
import SystemElements from '@/components/standards/modules/sqf/SystemElements';
import GMP from '@/components/standards/modules/sqf/GMP';
import FoodSafetyPlans from '@/components/standards/modules/sqf/FoodSafetyPlans';
import CAPA from '@/pages/CAPA';
import Documents from '@/pages/Documents';
import Organizations from '@/pages/Organizations';
import OrganizationsList from '@/pages/OrganizationsList';
import OrganizationManagement from '@/pages/OrganizationManagement';
import FacilitiesList from '@/pages/FacilitiesList';
import FacilityManagement from '@/pages/FacilityManagement';
import HaccpModule from '@/pages/HaccpModule';
import DepartmentManagement from '@/pages/DepartmentManagement';
import ComplaintManagement from '@/pages/ComplaintManagement';
import SupplierManagement from '@/pages/SupplierManagement';
import TrainingModule from '@/pages/TrainingModule';
import NonConformanceModule from '@/pages/NonConformance';
import Traceability from '@/pages/Traceability';
import AuditsModule from '@/pages/AuditsModule';
import UserManagement from '@/pages/UserManagement';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth />} />
        <Route path="/forgot-password" element={<Auth />} />
        <Route path="/dashboard" element={
          <ProtectedSidebarLayout>
            <Dashboard />
          </ProtectedSidebarLayout>
        } />
        
        <Route path="/standards" element={<Standards />} />
        <Route path="/standards/:standardId" element={<Standards />} />
        
        <Route path="/standards-modules" element={
          <ProtectedSidebarLayout>
            <StandardsPage />
          </ProtectedSidebarLayout>
        }>
          <Route path=":standardId" element={<StandardsPage />} />
          <Route path=":standardId/:moduleId" element={<ModuleContent />} />
        </Route>
        
        <Route path="/standards/sqf/system-elements" element={
          <ProtectedSidebarLayout>
            <SystemElements />
          </ProtectedSidebarLayout>
        } />
        <Route path="/standards/sqf/gmp" element={
          <ProtectedSidebarLayout>
            <GMP />
          </ProtectedSidebarLayout>
        } />
        <Route path="/standards/sqf/food-safety-plans" element={
          <ProtectedSidebarLayout>
            <FoodSafetyPlans />
          </ProtectedSidebarLayout>
        } />
        
        <Route path="/documents" element={
          <ProtectedSidebarLayout>
            <Suspense fallback={<Loading />}>
              <Documents />
            </Suspense>
          </ProtectedSidebarLayout>
        } />
        
        {/* Organization routes */}
        <Route path="/organizations" element={
          <ProtectedSidebarLayout>
            <Suspense fallback={<Loading />}>
              <Organizations />
            </Suspense>
          </ProtectedSidebarLayout>
        } />
        <Route path="/organizations/management" element={
          <ProtectedSidebarLayout>
            <Suspense fallback={<Loading />}>
              <OrganizationsList />
            </Suspense>
          </ProtectedSidebarLayout>
        } />
        <Route path="/organization" element={
          <ProtectedSidebarLayout>
            <Suspense fallback={<Loading />}>
              <OrganizationManagement />
            </Suspense>
          </ProtectedSidebarLayout>
        } />
        
        {/* Facilities routes */}
        <Route path="/facilities" element={
          <ProtectedSidebarLayout>
            <Suspense fallback={<Loading />}>
              <FacilitiesList />
            </Suspense>
          </ProtectedSidebarLayout>
        } />
        <Route path="/facilities/:id" element={
          <ProtectedSidebarLayout>
            <Suspense fallback={<Loading />}>
              <FacilityManagement />
            </Suspense>
          </ProtectedSidebarLayout>
        } />
        <Route path="/facilities/new" element={
          <ProtectedSidebarLayout>
            <Suspense fallback={<Loading />}>
              <FacilityManagement />
            </Suspense>
          </ProtectedSidebarLayout>
        } />
        
        {/* Admin routes */}
        <Route path="/users" element={
          <ProtectedSidebarLayout>
            <Suspense fallback={<Loading />}>
              <UserManagement />
            </Suspense>
          </ProtectedSidebarLayout>
        } />
        <Route path="/roles" element={
          <ProtectedSidebarLayout>
            <Suspense fallback={<Loading />}>
              <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Roles</h1>
                <p>Role management module is under development.</p>
              </div>
            </Suspense>
          </ProtectedSidebarLayout>
        } />
        <Route path="/departments" element={
          <ProtectedSidebarLayout>
            <Suspense fallback={<Loading />}>
              <DepartmentManagement />
            </Suspense>
          </ProtectedSidebarLayout>
        } />
        
        {/* Other modules */}
        <Route path="/audits" element={
          <ProtectedSidebarLayout>
            <Suspense fallback={<Loading />}>
              <AuditsModule />
            </Suspense>
          </ProtectedSidebarLayout>
        } />
        <Route path="/non-conformance" element={
          <ProtectedSidebarLayout>
            <Suspense fallback={<Loading />}>
              <NonConformanceModule />
            </Suspense>
          </ProtectedSidebarLayout>
        } />
        <Route path="/non-conformance/:id" element={
          <ProtectedSidebarLayout>
            <Suspense fallback={<Loading />}>
              <NonConformanceModule />
            </Suspense>
          </ProtectedSidebarLayout>
        } />
        <Route path="/capa" element={
          <ProtectedSidebarLayout>
            <Suspense fallback={<Loading />}>
              <CAPA />
            </Suspense>
          </ProtectedSidebarLayout>
        } />
        <Route path="/suppliers" element={
          <ProtectedSidebarLayout>
            <Suspense fallback={<Loading />}>
              <SupplierManagement />
            </Suspense>
          </ProtectedSidebarLayout>
        } />
        <Route path="/training" element={
          <ProtectedSidebarLayout>
            <Suspense fallback={<Loading />}>
              <TrainingModule />
            </Suspense>
          </ProtectedSidebarLayout>
        } />
        <Route path="/haccp" element={
          <ProtectedSidebarLayout>
            <Suspense fallback={<Loading />}>
              <HaccpModule />
            </Suspense>
          </ProtectedSidebarLayout>
        } />
        <Route path="/traceability" element={
          <ProtectedSidebarLayout>
            <Suspense fallback={<Loading />}>
              <Traceability />
            </Suspense>
          </ProtectedSidebarLayout>
        } />
        
        {/* Profile routes */}
        <Route path="/profile" element={
          <ProtectedSidebarLayout>
            <Profile />
          </ProtectedSidebarLayout>
        } />
        <Route path="/reset-password" element={
          <ProtectedSidebarLayout>
            <ResetPassword />
          </ProtectedSidebarLayout>
        } />
        <Route path="/update-password" element={<UpdatePassword />} />
        <Route path="/complaints" element={
          <ProtectedSidebarLayout>
            <Suspense fallback={<Loading />}>
              <ComplaintManagement />
            </Suspense>
          </ProtectedSidebarLayout>
        } />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
