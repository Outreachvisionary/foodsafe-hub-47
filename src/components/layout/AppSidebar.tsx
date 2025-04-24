
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
  ChevronRight,
  AlertTriangle,
  Calendar,
  BoxesStacked,
  MessageCircle,
  Fingerprint,
  Repeat,
  TestTube,
  FolderHeart
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { ThemeToggle } from './ThemeToggle';
import { Button } from '@/components/ui/button';

interface SidebarItem {
  name: string;
  icon: React.ElementType;
  path: string;
  badge?: string;
}

const mainNavItems: SidebarItem[] = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { name: 'Documents', icon: FileText, path: '/documents' },
  { name: 'CAPAs', icon: ClipboardCheck, path: '/capas' },
  { name: 'Training', icon: GraduationCap, path: '/training' },
  { name: 'Facilities', icon: Building2, path: '/facilities' },
  { name: 'Reports', icon: BarChart, path: '/reports' },
  { name: 'Audits', icon: Calendar, path: '/audits' },
  { name: 'Non-Conformance', icon: AlertTriangle, path: '/non-conformance' },
  { name: 'Traceability', icon: Repeat, path: '/traceability' },
  { name: 'Suppliers', icon: BoxesStacked, path: '/suppliers' },
  { name: 'Complaints', icon: MessageCircle, path: '/complaints' },
  { name: 'Testing', icon: TestTube, path: '/testing' },
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

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && mobileOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-20"
          onClick={() => setMobileOpen(false)}
        />
      )}
      
      {/* Sidebar with enhanced styling */}
      <div 
        className={cn(
          "fixed left-0 top-0 bottom-0 z-30 flex flex-col h-screen border-r transition-all duration-300",
          "bg-card shadow-md border-border",
          sidebarWidthClass,
          isMobile && !mobileOpen ? '-translate-x-full' : 'translate-x-0'
        )}
      >
        {/* Header with gradient accent */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-border relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 pointer-events-none" />
          
          {!collapsed && (
            <Link to="/dashboard" className="flex items-center gap-2 relative z-10">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm shadow-glow">
                CC
              </div>
              <span className="font-display font-semibold text-lg text-gradient-primary">
                ComplianceCore
              </span>
            </Link>
          )}
          {collapsed && (
            <Link to="/dashboard" className="flex items-center mx-auto relative z-10">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm shadow-glow">
                CC
              </div>
            </Link>
          )}
          {!isMobile && (
            <Button 
              variant="ghost"
              size="icon" 
              onClick={toggleSidebar}
              className="rounded-full h-7 w-7 flex items-center justify-center hover:bg-secondary transition-colors relative z-10"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <ChevronRight className={cn("h-4 w-4 transition-transform", collapsed ? "rotate-0" : "rotate-180")} />
            </Button>
          )}
        </div>

        {/* Main navigation with enhanced scrolling */}
        <nav className="flex-1 overflow-y-auto py-6 px-2 scrollbar-none">
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

        {/* Footer with theme toggle and user profile */}
        <div className="p-4 border-t border-border flex items-center justify-between bg-gradient-to-t from-background-tertiary to-card">
          <ThemeToggle />
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                <Fingerprint className="h-3.5 w-3.5" />
              </div>
              <span className="text-sm text-foreground-secondary">Admin</span>
            </div>
          )}
          {isMobile && (
            <Button
              onClick={toggleSidebar}
              variant="ghost"
              size="icon"
              className="rounded-md p-1 hover:bg-secondary transition-colors"
              aria-label="Toggle sidebar"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
      
      {/* Mobile toggle button */}
      {isMobile && !mobileOpen && (
        <Button
          onClick={toggleSidebar}
          className="fixed bottom-4 left-4 z-20 h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg"
          aria-label="Toggle sidebar"
          size="icon"
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}
    </>
  );
};

// Nav item component with enhanced styling and badge support
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
        "flex items-center gap-3 px-3 py-2 rounded-md transition-colors relative",
        active 
          ? "bg-accent/10 text-accent font-medium" 
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
      
      {item.badge && !collapsed && (
        <span className="ml-auto text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
          {item.badge}
        </span>
      )}
      
      {active && (
        <>
          {!collapsed && (
            <span className="ml-auto h-1.5 w-1.5 rounded-full bg-accent" />
          )}
          <span className={cn(
            "absolute inset-y-0 left-0 w-0.5 bg-accent rounded-r-full",
            collapsed ? "opacity-100" : "opacity-0"
          )} />
        </>
      )}
    </Link>
  );
};

export default AppSidebar;
