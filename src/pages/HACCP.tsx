
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clipboard, 
  ClipboardCheck, 
  FileText, 
  FilterX, 
  History, 
  Plus, 
  Search, 
  ShieldCheck, 
  Thermometer, 
  Clock, 
  BarChart2, 
  Eye, 
  Edit, 
  PanelRight, 
  Filter, 
  FileCheck,
  FileWarning
} from 'lucide-react';
import DashboardHeader from '@/components/DashboardHeader';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';

// Mock HACCP data
const mockHACCPPlans = [
  {
    id: 'HACCP-001',
    name: 'Raw Material Receiving',
    category: 'Receiving',
    lastReviewed: '2023-04-15',
    status: 'active',
    ccps: 2,
    version: '3.2',
    owner: 'John Smith',
  },
  {
    id: 'HACCP-002',
    name: 'Cooking Process',
    category: 'Processing',
    lastReviewed: '2023-03-10',
    status: 'active',
    ccps: 3,
    version: '2.1',
    owner: 'Sarah Johnson',
  },
  {
    id: 'HACCP-003',
    name: 'Cooling and Storage',
    category: 'Storage',
    lastReviewed: '2023-05-22',
    status: 'active',
    ccps: 2,
    version: '1.4',
    owner: 'Michael Brown',
  },
  {
    id: 'HACCP-004',
    name: 'Packaging',
    category: 'Packaging',
    lastReviewed: '2022-11-30',
    status: 'review-needed',
    ccps: 1,
    version: '2.0',
    owner: 'Emily Davis',
  },
  {
    id: 'HACCP-005',
    name: 'Distribution',
    category: 'Distribution',
    lastReviewed: '2023-01-18',
    status: 'active',
    ccps: 1,
    version: '1.2',
    owner: 'Robert Wilson',
  },
];

const mockCCPs = [
  {
    id: 'CCP-001',
    name: 'Raw Material Temperature',
    hazard: 'Biological - Pathogen Growth',
    criticalLimits: 'Temperature < 4°C',
    monitoring: 'Check temperature of each delivery',
    frequency: 'Every delivery',
    responsibility: 'Receiving Supervisor',
    correctiveAction: 'Reject if > 4°C',
    verification: 'Calibrated thermometer, daily logs review',
    records: 'Receiving Log',
    plan: 'HACCP-001',
    status: 'compliant',
  },
  {
    id: 'CCP-002',
    name: 'Foreign Material Detection',
    hazard: 'Physical - Metal Contamination',
    criticalLimits: 'No metal > 2mm',
    monitoring: 'Metal detector check',
    frequency: 'Continuous',
    responsibility: 'Production Operator',
    correctiveAction: 'Stop line, investigate, segregate product',
    verification: 'Hourly verification checks',
    records: 'Metal Detector Log',
    plan: 'HACCP-001',
    status: 'compliant',
  },
  {
    id: 'CCP-003',
    name: 'Cooking Temperature',
    hazard: 'Biological - Pathogen Survival',
    criticalLimits: 'Core temperature > 74°C for 15s',
    monitoring: 'Temperature probe',
    frequency: 'Every batch',
    responsibility: 'Process Operator',
    correctiveAction: 'Continue cooking until temperature reached',
    verification: 'Calibrated probe, supervisor check',
    records: 'Cooking Log',
    plan: 'HACCP-002',
    status: 'non-compliant',
  },
  {
    id: 'CCP-004',
    name: 'pH Verification',
    hazard: 'Biological - Pathogen Growth',
    criticalLimits: 'pH ≤ 4.6',
    monitoring: 'pH meter',
    frequency: 'Every batch',
    responsibility: 'QA Technician',
    correctiveAction: 'Adjust acid addition, reprocess',
    verification: 'Calibrated pH meter, lab verification',
    records: 'pH Control Log',
    plan: 'HACCP-002',
    status: 'compliant',
  },
  {
    id: 'CCP-005',
    name: 'Cooling Time/Temperature',
    hazard: 'Biological - Pathogen Growth',
    criticalLimits: '54°C to 21°C in 2hrs, 21°C to 4°C in 4hrs',
    monitoring: 'Temperature probe',
    frequency: 'Every batch',
    responsibility: 'Cooling Room Operator',
    correctiveAction: 'Adjust cooling parameters, evaluate product',
    verification: 'Time/temperature records review',
    records: 'Cooling Log',
    plan: 'HACCP-003',
    status: 'pending',
  },
];

