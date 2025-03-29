
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, PlusCircle, Sliders, ClipboardCheck, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import CCPTimeline from '@/components/traceability/CCPTimeline';
import BatchDetailsDialog from '@/components/traceability/BatchDetailsDialog';
import RecallRiskDashboard from '@/components/traceability/RecallRiskDashboard';
import ComplianceValidation from '@/components/traceability/ComplianceValidation';

const TraceabilityModule: React.FC = () => {
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
          
          <RecallRiskDashboard />
        </TabsContent>
        
        <TabsContent value="ccp">
          <CCPTimeline />
        </TabsContent>
        
        <TabsContent value="compliance">
          <ComplianceValidation />
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
                    <td className="p-3 text-sm"><Badge variant="success">Complete</Badge></td>
                    <td className="p-3 text-sm">1.2h</td>
                    <td className="p-3 text-sm">
                      <BatchDetailsDialog batchId="BT-2023-0542" />
                    </td>
                  </tr>
                  <tr className="border-t hover:bg-gray-50">
                    <td className="p-3 text-sm">BT-2023-0541</td>
                    <td className="p-3 text-sm">Cheese Spread</td>
                    <td className="p-3 text-sm">May 10, 2023</td>
                    <td className="p-3 text-sm">Backward</td>
                    <td className="p-3 text-sm"><Badge variant="success">Complete</Badge></td>
                    <td className="p-3 text-sm">0.8h</td>
                    <td className="p-3 text-sm">
                      <BatchDetailsDialog batchId="BT-2023-0541" />
                    </td>
                  </tr>
                  <tr className="border-t hover:bg-gray-50">
                    <td className="p-3 text-sm">BT-2023-0540</td>
                    <td className="p-3 text-sm">Wheat Flour</td>
                    <td className="p-3 text-sm">May 8, 2023</td>
                    <td className="p-3 text-sm">Full</td>
                    <td className="p-3 text-sm"><Badge variant="warning">In Progress</Badge></td>
                    <td className="p-3 text-sm">2.4h</td>
                    <td className="p-3 text-sm">
                      <BatchDetailsDialog batchId="BT-2023-0540" />
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
    </div>
  );
};

export default TraceabilityModule;
