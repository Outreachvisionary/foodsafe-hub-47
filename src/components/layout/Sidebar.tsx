
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  AlertCircle, 
  Clipboard, 
  UserCheck,
  Building, 
  ChevronDown,
  Truck,
  ShieldAlert,
  BookOpen,
  BarChart2,
  ClipboardCheck
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
  { name: 'Documents', path: '/documents', icon: <FileText className="h-5 w-5" /> },
  { name: 'Non-Conformance', path: '/non-conformance', icon: <AlertCircle className="h-5 w-5" /> },
  { name: 'CAPA', path: '/capa', icon: <ShieldAlert className="h-5 w-5" /> },
  { name: 'Audits', path: '/audits', icon: <Clipboard className="h-5 w-5" /> },
  { name: 'Training', path: '/training', icon: <BookOpen className="h-5 w-5" /> },
  { name: 'Suppliers', path: '/suppliers', icon: <Truck className="h-5 w-5" /> },
  { name: 'Facilities', path: '/facilities', icon: <Building className="h-5 w-5" /> },
  { name: 'Users', path: '/users', icon: <UserCheck className="h-5 w-5" /> },
  { name: 'Reports', path: '/reports', icon: <BarChart2 className="h-5 w-5" /> },
  { name: 'Tasks', path: '/tasks', icon: <ClipboardCheck className="h-5 w-5" /> },
];

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-gray-900 text-white h-screen flex flex-col overflow-y-auto">
      <div className="p-4 border-b border-gray-800">
        <h1 className="text-xl font-bold">Quality System</h1>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) => `
                  flex items-center px-4 py-2.5 text-sm font-medium rounded-md
                  ${isActive ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}
                  transition-all duration-200
                `}
              >
                {item.icon}
                <span className="ml-3">{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <span className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center text-sm">
              QS
            </span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">Quality System</p>
            <p className="text-xs text-gray-400">v1.0.0</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
