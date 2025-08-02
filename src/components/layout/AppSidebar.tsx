
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  Building,
  ClipboardList,
  AlertTriangle,
  GraduationCap,
  BarChart3,
  LogOut,
  User,
  Plus,
  MessageSquare,
  BoxesIcon,
  Warehouse,
  FileCheck,
  Award,
  Gauge,
  BookOpen
} from 'lucide-react';

const AppSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();

  console.log('AppSidebar render:', { 
    hasUser: !!user, 
    userEmail: user?.email,
    currentPath: location.pathname 
  });

  const handleSignOut = async () => {
    try {
      console.log('AppSidebar: Initiating sign out');
      signOut();
      navigate('/');
    } catch (error) {
      console.error('AppSidebar: Sign out error:', error);
    }
  };

  const mainMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Plus, label: 'Create New', path: '/create' },
  ];

  const documentMenuItems = [
    { icon: FileText, label: 'Documents', path: '/documents' },
    { icon: ClipboardList, label: 'CAPA', path: '/capa' },
    { icon: AlertTriangle, label: 'Non-Conformance', path: '/non-conformance' },
    { icon: FileCheck, label: 'Audits', path: '/audits' },
    { icon: MessageSquare, label: 'Complaints', path: '/complaints' },
    { icon: BookOpen, label: 'Standards', path: '/standards' },
  ];

  const trainingMenuItems = [
    { icon: GraduationCap, label: 'Training', path: '/training' },
    { icon: Award, label: 'Certifications', path: '/certifications' },
  ];

  const operationsMenuItems = [
    { icon: BoxesIcon, label: 'Traceability', path: '/traceability' },
    { icon: Building, label: 'Suppliers', path: '/suppliers' },
    { icon: Warehouse, label: 'Facilities', path: '/facilities' },
  ];

  const analyticsMenuItems = [
    { icon: BarChart3, label: 'Analytics', path: '/analytics' },
    { icon: Gauge, label: 'Performance', path: '/performance' },
  ];

  const systemMenuItems = [
    { icon: Users, label: 'Users', path: '/users' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  // Safely get display name
  const getDisplayName = () => {
    if (user?.email) return user.email.split('@')[0];
    return 'User';
  };

  const displayName = getDisplayName();
  const displayEmail = user?.email || '';

  const renderMenuSection = (title: string, items: typeof mainMenuItems) => (
    <div className="mb-6">
      <h3 className="text-xs font-medium text-white/70 uppercase tracking-wider mb-2 px-3">
        {title}
      </h3>
      <nav className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || 
                          (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
          
          return (
            <Button
              key={item.path}
              variant={isActive ? "secondary" : "ghost"}
              className={`w-full justify-start text-white hover:bg-white/10 ${
                isActive ? 'bg-white/20 font-medium' : ''
              }`}
              onClick={() => {
                console.log('Navigating to:', item.path);
                navigate(item.path);
              }}
            >
              <Icon className="mr-3 h-4 w-4" />
              {item.label}
            </Button>
          );
        })}
      </nav>
    </div>
  );

  return (
    <Sidebar className="w-64">
      <SidebarHeader className="p-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">QMS</span>
          </div>
          <span className="font-bold text-lg text-white">Quality Management</span>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4 py-2">
        {renderMenuSection('Main', mainMenuItems)}
        {renderMenuSection('Quality', documentMenuItems)}
        {renderMenuSection('Training', trainingMenuItems)}
        {renderMenuSection('Operations', operationsMenuItems)}
        {renderMenuSection('Analytics', analyticsMenuItems)}
        {renderMenuSection('System', systemMenuItems)}
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-white/10">
        <div className="flex items-center space-x-3 mb-4 text-white">
          <User className="h-8 w-8 bg-white/20 rounded-full p-1" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {displayName}
            </p>
            <p className="text-xs text-white/70 truncate">
              {displayEmail}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start text-white hover:bg-white/10"
          onClick={handleSignOut}
        >
          <LogOut className="mr-3 h-4 w-4" />
          Sign Out
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
