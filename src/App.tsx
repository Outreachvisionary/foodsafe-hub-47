
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DocumentProvider } from "@/contexts/DocumentContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Documents from "./pages/Documents";
import CreateDocumentForm from "./components/documents/CreateDocumentForm";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <DocumentProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/documents/create" element={<CreateDocumentForm />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </DocumentProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
