
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, PlusCircle, Sliders, ClipboardCheck, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import CCPTimeline from '@/components/traceability/CCPTimeline';
import BatchDetailsDialog from '@/components/traceability/BatchDetailsDialog';
import RecallRiskDashboard from '@/components/traceability/RecallRiskDashboard';
import ComplianceValidation from '@/components/traceability/ComplianceValidation';
import { BatchTrace } from '@/types/traceability';
import { toast } from 'sonner';

// Mock batch data to pass to components
const mockBatches: BatchTrace[] = [
  {
    id: 'BT-2023-0542',
    product: 'Organic Apple Juice',
    date: 'May 12, 2023',
    quantity: '1000 L',
    status: 'Released',
    location: 'Warehouse A',
    suppliers: [
      { id: 'SUP-001', name: 'Organic Farms Inc.', auditScore: 95 }
    ],
    haccpChecks: [
      {
        id: 'CCP-001',
        ccpId: 'CCP-TEMP-001',
        name: 'Pasteurization',
        target: 72,
        actual: 73,
        unit: '°C',
        timestamp: '2023-05-12T10:30:00Z',
        passed: true,
        auditor: 'John Smith',
        hazardType: 'biological',
      }
    ]
  },
  {
    id: 'BT-2023-0541',
    product: 'Cheese Spread',
    date: 'May 10, 2023',
    quantity: '500 kg',
    status: 'Released',
    location: 'Cold Storage B',
    suppliers: [
      { id: 'SUP-002', name: 'Dairy Cooperative', auditScore: 92 }
    ],
    haccpChecks: [
      {
        id: 'CCP-002',
        ccpId: 'CCP-COOL-001',
        name: 'Cooling Temperature',
        target: 4,
        actual: 3.8,
        unit: '°C',
        timestamp: '2023-05-10T14:15:00Z',
        passed: true,
        auditor: 'Emma Johnson',
        hazardType: 'biological',
      }
    ]
  },
  {
    id: 'BT-2023-0540',
    product: 'Wheat Flour',
    date: 'May 8, 2023',
    quantity: '1000 kg',
    status: 'In Production',
    location: 'Production Line 3',
    suppliers: [
      { id: 'SUP-003', name: 'Grain Suppliers Ltd.', auditScore: 78 }
    ],
    haccpChecks: [
      {
        id: 'CCP-003',
        ccpId: 'CCP-METAL-001',
        name: 'Metal Detection',
        target: 'Pass',
        actual: 'Pass',
        unit: '',
        timestamp: '2023-05-08T09:45:00Z',
        passed: true,
        auditor: 'Michael Brown',
        hazardType: 'physical',
      }
    ]
  }
];

// Extract CCP checks from mock batches for the CCPTimeline component
const ccpChecks = mockBatches.flatMap(batch => batch.haccpChecks);

