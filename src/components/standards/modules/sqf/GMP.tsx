
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

const GMP = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            Good Manufacturing Practices
          </CardTitle>
          <CardDescription>
            Essential practices for maintaining a safe and efficient food production environment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Good Manufacturing Practices (GMPs) are the foundation of your food safety program.
            They establish the necessary environmental and operational conditions for producing safe food.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-md p-4">
              <h3 className="text-lg font-medium mb-2">Personnel Practices</h3>
              <ul className="space-y-1 list-disc pl-5">
                <li>Hand washing procedures</li>
                <li>Appropriate attire and PPE</li>
                <li>Health monitoring</li>
                <li>Hygiene training</li>
              </ul>
            </div>
            
            <div className="border rounded-md p-4">
              <h3 className="text-lg font-medium mb-2">Facility Design</h3>
              <ul className="space-y-1 list-disc pl-5">
                <li>Product flow and segregation</li>
                <li>Construction materials</li>
                <li>Adequate lighting and ventilation</li>
                <li>Waste management systems</li>
              </ul>
            </div>
            
            <div className="border rounded-md p-4">
              <h3 className="text-lg font-medium mb-2">Cleaning and Sanitation</h3>
              <ul className="space-y-1 list-disc pl-5">
                <li>Master cleaning schedule</li>
                <li>Cleaning procedures and chemicals</li>
                <li>Environmental monitoring program</li>
                <li>Pre-operational inspections</li>
              </ul>
            </div>
            
            <div className="border rounded-md p-4">
              <h3 className="text-lg font-medium mb-2">Allergen Control</h3>
              <ul className="space-y-1 list-disc pl-5">
                <li>Allergen mapping</li>
                <li>Separation and identification</li>
                <li>Rework handling</li>
                <li>Cleaning validation</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Alert variant="destructive">
        <AlertTriangle className="h-5 w-5" />
        <AlertTitle>Common GMP Non-Conformances</AlertTitle>
        <AlertDescription>
          <ul className="mt-2 space-y-1 list-disc pl-5">
            <li>Inadequate handwashing facilities or practices</li>
            <li>Poor hygienic design of equipment</li>
            <li>Inadequate pest control programs</li>
            <li>Improper storage of cleaning chemicals</li>
            <li>Cross-contamination risks from traffic patterns</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default GMP;
