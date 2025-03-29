
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, FileText, Calendar, BarChart3, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const AuditsModule = () => {
  const [selectedTab, setSelectedTab] = useState('dashboard');
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Audits & Inspections</h1>
          <p className="text-gray-600 mt-1">Manage all your internal and external audit programs</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Calendar View
          </Button>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Schedule Audit
          </Button>
        </div>
      </div>
      
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="findings">Findings</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Upcoming Audits</CardTitle>
                <CardDescription>Next 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">4</div>
                <div className="flex items-center text-sm">
                  <Clock className="mr-1 h-4 w-4 text-blue-500" />
                  <span>Next: SQF Internal - Jun 15</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Open Findings</CardTitle>
                <CardDescription>Requiring action</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">12</div>
                <div className="flex items-center text-sm">
                  <AlertCircle className="mr-1 h-4 w-4 text-red-500" />
                  <span>3 critical, 9 minor</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Compliance Rate</CardTitle>
                <CardDescription>All audits YTD</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">86%</div>
                <Progress value={86} className="h-2" />
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Audit Activity</CardTitle>
              <CardDescription>Last 5 audit activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="mr-4 mt-0.5">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="font-medium">BRC Mock Recall Exercise completed</p>
                    <p className="text-sm text-muted-foreground">May 22, 2023 by John Smith</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mr-4 mt-0.5">
                    <FileText className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-medium">SQF Internal Audit Report finalized</p>
                    <p className="text-sm text-muted-foreground">May 18, 2023 by Sarah Johnson</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mr-4 mt-0.5">
                    <AlertCircle className="h-5 w-5 text-amber-500" />
                  </div>
                  <div>
                    <p className="font-medium">3 new findings from GMP Inspection</p>
                    <p className="text-sm text-muted-foreground">May 15, 2023 by Robert Williams</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mr-4 mt-0.5">
                    <Calendar className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="font-medium">ISO 22000 Audit scheduled</p>
                    <p className="text-sm text-muted-foreground">May 12, 2023 by Amanda Lee</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mr-4 mt-0.5">
                    <BarChart3 className="h-5 w-5 text-indigo-500" />
                  </div>
                  <div>
                    <p className="font-medium">Annual Audit Performance Report generated</p>
                    <p className="text-sm text-muted-foreground">May 10, 2023 by David Chen</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="scheduled">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Scheduled Audits</CardTitle>
                  <CardDescription>Upcoming and planned audits</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Calendar className="mr-2 h-4 w-4" />
                  Calendar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left p-3 text-sm font-medium text-gray-500">Audit Type</th>
                      <th className="text-left p-3 text-sm font-medium text-gray-500">Facility</th>
                      <th className="text-left p-3 text-sm font-medium text-gray-500">Date</th>
                      <th className="text-left p-3 text-sm font-medium text-gray-500">Auditor</th>
                      <th className="text-left p-3 text-sm font-medium text-gray-500">Status</th>
                      <th className="text-left p-3 text-sm font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t hover:bg-gray-50">
                      <td className="p-3 text-sm">SQF Internal</td>
                      <td className="p-3 text-sm">Main Production</td>
                      <td className="p-3 text-sm">Jun 15, 2023</td>
                      <td className="p-3 text-sm">Sarah Johnson</td>
                      <td className="p-3 text-sm"><Badge>Scheduled</Badge></td>
                      <td className="p-3 text-sm">
                        <Button variant="ghost" size="sm">View</Button>
                      </td>
                    </tr>
                    <tr className="border-t hover:bg-gray-50">
                      <td className="p-3 text-sm">GMP Inspection</td>
                      <td className="p-3 text-sm">Packaging</td>
                      <td className="p-3 text-sm">Jun 22, 2023</td>
                      <td className="p-3 text-sm">Robert Williams</td>
                      <td className="p-3 text-sm"><Badge>Scheduled</Badge></td>
                      <td className="p-3 text-sm">
                        <Button variant="ghost" size="sm">View</Button>
                      </td>
                    </tr>
                    <tr className="border-t hover:bg-gray-50">
                      <td className="p-3 text-sm">ISO 22000</td>
                      <td className="p-3 text-sm">All Facilities</td>
                      <td className="p-3 text-sm">Jul 10, 2023</td>
                      <td className="p-3 text-sm">External - TÜV</td>
                      <td className="p-3 text-sm"><Badge variant="outline">Confirmed</Badge></td>
                      <td className="p-3 text-sm">
                        <Button variant="ghost" size="sm">View</Button>
                      </td>
                    </tr>
                    <tr className="border-t hover:bg-gray-50">
                      <td className="p-3 text-sm">HACCP Verification</td>
                      <td className="p-3 text-sm">Processing</td>
                      <td className="p-3 text-sm">Jul 18, 2023</td>
                      <td className="p-3 text-sm">David Chen</td>
                      <td className="p-3 text-sm"><Badge>Scheduled</Badge></td>
                      <td className="p-3 text-sm">
                        <Button variant="ghost" size="sm">View</Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="completed">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Completed Audits</CardTitle>
                  <CardDescription>Review past audit results</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <FileText className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Completed audits module is under development. Check back soon for access to historical audit data.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="findings">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Audit Findings</CardTitle>
                  <CardDescription>Track and resolve audit findings</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Filter by Severity
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Audit findings management module is under development. Check back soon for comprehensive findings tracking.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Audit Reports</CardTitle>
                  <CardDescription>Analytics and trend reports</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Generate Report
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Audit reporting module is under development. Check back soon for comprehensive audit analytics.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuditsModule;
