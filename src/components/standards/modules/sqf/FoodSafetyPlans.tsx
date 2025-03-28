
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle2 } from 'lucide-react';

const FoodSafetyPlans = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            Food Safety Plans
          </CardTitle>
          <CardDescription>
            Systematic approach to identifying, evaluating and controlling food safety hazards
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            A Food Safety Plan is a fundamental component of the SQF Food Safety Code. It requires the application of 
            the Codex HACCP method for controlling food safety hazards in the process.
          </p>
          
          <Tabs defaultValue="preliminary">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="preliminary">Preliminary Steps</TabsTrigger>
              <TabsTrigger value="principles">HACCP Principles</TabsTrigger>
              <TabsTrigger value="implementation">Implementation</TabsTrigger>
            </TabsList>
            
            <TabsContent value="preliminary">
              <ol className="space-y-4 list-decimal pl-5">
                <li>
                  <p className="font-medium">Assemble HACCP Team</p>
                  <p className="text-sm text-muted-foreground">Form a multidisciplinary team with expertise in products and processes</p>
                </li>
                <li>
                  <p className="font-medium">Describe Product</p>
                  <p className="text-sm text-muted-foreground">Document all relevant safety information about the product</p>
                </li>
                <li>
                  <p className="font-medium">Identify Intended Use</p>
                  <p className="text-sm text-muted-foreground">Determine normal use and consumer of the food product</p>
                </li>
                <li>
                  <p className="font-medium">Construct Flow Diagram</p>
                  <p className="text-sm text-muted-foreground">Create a detailed process flow from raw materials to finished product</p>
                </li>
                <li>
                  <p className="font-medium">Confirm Flow Diagram</p>
                  <p className="text-sm text-muted-foreground">Verify accuracy of flow diagram through on-site observation</p>
                </li>
              </ol>
            </TabsContent>
            
            <TabsContent value="principles">
              <ol className="space-y-4 list-decimal pl-5">
                <li>
                  <p className="font-medium">Conduct a Hazard Analysis</p>
                  <p className="text-sm text-muted-foreground">Identify and assess all potential hazards (biological, chemical, physical)</p>
                </li>
                <li>
                  <p className="font-medium">Determine Critical Control Points (CCPs)</p>
                  <p className="text-sm text-muted-foreground">Identify points where control is essential to prevent, eliminate or reduce hazards</p>
                </li>
                <li>
                  <p className="font-medium">Establish Critical Limits</p>
                  <p className="text-sm text-muted-foreground">Set measurable parameters that separate acceptable from unacceptable</p>
                </li>
                <li>
                  <p className="font-medium">Establish Monitoring Procedures</p>
                  <p className="text-sm text-muted-foreground">Define how CCPs will be monitored to ensure critical limits are met</p>
                </li>
                <li>
                  <p className="font-medium">Establish Corrective Actions</p>
                  <p className="text-sm text-muted-foreground">Define actions when monitoring indicates deviation from critical limits</p>
                </li>
                <li>
                  <p className="font-medium">Establish Verification Procedures</p>
                  <p className="text-sm text-muted-foreground">Confirm that the HACCP system is working effectively</p>
                </li>
                <li>
                  <p className="font-medium">Establish Documentation and Record Keeping</p>
                  <p className="text-sm text-muted-foreground">Maintain records of all HACCP procedures and monitoring results</p>
                </li>
              </ol>
            </TabsContent>
            
            <TabsContent value="implementation">
              <div className="space-y-4">
                <div className="border rounded-md p-4">
                  <h3 className="text-lg font-medium mb-2">Validation</h3>
                  <p>Ensure that the controls identified in the food safety plan are capable of achieving the intended level of control. Gather scientific evidence to validate critical limits.</p>
                </div>
                
                <div className="border rounded-md p-4">
                  <h3 className="text-lg font-medium mb-2">Documentation</h3>
                  <p>Maintain all food safety plan documents including hazard analysis, CCP determination, monitoring procedures, and validation evidence.</p>
                </div>
                
                <div className="border rounded-md p-4">
                  <h3 className="text-lg font-medium mb-2">Training</h3>
                  <p>Ensure all staff responsible for monitoring CCPs are adequately trained. Document training records and conduct regular refresher training.</p>
                </div>
                
                <div className="border rounded-md p-4">
                  <h3 className="text-lg font-medium mb-2">Verification</h3>
                  <p>Conduct routine verification activities including review of records, testing results, internal audits, and reassessment of the food safety plan.</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default FoodSafetyPlans;
