
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Standards from "./pages/Standards";
import ComplaintManagement from "./pages/ComplaintManagement";
import Traceability from "./pages/Traceability";
import InternalAudits from "./pages/InternalAudits";
import HaccpModule from "./pages/HaccpModule";
import SupplierManagement from "./pages/SupplierManagement";
import TrainingModule from "./pages/TrainingModule";
import CAPA from "./pages/CAPA";
import NotFound from "./pages/NotFound";
import SidebarLayout from "./components/layout/SidebarLayout";

const queryClient = new QueryClient();

// Helper component to wrap authenticated pages with the sidebar layout
const AuthenticatedRoute = ({ element }: { element: React.ReactNode }) => (
  <SidebarLayout>{element}</SidebarLayout>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/standards" element={<Standards />} />
          <Route path="/standards/:standardId" element={<Standards />} />
          <Route path="/complaints" element={<AuthenticatedRoute element={<ComplaintManagement />} />} />
          <Route path="/traceability" element={<AuthenticatedRoute element={<Traceability />} />} />
          <Route path="/audits" element={<AuthenticatedRoute element={<InternalAudits />} />} />
          <Route path="/haccp" element={<AuthenticatedRoute element={<HaccpModule />} />} />
          <Route path="/suppliers" element={<AuthenticatedRoute element={<SupplierManagement />} />} />
          <Route path="/training" element={<AuthenticatedRoute element={<TrainingModule />} />} />
          <Route path="/capa" element={<AuthenticatedRoute element={<CAPA />} />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