const TraceabilityModule: React.FC = () => {
  const [selectedBatch, setSelectedBatch] = useState<BatchTrace | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Handler for recall initiation
  const handleRecallInitiate = (batch: BatchTrace) => {
    toast.error(`Recall initiated for batch ${batch.id} - ${batch.product}`);
    console.log('Initiating recall for batch:', batch);
  };

  // Handler for CCP click
  const handleCCPClick = (ccpId: string) => {
    toast.info(`Viewing CCP details for ${ccpId}`);
    console.log('Viewing CCP details for:', ccpId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Traceability Management</h1>
          <p className="text-gray-600 mt-1">Track products through your supply chain with comprehensive traceability</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Select Date Range
          </Button>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Trace
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="traces">Trace Records</TabsTrigger>
          <TabsTrigger value="ccp">CCP Monitoring</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Forward Traces</CardTitle>
                <CardDescription>Product destination tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">24</div>
                <div className="text-sm text-muted-foreground">Last 30 days</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Backward Traces</CardTitle>
                <CardDescription>Material source tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">38</div>
                <div className="text-sm text-muted-foreground">Last 30 days</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Average Trace Time</CardTitle>
                <CardDescription>Time to complete a trace</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">1.4h</div>
                <div className="text-sm text-muted-foreground">Improved by 22%</div>
              </CardContent>
            </Card>
          </div>
          
          <RecallRiskDashboard 
            batches={mockBatches} 
            onRecallInitiate={handleRecallInitiate} 
          />
        </TabsContent>
        
        <TabsContent value="ccp">
          <CCPTimeline 
            checks={ccpChecks} 
            onCCPClick={handleCCPClick} 
          />
        </TabsContent>
        
        <TabsContent value="compliance">
          <ComplianceValidation batch={selectedBatch} />
        </TabsContent>
        
        <TabsContent value="traces">
          <div className="bg-white rounded-lg border p-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-semibold">Recent Traces</h2>
                <p className="text-gray-500 text-sm">View and manage trace records</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Sliders className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  <ClipboardCheck className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left p-3 text-sm font-medium text-gray-500">Batch ID</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-500">Product</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-500">Date</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-500">Type</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-500">Status</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-500">Time</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t hover:bg-gray-50">
                    <td className="p-3 text-sm">BT-2023-0542</td>
                    <td className="p-3 text-sm">Organic Apple Juice</td>
                    <td className="p-3 text-sm">May 12, 2023</td>
                    <td className="p-3 text-sm">Forward</td>
                    <td className="p-3 text-sm">
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                        Complete
                      </Badge>
                    </td>
                    <td className="p-3 text-sm">1.2h</td>
                    <td className="p-3 text-sm">
                      <BatchDetailsDialog 
                        batch={mockBatches[0]} 
                        open={false}
                        onOpenChange={(open) => {
                          if (open) setSelectedBatch(mockBatches[0]);
                          else setSelectedBatch(null);
                        }}
                        onRecallInitiate={() => handleRecallInitiate(mockBatches[0])}
                        onViewCCP={(ccpId) => handleCCPClick(ccpId)}
                      />
                    </td>
                  </tr>
                  <tr className="border-t hover:bg-gray-50">
                    <td className="p-3 text-sm">BT-2023-0541</td>
                    <td className="p-3 text-sm">Cheese Spread</td>
                    <td className="p-3 text-sm">May 10, 2023</td>
                    <td className="p-3 text-sm">Backward</td>
                    <td className="p-3 text-sm">
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                        Complete
                      </Badge>
                    </td>
                    <td className="p-3 text-sm">0.8h</td>
                    <td className="p-3 text-sm">
                      <BatchDetailsDialog 
                        batch={mockBatches[1]}
                        open={false}
                        onOpenChange={(open) => {
                          if (open) setSelectedBatch(mockBatches[1]);
                          else setSelectedBatch(null);
                        }}
                        onRecallInitiate={() => handleRecallInitiate(mockBatches[1])}
                        onViewCCP={(ccpId) => handleCCPClick(ccpId)}
                      />
                    </td>
                  </tr>
                  <tr className="border-t hover:bg-gray-50">
                    <td className="p-3 text-sm">BT-2023-0540</td>
                    <td className="p-3 text-sm">Wheat Flour</td>
                    <td className="p-3 text-sm">May 8, 2023</td>
                    <td className="p-3 text-sm">Full</td>
                    <td className="p-3 text-sm">
                      <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
                        In Progress
                      </Badge>
                    </td>
                    <td className="p-3 text-sm">2.4h</td>
                    <td className="p-3 text-sm">
                      <BatchDetailsDialog 
                        batch={mockBatches[2]}
                        open={false}
                        onOpenChange={(open) => {
                          if (open) setSelectedBatch(mockBatches[2]);
                          else setSelectedBatch(null);
                        }}
                        onRecallInitiate={() => handleRecallInitiate(mockBatches[2])}
                        onViewCCP={(ccpId) => handleCCPClick(ccpId)}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Traceability Settings</CardTitle>
              <CardDescription>Configure your traceability system parameters</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Advanced settings configuration is under development.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Add dialog for batch details but don't show it by default */}
      <BatchDetailsDialog 
        batch={selectedBatch}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        onRecallInitiate={() => selectedBatch && handleRecallInitiate(selectedBatch)}
        onViewCCP={handleCCPClick}
      />
    </div>
  );
};

export default TraceabilityModule;
