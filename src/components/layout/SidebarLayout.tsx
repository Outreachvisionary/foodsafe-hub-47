import React, { useState, ReactNode } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useUser } from '@/contexts/UserContext';
import { usePermission } from '@/contexts/PermissionContext';
import { ChevronsLeft, ChevronsRight, LayoutDashboard, ClipboardCheck, FileText, AlertTriangle, RefreshCw, Truck, GraduationCap, Activity, Building2, Building, Beaker, HardDrive, UserCog, Shield, Layers, Factory, FolderTree } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '@/components/LanguageSelector';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import PermissionGuard from '@/components/auth/PermissionGuard';
import ProfileTile from '@/components/profile/ProfileTile';
import OrganizationSwitcher from '@/components/organizations/OrganizationSwitcher';

interface SidebarLink {
  name: string;
  href: string;
  icon: React.ElementType;
  color: string;
  permission?: string;
}

interface SidebarLayoutProps {
  children: ReactNode;
}

const SidebarLayout: React.FC<SidebarLayoutProps> = ({ children }) => {
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);
  const { user, signOut } = useUser();
  const { hasPermission } = usePermission();
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };
  
  const sidebarLinks: SidebarLink[] = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      color: 'text-blue-500'
    }, 
    {
      name: 'Documents',
      href: '/documents',
      icon: FileText,
      color: 'text-green-500',
      permission: 'documents:read'
    }, 
    {
      name: 'Standards',
      href: '/standards-modules',
      icon: ClipboardCheck,
      color: 'text-purple-500'
    },
    {
      name: 'Organizations',
      href: '/organizations',
      icon: Building,
      color: 'text-indigo-600',
      permission: 'organizations:manage'
    }, 
    {
      name: 'Facilities',
      href: '/facilities',
      icon: Building2,
      color: 'text-teal-500',
      permission: 'facilities:manage'
    }, 
    {
      name: 'Audits',
      href: '/audits',
      icon: HardDrive,
      color: 'text-yellow-600',
      permission: 'audits:read'
    }, 
    {
      name: 'Non-Conformance',
      href: '/non-conformance',
      icon: AlertTriangle,
      color: 'text-red-500',
      permission: 'nc:read'
    }, 
    {
      name: 'CAPA',
      href: '/capa',
      icon: RefreshCw,
      color: 'text-orange-500',
      permission: 'capa:read'
    }, 
    {
      name: 'Suppliers',
      href: '/suppliers',
      icon: Truck,
      color: 'text-pink-500'
    }, 
    {
      name: 'Training',
      href: '/training',
      icon: GraduationCap,
      color: 'text-indigo-500',
      permission: 'training:read'
    }, 
    {
      name: 'HACCP',
      href: '/haccp',
      icon: Beaker,
      color: 'text-emerald-500'
    }, 
    {
      name: 'Traceability',
      href: '/traceability',
      icon: Activity,
      color: 'text-cyan-500'
    }
  ];
  
  const adminLinks: SidebarLink[] = [
    {
      name: 'User Management',
      href: '/users',
      icon: UserCog,
      color: 'text-violet-500',
      permission: 'users:manage'
    },
    {
      name: 'Role Management',
      href: '/roles',
      icon: Shield,
      color: 'text-indigo-500',
      permission: 'roles:manage'
    },
    {
      name: 'Department Management',
      href: '/departments',
      icon: Layers,
      color: 'text-blue-500',
      permission: 'departments:manage'
    }
  ];
  
  const isActiveLink = (href: string) => {
    return location.pathname === href || (href !== '/' && href !== '/dashboard' && location.pathname.startsWith(href));
  };
  
  return (
    <div className="flex h-screen">
      <div className={`bg-gradient-to-b from-white to-secondary/20 border-r border-border/60 h-screen flex flex-col transition-all duration-300 shadow-sm ${collapsed ? 'w-20' : 'w-64'}`}>
        <div className={`p-4 flex ${collapsed ? 'justify-center' : 'justify-between'} items-center border-b border-border/60`}>
          {!collapsed && (
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-accent to-accent-light rounded-md p-1.5">
                <ClipboardCheck className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Compliance Core
              </span>
            </Link>
          )}
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="h-8 w-8 text-muted-foreground hover:text-accent hover:bg-secondary">
            {collapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="space-y-1.5">
            <div className="px-4 py-2">
              <OrganizationSwitcher />
            </div>
            
            {sidebarLinks.map(link => (
              <React.Fragment key={link.href}>
                {link.permission ? (
                  <PermissionGuard permissions={link.permission}>
                    <Link 
                      to={link.href} 
                      className={`
                        group flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-colors
                        ${isActiveLink(link.href) 
                          ? 'bg-gradient-to-r from-accent/10 to-primary/10 text-primary' 
                          : 'text-foreground hover:bg-secondary hover:text-primary'}
                      `}
                    >
                      <div className={`${isActiveLink(link.href) ? link.color : 'text-muted-foreground'} ${collapsed ? 'mr-0' : 'mr-3'} h-5 w-5 flex-shrink-0 transition-all group-hover:scale-110`}>
                        <link.icon className="h-5 w-5" />
                      </div>
                      {!collapsed && <span>{link.name}</span>}
                      {!collapsed && isActiveLink(link.href) && (
                        <div className="ml-auto h-1.5 w-1.5 rounded-full bg-accent"></div>
                      )}
                    </Link>
                  </PermissionGuard>
                ) : (
                  <Link 
                    to={link.href} 
                    className={`
                      group flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-colors
                      ${isActiveLink(link.href) 
                        ? 'bg-gradient-to-r from-accent/10 to-primary/10 text-primary' 
                        : 'text-foreground hover:bg-secondary hover:text-primary'}
                    `}
                  >
                    <div className={`${isActiveLink(link.href) ? link.color : 'text-muted-foreground'} ${collapsed ? 'mr-0' : 'mr-3'} h-5 w-5 flex-shrink-0 transition-all group-hover:scale-110`}>
                      <link.icon className="h-5 w-5" />
                    </div>
                    {!collapsed && <span>{link.name}</span>}
                    {!collapsed && isActiveLink(link.href) && (
                      <div className="ml-auto h-1.5 w-1.5 rounded-full bg-accent"></div>
                    )}
                  </Link>
                )}
              </React.Fragment>
            ))}
            
            {(hasPermission('users:manage') || hasPermission('roles:manage') || hasPermission('departments:manage')) && (
              <>
                {!collapsed && (
                  <div className="pt-5 pb-2">
                    <div className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Administration
                    </div>
                  </div>
                )}
                
                {adminLinks.map(link => (
                  <React.Fragment key={link.href}>
                    <PermissionGuard permissions={link.permission || ''}>
                      <Link 
                        to={link.href} 
                        className={`
                          group flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-colors
                          ${isActiveLink(link.href) 
                            ? 'bg-gradient-to-r from-accent/10 to-primary/10 text-primary' 
                            : 'text-foreground hover:bg-secondary hover:text-primary'}
                        `}
                      >
                        <div className={`${isActiveLink(link.href) ? link.color : 'text-muted-foreground'} ${collapsed ? 'mr-0' : 'mr-3'} h-5 w-5 flex-shrink-0 transition-all group-hover:scale-110`}>
                          <link.icon className="h-5 w-5" />
                        </div>
                        {!collapsed && <span>{link.name}</span>}
                        {!collapsed && isActiveLink(link.href) && (
                          <div className="ml-auto h-1.5 w-1.5 rounded-full bg-accent"></div>
                        )}
                      </Link>
                    </PermissionGuard>
                  </React.Fragment>
                ))}
              </>
            )}
          </div>
        </nav>

        <div className="border-t border-border/60 p-3">
          <ProfileTile collapsed={collapsed} />
        </div>
      </div>

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="bg-gradient-to-r from-white to-secondary/30 border-b border-border/60 px-6 py-4 flex justify-between items-center shadow-sm">
          <div>
            <h1 className="text-xl font-semibold mb-1 text-primary">
              {sidebarLinks.concat(adminLinks).find(link => isActiveLink(link.href))?.name || 'Dashboard'}
            </h1>
            <Breadcrumbs />
          </div>
          <div className="flex items-center space-x-2">
            {user?.preferred_language && (
              <div className="hidden md:block">
                <LanguageSelector />
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-secondary/30 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default SidebarLayout;
