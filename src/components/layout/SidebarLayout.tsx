
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
  SidebarInset
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
  Shield
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SidebarLayoutProps {
  children: React.ReactNode;
}

const SidebarLayout: React.FC<SidebarLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset className="bg-gray-50">
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

const AppSidebar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const modules = [
    { name: "Documents", path: "/documents", icon: FileText, tooltip: "Manage and control documents" },
    { name: "Audits", path: "/audits", icon: ClipboardCheck, tooltip: "Schedule and manage internal and external audits" },
    { name: "Complaints", path: "/complaints", icon: MessageSquare, tooltip: "Track and resolve customer complaints" },
    { name: "Traceability", path: "/traceability", icon: GitBranch, tooltip: "Manage product traceability and recalls" },
    { name: "Suppliers", path: "/suppliers", icon: Users, tooltip: "Manage supplier compliance and certifications" },
    { name: "Training", path: "/training", icon: GraduationCap, tooltip: "Track employee training and competencies" },
    { name: "CAPA", path: "/capa", icon: Shield, tooltip: "Manage corrective and preventive actions" },
    { name: "Reports", path: "/reports", icon: BarChart2, tooltip: "Generate compliance reports" }
  ];

  const standards = [
    { name: "SQF", path: "/standards/sqf", active: true },
    { name: "ISO 22000", path: "/standards/iso22000", active: false },
    { name: "FSSC 22000", path: "/standards/fssc22000", active: false },
    { name: "HACCP", path: "/standards/haccp", active: true },
    { name: "BRC GS2", path: "/standards/brcgs2", active: false }
  ];

  const settings = [
    { name: "Profile", path: "/profile", icon: User, tooltip: "Manage your profile" },
    { name: "Settings", path: "/settings", icon: Settings, tooltip: "System settings" },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-center py-4">
        <Link to="/dashboard" className="flex items-center space-x-2 font-bold text-xl">
          <span className="text-fsms-blue">Food</span>
          <span className="text-gray-800">Compli</span>
        </Link>
      </SidebarHeader>
      
      <SidebarContent>
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
                    <Link to={standard.path} className="flex items-center justify-between w-full">
                      <div className="flex items-center">
                        <Shield className="h-4 w-4 mr-2" />
                        <span>{standard.name}</span>
                      </div>
                      {standard.active && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 text-xs">
                          Active
                        </Badge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarSeparator />
        
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
