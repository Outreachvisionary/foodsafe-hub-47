
import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, FileCheck, ClipboardCheck, LineChart, Award, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import DashboardHeader from '@/components/DashboardHeader';

// Standard-specific content components
const SQFContent = () => (
  <div className="space-y-6">
    <Alert className="bg-fsms-lightBlue border-fsms-blue">
      <Shield className="h-5 w-5 text-fsms-blue" />
      <AlertTitle>SQF Certification Overview</AlertTitle>
      <AlertDescription>
        Safe Quality Food (SQF) is a rigorous, credible food safety and quality program recognized by retailers, brand owners, and food service providers worldwide.
      </AlertDescription>
    </Alert>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center">
            <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
            Key SQF Components
          </CardTitle>
          <CardDescription>Required elements for certification</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 list-disc pl-5">
            <li>Food Safety Management System</li>
            <li>Good Manufacturing Practices (GMPs)</li>
            <li>HACCP-based Food Safety Plans</li>
            <li>Food Quality Plans</li>
            <li>Environmental Monitoring Program</li>
          </ul>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center">
            <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
            Common Non-Conformances
          </CardTitle>
          <CardDescription>Areas requiring special attention</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 list-disc pl-5">
            <li>Inadequate HACCP Validation</li>
            <li>Poor Documentation Control</li>
            <li>Incomplete Corrective Actions</li>
            <li>Insufficient Internal Audit Programs</li>
            <li>Inadequate Allergen Controls</li>
          </ul>
        </CardContent>
      </Card>
    </div>
    
    <Card>
      <CardHeader>
        <CardTitle>SQF Certification Process</CardTitle>
        <CardDescription>Steps to achieve SQF certification</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Stage</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Timeline</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Preparation</TableCell>
              <TableCell>Register with SQF database, select certification level</TableCell>
              <TableCell className="text-right">1-2 months</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Documentation</TableCell>
              <TableCell>Develop food safety/quality manual, procedures, HACCP plans</TableCell>
              <TableCell className="text-right">2-4 months</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Implementation</TableCell>
              <TableCell>Train staff, implement procedures, internal audits</TableCell>
              <TableCell className="text-right">3-6 months</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Certification Audit</TableCell>
              <TableCell>Desk audit followed by facility audit</TableCell>
              <TableCell className="text-right">1 month</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Ongoing Compliance</TableCell>
              <TableCell>Surveillance & recertification audits</TableCell>
              <TableCell className="text-right">Annual</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
);

const ISO22000Content = () => (
  <div className="space-y-6">
    <Alert className="bg-fsms-lightBlue border-fsms-blue">
      <FileCheck className="h-5 w-5 text-fsms-blue" />
      <AlertTitle>ISO 22000 Certification Overview</AlertTitle>
      <AlertDescription>
        ISO 22000 is an international standard that specifies requirements for a food safety management system, combining interactive communication, system management, and hazard controls.
      </AlertDescription>
    </Alert>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center">
            <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
            Key ISO 22000 Components
          </CardTitle>
          <CardDescription>Required elements for certification</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 list-disc pl-5">
            <li>Management System</li>
            <li>Interactive Communication</li>
            <li>Prerequisite Programs (PRPs)</li>
            <li>HACCP Principles</li>
            <li>Emergency Preparedness</li>
          </ul>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center">
            <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
            Common Non-Conformances
          </CardTitle>
          <CardDescription>Areas requiring special attention</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 list-disc pl-5">
            <li>Incomplete Risk Assessment</li>
            <li>Poor Traceability Systems</li>
            <li>Inadequate Validation Measures</li>
            <li>Insufficient Management Review</li>
            <li>Incomplete Operational PRPs</li>
          </ul>
        </CardContent>
      </Card>
    </div>
    
    <Card>
      <CardHeader>
        <CardTitle>ISO 22000 Implementation Process</CardTitle>
        <CardDescription>Steps to achieve ISO 22000 certification</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Stage</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Timeline</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Gap Analysis</TableCell>
              <TableCell>Assess current food safety systems against ISO 22000</TableCell>
              <TableCell className="text-right">1 month</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Documentation</TableCell>
              <TableCell>Develop food safety manual, procedures, and control measures</TableCell>
              <TableCell className="text-right">2-3 months</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Implementation</TableCell>
              <TableCell>Staff training, prerequisite programs, validation</TableCell>
              <TableCell className="text-right">3-6 months</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Internal Audit</TableCell>
              <TableCell>Evaluate implementation effectiveness</TableCell>
              <TableCell className="text-right">1 month</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Certification Audit</TableCell>
              <TableCell>Two-stage audit process by certification body</TableCell>
              <TableCell className="text-right">1-2 months</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
);

