
import React from 'react';
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  SidebarInset,
  SidebarTrigger,
  SidebarRail,
  useSidebar
} from "@/components/ui/sidebar";
import { Link, useLocation } from 'react-router-dom';
import { 
  FileText, 
  ClipboardCheck, 
  MessageSquare, 
  GitBranch, 
  Users, 
  GraduationCap, 
  BarChart2,
  Settings,
  User,
  Shield,
  AlertTriangle,
  Gauge,
  AlertOctagon
} from 'lucide-react';

interface SidebarLayoutProps {
  children: React.ReactNode;
}

const SidebarLayout: React.FC<SidebarLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarRail />
        <SidebarInset className="bg-gray-50">
          <div className="flex flex-col min-h-screen">
            {children}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

const AppSidebar = () => {
  const location = useLocation();
  const { state: sidebarState, toggleSidebar } = useSidebar();
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const modules = [
    { name: "Dashboard", path: "/dashboard", icon: Gauge, tooltip: "View performance dashboards and metrics" },
    { name: "Documents", path: "/documents", icon: FileText, tooltip: "Manage and control documents" },
    { name: "Audits", path: "/internal-audits", icon: ClipboardCheck, tooltip: "Schedule and manage internal and external audits" },
    { name: "Complaints", path: "/complaint-management", icon: MessageSquare, tooltip: "Track and resolve customer complaints" },
    { name: "Traceability", path: "/traceability", icon: GitBranch, tooltip: "Manage product traceability and recalls" },
    { name: "Suppliers", path: "/supplier-management", icon: Users, tooltip: "Manage supplier compliance and certifications" },
    { name: "Training", path: "/training", icon: GraduationCap, tooltip: "Track employee training and competencies" },
    { name: "CAPA", path: "/capa", icon: AlertTriangle, tooltip: "Manage corrective and preventive actions" },
    { name: "Non-Conformance", path: "/non-conformance", icon: AlertOctagon, tooltip: "Manage non-conforming products and processes" },
    { name: "HACCP", path: "/haccp", icon: Shield, tooltip: "Manage HACCP plans and critical control points" },
    { name: "Reports", path: "/reports", icon: BarChart2, tooltip: "Generate compliance reports" }
  ];

  const standards = [
    { name: "SQF", path: "/standards/sqf" },
    { name: "ISO 22000", path: "/standards/iso22000" },
    { name: "FSSC 22000", path: "/standards/fssc22000" },
    { name: "HACCP", path: "/standards/haccp" },
    { name: "BRC", path: "/standards/brc" }
  ];

  const settings = [
    { name: "Profile", path: "/profile", icon: User, tooltip: "Manage your profile" },
    { name: "Settings", path: "/settings", icon: Settings, tooltip: "System settings" },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-between py-4 px-4">
        <Link to="/dashboard" className="flex items-center font-bold text-xl">
          <span className="text-fsms-blue">Food</span>
          <span className="text-gray-800">Compli</span>
        </Link>
        <SidebarTrigger />
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>MODULES</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {modules.map((module) => (
                <SidebarMenuItem key={module.name}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(module.path)}
                    tooltip={module.tooltip}
                  >
                    <Link to={module.path}>
                      <module.icon className="h-4 w-4 mr-2" />
                      <span>{module.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarSeparator />
        
        <SidebarGroup>
          <SidebarGroupLabel>STANDARDS</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {standards.map((standard) => (
                <SidebarMenuItem key={standard.name}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(standard.path)}
                    tooltip={`${standard.name} compliance standard`}
                  >
                    <Link to={standard.path} className="flex items-center">
                      <Shield className="h-4 w-4 mr-2" />
                      <span>{standard.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarSeparator />
        
        <SidebarGroup>
          <SidebarGroupLabel>SETTINGS</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settings.map((setting) => (
                <SidebarMenuItem key={setting.name}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(setting.path)}
                    tooltip={setting.tooltip}
                  >
                    <Link to={setting.path}>
                      <setting.icon className="h-4 w-4 mr-2" />
                      <span>{setting.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default SidebarLayout;