const mockMonitoringRecords = [
  {
    id: 'MON-001',
    date: '2023-06-01',
    time: '08:15',
    ccpId: 'CCP-001',
    reading: '2.1°C',
    operator: 'John Smith',
    result: 'compliant',
    notes: 'Within limits',
  },
  {
    id: 'MON-002',
    date: '2023-06-01',
    time: '10:30',
    ccpId: 'CCP-003',
    reading: '72.5°C',
    operator: 'Sarah Johnson',
    result: 'non-compliant',
    notes: 'Below required temperature, extended cooking time',
  },
  {
    id: 'MON-003',
    date: '2023-06-01',
    time: '12:45',
    ccpId: 'CCP-003',
    reading: '75.3°C',
    operator: 'Sarah Johnson',
    result: 'compliant',
    notes: 'Compliant after adjustment',
  },
  {
    id: 'MON-004',
    date: '2023-06-01',
    time: '14:20',
    ccpId: 'CCP-004',
    reading: '4.3',
    operator: 'Michael Brown',
    result: 'compliant',
    notes: 'Within limits',
  },
  {
    id: 'MON-005',
    date: '2023-06-01',
    time: '16:00',
    ccpId: 'CCP-002',
    reading: 'Pass',
    operator: 'Emily Davis',
    result: 'compliant',
    notes: 'No foreign material detected',
  },
];