const FSSC22000Content = () => (
  <div className="space-y-6">
    <Alert className="bg-fsms-lightBlue border-fsms-blue">
      <ClipboardCheck className="h-5 w-5 text-fsms-blue" />
      <AlertTitle>FSSC 22000 Certification Overview</AlertTitle>
      <AlertDescription>
        FSSC 22000 combines ISO 22000 with sector-specific prerequisite programs (ISO/TS 22002-1) and additional requirements, providing a complete certification scheme for food safety management systems.
      </AlertDescription>
    </Alert>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center">
            <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
            Key FSSC 22000 Components
          </CardTitle>
          <CardDescription>Required elements for certification</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 list-disc pl-5">
            <li>ISO 22000 Requirements</li>
            <li>Sector-Specific PRPs</li>
            <li>Food Fraud Prevention</li>
            <li>Food Defense</li>
            <li>Allergen Management</li>
            <li>Environmental Monitoring</li>
          </ul>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center">
            <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
            Common Non-Conformances
          </CardTitle>
          <CardDescription>Areas requiring special attention</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 list-disc pl-5">
            <li>Insufficient Food Fraud Prevention</li>
            <li>Inadequate Food Defense Measures</li>
            <li>Poor Management of Outsourced Processes</li>
            <li>Weak Environmental Monitoring Programs</li>
            <li>Incomplete Product Labeling Controls</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  </div>
);

const HACCPContent = () => (
  <div className="space-y-6">
    <Alert className="bg-fsms-lightBlue border-fsms-blue">
      <LineChart className="h-5 w-5 text-fsms-blue" />
      <AlertTitle>HACCP System Overview</AlertTitle>
      <AlertDescription>
        Hazard Analysis Critical Control Point (HACCP) is a preventive approach to food safety that identifies, evaluates, and controls hazards significant for food safety.
      </AlertDescription>
    </Alert>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center">
            <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
            The 7 HACCP Principles
          </CardTitle>
          <CardDescription>Core elements of any HACCP system</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 list-disc pl-5">
            <li>Conduct a hazard analysis</li>
            <li>Determine critical control points (CCPs)</li>
            <li>Establish critical limits</li>
            <li>Establish monitoring procedures</li>
            <li>Establish corrective actions</li>
            <li>Establish verification procedures</li>
            <li>Establish record-keeping and documentation procedures</li>
          </ul>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center">
            <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
            Common HACCP Pitfalls
          </CardTitle>
          <CardDescription>Areas requiring special attention</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 list-disc pl-5">
            <li>Too many or too few CCPs</li>
            <li>Inadequate hazard analysis</li>
            <li>Poor recordkeeping</li>
            <li>Inadequate corrective actions</li>
            <li>Insufficient verification activities</li>
            <li>Lack of team involvement</li>
          </ul>
        </CardContent>
      </Card>
    </div>
    
    <Card>
      <CardHeader>
        <CardTitle>HACCP Plan Development Process</CardTitle>
        <CardDescription>Steps to develop and implement HACCP</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Stage</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Documentation</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Preliminary Steps</TableCell>
              <TableCell>Assemble HACCP team, describe product, identify intended use, construct flow diagram, on-site confirmation</TableCell>
              <TableCell className="text-right">Team charter, product descriptions, flow diagrams</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Hazard Analysis</TableCell>
              <TableCell>List all potential hazards, conduct analysis, consider control measures</TableCell>
              <TableCell className="text-right">Hazard analysis worksheets</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Critical Control Points</TableCell>
              <TableCell>Determine CCPs using decision tree</TableCell>
              <TableCell className="text-right">CCP determination forms</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">HACCP Plan Development</TableCell>
              <TableCell>Establish critical limits, monitoring system, corrective actions, verification procedures, documentation</TableCell>
              <TableCell className="text-right">HACCP plan forms, monitoring records</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Implementation & Verification</TableCell>
              <TableCell>Train employees, implement plan, verify effectiveness</TableCell>
              <TableCell className="text-right">Training records, verification reports</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
);

