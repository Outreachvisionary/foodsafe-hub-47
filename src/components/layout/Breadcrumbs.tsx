
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  // Map of path segments to readable names
  const pathMap: Record<string, string> = {
    'dashboard': 'Dashboard',
    'documents': 'Documents',
    'audits': 'Audits',
    'complaints': 'Complaints',
    'traceability': 'Traceability',
    'suppliers': 'Suppliers',
    'training': 'Training',
    'capa': 'CAPA',
    'haccp': 'HACCP',
    'reports': 'Reports',
    'standards': 'Standards',
    'sqf': 'SQF',
    'iso22000': 'ISO 22000',
    'fssc22000': 'FSSC 22000',
    'brcgs2': 'BRC',
    'brc': 'BRC',
    'profile': 'Profile',
    'settings': 'Settings',
  };

  return (
    <div className="flex items-center space-x-2 text-sm text-gray-500 py-2">
      <Link to="/dashboard" className="flex items-center hover:text-gray-700">
        <Home className="h-4 w-4" />
      </Link>
      
      {pathnames.map((path, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        
        return (
          <React.Fragment key={path}>
            <ChevronRight className="h-4 w-4" />
            <Link 
              to={routeTo}
              className={`${isLast ? 'font-medium text-gray-800' : 'hover:text-gray-700'}`}
            >
              {pathMap[path] || path}
            </Link>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Breadcrumbs;