const getStatusBadge = (status: string) => {
  switch(status) {
    case 'active':
      return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Active</Badge>;
    case 'review-needed':
      return <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">Review Needed</Badge>;
    case 'obsolete':
      return <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">Obsolete</Badge>;
    case 'draft':
      return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Draft</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const getResultBadge = (result: string) => {
  switch(result) {
    case 'compliant':
      return <Badge className="bg-green-100 text-green-600 border-green-200">Compliant</Badge>;
    case 'non-compliant':
      return <Badge className="bg-red-100 text-red-600 border-red-200">Non-Compliant</Badge>;
    case 'pending':
      return <Badge className="bg-blue-100 text-blue-600 border-blue-200">Pending</Badge>;
    default:
      return <Badge>{result}</Badge>;
  }
};

const HACCP = () => {
  const [activeTab, setActiveTab] = useState('plans');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCCP, setSelectedCCP] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showCCPDetails, setShowCCPDetails] = useState(false);

  const filteredPlans = mockHACCPPlans.filter(plan => 
    plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCCPs = mockCCPs.filter(ccp => {
    const matchesSearch = searchTerm === '' || 
      ccp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ccp.hazard.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ccp.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPlan = selectedPlan === null || ccp.plan === selectedPlan;
    
    return matchesSearch && matchesPlan;
  });

  const selectedCCPDetails = selectedCCP ? mockCCPs.find(ccp => ccp.id === selectedCCP) : null;
  const ccpMonitoringRecords = selectedCCP ? mockMonitoringRecords.filter(record => record.ccpId === selectedCCP) : [];

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <DashboardHeader
          title={
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-8 w-8 text-primary" />
              <span>HACCP Management</span>
            </div>
          }
          subtitle="Hazard Analysis and Critical Control Point System"
          className="mb-0"
        />
        
        <div>
          <Button className="flex items-center gap-2">
            <Plus size={16} />
            New HACCP Plan
          </Button>
        </div>
      </div>
      
      <div className="mb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="plans">HACCP Plans</TabsTrigger>
            <TabsTrigger value="ccps">Critical Control Points</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring Records</TabsTrigger>
            <TabsTrigger value="verification">Verification Activities</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={`Search ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <Button 
          variant="outline" 
          size="icon" 
          className="ml-2"
          onClick={() => setSearchTerm('')}
        >
          <FilterX className="h-4 w-4" />
        </Button>
        
        {activeTab === 'ccps' && (
          <Select value={selectedPlan || ''} onValueChange={(value) => setSelectedPlan(value || null)}>
            <SelectTrigger className="w-[220px] ml-2">
              <SelectValue placeholder="Filter by HACCP plan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All HACCP Plans</SelectItem>
              {mockHACCPPlans.map((plan) => (
                <SelectItem key={plan.id} value={plan.id}>{plan.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
      
      <TabsContent value="plans" className="m-0" hidden={activeTab !== 'plans'}>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>HACCP Plans</CardTitle>
            <CardDescription>
              All hazard analysis and critical control point plans in your system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plan ID</TableHead>
                  <TableHead>Plan Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>CCPs</TableHead>
                  <TableHead>Version</TableHead>
                  <TableHead>Last Reviewed</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPlans.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4 text-muted-foreground">
                      No HACCP plans found matching your search.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPlans.map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell className="font-medium">{plan.id}</TableCell>
                      <TableCell>{plan.name}</TableCell>
                      <TableCell>{plan.category}</TableCell>
                      <TableCell>{plan.ccps}</TableCell>
                      <TableCell>v{plan.version}</TableCell>
                      <TableCell>
                        {new Date(plan.lastReviewed).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{getStatusBadge(plan.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" title="View">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" title="Edit">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="ccps" className="m-0" hidden={activeTab !== 'ccps'}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className={showCCPDetails && selectedCCPDetails ? "lg:col-span-7" : "lg:col-span-12"}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Critical Control Points</CardTitle>
                <CardDescription>
                  Points in the process where control is essential to prevent, eliminate, or reduce hazards
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>CCP ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Hazard Type</TableHead>
                      <TableHead>HACCP Plan</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCCPs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                          No critical control points found matching your search.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredCCPs.map((ccp) => (
                        <TableRow 
                          key={ccp.id} 
                          className={selectedCCP === ccp.id ? "bg-muted/50" : ""}
                          onClick={() => {
                            setSelectedCCP(ccp.id);
                            setShowCCPDetails(true);
                          }}
                        >
                          <TableCell className="font-medium">{ccp.id}</TableCell>
                          <TableCell>{ccp.name}</TableCell>
                          <TableCell>{ccp.hazard}</TableCell>
                          <TableCell>{mockHACCPPlans.find(plan => plan.id === ccp.plan)?.name}</TableCell>
                          <TableCell>{getResultBadge(ccp.status)}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button 
                                variant={showCCPDetails && selectedCCP === ccp.id ? "secondary" : "ghost"} 
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedCCP(ccp.id);
                                  setShowCCPDetails(!showCCPDetails || selectedCCP !== ccp.id);
                                }}
                                className="flex items-center gap-1"
                              >
                                <PanelRight className="h-4 w-4" />
                                Details
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
          
          {showCCPDetails && selectedCCPDetails && (
            <div className="lg:col-span-5">
              <Card className="h-full">
                <CardHeader className="pb-3 flex flex-row items-start justify-between">
                  <div>
                    <CardTitle>{selectedCCPDetails.name}</CardTitle>
                    <CardDescription>
                      {selectedCCPDetails.id} - {mockHACCPPlans.find(plan => plan.id === selectedCCPDetails.plan)?.name}
                    </CardDescription>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setShowCCPDetails(false)}
                  >
                    <PanelRight className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px] pr-4">
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-sm font-semibold mb-2">Hazard</h4>
                        <p className="text-sm">{selectedCCPDetails.hazard}</p>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h4 className="text-sm font-semibold mb-2">Critical Limits</h4>
                        <p className="text-sm">{selectedCCPDetails.criticalLimits}</p>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h4 className="text-sm font-semibold mb-2">Monitoring Procedure</h4>
                        <p className="text-sm">{selectedCCPDetails.monitoring}</p>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                          <div>
                            <p className="text-xs text-muted-foreground">Frequency</p>
                            <p className="text-sm">{selectedCCPDetails.frequency}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Responsibility</p>
                            <p className="text-sm">{selectedCCPDetails.responsibility}</p>
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h4 className="text-sm font-semibold mb-2">Corrective Action</h4>
                        <p className="text-sm">{selectedCCPDetails.correctiveAction}</p>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h4 className="text-sm font-semibold mb-2">Verification Activities</h4>
                        <p className="text-sm">{selectedCCPDetails.verification}</p>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h4 className="text-sm font-semibold mb-2">Records</h4>
                        <p className="text-sm">{selectedCCPDetails.records}</p>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h4 className="text-sm font-semibold mb-2">Recent Monitoring Records</h4>
                        {ccpMonitoringRecords.length > 0 ? (
                          <div className="space-y-2">
                            {ccpMonitoringRecords.map(record => (
                              <div key={record.id} className="p-2 border rounded-md">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="text-sm font-medium">{record.date} {record.time}</p>
                                    <p className="text-xs text-muted-foreground">Operator: {record.operator}</p>
                                  </div>
                                  <div>
                                    {getResultBadge(record.result)}
                                  </div>
                                </div>
                                <div className="mt-2">
                                  <p className="text-sm"><span className="font-medium">Reading:</span> {record.reading}</p>
                                  {record.notes && <p className="text-xs text-muted-foreground mt-1">Notes: {record.notes}</p>}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">No recent monitoring records found.</p>
                        )}
                      </div>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </TabsContent>
      
      <TabsContent value="monitoring" className="m-0" hidden={activeTab !== 'monitoring'}>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Monitoring Records</CardTitle>
            <CardDescription>
              Records of CCP monitoring activities and results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>CCP</TableHead>
                  <TableHead>Reading</TableHead>
                  <TableHead>Operator</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockMonitoringRecords.map((record) => {
                  const ccp = mockCCPs.find(c => c.id === record.ccpId);
                  return (
                    <TableRow key={record.id}>
                      <TableCell>{record.date}</TableCell>
                      <TableCell>{record.time}</TableCell>
                      <TableCell>{ccp?.name}</TableCell>
                      <TableCell>{record.reading}</TableCell>
                      <TableCell>{record.operator}</TableCell>
                      <TableCell>{getResultBadge(record.result)}</TableCell>
                      <TableCell>{record.notes}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="verification" className="m-0" hidden={activeTab !== 'verification'}>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Verification Activities</CardTitle>
            <CardDescription>
              Activities conducted to validate that the HACCP system is working effectively
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle className="text-base font-semibold">Internal Audits</CardTitle>
                      <Badge className="bg-green-100 text-green-600">Complete</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="text-sm">
                      <div className="flex justify-between mb-2">
                        <span className="text-muted-foreground">Last audit:</span>
                        <span>May 15, 2023</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-muted-foreground">Findings:</span>
                        <span>2 minor</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Next due:</span>
                        <span>Aug 15, 2023</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle className="text-base font-semibold">Records Review</CardTitle>
                      <Badge className="bg-amber-100 text-amber-600">In Progress</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="text-sm">
                      <div className="flex justify-between mb-2">
                        <span className="text-muted-foreground">Period:</span>
                        <span>Q2 2023</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-muted-foreground">Progress:</span>
                        <span>65%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Due:</span>
                        <span>Jun 30, 2023</span>
                      </div>
                      <Progress value={65} className="mt-2 h-2" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle className="text-base font-semibold">Calibration</CardTitle>
                      <Badge className="bg-green-100 text-green-600">Complete</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="text-sm">
                      <div className="flex justify-between mb-2">
                        <span className="text-muted-foreground">Last done:</span>
                        <span>Jun 1, 2023</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-muted-foreground">Equipment:</span>
                        <span>15 items</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Next due:</span>
                        <span>Sep 1, 2023</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Verification Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Activity</TableHead>
                        <TableHead>Frequency</TableHead>
                        <TableHead>Last Completed</TableHead>
                        <TableHead>Next Due</TableHead>
                        <TableHead>Responsible</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">HACCP Plan Review</TableCell>
                        <TableCell>Annual</TableCell>
                        <TableCell>Mar 10, 2023</TableCell>
                        <TableCell>Mar 10, 2024</TableCell>
                        <TableCell>Food Safety Team</TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-600">Complete</Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Microbiological Testing</TableCell>
                        <TableCell>Quarterly</TableCell>
                        <TableCell>Apr 15, 2023</TableCell>
                        <TableCell>Jul 15, 2023</TableCell>
                        <TableCell>QA Manager</TableCell>
                        <TableCell>
                          <Badge className="bg-amber-100 text-amber-600">Upcoming</Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Thermometer Calibration</TableCell>
                        <TableCell>Monthly</TableCell>
                        <TableCell>Jun 1, 2023</TableCell>
                        <TableCell>Jul 1, 2023</TableCell>
                        <TableCell>Maintenance</TableCell>
                        <TableCell>
                          <Badge className="bg-amber-100 text-amber-600">Upcoming</Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">pH Meter Calibration</TableCell>
                        <TableCell>Weekly</TableCell>
                        <TableCell>May 30, 2023</TableCell>
                        <TableCell>Jun 6, 2023</TableCell>
                        <TableCell>QA Technician</TableCell>
                        <TableCell>
                          <Badge className="bg-red-100 text-red-600">Overdue</Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Metal Detector Verification</TableCell>
                        <TableCell>Daily</TableCell>
                        <TableCell>Jun 5, 2023</TableCell>
                        <TableCell>Jun 6, 2023</TableCell>
                        <TableCell>Production Lead</TableCell>
                        <TableCell>
                          <Badge className="bg-amber-100 text-amber-600">Due Today</Badge>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Verification Findings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3 p-3 bg-red-50 rounded-md">
                        <div className="bg-red-100 text-red-700 p-1.5 rounded-full">
                          <AlertTriangle className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium">pH Meter Calibration Overdue</p>
                          <p className="text-sm text-muted-foreground">Required weekly calibration missed for processing area pH meter</p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                            <Clock className="h-3 w-3" />
                            <span>Jun 2, 2023</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-md">
                        <div className="bg-amber-100 text-amber-700 p-1.5 rounded-full">
                          <FileWarning className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium">Records Review Finding</p>
                          <p className="text-sm text-muted-foreground">Missing sign-off on 3 cooking temperature logs from May 28</p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                            <Clock className="h-3 w-3" />
                            <span>May 31, 2023</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 p-3 bg-green-50 rounded-md">
                        <div className="bg-green-100 text-green-700 p-1.5 rounded-full">
                          <CheckCircle className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium">Microbial Testing Results</p>
                          <p className="text-sm text-muted-foreground">All Q2 environmental swabs within specification</p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                            <Clock className="h-3 w-3" />
                            <span>May 15, 2023</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Recommendations & Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border rounded-md p-3">
                        <div className="flex justify-between items-start">
                          <p className="font-medium">Update CCP-003 Monitoring Frequency</p>
                          <Badge>High Priority</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Based on validation study results, increase cook temperature monitoring frequency to every 30 minutes.
                        </p>
                        <div className="flex justify-between items-center text-xs text-muted-foreground mt-2">
                          <span>Assigned to: Sarah Johnson</span>
                          <span>Due: Jun 15, 2023</span>
                        </div>
                      </div>
                      
                      <div className="border rounded-md p-3">
                        <div className="flex justify-between items-start">
                          <p className="font-medium">Retrain Receiving Staff on CCP Monitoring</p>
                          <Badge>Medium Priority</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Schedule refresher training on proper temperature monitoring and documentation procedures.
                        </p>
                        <div className="flex justify-between items-center text-xs text-muted-foreground mt-2">
                          <span>Assigned to: Training Department</span>
                          <span>Due: Jun 30, 2023</span>
                        </div>
                      </div>
                      
                      <div className="border rounded-md p-3">
                        <div className="flex justify-between items-start">
                          <p className="font-medium">Evaluate Metal Detector Sensitivity</p>
                          <Badge>Medium Priority</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Review current sensitivity settings against industry standards and adjust if necessary.
                        </p>
                        <div className="flex justify-between items-center text-xs text-muted-foreground mt-2">
                          <span>Assigned to: Engineering Team</span>
                          <span>Due: Jul 15, 2023</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <Dialog>
        <DialogTrigger asChild>
          <Button 
            className="fixed bottom-8 right-8 shadow-lg flex gap-2 items-center"
            size="lg"
          >
            <ClipboardCheck className="h-4 w-4" />
            Add Monitoring Record
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Monitoring Record</DialogTitle>
            <DialogDescription>
              Record a new CCP monitoring observation
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="record-date">Date</Label>
                <Input id="record-date" type="date" defaultValue={new Date().toISOString().split('T')[0]} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="record-time">Time</Label>
                <Input id="record-time" type="time" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="record-ccp">Critical Control Point</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select CCP" />
                </SelectTrigger>
                <SelectContent>
                  {mockCCPs.map((ccp) => (
                    <SelectItem key={ccp.id} value={ccp.id}>
                      {ccp.id} - {ccp.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="record-reading">Reading/Result</Label>
              <Input id="record-reading" placeholder="e.g. 72.5°C, Pass, 4.3 pH" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="record-result">Compliance Status</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="compliant">Compliant</SelectItem>
                  <SelectItem value="non-compliant">Non-Compliant</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="record-notes">Notes</Label>
              <Input id="record-notes" placeholder="Any additional observations or actions taken" />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline">Cancel</Button>
            <Button>Save Record</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HACCP;
