
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle2 } from 'lucide-react';

const SystemElements = () => {
  const elements = [
    { id: '2.1', name: 'Management Commitment', description: 'Establish and maintain food safety policy' },
    { id: '2.2', name: 'Document Control', description: 'Maintain documented procedures' },
    { id: '2.3', name: 'Specifications, Formulations & Supplier Approval', description: 'Control and approve suppliers' },
    { id: '2.4', name: 'Food Safety System', description: 'Document, implement and maintain food safety system' },
    { id: '2.5', name: 'SQF System Verification', description: 'Verify activities and validate product safety' },
    { id: '2.6', name: 'Product Identification, Trace, Withdrawal & Recall', description: 'Ensure product traceability' },
    { id: '2.7', name: 'Food Defense and Food Fraud', description: 'Assess vulnerability and implement mitigation plans' },
  ];
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            SQF System Elements
          </CardTitle>
          <CardDescription>
            Core requirements that form the foundation of your SQF system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Element</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {elements.map((element) => (
                <TableRow key={element.id}>
                  <TableCell className="font-medium">{element.id}</TableCell>
                  <TableCell>{element.name}</TableCell>
                  <TableCell>{element.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Implementation Guidance</CardTitle>
          <CardDescription>
            Steps to effectively implement system elements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 list-disc pl-5">
            <li>Develop a comprehensive food safety policy</li>
            <li>Establish clear roles and responsibilities</li>
            <li>Document procedures for all system elements</li>
            <li>Train staff on SQF requirements</li>
            <li>Conduct internal audits regularly</li>
            <li>Maintain records of verification activities</li>
            <li>Implement corrective actions for any non-conformances</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemElements;
