
import { Link, useLocation } from 'react-router-dom';
import {
  BarChart2,
  FileText,
  ClipboardCheck,
  AlertTriangle,
  Settings,
  Users,
  Building,
  BoxesIcon,
  FileCheck,
  ShieldCheck,
  BookOpen,
  Library,
  Gauge,
  GraduationCap,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

const AppSidebar = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const navItems = [
    {
      section: 'Core',
      items: [
        { name: 'Dashboard', path: '/dashboard', icon: BarChart2 },
        { name: 'Documents', path: '/documents', icon: FileText },
        { name: 'CAPA', path: '/capa', icon: ClipboardCheck },
        { name: 'Non-Conformance', path: '/non-conformance', icon: AlertTriangle },
      ]
    },
    {
      section: 'Quality Management',
      items: [
        { name: 'Audits', path: '/audits', icon: FileCheck },
        { name: 'Standards', path: '/standards', icon: BookOpen },
        { name: 'Training', path: '/training', icon: GraduationCap },
        { name: 'Complaints', path: '/complaints', icon: AlertTriangle },
      ]
    },
    {
      section: 'Supply Chain',
      items: [
        { name: 'Traceability', path: '/traceability', icon: BoxesIcon },
        { name: 'Suppliers', path: '/suppliers', icon: Building },
        { name: 'Product Testing', path: '/testing', icon: ShieldCheck },
      ]
    },
    {
      section: 'Administration',
      items: [
        { name: 'Organizations', path: '/organizations', icon: Building },
        { name: 'Facilities', path: '/facilities', icon: Building },
        { name: 'Users', path: '/users', icon: Users },
        { name: 'Settings', path: '/settings', icon: Settings },
      ]
    },
  ];

  return (
    <div className="w-64 min-h-screen bg-gradient-to-b from-background to-secondary/20 border-r border-border/60 flex flex-col">
      <div className="p-4 border-b border-border/60">
        <Link to="/" className="flex items-center space-x-2">
          <div className="bg-gradient-to-r from-primary to-accent rounded-md p-1.5">
            <span className="text-white font-bold">CC</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            ComplianceCore
          </span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-2">
        {navItems.map((section, index) => (
          <div key={section.section} className={cn("mb-6", index !== 0 && "mt-2")}>
            <div className="px-3 mb-2">
              <h2 className="text-xs font-semibold text-foreground-muted tracking-wider uppercase">
                {section.section}
              </h2>
            </div>
            <div className="space-y-1">
              {section.items.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors",
                    isActive(item.path)
                      ? "bg-accent/10 text-accent font-medium"
                      : "text-foreground hover:bg-secondary/80 hover:text-accent"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                  {isActive(item.path) && (
                    <div className="ml-auto h-1.5 w-1.5 rounded-full bg-accent"></div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppSidebar;
