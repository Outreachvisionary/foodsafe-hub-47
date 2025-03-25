
import React from 'react';
import './App.css';
import './i18n/i18n'; // Import i18n configuration
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import Documents from './pages/Documents';
import InternalAudits from './pages/InternalAudits';
import CAPA from './pages/CAPA';
import SupplierManagement from './pages/SupplierManagement';
import ComplaintManagement from './pages/ComplaintManagement';
import Traceability from './pages/Traceability';
import HaccpModule from './pages/HaccpModule';
import TrainingModule from './pages/TrainingModule';
import Reports from './pages/Reports';
import Standards from './pages/Standards';
import NotFound from './pages/NotFound';
import { AuthProvider } from './contexts/AuthContext';
import { UserProvider } from './contexts/UserContext';
import { ConfigProvider } from './contexts/ConfigContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { Toaster } from './components/ui/toaster';
import { DocumentContextWrapper } from './contexts/DocumentContextWrapper';
import { LanguageProvider } from './contexts/LanguageContext';

const router = createBrowserRouter([
  { path: '/', element: <Index /> },
  { path: '/dashboard', element: <Dashboard /> },
  { path: '/documents', element: <Documents /> },
  { path: '/internal-audits', element: <InternalAudits /> },
  { path: '/capa', element: <CAPA /> },
  { path: '/supplier-management', element: <SupplierManagement /> },
  { path: '/complaint-management', element: <ComplaintManagement /> },
  { path: '/traceability', element: <Traceability /> },
  { path: '/haccp', element: <HaccpModule /> },
  { path: '/training', element: <TrainingModule /> },
  { path: '/reports', element: <Reports /> },
  { path: '/standards', element: <Standards /> },
  { path: '*', element: <NotFound /> },
]);

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <UserProvider>
          <ConfigProvider>
            <NotificationProvider>
              <DocumentContextWrapper>
                <RouterProvider router={router} />
                <Toaster />
              </DocumentContextWrapper>
            </NotificationProvider>
          </ConfigProvider>
        </UserProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
