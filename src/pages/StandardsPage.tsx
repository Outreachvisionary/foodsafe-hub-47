
import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import StandardSidebar from '@/components/standards/StandardSidebar';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Shield } from 'lucide-react';

// Import specific standard module components
import SQFSystemElements from '@/components/standards/modules/sqf/SystemElements';
import SQFGMP from '@/components/standards/modules/sqf/GMP';
import SQFFoodSafetyPlans from '@/components/standards/modules/sqf/FoodSafetyPlans';
import SQFVerification from '@/components/standards/modules/sqf/Verification';

// Placeholder component for module content
const ModuleContent = ({ standard, module }: { standard: string, module: string }) => {
  // Map standard and module to component
  if (standard === 'sqf') {
    if (module === 'system-elements') return <SQFSystemElements />;
    if (module === 'gmp') return <SQFGMP />;
    if (module === 'food-safety-plans') return <SQFFoodSafetyPlans />;
    if (module === 'verification') return <SQFVerification />;
  }
  
  // Default placeholder content
  return (
    <Card className="p-6 bg-white border-border">
      <Alert className="bg-blue-50 border-primary">
        <Shield className="h-5 w-5 text-primary" />
        <AlertTitle className="text-foreground">{standard.toUpperCase()} - {module.replace(/-/g, ' ')}</AlertTitle>
        <AlertDescription className="text-secondary-foreground">
          This module provides detailed guidance and implementation resources for {module.replace(/-/g, ' ')} 
          under the {standard.toUpperCase()} standard.
        </AlertDescription>
      </Alert>
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2 text-foreground">Module Overview</h3>
        <p className="text-secondary-foreground">Comprehensive information and implementation tools for this specific aspect of {standard.toUpperCase()}.</p>
      </div>
    </Card>
  );
};

const StandardsPage = () => {
  const { standardId, moduleId } = useParams<{ standardId: string; moduleId: string }>();
  
  // Validate that the standardId is one of the allowed values
  const validStandards = ['sqf', 'iso22000', 'fssc22000', 'haccp', 'brcgs2'];
  
  if (!standardId || !validStandards.includes(standardId)) {
    return <Navigate to="/standards/sqf/system-elements" replace />;
  }
  
  // If no module is specified, redirect to the first module of the standard
  if (!moduleId) {
    switch(standardId) {
      case 'sqf': return <Navigate to="/standards/sqf/system-elements" replace />;
      case 'iso22000': return <Navigate to="/standards/iso22000/management-system" replace />;
      case 'fssc22000': return <Navigate to="/standards/fssc22000/iso-requirements" replace />;
      case 'haccp': return <Navigate to="/standards/haccp/hazard-analysis" replace />;
      case 'brcgs2': return <Navigate to="/standards/brcgs2/management" replace />;
      default: return <Navigate to="/standards/sqf/system-elements" replace />;
    }
  }
  
  return (
    <AppLayout 
      title="Food Safety Standards" 
      subtitle="Comprehensive implementation guides for global food safety standards"
    >
      <div className="flex h-[calc(100vh-12rem)] bg-background border border-border rounded-lg overflow-hidden">
        <StandardSidebar />
        <div className="flex-1 p-6 overflow-y-auto">
          <ModuleContent standard={standardId} module={moduleId} />
        </div>
      </div>
    </AppLayout>
  );
};

export default StandardsPage;
