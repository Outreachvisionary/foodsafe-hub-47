
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DocumentProvider } from "@/contexts/DocumentContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { UserProvider } from "@/contexts/UserContext";
import ProtectedSidebarLayout from "@/components/layout/ProtectedSidebarLayout";

// Pages
import Index from "./pages/Index";
import Documents from "./pages/Documents";
import Dashboard from "./pages/Dashboard";
import CAPA from "./pages/CAPA";
import CAPADetails from "./pages/CAPADetails";
import NonConformance from "./pages/NonConformance";
import NonConformanceDashboard from "./pages/NonConformanceDashboard";
import NonConformanceFormPage from "./pages/NonConformanceFormPage";
import TrainingModule from "./pages/TrainingModule";
import AuditsModule from "./pages/AuditsModule";
import InternalAudits from "./pages/InternalAudits";
import ScheduleAuditPage from "./pages/ScheduleAuditPage";
import SupplierManagement from "./pages/SupplierManagement";
import NewSupplierPage from "./pages/NewSupplierPage";
import Traceability from "./pages/Traceability";
import ComplaintManagement from "./pages/ComplaintManagement";
import Complaints from "./pages/Complaints";
import ComplaintsManagement from "./pages/ComplaintsManagement";
import Standards from "./pages/Standards";
import StandardsPage from "./pages/StandardsPage";
import HACCP from "./pages/HACCP";
import HACCPPage from "./pages/HACCPPage";
import HaccpModule from "./pages/HaccpModule";
import KPIs from "./pages/KPIs";
import Performance from "./pages/Performance";
import Reports from "./pages/Reports";
import Analytics from "./pages/Analytics";
import Testing from "./pages/Testing";
import TestingVerification from "./pages/TestingVerification";
import Facilities from "./pages/Facilities";
import FacilitiesList from "./pages/FacilitiesList";
import FacilityManagement from "./pages/FacilityManagement";
import Users from "./pages/Users";
import UserManagement from "./pages/UserManagement";
import UserCreate from "./pages/UserCreate";
import UserOnboarding from "./pages/UserOnboarding";
import Organizations from "./pages/Organizations";
import OrganizationsList from "./pages/OrganizationsList";
import OrganizationManagement from "./pages/OrganizationManagement";
import Departments from "./pages/Departments";
import DepartmentManagement from "./pages/DepartmentManagement";
import Roles from "./pages/Roles";
import RoleManagement from "./pages/RoleManagement";
import Certifications from "./pages/Certifications";
import Settings from "./pages/Settings";
import Tasks from "./pages/Tasks";
import TaskCreate from "./pages/TaskCreate";
import Create from "./pages/Create";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import DatabaseConnectionTest from "./pages/DatabaseConnectionTest";
import CreateDocumentForm from "./components/documents/CreateDocumentForm";
import DocumentCreate from "./pages/DocumentCreate";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <UserProvider>
        <DocumentProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                
                {/* Protected Routes with Sidebar Layout */}
                <Route path="/dashboard" element={<ProtectedSidebarLayout><Dashboard /></ProtectedSidebarLayout>} />
                
                {/* Document Management */}
                <Route path="/documents" element={<ProtectedSidebarLayout><Documents /></ProtectedSidebarLayout>} />
                <Route path="/documents/create" element={<ProtectedSidebarLayout><CreateDocumentForm /></ProtectedSidebarLayout>} />
                <Route path="/document-create" element={<ProtectedSidebarLayout><DocumentCreate /></ProtectedSidebarLayout>} />
                
                {/* Quality Management */}
                <Route path="/capa" element={<ProtectedSidebarLayout><CAPA /></ProtectedSidebarLayout>} />
                <Route path="/capa/:id" element={<ProtectedSidebarLayout><CAPADetails /></ProtectedSidebarLayout>} />
                <Route path="/non-conformance" element={<ProtectedSidebarLayout><NonConformance /></ProtectedSidebarLayout>} />
                <Route path="/non-conformance/dashboard" element={<ProtectedSidebarLayout><NonConformanceDashboard /></ProtectedSidebarLayout>} />
                <Route path="/non-conformance/form" element={<ProtectedSidebarLayout><NonConformanceFormPage /></ProtectedSidebarLayout>} />
                
                {/* Training */}
                <Route path="/training" element={<ProtectedSidebarLayout><TrainingModule /></ProtectedSidebarLayout>} />
                
                {/* Audits */}
                <Route path="/audits" element={<ProtectedSidebarLayout><AuditsModule /></ProtectedSidebarLayout>} />
                <Route path="/internal-audits" element={<ProtectedSidebarLayout><InternalAudits /></ProtectedSidebarLayout>} />
                <Route path="/schedule-audit" element={<ProtectedSidebarLayout><ScheduleAuditPage /></ProtectedSidebarLayout>} />
                
                {/* Standards & HACCP */}
                <Route path="/standards" element={<ProtectedSidebarLayout><Standards /></ProtectedSidebarLayout>} />
                <Route path="/standards-page" element={<ProtectedSidebarLayout><StandardsPage /></ProtectedSidebarLayout>} />
                <Route path="/haccp" element={<ProtectedSidebarLayout><HACCP /></ProtectedSidebarLayout>} />
                <Route path="/haccp-page" element={<ProtectedSidebarLayout><HACCPPage /></ProtectedSidebarLayout>} />
                <Route path="/haccp-module" element={<ProtectedSidebarLayout><HaccpModule /></ProtectedSidebarLayout>} />
                
                {/* Supply Chain */}
                <Route path="/suppliers" element={<ProtectedSidebarLayout><SupplierManagement /></ProtectedSidebarLayout>} />
                <Route path="/suppliers/new" element={<ProtectedSidebarLayout><NewSupplierPage /></ProtectedSidebarLayout>} />
                <Route path="/traceability" element={<ProtectedSidebarLayout><Traceability /></ProtectedSidebarLayout>} />
                <Route path="/testing" element={<ProtectedSidebarLayout><Testing /></ProtectedSidebarLayout>} />
                <Route path="/testing-verification" element={<ProtectedSidebarLayout><TestingVerification /></ProtectedSidebarLayout>} />
                
                {/* Complaints */}
                <Route path="/complaints" element={<ProtectedSidebarLayout><Complaints /></ProtectedSidebarLayout>} />
                <Route path="/complaint-management" element={<ProtectedSidebarLayout><ComplaintManagement /></ProtectedSidebarLayout>} />
                <Route path="/complaints-management" element={<ProtectedSidebarLayout><ComplaintsManagement /></ProtectedSidebarLayout>} />
                
                {/* Monitoring & Analytics */}
                <Route path="/kpis" element={<ProtectedSidebarLayout><KPIs /></ProtectedSidebarLayout>} />
                <Route path="/performance" element={<ProtectedSidebarLayout><Performance /></ProtectedSidebarLayout>} />
                <Route path="/reports" element={<ProtectedSidebarLayout><Reports /></ProtectedSidebarLayout>} />
                <Route path="/analytics" element={<ProtectedSidebarLayout><Analytics /></ProtectedSidebarLayout>} />
                
                {/* Facilities */}
                <Route path="/facilities" element={<ProtectedSidebarLayout><Facilities /></ProtectedSidebarLayout>} />
                <Route path="/facilities-list" element={<ProtectedSidebarLayout><FacilitiesList /></ProtectedSidebarLayout>} />
                <Route path="/facility-management" element={<ProtectedSidebarLayout><FacilityManagement /></ProtectedSidebarLayout>} />
                
                {/* User Management */}
                <Route path="/users" element={<ProtectedSidebarLayout><Users /></ProtectedSidebarLayout>} />
                <Route path="/user-management" element={<ProtectedSidebarLayout><UserManagement /></ProtectedSidebarLayout>} />
                <Route path="/user-create" element={<ProtectedSidebarLayout><UserCreate /></ProtectedSidebarLayout>} />
                <Route path="/user-onboarding" element={<ProtectedSidebarLayout><UserOnboarding /></ProtectedSidebarLayout>} />
                
                {/* Organization Management */}
                <Route path="/organizations" element={<ProtectedSidebarLayout><Organizations /></ProtectedSidebarLayout>} />
                <Route path="/organizations-list" element={<ProtectedSidebarLayout><OrganizationsList /></ProtectedSidebarLayout>} />
                <Route path="/organization-management" element={<ProtectedSidebarLayout><OrganizationManagement /></ProtectedSidebarLayout>} />
                
                {/* Department & Role Management */}
                <Route path="/departments" element={<ProtectedSidebarLayout><Departments /></ProtectedSidebarLayout>} />
                <Route path="/department-management" element={<ProtectedSidebarLayout><DepartmentManagement /></ProtectedSidebarLayout>} />
                <Route path="/roles" element={<ProtectedSidebarLayout><Roles /></ProtectedSidebarLayout>} />
                <Route path="/role-management" element={<ProtectedSidebarLayout><RoleManagement /></ProtectedSidebarLayout>} />
                
                {/* Tasks */}
                <Route path="/tasks" element={<ProtectedSidebarLayout><Tasks /></ProtectedSidebarLayout>} />
                <Route path="/task-create" element={<ProtectedSidebarLayout><TaskCreate /></ProtectedSidebarLayout>} />
                
                {/* System */}
                <Route path="/certifications" element={<ProtectedSidebarLayout><Certifications /></ProtectedSidebarLayout>} />
                <Route path="/settings" element={<ProtectedSidebarLayout><Settings /></ProtectedSidebarLayout>} />
                <Route path="/create" element={<ProtectedSidebarLayout><Create /></ProtectedSidebarLayout>} />
                <Route path="/profile" element={<ProtectedSidebarLayout><Profile /></ProtectedSidebarLayout>} />
                <Route path="/database-test" element={<ProtectedSidebarLayout><DatabaseConnectionTest /></ProtectedSidebarLayout>} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </DocumentProvider>
      </UserProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
