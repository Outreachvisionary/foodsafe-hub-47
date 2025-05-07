import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Activity, AlertTriangle, BarChart, Calendar, ChevronDown, Clock, FileCheck, LineChart, PieChart, Plus, Settings, Target, TrendingDown, TrendingUp, BarChart2, CheckCircle2 } from 'lucide-react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart as RechartsLineChart, Line } from 'recharts';
import DashboardHeader from '@/components/DashboardHeader';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

// Mock data for charts
const productionData = [
  { month: 'Jan', target: 100, actual: 87 },
  { month: 'Feb', target: 100, actual: 92 },
  { month: 'Mar', target: 100, actual: 105 },
  { month: 'Apr', target: 100, actual: 110 },
  { month: 'May', target: 100, actual: 98 },
  { month: 'Jun', target: 100, actual: 115 },
];

const qualityData = [
  { month: 'Jan', defectRate: 2.1, returnRate: 0.8 },
  { month: 'Feb', defectRate: 1.8, returnRate: 0.7 },
  { month: 'Mar', defectRate: 1.9, returnRate: 0.9 },
  { month: 'Apr', defectRate: 1.5, returnRate: 0.6 },
  { month: 'May', defectRate: 1.2, returnRate: 0.5 },
  { month: 'Jun', defectRate: 1.0, returnRate: 0.4 },
];

const safetyData = [
  { month: 'Jan', incidents: 3, nearMisses: 7 },
  { month: 'Feb', incidents: 1, nearMisses: 5 },
  { month: 'Mar', incidents: 2, nearMisses: 6 },
  { month: 'Apr', incidents: 0, nearMisses: 4 },
  { month: 'May', incidents: 1, nearMisses: 3 },
  { month: 'Jun', incidents: 0, nearMisses: 2 },
];

