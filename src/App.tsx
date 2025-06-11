
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
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
import ProtectedRoute from "./components/layout/ProtectedRoute";
import SidebarLayout from "./components/layout/SidebarLayout";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
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
              
              <Route path="/facilities" element={
                <ProtectedRoute>
                  <SidebarLayout>
                    <Facilities />
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
              
              <Route path="/reports" element={
                <ProtectedRoute>
                  <SidebarLayout>
                    <Reports />
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
              
              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
