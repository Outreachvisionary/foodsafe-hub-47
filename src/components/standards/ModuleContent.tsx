
import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';

const ModuleContent: React.FC = () => {
  const { standardId, moduleId } = useParams<{ standardId?: string; moduleId?: string }>();
  
  if (!standardId || !moduleId) {
    return <div>Module not found</div>;
  }
  
  // This would be fetched from a backend in a real application
  const moduleTitle = moduleId
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">{moduleTitle}</CardTitle>
        <CardDescription>
          Module requirements and compliance information for {standardId.toUpperCase()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="requirements">
          <TabsList className="mb-4">
            <TabsTrigger value="requirements">Requirements</TabsTrigger>
            <TabsTrigger value="implementation">Implementation Guide</TabsTrigger>
            <TabsTrigger value="compliance">Compliance Status</TabsTrigger>
            <TabsTrigger value="documents">Related Documents</TabsTrigger>
          </TabsList>
          
          <TabsContent value="requirements" className="space-y-4">
            <Alert>
              <InfoIcon className="h-4 w-4 mr-2" />
              <AlertDescription>
                This section outlines the key requirements that must be met to comply with {moduleTitle} in the {standardId.toUpperCase()} standard.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-4 mt-4">
              <RequirementItem 
                id="req-1"
                title="Documentation Requirements"
                description="Maintain written procedures for all operational processes and critical control points."
                compliance="Compliant"
              />
              <RequirementItem 
                id="req-2"
                title="Monitoring Process"
                description="Establish monitoring procedures with defined frequency and responsibility."
                compliance="Compliant"
              />
              <RequirementItem 
                id="req-3"
                title="Verification Activities"
                description="Implement verification activities to confirm monitoring effectiveness."
                compliance="Non-Compliant"
              />
              <RequirementItem 
                id="req-4"
                title="Record Keeping"
                description="Maintain records of monitoring, corrective actions, and verification activities."
                compliance="Partial"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="implementation">
            <p className="text-muted-foreground mb-4">
              Implementation guidelines and best practices for meeting the requirements of this module.
            </p>
            {/* Implementation content would go here */}
          </TabsContent>
          
          <TabsContent value="compliance">
            <p className="text-muted-foreground mb-4">
              Current compliance status and gap analysis for this module.
            </p>
            {/* Compliance content would go here */}
          </TabsContent>
          
          <TabsContent value="documents">
            <p className="text-muted-foreground mb-4">
              Documents related to this module.
            </p>
            {/* Documents content would go here */}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

interface RequirementItemProps {
  id: string;
  title: string;
  description: string;
  compliance: 'Compliant' | 'Non-Compliant' | 'Partial';
}

const RequirementItem: React.FC<RequirementItemProps> = ({ id, title, description, compliance }) => {
  const getComplianceDetails = () => {
    switch (compliance) {
      case 'Compliant':
        return {
          icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
          text: 'Compliant',
          className: 'text-emerald-500',
        };
      case 'Non-Compliant':
        return {
          icon: <AlertTriangle className="h-5 w-5 text-rose-500" />,
          text: 'Non-Compliant',
          className: 'text-rose-500',
        };
      case 'Partial':
        return {
          icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
          text: 'Partially Compliant',
          className: 'text-amber-500',
        };
      default:
        return {
          icon: <FileText className="h-5 w-5 text-muted-foreground" />,
          text: 'Not Evaluated',
          className: 'text-muted-foreground',
        };
    }
  };
  
  const complianceDetails = getComplianceDetails();
  
  return (
    <div className="border border-border rounded-md p-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
        <div className="flex items-center">
          {complianceDetails.icon}
          <span className={`ml-2 text-sm font-medium ${complianceDetails.className}`}>
            {complianceDetails.text}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ModuleContent;