// KPI card component
const KPICard = ({ 
  title, 
  value, 
  target, 
  unit = "", 
  trend = 0, 
  trendPeriod = "vs. last month",
  icon: Icon,
  progressValue = 0,
}) => {
  const isPositiveTrend = trend >= 0;
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-8 w-8 rounded-full bg-primary/20 p-1.5 text-primary">
          <Icon className="h-full w-full" />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-baseline">
          <div className="text-2xl font-bold">
            {value}{unit}
          </div>
          {target !== undefined && (
            <div className="ml-2 text-sm text-muted-foreground">
              / {target}{unit} target
            </div>
          )}
        </div>
        
        {progressValue > 0 && (
          <div className="space-y-1">
            <Progress value={progressValue} className="h-2" />
            <div className="text-xs text-muted-foreground">
              {progressValue}% {progressValue >= 100 ? 'achieved' : 'of target'}
            </div>
          </div>
        )}
        
        {trend !== undefined && (
          <div className={`flex items-center text-sm ${isPositiveTrend ? 'text-green-600' : 'text-red-600'}`}>
            {isPositiveTrend ? 
              <TrendingUp className="mr-1 h-4 w-4" /> : 
              <TrendingDown className="mr-1 h-4 w-4" />
            }
            <span>{isPositiveTrend ? '+' : ''}{trend}% {trendPeriod}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const KPIs = () => {
  const [timeframe, setTimeframe] = useState('monthly');
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <DashboardHeader
          title={
            <div className="flex items-center gap-2">
              <Target className="h-8 w-8 text-primary" />
              <span>Key Performance Indicators</span>
            </div>
          }
          subtitle="Monitor and analyze your organization's critical metrics"
          className="mb-0"
        />
        
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {timeframe === 'monthly' ? 'Monthly' : timeframe === 'quarterly' ? 'Quarterly' : 'Yearly'}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Select Timeframe</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setTimeframe('monthly')}>Monthly</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeframe('quarterly')}>Quarterly</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeframe('yearly')}>Yearly</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add KPI
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New KPI</DialogTitle>
                <DialogDescription>
                  Create a new key performance indicator to track in your dashboard.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="kpi-name">KPI Name</Label>
                  <Input id="kpi-name" placeholder="e.g. Production Efficiency" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="kpi-category">Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="production">Production</SelectItem>
                      <SelectItem value="quality">Quality</SelectItem>
                      <SelectItem value="safety">Safety</SelectItem>
                      <SelectItem value="compliance">Compliance</SelectItem>
                      <SelectItem value="financial">Financial</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="kpi-measurement">Measurement Unit</Label>
                  <Input id="kpi-measurement" placeholder="e.g. %, kg, hours" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="kpi-target">Target Value</Label>
                  <Input id="kpi-target" type="number" placeholder="e.g. 95" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="kpi-frequency">Measurement Frequency</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="alerts">Enable Alerts</Label>
                    <p className="text-sm text-muted-foreground">Get notified when KPI is below target</p>
                  </div>
                  <Switch id="alerts" />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button>Create KPI</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPICard 
          title="Production Efficiency" 
          value={92} 
          target={95}
          unit="%"
          trend={3.5}
          progressValue={92 / 95 * 100}
          icon={LineChart}
        />
        <KPICard 
          title="Quality Compliance" 
          value={98.5} 
          target={99}
          unit="%"
          trend={0.5}
          progressValue={98.5 / 99 * 100}
          icon={CheckCircle2}
        />
        <KPICard 
          title="Safety Incidents" 
          value={1} 
          target={0}
          trend={-50}
          progressValue={0}
          icon={AlertTriangle}
        />
        <KPICard 
          title="On-Time Delivery" 
          value={94.2} 
          target={95}
          unit="%"
          trend={-1.8}
          progressValue={94.2 / 95 * 100}
          icon={Clock}
        />
      </div>

      <Tabs defaultValue="production" className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="production">Production</TabsTrigger>
          <TabsTrigger value="quality">Quality</TabsTrigger>
          <TabsTrigger value="safety">Safety</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="production" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Production Efficiency vs Target</CardTitle>
              <CardDescription>Monthly production efficiency compared to target</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={productionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 120]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="actual" name="Actual" fill="#3b82f6" />
                    <Bar dataKey="target" name="Target" fill="#93c5fd" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Production Volume</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">28,429 kg</div>
                <p className="text-xs text-muted-foreground mb-1">vs. 25,123 kg last month</p>
                <div className="flex items-center text-sm text-green-600">
                  <TrendingUp className="mr-1 h-4 w-4" />
                  <span>+13.2% increase</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Equipment Downtime</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.2 hrs</div>
                <p className="text-xs text-muted-foreground mb-1">vs. 6.8 hrs last month</p>
                <div className="flex items-center text-sm text-green-600">
                  <TrendingDown className="mr-1 h-4 w-4" />
                  <span>-38.2% decrease</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Materials Utilization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">93.8%</div>
                <p className="text-xs text-muted-foreground mb-1">vs. 92.5% last month</p>
                <div className="flex items-center text-sm text-green-600">
                  <TrendingUp className="mr-1 h-4 w-4" />
                  <span>+1.4% increase</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="quality" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quality Metrics Trend</CardTitle>
              <CardDescription>Defect rate and return rate over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={qualityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="defectRate" name="Defect Rate %" stroke="#3b82f6" />
                    <Line type="monotone" dataKey="returnRate" name="Return Rate %" stroke="#f59e0b" />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">First-Time Pass Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">98.2%</div>
                <div className="text-xs text-muted-foreground mb-1">Target: 99%</div>
                <Progress value={98.2} className="h-2" />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Customer Complaints</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground mb-1">vs. 17 last month</p>
                <div className="flex items-center text-sm text-green-600">
                  <TrendingDown className="mr-1 h-4 w-4" />
                  <span>-29.4% decrease</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">On-Time Testing Completion</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">94.7%</div>
                <div className="text-xs text-muted-foreground mb-1">Target: 95%</div>
                <Progress value={94.7 / 95 * 100} className="h-2" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="safety" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Safety Incidents</CardTitle>
              <CardDescription>Incidents and near misses by month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={safetyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="incidents" name="Reportable Incidents" fill="#ef4444" />
                    <Bar dataKey="nearMisses" name="Near Misses" fill="#f59e0b" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Days Since Last Incident</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42</div>
                <p className="text-xs text-muted-foreground">Best record: 87 days</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Safety Training Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">96.5%</div>
                <div className="text-xs text-muted-foreground mb-1">Target: 100%</div>
                <Progress value={96.5} className="h-2" />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Open Safety Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">7</div>
                <div className="text-xs text-muted-foreground">3 high priority</div>
                <div className="flex items-center text-sm text-amber-600 mt-1">
                  <Clock className="mr-1 h-4 w-4" />
                  <span>2 past due</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="compliance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Overview</CardTitle>
              <CardDescription>Key compliance metrics and status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <FileCheck className="h-5 w-5 text-green-500" />
                      <span className="font-medium">Document Compliance</span>
                    </div>
                    <span className="font-bold">98.3%</span>
                  </div>
                  <Progress value={98.3} className="h-2" />
                  <p className="text-xs text-muted-foreground">5 documents pending approval</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <BarChart2 className="h-5 w-5 text-green-500" />
                      <span className="font-medium">Audit Findings</span>
                    </div>
                    <span className="font-bold">3 open</span>
                  </div>
                  <Progress value={85} className="h-2" />
                  <p className="text-xs text-muted-foreground">17 closed, 3 open out of 20 total</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-amber-500" />
                      <span className="font-medium">Training Compliance</span>
                    </div>
                    <span className="font-bold">92.7%</span>
                  </div>
                  <Progress value={92.7} className="h-2" />
                  <p className="text-xs text-muted-foreground">15 employees with overdue training</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <PieChart className="h-5 w-5 text-green-500" />
                      <span className="font-medium">Regulatory Requirements</span>
                    </div>
                    <span className="font-bold">100%</span>
                  </div>
                  <Progress value={100} className="h-2" />
                  <p className="text-xs text-muted-foreground">All regulatory requirements fulfilled</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Latest Compliance Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-green-100 text-green-700 p-1.5 rounded-full">
                      <FileCheck className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">Annual HACCP Review Completed</p>
                      <p className="text-sm text-muted-foreground">Completed 3 days ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 text-blue-700 p-1.5 rounded-full">
                      <BarChart className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">ISO 22000 Internal Audit</p>
                      <p className="text-sm text-muted-foreground">Completed 1 week ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-amber-100 text-amber-700 p-1.5 rounded-full">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">Chemical Safety Policy Update</p>
                      <p className="text-sm text-muted-foreground">Due in 2 days</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Compliance Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-amber-100 text-amber-700 p-1.5 rounded-full">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <p className="font-medium">Supplier Audit Program Review</p>
                        <Badge>Jun 15</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Annual review of supplier audit program</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-amber-100 text-amber-700 p-1.5 rounded-full">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <p className="font-medium">Food Defense Training</p>
                        <Badge>Jun 22</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Refresher training for all employees</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-amber-100 text-amber-700 p-1.5 rounded-full">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <p className="font-medium">Management Review Meeting</p>
                        <Badge>Jun 30</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Quarterly quality management system review</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default KPIs;
