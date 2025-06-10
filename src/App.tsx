
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { DocumentProvider } from "@/contexts/DocumentContext";
import "./App.css";

// Import your pages and components
import Index from "./pages/Index";
import Documents from "./pages/Documents";
import CAPADetails from "./pages/CAPADetails";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DocumentProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/capa/:id" element={<CAPADetails />} />
          </Routes>
        </TooltipProvider>
      </DocumentProvider>
    </QueryClientProvider>
  );
}

export default App;
