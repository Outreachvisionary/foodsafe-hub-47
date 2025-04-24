
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  BarChart, 
  FileText, 
  ClipboardCheck, 
  Building2, 
  Settings, 
  Users, 
  LayoutDashboard,
  Shield,
  BookOpen,
  GraduationCap,
  Menu,
  ChevronRight
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { ThemeToggle } from './ThemeToggle';

// Define sidebar items with proper typing
interface SidebarItem {
  name: string;
  icon: React.ElementType;
  path: string;
}

const mainNavItems: SidebarItem[] = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { name: 'Documents', icon: FileText, path: '/documents' },
  { name: 'CAPAs', icon: ClipboardCheck, path: '/capas' },
  { name: 'Training', icon: GraduationCap, path: '/training' },
  { name: 'Facilities', icon: Building2, path: '/facilities' },
  { name: 'Reports', icon: BarChart, path: '/reports' },
];

const secondaryNavItems: SidebarItem[] = [
  { name: 'Standards', icon: Shield, path: '/standards' },
  { name: 'Learning', icon: BookOpen, path: '/learning' },
  { name: 'Users', icon: Users, path: '/users' },
  { name: 'Settings', icon: Settings, path: '/settings' },
];

const AppSidebar: React.FC = () => {
  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setCollapsed(!collapsed);
    }
  };

  const sidebarWidthClass = collapsed 
    ? 'w-16 sm:w-20' 
    : 'w-64';

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  // Sidebar appearance with new design system
  return (
    <>
      {/* Mobile overlay */}
      {isMobile && mobileOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-20"
          onClick={() => setMobileOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={cn(
          "fixed left-0 top-0 bottom-0 z-30 flex flex-col h-screen bg-card border-r border-border transition-all duration-300",
          sidebarWidthClass,
          isMobile && !mobileOpen ? '-translate-x-full' : 'translate-x-0'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-border">
          {!collapsed && (
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm">
                CC
              </div>
              <span className="font-display font-semibold text-lg text-gradient-primary">
                ComplianceCore
              </span>
            </Link>
          )}
          {collapsed && (
            <Link to="/dashboard" className="flex items-center mx-auto">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm">
                CC
              </div>
            </Link>
          )}
          {!isMobile && (
            <button 
              onClick={toggleSidebar}
              className="h-6 w-6 rounded-full flex items-center justify-center hover:bg-secondary transition-colors"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <ChevronRight className={cn("h-4 w-4 transition-transform", collapsed ? "rotate-0" : "rotate-180")} />
            </button>
          )}
        </div>

        {/* Main navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-2">
          <div className="space-y-1">
            {mainNavItems.map((item) => (
              <NavItem 
                key={item.path}
                item={item}
                collapsed={collapsed}
                active={isActive(item.path)}
              />
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-border/60">
            <div className="px-4 mb-2">
              {!collapsed && (
                <span className="text-xs font-medium text-foreground-muted uppercase tracking-wider">
                  System
                </span>
              )}
            </div>
            <div className="space-y-1">
              {secondaryNavItems.map((item) => (
                <NavItem 
                  key={item.path}
                  item={item}
                  collapsed={collapsed}
                  active={isActive(item.path)}
                />
              ))}
            </div>
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border flex items-center justify-between">
          <ThemeToggle />
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-accent/80">
                JS
              </div>
              <span className="text-sm text-foreground-secondary">Admin</span>
            </div>
          )}
          {isMobile && (
            <button
              onClick={toggleSidebar}
              className="rounded-md p-1 hover:bg-secondary transition-colors"
              aria-label="Toggle sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
      
      {/* Mobile toggle button */}
      {isMobile && !mobileOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed bottom-4 left-4 z-20 h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
      )}
    </>
  );
};

// Nav item component with updated styling
interface NavItemProps {
  item: SidebarItem;
  collapsed: boolean;
  active: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ item, collapsed, active }) => {
  const Icon = item.icon;
  
  return (
    <Link
      to={item.path}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
        active 
          ? "bg-accent/10 text-accent" 
          : "hover:bg-secondary text-foreground-secondary hover:text-foreground"
      )}
    >
      <Icon className={cn(
        "flex-shrink-0",
        collapsed ? "h-5 w-5 mx-auto" : "h-5 w-5"
      )} />
      {!collapsed && (
        <span className="text-sm">{item.name}</span>
      )}
      {active && !collapsed && (
        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-accent" />
      )}
    </Link>
  );
};

export default AppSidebar;
