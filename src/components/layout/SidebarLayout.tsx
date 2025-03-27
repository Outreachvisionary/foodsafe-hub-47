
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUser } from '@/contexts/UserContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  LogOut,
  User,
  Settings,
  ChevronsLeft,
  ChevronsRight,
  LayoutDashboard,
  ClipboardCheck,
  FileText,
  AlertTriangle,
  RefreshCw,
  Truck,
  GraduationCap,
  Activity,
  Flask,
  HardHat,
  Building2,
  Building,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '@/components/LanguageSelector';

interface SidebarLink {
  name: string;
  href: string;
  icon: React.ElementType;
  color?: string;
}

const SidebarLayout = ({ children }: { children: React.ReactNode }) => {
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);
  const { user, signOut } = useUser();
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
    { name: t('sidebar.dashboard'), href: '/dashboard', icon: LayoutDashboard, color: 'text-blue-500' },
    { name: t('sidebar.documents'), href: '/documents', icon: FileText, color: 'text-green-500' },
    { name: t('sidebar.standards'), href: '/standards', icon: ClipboardCheck, color: 'text-purple-500' },
    { name: t('sidebar.organizations'), href: '/organizations', icon: Building, color: 'text-indigo-600' },
    { name: t('sidebar.facilities'), href: '/facilities', icon: Building2, color: 'text-teal-500' },
    { name: t('sidebar.audits'), href: '/audits', icon: HardHat, color: 'text-yellow-600' },
    { name: t('sidebar.nonConformance'), href: '/non-conformance', icon: AlertTriangle, color: 'text-red-500' },
    { name: t('sidebar.capa'), href: '/capa', icon: RefreshCw, color: 'text-orange-500' },
    { name: t('sidebar.suppliers'), href: '/suppliers', icon: Truck, color: 'text-pink-500' },
    { name: t('sidebar.training'), href: '/training', icon: GraduationCap, color: 'text-indigo-500' },
    { name: t('sidebar.haccp'), href: '/haccp', icon: Flask, color: 'text-teal-500' },
    { name: t('sidebar.traceability'), href: '/traceability', icon: Activity, color: 'text-cyan-500' },
  ];

  const isActiveLink = (href: string) => {
    return location.pathname === href || 
           (href !== '/' && href !== '/dashboard' && location.pathname.startsWith(href));
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`bg-card border-r border-border h-screen flex flex-col transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Logo */}
        <div className={`p-4 flex ${collapsed ? 'justify-center' : 'justify-between'} items-center`}>
          {!collapsed && (
            <Link to="/dashboard" className="flex items-center">
              <span className="text-xl font-bold">CompliancePro</span>
            </Link>
          )}
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="h-8 w-8">
            {collapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
          </Button>
        </div>

        <Separator />

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto p-3">
          <ul className="space-y-1">
            {sidebarLinks.map((link) => (
              <li key={link.href}>
                <Link to={link.href}>
                  <Button
                    variant={isActiveLink(link.href) ? 'secondary' : 'ghost'}
                    className={`w-full justify-start ${collapsed ? 'px-2' : 'px-3'}`}
                  >
                    <link.icon className={`${link.color || 'text-foreground'} ${collapsed ? 'mr-0' : 'mr-2'}`} size={18} />
                    {!collapsed && <span>{link.name}</span>}
                  </Button>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Section */}
        <div className="border-t border-border p-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className={`w-full ${collapsed ? 'justify-center' : 'justify-between'}`}>
                <div className="flex items-center">
                  <Avatar className="h-7 w-7 mr-2">
                    <AvatarImage src={user?.avatar_url || ''} />
                    <AvatarFallback>{user?.full_name?.[0] || user?.email?.[0] || 'U'}</AvatarFallback>
                  </Avatar>
                  {!collapsed && (
                    <div className="text-sm font-medium truncate">
                      {user?.full_name || user?.email || t('common.user')}
                    </div>
                  )}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>{t('profile.title')}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                <User className="mr-2 h-4 w-4" />
                {t('profile.viewProfile')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                {t('profile.settings')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="px-2 py-1.5">
                <LanguageSelector compact />
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                {t('auth.signOut')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Bar */}
        <header className="bg-background border-b border-border p-4 flex justify-between items-center">
          <div className="text-xl font-semibold">
            {sidebarLinks.find(link => isActiveLink(link.href))?.name || t('common.dashboard')}
          </div>
          <div className="flex items-center space-x-2">
            {user?.preferred_language && (
              <div className="hidden md:block">
                <LanguageSelector />
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto bg-muted/20">{children}</main>
      </div>
    </div>
  );
};

export default SidebarLayout;
