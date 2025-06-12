import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { DocumentProvider } from "@/contexts/DocumentContext";
import { TrainingProvider } from "@/contexts/TrainingContext";
import "./App.css";

// Import pages and components
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Documents from "./pages/Documents";
import CAPA from "./pages/CAPA";
import CAPADetails from "./pages/CAPADetails";
import Auth from "./pages/Auth";
import NonConformance from "./pages/NonConformance";
import Facilities from "./pages/Facilities";
import Users from "./pages/Users";
import Organizations from "./pages/Organizations";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Tasks from "./pages/Tasks";
import TrainingModule from "./pages/TrainingModule";
import AuditsModule from "./pages/AuditsModule";
import Standards from "./pages/Standards";
import Complaints from "./pages/Complaints";
import KPIs from "./pages/KPIs";
import HACCPPage from "./pages/HACCPPage";
import Traceability from "./pages/Traceability";
import Analytics from "./pages/Analytics";
import Performance from "./pages/Performance";
import Departments from "./pages/Departments";
import Roles from "./pages/Roles";
import Certifications from "./pages/Certifications";
import Create from "./pages/Create";
import DatabaseConnectionTest from "./pages/DatabaseConnectionTest";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import SidebarLayout from "./components/layout/SidebarLayout";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <DocumentProvider>
            <TrainingProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  
                  {/* Protected routes with sidebar */}
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <SidebarLayout>
                        <Dashboard />
                      </SidebarLayout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/documents" element={
                    <ProtectedRoute>
                      <SidebarLayout>
                        <Documents />
                      </SidebarLayout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/tasks" element={
                    <ProtectedRoute>
                      <SidebarLayout>
                        <Tasks />
                      </SidebarLayout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/capa" element={
                    <ProtectedRoute>
                      <SidebarLayout>
                        <CAPA />
                      </SidebarLayout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/capa/:id" element={
                    <ProtectedRoute>
                      <SidebarLayout>
                        <CAPADetails />
                      </SidebarLayout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/non-conformance" element={
                    <ProtectedRoute>
                      <SidebarLayout>
                        <NonConformance />
                      </SidebarLayout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/training" element={
                    <ProtectedRoute>
                      <SidebarLayout>
                        <TrainingModule />
                      </SidebarLayout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/facilities" element={
                    <ProtectedRoute>
                      <SidebarLayout>
                        <Facilities />
                      </SidebarLayout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/audits" element={
                    <ProtectedRoute>
                      <SidebarLayout>
                        <AuditsModule />
                      </SidebarLayout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/standards" element={
                    <ProtectedRoute>
                      <SidebarLayout>
                        <Standards />
                      </SidebarLayout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/complaints" element={
                    <ProtectedRoute>
                      <SidebarLayout>
                        <Complaints />
                      </SidebarLayout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/kpis" element={
                    <ProtectedRoute>
                      <SidebarLayout>
                        <KPIs />
                      </SidebarLayout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/haccp" element={
                    <ProtectedRoute>
                      <SidebarLayout>
                        <HACCPPage />
                      </SidebarLayout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/traceability" element={
                    <ProtectedRoute>
                      <SidebarLayout>
                        <Traceability />
                      </SidebarLayout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/suppliers" element={
                    <ProtectedRoute>
                      <SidebarLayout>
                        <Organizations />
                      </SidebarLayout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/testing" element={
                    <ProtectedRoute>
                      <SidebarLayout>
                        <KPIs />
                      </SidebarLayout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/reports" element={
                    <ProtectedRoute>
                      <SidebarLayout>
                        <Reports />
                      </SidebarLayout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/analytics" element={
                    <ProtectedRoute>
                      <SidebarLayout>
                        <Analytics />
                      </SidebarLayout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/performance" element={
                    <ProtectedRoute>
                      <SidebarLayout>
                        <Performance />
                      </SidebarLayout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/users" element={
                    <ProtectedRoute>
                      <SidebarLayout>
                        <Users />
                      </SidebarLayout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/organizations" element={
                    <ProtectedRoute>
                      <SidebarLayout>
                        <Organizations />
                      </SidebarLayout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/departments" element={
                    <ProtectedRoute>
                      <SidebarLayout>
                        <Departments />
                      </SidebarLayout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/roles" element={
                    <ProtectedRoute>
                      <SidebarLayout>
                        <Roles />
                      </SidebarLayout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/database-test" element={
                    <ProtectedRoute>
                      <SidebarLayout>
                        <DatabaseConnectionTest />
                      </SidebarLayout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/certifications" element={
                    <ProtectedRoute>
                      <SidebarLayout>
                        <Certifications />
                      </SidebarLayout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/settings" element={
                    <ProtectedRoute>
                      <SidebarLayout>
                        <Settings />
                      </SidebarLayout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/create" element={
                    <ProtectedRoute>
                      <SidebarLayout>
                        <Create />
                      </SidebarLayout>
                    </ProtectedRoute>
                  } />
                  
                  {/* Catch all route */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </TooltipProvider>
            </TrainingProvider>
          </DocumentProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
