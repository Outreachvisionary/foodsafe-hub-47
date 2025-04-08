import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sidebar } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { LogOut, User, Settings, LayoutDashboard, ClipboardCheck, FileText, AlertTriangle, RefreshCw, Truck, GraduationCap, Activity, Building2, Building, Beaker, HardDrive, BookOpen, ChevronLeft, ChevronRight, TestTube2 } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ProfileTile from '@/components/profile/ProfileTile';

interface SidebarLink {
  name: string;
  href: string;
  icon: React.ElementType;
  color: string;
  gradientFrom?: string;
  gradientTo?: string;
}

const AppSidebar = () => {
  const { t } = useTranslation();
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  
  const sidebarLinks: SidebarLink[] = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      color: 'text-blue-500',
      gradientFrom: 'from-blue-500',
      gradientTo: 'to-blue-600'
    }, {
      name: 'Documents',
      href: '/documents',
      icon: FileText,
      color: 'text-green-500',
      gradientFrom: 'from-green-500',
      gradientTo: 'to-green-600'
    }, {
      name: 'Standards',
      href: '/standards',
      icon: BookOpen,
      color: 'text-purple-500',
      gradientFrom: 'from-purple-500',
      gradientTo: 'to-purple-600'
    }, {
      name: 'Organizations',
      href: '/organizations',
      icon: Building,
      color: 'text-indigo-600',
      gradientFrom: 'from-indigo-500',
      gradientTo: 'to-indigo-600'
    }, {
      name: 'Facilities',
      href: '/facilities',
      icon: Building2,
      color: 'text-teal-500',
      gradientFrom: 'from-teal-500',
      gradientTo: 'to-teal-600'
    }, {
      name: 'Audits',
      href: '/audits',
      icon: HardDrive,
      color: 'text-yellow-600',
      gradientFrom: 'from-yellow-500',
      gradientTo: 'to-yellow-600'
    }, {
      name: 'Non-Conformance',
      href: '/non-conformance',
      icon: AlertTriangle,
      color: 'text-red-500',
      gradientFrom: 'from-red-500',
      gradientTo: 'to-red-600'
    }, {
      name: 'CAPA',
      href: '/capa',
      icon: RefreshCw,
      color: 'text-orange-500',
      gradientFrom: 'from-orange-500',
      gradientTo: 'to-orange-600'
    }, {
      name: 'Suppliers',
      href: '/suppliers',
      icon: Truck,
      color: 'text-pink-500',
      gradientFrom: 'from-pink-500',
      gradientTo: 'to-pink-600'
    }, {
      name: 'Training',
      href: '/training',
      icon: GraduationCap,
      color: 'text-indigo-500',
      gradientFrom: 'from-indigo-400',
      gradientTo: 'to-indigo-500'
    }, {
      name: 'HACCP',
      href: '/haccp',
      icon: Beaker,
      color: 'text-emerald-500',
      gradientFrom: 'from-emerald-500',
      gradientTo: 'to-emerald-600'
    }, {
      name: 'Traceability',
      href: '/traceability',
      icon: Activity,
      color: 'text-cyan-500',
      gradientFrom: 'from-cyan-500',
      gradientTo: 'to-cyan-600'
    }, {
      name: 'Testing',
      href: '/testing',
      icon: TestTube2,
      color: 'text-violet-500',
      gradientFrom: 'from-violet-500',
      gradientTo: 'to-violet-600'
    }
  ];
  
  const isActiveLink = (href: string) => {
    return location.pathname === href || (href !== '/' && href !== '/dashboard' && location.pathname.startsWith(href));
  };
  
  return (
    <Sidebar className="h-screen flex flex-col transition-all duration-300">
      <div className="border-b border-border/60 relative">
        <div className="flex items-center justify-between px-4 py-3">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-accent to-primary rounded-md p-1.5 shadow-glow">
              <ClipboardCheck className="h-5 w-5 text-white" />
            </div>
            {!collapsed && (
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Compliance Core</span>
            )}
          </Link>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setCollapsed(!collapsed)}
            className="hover:bg-accent/10 text-accent absolute right-2"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-1.5">
          {sidebarLinks.map(link => (
            <Link 
              key={link.href} 
              to={link.href}
              className={`
                group flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-all
                ${isActiveLink(link.href) 
                  ? `bg-gradient-to-r ${link.gradientFrom} ${link.gradientTo} text-white shadow-md` 
                  : 'text-foreground hover:bg-secondary hover:text-primary'}
              `}
            >
              <div className={`${isActiveLink(link.href) ? 'text-white' : link.color} mr-3 h-5 w-5 flex-shrink-0 transition-all group-hover:scale-110`}>
                <link.icon className="h-5 w-5" />
              </div>
              {!collapsed && (
                <span>{link.name}</span>
              )}
              {isActiveLink(link.href) && !collapsed && (
                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-white animate-pulse"></div>
              )}
            </Link>
          ))}
        </div>
      </div>
      
      <div className="border-t border-border/60 p-3">
        <ProfileTile collapsed={collapsed} />
      </div>
    </Sidebar>
  );
};

export default AppSidebar;
