
import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Toaster } from '@/components/ui/toaster';
import SidebarLayout from '@/components/layout/SidebarLayout';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import Loading from '@/components/Loading';

// Authentication Pages
import Auth from '@/pages/Auth';
import UserOnboarding from '@/pages/UserOnboarding';

// Creation forms
const Create = lazy(() => import('@/pages/Create'));
const DocumentCreate = lazy(() => import('@/pages/DocumentCreate'));
const UserCreate = lazy(() => import('@/pages/UserCreate'));
const TaskCreate = lazy(() => import('@/pages/TaskCreate'));

// Lazy-loaded pages
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Documents = lazy(() => import('@/pages/Documents'));
const Tasks = lazy(() => import('@/pages/Tasks'));
const OrganizationsList = lazy(() => import('@/pages/OrganizationsList'));
const OrganizationManagement = lazy(() => import('@/pages/OrganizationManagement'));
const FacilityManagement = lazy(() => import('@/pages/FacilityManagement'));
const DepartmentManagement = lazy(() => import('@/pages/DepartmentManagement'));
const TrainingModule = lazy(() => import('@/pages/TrainingModule'));
const NonConformance = lazy(() => import('@/pages/NonConformance'));
const NonConformanceFormPage = lazy(() => import('@/pages/NonConformanceFormPage'));
const UserManagement = lazy(() => import('@/pages/UserManagement'));
const InternalAudits = lazy(() => import('@/pages/InternalAudits'));
const Traceability = lazy(() => import('@/pages/Traceability'));
const ComplaintsManagement = lazy(() => import('@/pages/ComplaintsManagement'));
const SupplierManagement = lazy(() => import('@/pages/SupplierManagement'));
const DatabaseConnectionTest = lazy(() => import('@/pages/DatabaseConnectionTest'));
const RoleManagement = lazy(() => import('@/pages/RoleManagement'));
const StandardsPage = lazy(() => import('@/pages/StandardsPage'));
const ModuleContent = lazy(() => import('@/components/standards/ModuleContent'));
const TestingVerification = lazy(() => import('@/pages/TestingVerification'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const CAPA = lazy(() => import('@/pages/CAPA'));
const Reports = lazy(() => import('@/pages/Reports'));
const Analytics = lazy(() => import('@/pages/Analytics'));
const Performance = lazy(() => import('@/pages/Performance'));
import ScheduleAuditPage from "./pages/ScheduleAuditPage";
import NewSupplierPage from "./pages/NewSupplierPage";

// New page imports
const Settings = lazy(() => import('@/pages/Settings'));
const Certifications = lazy(() => import('@/pages/Certifications'));
const KPIs = lazy(() => import('@/pages/KPIs'));
const HACCP = lazy(() => import('@/pages/HACCP'));
const HaccpModule = lazy(() => import('@/pages/HaccpModule'));

function App() {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* Public routes */}
          <Route path="/auth" element={<Auth />} />
          <Route path="/onboarding" element={<UserOnboarding />} />

          {/* Protected routes with SidebarLayout */}
          <Route element={<ProtectedRoute><SidebarLayout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            
            {/* Create routes */}
            <Route path="create" element={<Create />} />
            <Route path="documents/new" element={<DocumentCreate />} />
            <Route path="users/new" element={<UserCreate />} />
            <Route path="tasks/new" element={<TaskCreate />} />
            
            {/* Documents routes */}
            <Route path="documents" element={<Documents />} />
            
            {/* Tasks routes */}
            <Route path="tasks" element={<Tasks />} />
            
            {/* Organization and facility routes */}
            <Route path="organizations" element={<OrganizationsList />} />
            <Route path="organization" element={<OrganizationManagement />} />
            <Route path="facilities" element={<FacilityManagement />} />
            <Route path="departments" element={<DepartmentManagement />} />
            
            {/* User management */}
            <Route path="users" element={<UserManagement />} />
            
            {/* Training */}
            <Route path="training" element={<TrainingModule />} />
            
            {/* Audits - Updated to use InternalAudits */}
            <Route path="audits" element={<InternalAudits />} />
            <Route path="audits/new" element={<ScheduleAuditPage />} />
            <Route path="audits/schedule" element={<ScheduleAuditPage />} />
            
            {/* Traceability */}
            <Route path="traceability" element={<Traceability />} />
            
            {/* Non-conformance routes - Fixed routing inconsistency */}
            <Route path="non-conformance" element={<NonConformance />} />
            <Route path="non-conformance/new" element={<NonConformanceFormPage />} />
            <Route path="non-conformance/create" element={<NonConformanceFormPage />} />
            <Route path="non-conformance/:id" element={<NonConformanceFormPage />} />
            
            {/* CAPA routes */}
            <Route path="capa" element={<CAPA />} />
            <Route path="capa/:id" element={<CAPA />} />
            
            {/* Suppliers */}
            <Route path="suppliers" element={<SupplierManagement />} />
            <Route path="suppliers/new" element={<NewSupplierPage />} />
            
            {/* Complaints */}
            <Route path="complaints" element={<ComplaintsManagement />} />
            
            {/* Reports */}
            <Route path="reports" element={<Reports />} />
            
            {/* Analytics and Performance */}
            <Route path="analytics" element={<Analytics />} />
            <Route path="performance" element={<Performance />} />
            
            {/* Standards routes */}
            <Route path="standards" element={<StandardsPage />} />
            <Route path="standards/:standardId" element={<StandardsPage />} />
            <Route path="standards/:standardId/:moduleId" element={<StandardsPage />}>
              <Route index element={<ModuleContent />} />
            </Route>
            
            {/* Testing and Verification routes */}
            <Route path="testing" element={<TestingVerification />} />
            
            {/* HACCP Routes */}
            <Route path="haccp" element={<HACCP />} />
            <Route path="haccp-module" element={<HaccpModule />} />
            
            {/* New routes */}
            <Route path="kpis" element={<KPIs />} />
            <Route path="certifications" element={<Certifications />} />
            <Route path="settings" element={<Settings />} />
            
            <Route path="database-test" element={<DatabaseConnectionTest />} />
            <Route path="roles" element={<RoleManagement />} />
            
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
      <Toaster />
    </>
  );
}

export default App;
