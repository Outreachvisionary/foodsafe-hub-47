
import { NavLink, useLocation } from 'react-router-dom';
import {
  FileText,
  AlertTriangle,
  ClipboardCheck,
  BarChart2,
  Users,
  Settings,
  BookOpen,
  Check,
  Boxes,
  CreditCard,
  Building,
  ShieldCheck
} from "lucide-react";
import { ThemeToggle } from './ThemeToggle';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '@/components/ui/sidebar';

const AppSidebar = () => {
  const location = useLocation();
  const isMobile = useIsMobile();

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const renderNavItem = (to: string, label: string, icon: React.ReactNode, exact: boolean = false) => {
    const active = exact ? location.pathname === to : isActive(to);
    
    return (
      <NavLink
        to={to}
        className={`
          flex items-center px-3 py-2 my-1 rounded-md text-sm font-medium transition-colors
          ${active 
            ? 'text-foreground bg-accent/10' 
            : 'text-foreground-secondary hover:text-foreground hover:bg-secondary'
          }
        `}
      >
        <span className={`mr-2 ${active ? 'text-accent' : 'text-foreground-secondary'}`}>
          {icon}
        </span>
        <span>{label}</span>
        {active && (
          <span className="ml-auto">
            <div className="h-1.5 w-1.5 rounded-full bg-accent"></div>
          </span>
        )}
      </NavLink>
    );
  };

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-center py-6">
        <h1 className="text-xl font-bold text-foreground">ComplianceCore</h1>
      </SidebarHeader>
      
      <SidebarContent className="px-3">
        {/* Main Navigation */}
        <div className="space-y-1 mb-6">
          {renderNavItem("/", "Dashboard", <BarChart2 size={18} />, true)}
          {renderNavItem("/documents", "Documents", <FileText size={18} />)}
          {renderNavItem("/capa", "CAPA", <ClipboardCheck size={18} />)}
          {renderNavItem("/non-conformance", "Non-Conformance", <AlertTriangle size={18} />)}
          {renderNavItem("/audits", "Audits", <Check size={18} />)}
          {renderNavItem("/standards", "Standards", <BookOpen size={18} />)}
          {renderNavItem("/traceability", "Traceability", <Boxes size={18} />)}
          {renderNavItem("/supplier-management", "Suppliers", <CreditCard size={18} />)}
        </div>
        
        {/* Administration */}
        <div className="mb-2">
          <h3 className="text-xs uppercase tracking-wider text-foreground-muted font-medium px-3 mb-2">
            Administration
          </h3>
          <div className="space-y-1">
            {renderNavItem("/facilities", "Facilities", <Building size={18} />)}
            {renderNavItem("/user-management", "Users", <Users size={18} />)}
            {renderNavItem("/settings", "Settings", <Settings size={18} />)}
          </div>
        </div>
      </SidebarContent>
      
      <SidebarFooter className="p-3 border-t border-border mt-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
              <ShieldCheck size={16} />
            </div>
            <div>
              <div className="text-sm font-medium">Admin User</div>
              <div className="text-xs text-foreground-muted">Quality Manager</div>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
