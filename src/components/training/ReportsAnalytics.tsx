
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart3, 
  Download, 
  Calendar, 
  Users, 
  Award, 
  PieChart, 
  TrendingUp,
  FileText,
  BarChart2
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart as RePieChart, Pie, Cell } from 'recharts';

const ReportsAnalytics: React.FC = () => {
  const [dateRange, setDateRange] = useState<string>('90days');
  const [activeTab, setActiveTab] = useState<string>('overview');
  
  // Sample training compliance data
  const complianceByDepartment = [
    { name: 'Production', compliance: 82 },
    { name: 'Quality', compliance: 90 },
    { name: 'Maintenance', compliance: 76 },
    { name: 'R&D', compliance: 85 },
    { name: 'Logistics', compliance: 79 }
  ];
  
  // Sample training status data
  const trainingStatusData = [
    { name: 'Completed', value: 65, color: '#10b981' },
    { name: 'In Progress', value: 20, color: '#3b82f6' },
    { name: 'Not Started', value: 10, color: '#9ca3af' },
    { name: 'Overdue', value: 5, color: '#ef4444' }
  ];
  
  // Sample SPC competency data
  const spcCompetencyData = [
    { name: 'Control Charts', beginner: 30, intermediate: 45, advanced: 25 },
    { name: 'Process Capability', beginner: 40, intermediate: 35, advanced: 25 },
    { name: 'Root Cause Analysis', beginner: 20, intermediate: 50, advanced: 30 },
    { name: 'Measurement Systems', beginner: 35, intermediate: 40, advanced: 25 },
    { name: 'Data Collection', beginner: 25, intermediate: 45, advanced: 30 }
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Reports & Analytics</h2>
        <div className="flex space-x-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Select date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Reports
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="spc">
            <BarChart2 className="h-4 w-4 mr-1" />
            SPC Competency
          </TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatsCard 
              title="Training Compliance" 
              value="78%" 
              trend="+3% from last month"
              icon={<FileText className="h-5 w-5 text-blue-500" />}
            />
            
            <StatsCard 
              title="Employees Trained" 
              value="143" 
              trend="12 new this month"
              icon={<Users className="h-5 w-5 text-blue-500" />}
            />
            
            <StatsCard 
              title="Active Courses" 
              value="26" 
              trend="3 new courses"
              icon={<Award className="h-5 w-5 text-blue-500" />}
            />
            
            <StatsCard 
              title="Avg. Score" 
              value="82%" 
              trend="+5% improvement"
              icon={<TrendingUp className="h-5 w-5 text-blue-500" />}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 text-blue-500 mr-2" />
                  Compliance by Department
                </CardTitle>
                <CardDescription>
                  Training completion rates across departments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      width={500}
                      height={300}
                      data={complianceByDepartment}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="compliance" name="Compliance %" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="h-5 w-5 text-blue-500 mr-2" />
                  Training Status Distribution
                </CardTitle>
                <CardDescription>
                  Current status of assigned training across organization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart width={400} height={300}>
                      <Pie
                        data={trainingStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {trainingStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="compliance" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Reports</CardTitle>
              <CardDescription>
                Training compliance reports for audit preparation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-8 text-center">
                <h3 className="text-lg font-medium mb-2">Compliance Reporting</h3>
                <p className="text-muted-foreground mb-4">This section will display detailed compliance reports</p>
                <Button>Generate Compliance Report</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="spc" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart2 className="h-5 w-5 text-blue-500 mr-2" />
                SPC Training Competency Analysis
              </CardTitle>
              <CardDescription>
                Statistical Process Control knowledge and skill levels across the organization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    width={500}
                    height={300}
                    data={spcCompetencyData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="beginner" name="Beginner" stackId="a" fill="#94a3b8" />
                    <Bar dataKey="intermediate" name="Intermediate" stackId="a" fill="#3b82f6" />
                    <Bar dataKey="advanced" name="Advanced" stackId="a" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">SPC Course Effectiveness</CardTitle>
                <CardDescription>
                  Impact of SPC training on quality metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Knowledge Retention</span>
                      <span className="font-medium">86%</span>
                    </div>
                    <Progress value={86} className="h-2" />
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Practical Application</span>
                      <span className="font-medium">78%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Problem Solving Capability</span>
                      <span className="font-medium">82%</span>
                    </div>
                    <Progress value={82} className="h-2" />
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Quality Improvement Success</span>
                      <span className="font-medium">74%</span>
                    </div>
                    <Progress value={74} className="h-2" />
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t">
                  <h3 className="text-sm font-medium mb-2">Correlation with Quality KPIs</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Defect Rate Reduction</span>
                      <Badge className="bg-green-50 text-green-700">18% Improvement</Badge>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Process Stability</span>
                      <Badge className="bg-green-50 text-green-700">32% Improvement</Badge>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">First Pass Yield</span>
                      <Badge className="bg-green-50 text-green-700">12% Improvement</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">SPC Training Recommendations</CardTitle>
                <CardDescription>
                  AI-generated recommendations for improving SPC competency
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <h3 className="text-sm font-medium text-blue-700 mb-1">Focus Areas for Improvement</h3>
                    <ul className="text-sm space-y-1 list-disc list-inside text-blue-700">
                      <li>Process Capability Analysis (25% skill gap)</li>
                      <li>Measurement System Analysis (30% skill gap)</li>
                      <li>Control Chart Selection (20% skill gap)</li>
                    </ul>
                  </div>
                  
                  <div className="p-3 border rounded-md">
                    <h3 className="text-sm font-medium mb-1">Recommended Courses</h3>
                    <ul className="text-sm space-y-2">
                      <li className="flex justify-between items-center">
                        <span>Advanced Process Capability</span>
                        <Button variant="outline" size="sm">Assign</Button>
                      </li>
                      <li className="flex justify-between items-center">
                        <span>Measurement Systems Analysis</span>
                        <Button variant="outline" size="sm">Assign</Button>
                      </li>
                      <li className="flex justify-between items-center">
                        <span>Control Chart Mastery</span>
                        <Button variant="outline" size="sm">Assign</Button>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="p-3 border rounded-md">
                    <h3 className="text-sm font-medium mb-1">Departmental Focus</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Production Team</span>
                        <Badge variant="outline">Control Chart Interpretation</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Quality Team</span>
                        <Badge variant="outline">Process Capability Analysis</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Maintenance Team</span>
                        <Badge variant="outline">Root Cause Analysis</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="certifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Certification Reports</CardTitle>
              <CardDescription>
                Certification status and expiry reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-8 text-center">
                <h3 className="text-lg font-medium mb-2">Certification Reporting</h3>
                <p className="text-muted-foreground mb-4">This section will display detailed certification reports</p>
                <Button>Generate Certification Report</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface StatsCardProps {
  title: string;
  value: string;
  trend?: string;
  icon: React.ReactNode;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, trend, icon }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p className="text-xs text-muted-foreground mt-1">{trend}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ReportsAnalytics;
