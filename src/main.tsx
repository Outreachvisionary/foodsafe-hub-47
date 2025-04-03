
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import './services/storageService'; // Initialize storage services
import './services/databaseInitializer'; // Initialize database tables
import { UserProvider } from './contexts/UserContext';
import { PermissionProvider } from './contexts/PermissionContext';
import { LanguageProvider } from './contexts/LanguageContext';
import './i18n/i18n'; // Initialize i18n

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <UserProvider>
      <PermissionProvider>
        <LanguageProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </LanguageProvider>
      </PermissionProvider>
    </UserProvider>
  </React.StrictMode>
);
