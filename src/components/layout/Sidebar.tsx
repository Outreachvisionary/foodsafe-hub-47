
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  AlertTriangle, 
  ClipboardCheck, 
  Users,
  Building, 
  FileCheck,
  BoxesIcon,
  ShieldCheck,
  BookOpen,
  BarChart2,
  CheckSquare,
  MessageSquare,
  GraduationCap,
  Warehouse,
  Activity,
  LineChart,
  Gauge,
  Settings,
  Award,
  UserCheck,
  Database,
  Plus
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
  { name: 'Documents', path: '/documents', icon: <FileText className="h-5 w-5" /> },
  { name: 'Tasks', path: '/tasks', icon: <CheckSquare className="h-5 w-5" /> },
  { name: 'CAPAs', path: '/capa', icon: <ClipboardCheck className="h-5 w-5" /> },
  { name: 'Non-Conformance', path: '/non-conformance', icon: <AlertTriangle className="h-5 w-5" /> },
  { name: 'Training', path: '/training', icon: <GraduationCap className="h-5 w-5" /> },
  { name: 'Audits', path: '/audits', icon: <FileCheck className="h-5 w-5" /> },
  { name: 'Standards', path: '/standards', icon: <BookOpen className="h-5 w-5" /> },
  { name: 'Complaints', path: '/complaints', icon: <MessageSquare className="h-5 w-5" /> },
  { name: 'Traceability', path: '/traceability', icon: <BoxesIcon className="h-5 w-5" /> },
  { name: 'Suppliers', path: '/suppliers', icon: <Building className="h-5 w-5" /> },
  { name: 'Facilities', path: '/facilities', icon: <Warehouse className="h-5 w-5" /> },
  { name: 'Reports', path: '/reports', icon: <BarChart2 className="h-5 w-5" /> },
  { name: 'Analytics', path: '/analytics', icon: <LineChart className="h-5 w-5" /> },
  { name: 'Performance', path: '/performance', icon: <Gauge className="h-5 w-5" /> },
  { name: 'Users', path: '/users', icon: <Users className="h-5 w-5" /> },
];

const Sidebar: React.FC = () => {
  const { user, profile } = useAuth();
  
  return (
    <aside className="w-64 bg-gradient-to-b from-background to-secondary/20 border-r border-border/60 flex flex-col h-screen overflow-y-auto">
      <div className="p-4 border-b border-border/60">
        <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">ComplianceCore</h1>
      </div>
      
      {/* Create New button */}
      <div className="p-2">
        <NavLink
          to="/create"
          className="flex items-center justify-center gap-2 px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/90 transition-colors"
        >
          <Plus size={16} />
          <span>Create New</span>
        </NavLink>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) => cn(
                  "flex items-center px-3 py-2 text-sm rounded-md transition-colors",
                  isActive 
                    ? "bg-accent/10 text-accent font-medium" 
                    : "text-foreground hover:bg-secondary/80 hover:text-accent"
                )}
              >
                {item.icon}
                <span className="ml-3">{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-border/60 bg-secondary/30">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium overflow-hidden">
            {profile?.avatar_url ? (
              <img 
                src={profile.avatar_url} 
                alt="User avatar" 
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}</span>
            )}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">{profile?.full_name || user?.email || 'User'}</p>
            <p className="text-xs text-muted-foreground">{user?.email || 'user@company.com'}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
