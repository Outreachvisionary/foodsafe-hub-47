
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  FileText, 
  Users, 
  ClipboardCheck, 
  AlertTriangle, 
  TrendingUp,
  TrendingDown,
  Calendar,
  Info
} from 'lucide-react';
import { ResponsiveContainer, BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart as RePieChart, Pie, Cell } from 'recharts';

interface ReportDashboardProps {
  dateRange: string;
}

const ReportDashboard: React.FC<ReportDashboardProps> = ({ dateRange }) => {
  // Sample document data
  const documentStatusData = [
    { name: 'Approved', value: 65, color: '#10b981' },
    { name: 'Pending Approval', value: 15, color: '#3b82f6' },
    { name: 'Draft', value: 10, color: '#9ca3af' },
    { name: 'Expired', value: 5, color: '#ef4444' },
    { name: 'Archived', value: 5, color: '#6b7280' },
  ];
  
  // Sample audit data
  const auditFindingsData = [
    { name: 'Food Safety', critical: 2, major: 4, minor: 8 },
    { name: 'GMP', critical: 1, major: 3, minor: 5 },
    { name: 'Sanitation', critical: 0, major: 6, minor: 7 },
    { name: 'HACCP', critical: 3, major: 2, minor: 4 },
    { name: 'Quality', critical: 0, major: 5, minor: 9 },
  ];
  
  // Sample CAPA data
  const capaStatusData = [
    { status: 'Open', count: 12, color: '#ef4444' },
    { status: 'In Progress', count: 18, color: '#3b82f6' },
    { status: 'Closed', count: 15, color: '#10b981' },
    { status: 'Verified', count: 5, color: '#6b7280' },
  ];
  
  // Sample training data
  const trainingComplianceData = [
    { name: 'Production', compliance: 82 },
    { name: 'Quality', compliance: 90 },
    { name: 'Maintenance', compliance: 76 },
    { name: 'R&D', compliance: 85 },
    { name: 'Logistics', compliance: 79 }
  ];
  
  // Metrics
  const metrics = [
    { 
      name: 'Document Compliance',
      value: '92%',
      change: '+3%',
      trending: 'up',
      info: '% of documents that are current and approved'
    },
    { 
      name: 'Audit Completion',
      value: '88%',
      change: '+5%',
      trending: 'up',
      info: '% of scheduled audits completed on time'
    },
    { 
      name: 'CAPA Closure Rate',
      value: '76%',
      change: '-2%',
      trending: 'down',
      info: '% of CAPAs closed within target date'
    },
    { 
      name: 'Training Compliance',
      value: '85%',
      change: '+4%',
      trending: 'up',
      info: '% of required training completed'
    },
    { 
      name: 'HACCP Compliance',
      value: '98%',
      change: '+1%',
      trending: 'up',
      info: '% of CCP monitoring performed as scheduled'
    },
    { 
      name: 'Complaint Resolution',
      value: '79%',
      change: '+6%',
      trending: 'up',
      info: '% of complaints resolved within SLA'
    },
  ];
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map((metric, index) => (
          <MetricCard
            key={index}
            name={metric.name}
            value={metric.value}
            change={metric.change}
            trending={metric.trending as 'up' | 'down'}
            info={metric.info}
          />
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 text-blue-500 mr-2" />
              Document Status Overview
            </CardTitle>
            <CardDescription>
              Document distribution by current status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart width={400} height={300}>
                  <Pie
                    data={documentStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {documentStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </RePieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Documents expiring this month:</span>
                <Badge variant="destructive">12</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Documents pending approval:</span>
                <Badge variant="outline" className="bg-blue-50 text-blue-700">15</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ClipboardCheck className="h-5 w-5 text-blue-500 mr-2" />
              Audit Findings
            </CardTitle>
            <CardDescription>
              Non-conformities by category and severity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ReBarChart
                  width={500}
                  height={300}
                  data={auditFindingsData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="critical" name="Critical" fill="#ef4444" />
                  <Bar dataKey="major" name="Major" fill="#f59e0b" />
                  <Bar dataKey="minor" name="Minor" fill="#3b82f6" />
                </ReBarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total open findings:</span>
                <Badge variant="destructive">24</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Average days to close:</span>
                <Badge variant="outline">14.5 days</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-blue-500 mr-2" />
              CAPA Status
            </CardTitle>
            <CardDescription>
              Corrective and preventive actions by status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {capaStatusData.map((item, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{item.status}</span>
                    <span className="font-medium">{item.count} ({Math.round(item.count / capaStatusData.reduce((sum, i) => sum + i.count, 0) * 100)}%)</span>
                  </div>
                  <Progress value={item.count / capaStatusData.reduce((sum, i) => sum + i.count, 0) * 100} className="h-2" indicatorClassName={`bg-[${item.color}]`} />
                </div>
              ))}
              
              <div className="pt-4 mt-4 border-t">
                <div className="text-sm font-medium mb-2">Key CAPA Metrics</div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="text-sm text-gray-500">Average Time to Close</div>
                    <div className="text-xl font-bold">18.5 days</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="text-sm text-gray-500">Overdue CAPAs</div>
                    <div className="text-xl font-bold text-red-500">7</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 text-blue-500 mr-2" />
              Training Compliance
            </CardTitle>
            <CardDescription>
              Training completion rates by department
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ReBarChart
                  width={500}
                  height={300}
                  data={trainingComplianceData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="compliance" name="Compliance %" fill="#3b82f6" />
                </ReBarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="pt-4 mt-4 border-t">
              <div className="text-sm font-medium mb-2">Upcoming Certifications</div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">PCQI Certification Renewals</span>
                  <Badge className="bg-amber-50 text-amber-700">8 due this month</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">HACCP Training</span>
                  <Badge className="bg-amber-50 text-amber-700">12 due next month</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

interface MetricCardProps {
  name: string;
  value: string;
  change: string;
  trending: 'up' | 'down';
  info: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ name, value, change, trending, info }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          {name}
          <Button variant="ghost" className="h-6 w-6 p-0" asChild>
            <div title={info}>
              <Info className="h-4 w-4 text-gray-400" />
            </div>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className={`text-xs flex items-center ${trending === 'up' ? 'text-green-500' : 'text-red-500'}`}>
          {trending === 'up' ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
          <span>{change} from previous period</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportDashboard;
