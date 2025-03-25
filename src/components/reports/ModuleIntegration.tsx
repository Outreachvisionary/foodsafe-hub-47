
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  ClipboardCheck, 
  AlertTriangle, 
  Users, 
  BarChart2, 
  ArrowRight,
  Calendar,
  FileBarChart
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface ModuleIntegrationProps {
  onNavigateToModule: (module: string) => void;
}

const ModuleIntegration: React.FC<ModuleIntegrationProps> = ({ onNavigateToModule }) => {
  const [activeModule, setActiveModule] = useState('documents');
  const { toast } = useToast();
  
  const handleGenerateReport = (reportType: string) => {
    toast({
      title: "Generating Report",
      description: `Your ${reportType} report is being generated and will be available shortly.`
    });
  };
  
  const modules = [
    { id: 'documents', name: 'Documents', icon: <FileText className="h-4 w-4" /> },
    { id: 'audits', name: 'Audits', icon: <ClipboardCheck className="h-4 w-4" /> },
    { id: 'capa', name: 'CAPA', icon: <AlertTriangle className="h-4 w-4" /> },
    { id: 'training', name: 'Training', icon: <Users className="h-4 w-4" /> },
    { id: 'haccp', name: 'HACCP', icon: <FileBarChart className="h-4 w-4" /> }
  ];
  
  // Document module integration data
  const expiringDocuments = [
    { id: 'DOC-001', title: 'Quality Manual', category: 'Manual', expiresIn: 15, status: 'Active' },
    { id: 'DOC-023', title: 'Supplier Approval Procedure', category: 'SOP', expiresIn: 10, status: 'Active' },
    { id: 'DOC-045', title: 'Internal Audit Procedure', category: 'SOP', expiresIn: 5, status: 'Active' },
    { id: 'DOC-067', title: 'HACCP Plan - Production Line A', category: 'HACCP', expiresIn: 3, status: 'Active' }
  ];
  
  // CAPA module integration data
  const openCapas = [
    { id: 'CAPA-2023-042', title: 'Temperature excursion in cold storage', priority: 'High', status: 'In Progress', dueIn: 5 },
    { id: 'CAPA-2023-039', title: 'Missing training records for new employees', priority: 'Medium', status: 'Open', dueIn: 10 },
    { id: 'CAPA-2023-036', title: 'Inconsistent allergen labeling', priority: 'Critical', status: 'In Progress', dueIn: 2 }
  ];
  
  // Training module integration data
  const trainingCompliance = [
    { department: 'Production', employeeCount: 28, completedCount: 24, compliance: 86 },
    { department: 'Quality', employeeCount: 12, completedCount: 11, compliance: 92 },
    { department: 'Warehouse', employeeCount: 15, completedCount: 12, compliance: 80 },
    { department: 'Management', employeeCount: 8, completedCount: 7, compliance: 88 }
  ];
  
  // Audit module integration data
  const upcomingAudits = [
    { id: 'AUD-2023-12', title: 'Monthly GMP Audit', type: 'Internal', scheduled: '2023-09-15', status: 'Scheduled' },
    { id: 'AUD-2023-13', title: 'FSSC 22000 Surveillance', type: 'External', scheduled: '2023-09-28', status: 'Scheduled' },
    { id: 'AUD-2023-14', title: 'Supplier Audit - Ingredients Inc', type: 'Supplier', scheduled: '2023-10-05', status: 'Planned' }
  ];
  
  // HACCP module integration data
  const ccpDeviations = [
    { id: 'CCP-01', name: 'Cooking Temperature', deviations: 2, lastDeviation: '2023-09-01', status: 'Under Control' },
    { id: 'CCP-02', name: 'Metal Detection', deviations: 0, lastDeviation: 'None', status: 'Under Control' },
    { id: 'CCP-03', name: 'Cold Storage Temperature', deviations: 3, lastDeviation: '2023-09-05', status: 'Action Required' }
  ];
  
  const renderModuleContent = () => {
    switch (activeModule) {
      case 'documents':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Expiring Documents</CardTitle>
                <CardDescription>Documents that will expire in the next 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Expires In</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expiringDocuments.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell className="font-medium">{doc.id}</TableCell>
                        <TableCell>{doc.title}</TableCell>
                        <TableCell>{doc.category}</TableCell>
                        <TableCell>{doc.expiresIn} days</TableCell>
                        <TableCell>
                          <Badge variant={doc.expiresIn <= 5 ? "destructive" : "outline"}>
                            {doc.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            <div className="flex justify-between gap-4">
              <Button onClick={() => handleGenerateReport('Document Expiry')}>
                Generate Expiry Report
              </Button>
              <Button variant="outline" onClick={() => onNavigateToModule('documents')}>
                Go to Document Management
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        );
        
      case 'capa':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Open CAPAs</CardTitle>
                <CardDescription>Corrective actions that require attention</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>CAPA ID</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Due In</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {openCapas.map((capa) => (
                      <TableRow key={capa.id}>
                        <TableCell className="font-medium">{capa.id}</TableCell>
                        <TableCell>{capa.title}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              capa.priority === 'Critical' ? "destructive" : 
                              capa.priority === 'High' ? "default" : 
                              "outline"
                            }
                          >
                            {capa.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>{capa.status}</TableCell>
                        <TableCell>{capa.dueIn} days</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            <div className="flex justify-between gap-4">
              <Button onClick={() => handleGenerateReport('CAPA Status')}>
                Generate CAPA Status Report
              </Button>
              <Button variant="outline" onClick={() => onNavigateToModule('capa')}>
                Go to CAPA Management
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        );
        
      case 'training':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Training Compliance</CardTitle>
                <CardDescription>Current training compliance by department</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {trainingCompliance.map((dept) => (
                    <div key={dept.department} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-medium">{dept.department}</span>
                          <span className="text-sm text-gray-500 ml-2">
                            ({dept.completedCount}/{dept.employeeCount} employees trained)
                          </span>
                        </div>
                        <span className="font-medium">{dept.compliance}%</span>
                      </div>
                      <Progress value={dept.compliance} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-between gap-4">
              <Button onClick={() => handleGenerateReport('Training Compliance')}>
                Generate Training Report
              </Button>
              <Button variant="outline" onClick={() => onNavigateToModule('training')}>
                Go to Training Module
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        );
        
      case 'audits':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Audits</CardTitle>
                <CardDescription>Scheduled audits for the next 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Audit ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Scheduled Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {upcomingAudits.map((audit) => (
                      <TableRow key={audit.id}>
                        <TableCell className="font-medium">{audit.id}</TableCell>
                        <TableCell>{audit.title}</TableCell>
                        <TableCell>{audit.type}</TableCell>
                        <TableCell>{audit.scheduled}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{audit.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            <div className="flex justify-between gap-4">
              <Button onClick={() => handleGenerateReport('Audit Schedule')}>
                Generate Audit Schedule Report
              </Button>
              <Button variant="outline" onClick={() => onNavigateToModule('internal-audits')}>
                Go to Audit Management
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        );
        
      case 'haccp':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>CCP Monitoring Status</CardTitle>
                <CardDescription>Current status of critical control points</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>CCP ID</TableHead>
                      <TableHead>CCP Name</TableHead>
                      <TableHead>Deviations (Last 30 Days)</TableHead>
                      <TableHead>Last Deviation</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ccpDeviations.map((ccp) => (
                      <TableRow key={ccp.id}>
                        <TableCell className="font-medium">{ccp.id}</TableCell>
                        <TableCell>{ccp.name}</TableCell>
                        <TableCell>{ccp.deviations}</TableCell>
                        <TableCell>{ccp.lastDeviation}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={ccp.status === 'Action Required' ? "destructive" : "outline"}
                          >
                            {ccp.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            <div className="flex justify-between gap-4">
              <Button onClick={() => handleGenerateReport('CCP Monitoring')}>
                Generate CCP Monitoring Report
              </Button>
              <Button variant="outline" onClick={() => onNavigateToModule('haccp')}>
                Go to HACCP Module
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Module Integration</h3>
      </div>
      
      <Tabs defaultValue="documents" value={activeModule} onValueChange={setActiveModule}>
        <TabsList>
          {modules.map((module) => (
            <TabsTrigger key={module.id} value={module.id} className="flex items-center gap-2">
              {module.icon}
              <span>{module.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value={activeModule} className="mt-6">
          {renderModuleContent()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ModuleIntegration;
