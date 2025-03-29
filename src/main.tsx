
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import { LanguageProvider } from './contexts/LanguageContext';
import './i18n/i18n'; // Import i18n configuration
import { ThemeProvider } from 'next-themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PermissionProvider } from './contexts/PermissionContext';

// Create the query client
const queryClient = new QueryClient();

// Create a function component to wrap the app
const AppWrapper = () => {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <ThemeProvider attribute="class" defaultTheme="light">
          <QueryClientProvider client={queryClient}>
            <UserProvider>
              <PermissionProvider>
                <LanguageProvider>
                  <App />
                </LanguageProvider>
              </PermissionProvider>
            </UserProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(<AppWrapper />);
