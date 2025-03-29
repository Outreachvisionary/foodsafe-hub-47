// src/components/layout/SidebarLayout.tsx

import React, { useState } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUser } from '@/contexts/UserContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { LogOut, User, Settings, ChevronsLeft, ChevronsRight, LayoutDashboard, ClipboardCheck, FileText, AlertTriangle, RefreshCw, Truck, GraduationCap, Activity, Building2, Building, Beaker, HardDrive } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '@/components/LanguageSelector';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
interface SidebarLink {
  name: string;
  href: string;
  icon: React.ElementType;
  color?: string;
}
const SidebarLayout = () => {
  const {
    t
  } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);
  const {
    user,
    signOut
  } = useUser();
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
  const sidebarLinks: SidebarLink[] = [{
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    color: 'text-primary'
  }, {
    name: 'Documents',
    href: '/documents',
    icon: FileText,
    color: 'text-primary'
  }, {
    name: 'Standards',
    href: '/standards',
    icon: ClipboardCheck,
    color: 'text-primary'
  }, {
    name: 'Organizations',
    href: '/organizations',
    icon: Building,
    color: 'text-primary'
  }, {
    name: 'Facilities',
    href: '/facilities',
    icon: Building2,
    color: 'text-primary'
  }, {
    name: 'Audits',
    href: '/audits',
    icon: HardDrive,
    color: 'text-primary'
  }, {
    name: 'Non-Conformance',
    href: '/non-conformance',
    icon: AlertTriangle,
    color: 'text-primary'
  }, {
    name: 'CAPA',
    href: '/capa',
    icon: RefreshCw,
    color: 'text-primary'
  }, {
    name: 'Suppliers',
    href: '/suppliers',
    icon: Truck,
    color: 'text-primary'
  }, {
    name: 'Training',
    href: '/training',
    icon: GraduationCap,
    color: 'text-primary'
  }, {
    name: 'HACCP',
    href: '/haccp',
    icon: Beaker,
    color: 'text-primary'
  }, {
    name: 'Traceability',
    href: '/traceability',
    icon: Activity,
    color: 'text-primary'
  }];
  const isActiveLink = (href: string) => {
    return location.pathname === href || href !== '/' && href !== '/dashboard' && location.pathname.startsWith(href);
  };
  return <div className="flex h-screen">
      {/* Light theme sidebar */}
      <div className={`bg-white border-r border-border h-screen flex flex-col transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
        {/* Logo */}
        <div className={`p-4 flex ${collapsed ? 'justify-center' : 'justify-between'} items-center`}>
          {!collapsed && <Link to="/dashboard" className="flex items-center">
              <span className="text-xl font-bold text-primary">Compliance Core</span>
            </Link>}
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="h-8 w-8 text-charcoal-muted hover:text-charcoal">
            {collapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
          </Button>
        </div>

        <Separator className="mb-2" />

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-2">
          <div className="space-y-1">
            {sidebarLinks.map(link => <Link key={link.href} to={link.href} className={`
                  group flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-colors
                  ${isActiveLink(link.href) ? 'bg-primary/10 text-primary' : 'text-charcoal hover:bg-secondary hover:text-charcoal'}
                `}>
                <link.icon className={`${isActiveLink(link.href) ? link.color : 'text-charcoal-light'} ${collapsed ? 'mr-0' : 'mr-3'} h-5 w-5 flex-shrink-0`} />
                {!collapsed && <span>{link.name}</span>}
              </Link>)}
          </div>
        </nav>

        {/* User Section */}
        <div className="border-t border-border p-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className={`w-full ${collapsed ? 'justify-center' : 'justify-between'} px-2 text-charcoal`}>
                <div className="flex items-center">
                  <Avatar className="h-7 w-7 mr-2">
                    <AvatarImage src={user?.avatar_url || ''} />
                    <AvatarFallback>{user?.full_name?.[0] || user?.email?.[0] || 'U'}</AvatarFallback>
                  </Avatar>
                  {!collapsed && <div className="text-sm font-medium truncate">
                      {user?.full_name || user?.email || t('common.user')}
                    </div>}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-slate-600 text-charcoal border border-border">
              <DropdownMenuLabel>{t('profile.title')}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer hover:bg-secondary">
                <User className="mr-2 h-4 w-4" />
                {t('profile.viewProfile')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings')} className="cursor-pointer hover:bg-secondary">
                <Settings className="mr-2 h-4 w-4" />
                {t('profile.settings')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="px-2 py-1.5">
                <LanguageSelector />
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive hover:bg-secondary">
                <LogOut className="mr-2 h-4 w-4" />
                {t('auth.signOut')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Content - Light Theme */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-border px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold mb-1 text-charcoal">
              {sidebarLinks.find(link => isActiveLink(link.href))?.name || 'Dashboard'}
            </h1>
            <Breadcrumbs />
          </div>
          <div className="flex items-center space-x-2">
            {user?.preferred_language && <div className="hidden md:block">
                <LanguageSelector />
              </div>}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto bg-secondary p-6">
          <Outlet />
        </main>
      </div>
    </div>;
};
export default SidebarLayout;