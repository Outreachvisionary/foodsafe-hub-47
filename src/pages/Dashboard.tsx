
import React from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  FileText, 
  CalendarDays,
  ListChecks,
  AlertCircle,
  ShieldCheck,
  Users
} from 'lucide-react';

// Placeholder chart component
const Chart = () => (
  <div className="w-full h-60 bg-gradient-to-r from-fsms-blue/5 to-fsms-indigo/5 rounded-md flex items-center justify-center">
    <BarChart className="h-12 w-12 text-fsms-blue/30" />
    <span className="ml-2 text-gray-400">Compliance Trend Chart</span>
  </div>
);

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader 
        title="FSMS Dashboard" 
        subtitle="Welcome back! Here's an overview of your food safety compliance." 
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="w-full animate-fade-in">
          <TabsList className="mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sqf">SQF</TabsTrigger>
            <TabsTrigger value="iso22000">ISO 22000</TabsTrigger>
            <TabsTrigger value="fssc22000">FSSC 22000</TabsTrigger>
            <TabsTrigger value="haccp">HACCP</TabsTrigger>
            <TabsTrigger value="brcgs2">BRC GS2</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="animate-scale-in">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    Overall Compliance
                  </CardTitle>
                  <CardDescription>Across all standards</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-fsms-dark mb-2">87%</div>
                  <Progress value={87} className="h-2" />
                  <p className="text-sm text-gray-500 mt-2">+2.5% from last month</p>
                </CardContent>
              </Card>
              
              <Card className="animate-scale-in delay-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium flex items-center">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                    Open Issues
                  </CardTitle>
                  <CardDescription>Requires attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-fsms-dark mb-2">12</div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Critical: 2</span>
                    <span className="text-gray-500">Major: 4</span>
                    <span className="text-gray-500">Minor: 6</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="animate-scale-in delay-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium flex items-center">
                    <Clock className="h-5 w-5 text-fsms-blue mr-2" />
                    Upcoming Audits
                  </CardTitle>
                  <CardDescription>Next 30 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-fsms-dark mb-2">3</div>
                  <div className="space-y-1">
                    <div className="text-sm text-gray-500 flex justify-between">
                      <span>SQF Internal Audit</span>
                      <span>May 15</span>
                    </div>
                    <div className="text-sm text-gray-500 flex justify-between">
                      <span>HACCP Verification</span>
                      <span>May 22</span>
                    </div>
                    <div className="text-sm text-gray-500 flex justify-between">
                      <span>ISO 22000 Surveillance</span>
                      <span>Jun 05</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 animate-fade-in delay-300">
                <CardHeader>
                  <CardTitle>Compliance Trend</CardTitle>
                  <CardDescription>Last 6 months performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <Chart />
                </CardContent>
              </Card>
              
              <Card className="animate-fade-in delay-400">
                <CardHeader>
                  <CardTitle>Document Status</CardTitle>
                  <CardDescription>Policy & procedure updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">Current</span>
                        <span className="text-sm text-gray-500">32</span>
                      </div>
                      <Progress value={80} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">Needs Review</span>
                        <span className="text-sm text-gray-500">5</span>
                      </div>
                      <Progress value={12} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">Outdated</span>
                        <span className="text-sm text-gray-500">3</span>
                      </div>
                      <Progress value={8} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in delay-500">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between">
                    <span>Recent Activities</span>
                    <FileText className="h-5 w-5 text-gray-400" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { icon: <ListChecks className="h-4 w-4" />, action: "Updated HACCP Plan", time: "2 hours ago", user: "John D." },
                      { icon: <AlertCircle className="h-4 w-4" />, action: "New non-conformance reported", time: "5 hours ago", user: "Maria S." },
                      { icon: <ShieldCheck className="h-4 w-4" />, action: "Completed SQF internal audit", time: "Yesterday", user: "Robert K." },
                      { icon: <CalendarDays className="h-4 w-4" />, action: "Scheduled BRC audit", time: "2 days ago", user: "Sarah L." }
                    ].map((item, i) => (
                      <div key={i} className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-fsms-blue/10 flex items-center justify-center text-fsms-blue mr-3">
                          {item.icon}
                        </div>
                        <div>
                          <div className="text-sm font-medium">{item.action}</div>
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <span>{item.time}</span>
                            <span className="inline-block w-1 h-1 rounded-full bg-gray-300"></span>
                            <span>{item.user}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between">
                    <span>Team Performance</span>
                    <Users className="h-5 w-5 text-gray-400" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "Quality Assurance", progress: 92 },
                      { name: "Production", progress: 78 },
                      { name: "Maintenance", progress: 85 },
                      { name: "Receiving & Storage", progress: 64 }
                    ].map((team, i) => (
                      <div key={i}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">{team.name}</span>
                          <span className="text-sm text-gray-500">{team.progress}%</span>
                        </div>
                        <Progress value={team.progress} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="sqf">
            <div className="h-64 flex items-center justify-center text-lg text-gray-400">
              SQF Dashboard Content (Coming Soon)
            </div>
          </TabsContent>
          
          <TabsContent value="iso22000">
            <div className="h-64 flex items-center justify-center text-lg text-gray-400">
              ISO 22000 Dashboard Content (Coming Soon)
            </div>
          </TabsContent>
          
          <TabsContent value="fssc22000">
            <div className="h-64 flex items-center justify-center text-lg text-gray-400">
              FSSC 22000 Dashboard Content (Coming Soon)
            </div>
          </TabsContent>
          
          <TabsContent value="haccp">
            <div className="h-64 flex items-center justify-center text-lg text-gray-400">
              HACCP Dashboard Content (Coming Soon)
            </div>
          </TabsContent>
          
          <TabsContent value="brcgs2">
            <div className="h-64 flex items-center justify-center text-lg text-gray-400">
              BRC GS2 Dashboard Content (Coming Soon)
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