const BRCGS2Content = () => (
  <div className="space-y-6">
    <Alert className="bg-fsms-lightBlue border-fsms-blue">
      <Award className="h-5 w-5 text-fsms-blue" />
      <AlertTitle>BRC Global Standard for Food Safety Overview</AlertTitle>
      <AlertDescription>
        The BRC Global Standard for Food Safety provides a framework for managing product safety, integrity, legality, and quality in food manufacturing, processing, and packing.
      </AlertDescription>
    </Alert>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center">
            <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
            Key BRC Requirements
          </CardTitle>
          <CardDescription>Core elements for certification</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 list-disc pl-5">
            <li>Senior Management Commitment</li>
            <li>Food Safety Plan (HACCP)</li>
            <li>Food Safety & Quality Management System</li>
            <li>Site Standards</li>
            <li>Product Control</li>
            <li>Process Control</li>
            <li>Personnel</li>
          </ul>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center">
            <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
            Common Non-Conformances
          </CardTitle>
          <CardDescription>Areas requiring special attention</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 list-disc pl-5">
            <li>Inadequate root cause analysis</li>
            <li>Poor pest management</li>
            <li>Insufficient foreign material controls</li>
            <li>Incomplete allergen management</li>
            <li>Weak traceability systems</li>
            <li>Inadequate supplier approval program</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  </div>
);

// Standard information wrapper component
const StandardInformation = () => {
  const { standardId } = useParams<{ standardId: string }>();
  
  // Default to 'sqf' if no standardId is provided
  const activeTab = standardId || 'sqf';
  
  // Validate that the standardId is one of the allowed values
  const validStandards = ['sqf', 'iso22000', 'fssc22000', 'haccp', 'brcgs2'];
  if (standardId && !validStandards.includes(standardId)) {
    return <Navigate to="/standards/sqf" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader 
        title="Food Safety Standards" 
        subtitle="Comprehensive information and implementation guides for global food safety standards." 
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue={activeTab} className="w-full animate-fade-in">
          <TabsList className="mb-8">
            <TabsTrigger value="sqf">SQF</TabsTrigger>
            <TabsTrigger value="iso22000">ISO 22000</TabsTrigger>
            <TabsTrigger value="fssc22000">FSSC 22000</TabsTrigger>
            <TabsTrigger value="haccp">HACCP</TabsTrigger>
            <TabsTrigger value="brcgs2">BRC GS2</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sqf" className="space-y-4">
            <SQFContent />
          </TabsContent>
          
          <TabsContent value="iso22000" className="space-y-4">
            <ISO22000Content />
          </TabsContent>
          
          <TabsContent value="fssc22000" className="space-y-4">
            <FSSC22000Content />
          </TabsContent>
          
          <TabsContent value="haccp" className="space-y-4">
            <HACCPContent />
          </TabsContent>
          
          <TabsContent value="brcgs2" className="space-y-4">
            <BRCGS2Content />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

// Main Standards page component
const Standards = () => {
  // If we're at the root /standards path, redirect to SQF by default
  const { standardId } = useParams<{ standardId: string }>();
  
  if (!standardId) {
    return <Navigate to="/standards/sqf" replace />;
  }
  
  return <StandardInformation />;
};

export default Standards;
