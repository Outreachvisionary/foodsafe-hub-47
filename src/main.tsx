
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './services/storageService'; // Initialize storage services
import './services/databaseInitializer'; // Initialize database tables

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
