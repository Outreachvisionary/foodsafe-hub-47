
import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { UserProvider } from "./contexts/UserContext";
import { ConfigProvider } from "./contexts/ConfigContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Documents from "./pages/Documents";
import SupplierManagement from "./pages/SupplierManagement";
import CAPA from "./pages/CAPA";
import TrainingModule from "./pages/TrainingModule"; // Fixed import path
import InternalAudits from "./pages/InternalAudits";
import HaccpModule from "./pages/HaccpModule";
import Traceability from "./pages/Traceability";
import ComplaintManagement from "./pages/ComplaintManagement";
import Standards from "./pages/Standards";
import NotFound from "./pages/NotFound";
import Loading from "./components/Loading";
import Reports from "./pages/Reports";

function App() {
  
  return (
    <AuthProvider>
      <UserProvider>
        <ConfigProvider>
          <NotificationProvider>
            <BrowserRouter>
              <Suspense fallback={<Loading />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/documents" element={<Documents />} />
                  <Route path="/supplier-management" element={<SupplierManagement />} />
                  <Route path="/capa" element={<CAPA />} />
                  <Route path="/training" element={<TrainingModule />} />
                  <Route path="/internal-audits" element={<InternalAudits />} />
                  <Route path="/haccp" element={<HaccpModule />} />
                  <Route path="/traceability" element={<Traceability />} />
                  <Route path="/complaint-management" element={<ComplaintManagement />} />
                  <Route path="/standards" element={<Standards />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </NotificationProvider>
        </ConfigProvider>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
