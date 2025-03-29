
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  Building
} from 'lucide-react';

interface StandardModule {
  name: string;
  path: string;
  icon: React.ReactNode;
}

interface Standard {
  id: string;
  name: string;
  icon: React.ReactNode;
  modules: StandardModule[];
}

const StandardSidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const standards: Standard[] = [
    {
      id: 'sqf',
      name: 'SQF',
      icon: <ClipboardCheck className="h-5 w-5 text-purple-500" />,
      modules: [
        { name: 'System Elements', path: '/standards/sqf/system-elements', icon: <FileText className="h-4 w-4" /> },
        { name: 'Good Manufacturing Practices', path: '/standards/sqf/gmp', icon: <CheckCircle2 className="h-4 w-4" /> },
        { name: 'Food Safety Plans', path: '/standards/sqf/food-safety-plans', icon: <ShieldCheck className="h-4 w-4" /> },
        { name: 'Verification Activities', path: '/standards/sqf/verification', icon: <FileCheck className="h-4 w-4" /> },
      ]
    },
    {
      id: 'iso22000',
      name: 'ISO 22000',
      icon: <FileCheck className="h-5 w-5 text-green-500" />,
      modules: [
        { name: 'Management System', path: '/standards/iso22000/management-system', icon: <FileText className="h-4 w-4" /> },
        { name: 'Prerequisite Programs', path: '/standards/iso22000/prerequisites', icon: <CheckCircle2 className="h-4 w-4" /> },
        { name: 'HACCP Principles', path: '/standards/iso22000/haccp', icon: <ShieldCheck className="h-4 w-4" /> },
        { name: 'Performance Evaluation', path: '/standards/iso22000/evaluation', icon: <FileCheck className="h-4 w-4" /> },
      ]
    },
    {
      id: 'fssc22000',
      name: 'FSSC 22000',
      icon: <ClipboardCheck className="h-5 w-5 text-blue-500" />,
      modules: [
        { name: 'ISO 22000 Requirements', path: '/standards/fssc22000/iso-requirements', icon: <FileText className="h-4 w-4" /> },
        { name: 'Additional Requirements', path: '/standards/fssc22000/additional', icon: <CheckCircle2 className="h-4 w-4" /> },
        { name: 'Sector-Specific PRPs', path: '/standards/fssc22000/sector-prps', icon: <ShieldCheck className="h-4 w-4" /> },
        { name: 'Certification Process', path: '/standards/fssc22000/certification', icon: <FileCheck className="h-4 w-4" /> },
      ]
    },
    {
      id: 'haccp',
      name: 'HACCP',
      icon: <LineChart className="h-5 w-5 text-orange-500" />,
      modules: [
        { name: 'Hazard Analysis', path: '/standards/haccp/hazard-analysis', icon: <AlertTriangle className="h-4 w-4" /> },
        { name: 'Critical Control Points', path: '/standards/haccp/ccps', icon: <CheckCircle2 className="h-4 w-4" /> },
        { name: 'Monitoring Procedures', path: '/standards/haccp/monitoring', icon: <LineChart className="h-4 w-4" /> },
        { name: 'Verification Activities', path: '/standards/haccp/verification', icon: <FileCheck className="h-4 w-4" /> },
      ]
    },
    {
      id: 'brcgs2',
      name: 'BRC GS2',
      icon: <Award className="h-5 w-5 text-yellow-600" />,
      modules: [
        { name: 'Senior Management Commitment', path: '/standards/brcgs2/management', icon: <FileText className="h-4 w-4" /> },
        { name: 'Food Safety Plan', path: '/standards/brcgs2/food-safety-plan', icon: <ShieldCheck className="h-4 w-4" /> },
        { name: 'Site Standards', path: '/standards/brcgs2/site-standards', icon: <Building className="h-4 w-4" /> },
        { name: 'Product Control', path: '/standards/brcgs2/product-control', icon: <CheckCircle2 className="h-4 w-4" /> },
      ]
    },
  ];

  // Determine which accordion item should be open by default
  const defaultOpenItem = standards.find(standard => 
    currentPath.includes(`/standards/${standard.id}`)
  )?.id || standards[0].id;

  return (
    <div className="w-64 h-full border-r bg-card">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-lg">Standards</h2>
      </div>
      <div className="py-2">
        <Accordion type="single" collapsible defaultValue={defaultOpenItem}>
          {standards.map((standard) => (
            <AccordionItem key={standard.id} value={standard.id}>
              <AccordionTrigger className="px-4 py-2 hover:bg-muted/50">
                <div className="flex items-center gap-2">
                  {standard.icon}
                  <span>{standard.name}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pl-8 pr-2 py-1 space-y-1">
                  {standard.modules.map((module) => (
                    <Link 
                      key={module.path} 
                      to={module.path}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 text-sm rounded-md",
                        currentPath === module.path 
                          ? "bg-primary/10 text-primary font-medium" 
                          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                      )}
                    >
                      {module.icon}
                      <span>{module.name}</span>
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

