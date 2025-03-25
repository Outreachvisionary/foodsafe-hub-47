import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart, 
  PieChart, 
  LineChart, 
  Calendar, 
  Download, 
  Filter, 
  Clock, 
  AlertTriangle
} from 'lucide-react';
import { 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart as RechartsLineChart,
  Line
} from 'recharts';

interface ReportDashboardProps {
  dateRange: string;
}

const ReportDashboard: React.FC<ReportDashboardProps> = ({ dateRange }) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Sample data for charts
  const documentStatusData = [
    { name: 'Active', value: 65 },
    { name: 'Pending Approval', value: 15 },
    { name: 'In Draft', value: 10 },
    { name: 'Expired', value: 5 },
    { name: 'Obsolete', value: 5 },
  ];
  
  const auditFindingsData = [
    { name: 'Jan', nonConformities: 5, observations: 8 },
    { name: 'Feb', nonConformities: 3, observations: 6 },
    { name: 'Mar', nonConformities: 4, observations: 7 },
    { name: 'Apr', nonConformities: 2, observations: 5 },
    { name: 'May', nonConformities: 1, observations: 4 },
    { name: 'Jun', nonConformities: 0, observations: 3 },
  ];
  
  const trainingComplianceData = [
    { name: 'QA Team', compliance: 94 },
    { name: 'Production', compliance: 83 },
    { name: 'Warehouse', compliance: 78 },
    { name: 'Maintenance', compliance: 88 },
    { name: 'Management', compliance: 96 },
  ];
  
  const capaStatusData = [
    { name: 'Open', value: 12 },
    { name: 'In Progress', value: 18 },
    { name: 'Pending Verification', value: 5 },
    { name: 'Closed', value: 45 },
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A374DB'];
  
  const downloadDashboard = () => {
    console.log('Downloading dashboard...');
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              <span>Documents</span>
            </TabsTrigger>
            <TabsTrigger value="audits" className="flex items-center gap-2">
              <LineChart className="h-4 w-4" />
              <span>Audits</span>
            </TabsTrigger>
            <TabsTrigger value="training" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              <span>Training</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <TabsContent value="overview" className="mt-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Document Status</CardTitle>
              <CardDescription>Current status of all documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={documentStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {documentStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Audit Findings</CardTitle>
              <CardDescription>Recent 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={auditFindingsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="nonConformities" fill="#FF8042" name="Non-Conformities" />
                    <Bar dataKey="observations" fill="#0088FE" name="Observations" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">CAPA Status</CardTitle>
              <CardDescription>Current status of all CAPAs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={capaStatusData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {capaStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Department Training Compliance</CardTitle>
              <CardDescription>Current compliance rates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trainingComplianceData.map((dept) => (
                  <div key={dept.name} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{dept.name}</span>
                      <span className="font-medium">{dept.compliance}%</span>
                    </div>
                    <Progress value={dept.compliance} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Upcoming Compliance Deadlines</CardTitle>
              <CardDescription>Next 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 text-amber-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Food Safety Management Review</p>
                    <p className="text-sm text-gray-500">Due in 5 days - Annual Review</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-4 w-4 text-red-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Supplier Audit: Global Ingredients</p>
                    <p className="text-sm text-gray-500">Due in 12 days - High Risk Supplier</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />
                  <div>
                    <p className="font-medium">HACCP Plan Verification</p>
                    <p className="text-sm text-gray-500">Due in 18 days - Quarterly Requirement</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-medium">ISO 22000 Internal Audit</p>
                    <p className="text-sm text-gray-500">Due in 24 days - Process Area</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      
      <TabsContent value="documents" className="mt-0">
        <div className="grid grid-cols-1 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Document Overview</CardTitle>
              <CardDescription>Document analytics for {dateRange}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Document-specific analytics will be displayed here.</p>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      
      <TabsContent value="audits" className="mt-0">
        <div className="grid grid-cols-1 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Audit Overview</CardTitle>
              <CardDescription>Audit analytics for {dateRange}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Audit-specific analytics will be displayed here.</p>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      
      <TabsContent value="training" className="mt-0">
        <div className="grid grid-cols-1 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Training Overview</CardTitle>
              <CardDescription>Training analytics for {dateRange}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Training-specific analytics will be displayed here.</p>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </div>
  );
};

export default ReportDashboard;
