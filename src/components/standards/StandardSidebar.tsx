
import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from '@/lib/utils';
import { 
  ClipboardCheck, 
  FileCheck,
  LineChart,
  Award,
  CheckCircle2, 
  FileText,
  ShieldCheck,
  AlertTriangle,
  Building,
  ChevronRight,
  BarChart3,
  ListChecks
} from 'lucide-react';

interface StandardModule {
  name: string;
  path: string;
  icon: React.ReactNode;
  description?: string;
}

interface Standard {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  modules: StandardModule[];
}

const StandardSidebar = () => {
  const location = useLocation();
  const { standardId } = useParams<{ standardId?: string }>();
  const currentPath = location.pathname;
  
  const standards: Standard[] = [
    {
      id: 'sqf',
      name: 'SQF',
      icon: <ClipboardCheck className="h-5 w-5" />,
      color: 'text-blue-500 group-hover:text-blue-600',
      modules: [
        { 
          name: 'System Elements', 
          path: '/standards/sqf/system-elements', 
          icon: <FileText className="h-4 w-4" />,
          description: 'Foundation requirements for food safety management'
        },
        { 
          name: 'Good Manufacturing Practices', 
          path: '/standards/sqf/gmp', 
          icon: <CheckCircle2 className="h-4 w-4" />,
          description: 'Operational prerequisites and conditions'
        },
        { 
          name: 'Food Safety Plans', 
          path: '/standards/sqf/food-safety-plans', 
          icon: <ShieldCheck className="h-4 w-4" />,
          description: 'HACCP-based food safety risk management'
        },
        { 
          name: 'Verification Activities', 
          path: '/standards/sqf/verification', 
          icon: <FileCheck className="h-4 w-4" />,
          description: 'Monitoring and validation procedures'
        },
      ]
    },
    {
      id: 'iso22000',
      name: 'ISO 22000',
      icon: <FileCheck className="h-5 w-5" />,
      color: 'text-green-500 group-hover:text-green-600',
      modules: [
        { 
          name: 'Management System', 
          path: '/standards/iso22000/management-system', 
          icon: <FileText className="h-4 w-4" />,
          description: 'Organizational leadership and planning'
        },
        { 
          name: 'Prerequisite Programs', 
          path: '/standards/iso22000/prerequisites', 
          icon: <CheckCircle2 className="h-4 w-4" />,
          description: 'Foundational food safety conditions'
        },
        { 
          name: 'HACCP Principles', 
          path: '/standards/iso22000/haccp', 
          icon: <ShieldCheck className="h-4 w-4" />,
          description: 'Hazard analysis and critical control points'
        },
        { 
          name: 'Performance Evaluation', 
          path: '/standards/iso22000/evaluation', 
          icon: <BarChart3 className="h-4 w-4" />,
          description: 'Monitoring, measurement and analysis'
        },
      ]
    },
    {
      id: 'fssc22000',
      name: 'FSSC 22000',
      icon: <ListChecks className="h-5 w-5" />,
      color: 'text-purple-500 group-hover:text-purple-600',
      modules: [
        { 
          name: 'ISO 22000 Requirements', 
          path: '/standards/fssc22000/iso-requirements', 
          icon: <FileText className="h-4 w-4" />,
          description: 'Core ISO 22000 components'
        },
        { 
          name: 'Additional Requirements', 
          path: '/standards/fssc22000/additional', 
          icon: <CheckCircle2 className="h-4 w-4" />,
          description: 'FSSC-specific requirements'
        },
        { 
          name: 'Sector-Specific PRPs', 
          path: '/standards/fssc22000/sector-prps', 
          icon: <ShieldCheck className="h-4 w-4" />,
          description: 'Industry-specific prerequisite programs'
        },
        { 
          name: 'Certification Process', 
          path: '/standards/fssc22000/certification', 
          icon: <Award className="h-4 w-4" />,
          description: 'Steps for achieving certification'
        },
      ]
    },
    {
      id: 'haccp',
      name: 'HACCP',
      icon: <LineChart className="h-5 w-5" />,
      color: 'text-orange-500 group-hover:text-orange-600',
      modules: [
        { 
          name: 'Hazard Analysis', 
          path: '/standards/haccp/hazard-analysis', 
          icon: <AlertTriangle className="h-4 w-4" />,
          description: 'Identification and assessment of hazards'
        },
        { 
          name: 'Critical Control Points', 
          path: '/standards/haccp/ccps', 
          icon: <CheckCircle2 className="h-4 w-4" />,
          description: 'Key control points to prevent hazards'
        },
        { 
          name: 'Monitoring Procedures', 
          path: '/standards/haccp/monitoring', 
          icon: <LineChart className="h-4 w-4" />,
          description: 'Systems for CCP oversight'
        },
        { 
          name: 'Verification Activities', 
          path: '/standards/haccp/verification', 
          icon: <FileCheck className="h-4 w-4" />,
          description: 'Validation of HACCP system effectiveness'
        },
      ]
    },
    {
      id: 'brcgs2',
      name: 'BRC GS2',
      icon: <Award className="h-5 w-5" />,
      color: 'text-red-500 group-hover:text-red-600',
      modules: [
        { 
          name: 'Senior Management Commitment', 
          path: '/standards/brcgs2/management', 
          icon: <FileText className="h-4 w-4" />,
          description: 'Leadership and continuous improvement'
        },
        { 
          name: 'Food Safety Plan', 
          path: '/standards/brcgs2/food-safety-plan', 
          icon: <ShieldCheck className="h-4 w-4" />,
          description: 'Comprehensive safety management'
        },
        { 
          name: 'Site Standards', 
          path: '/standards/brcgs2/site-standards', 
          icon: <Building className="h-4 w-4" />,
          description: 'Facility and environmental requirements'
        },
        { 
          name: 'Product Control', 
          path: '/standards/brcgs2/product-control', 
          icon: <CheckCircle2 className="h-4 w-4" />,
          description: 'Product design and process control'
        },
      ]
    },
  ];

  // Determine which accordion item should be open by default
  const defaultOpenItem = standardId || 
    standards.find(standard => 
      currentPath.includes(`/standards/${standard.id}`)
    )?.id || 
    standards[0].id;

  return (
    <div className="w-64 h-full border-r border-border/60 bg-gradient-to-b from-background to-secondary/20">
      <div className="p-4 border-b border-border/60 bg-secondary/30">
        <h2 className="font-semibold text-lg text-primary flex items-center">
          <ClipboardCheck className="h-5 w-5 mr-2 text-accent" />
          Standards & Modules
        </h2>
      </div>
      <div className="py-2">
        <Accordion type="single" collapsible defaultValue={defaultOpenItem}>
          {standards.map((standard) => (
            <AccordionItem key={standard.id} value={standard.id} className="border-b-0">
              <AccordionTrigger className="px-4 py-3 hover:bg-secondary/50 hover:no-underline group">
                <div className={`flex items-center gap-2 ${standard.color}`}>
                  {standard.icon}
                  <span className="font-medium">{standard.name}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pl-6 pr-2 py-1 space-y-1">
                  {standard.modules.map((module) => (
                    <Link 
                      key={module.path} 
                      to={module.path}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2.5 text-sm rounded-md group relative",
                        currentPath === module.path 
                          ? "bg-gradient-to-r from-accent/10 to-primary/10 text-primary font-medium" 
                          : "text-foreground-light hover:bg-secondary/70 hover:text-primary transition-colors"
                      )}
                    >
                      <div className={currentPath === module.path ? standard.color : "text-muted-foreground group-hover:text-accent"}>
                        {module.icon}
                      </div>
                      <span>{module.name}</span>
                      {currentPath === module.path && (
                        <div className="ml-auto h-1.5 w-1.5 rounded-full bg-accent"></div>
                      )}
                      {module.description && (
                        <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 w-48 p-2 bg-background border border-border shadow-md rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                          <div className="text-xs text-foreground-light">{module.description}</div>
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default StandardSidebar;
