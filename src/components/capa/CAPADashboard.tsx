
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { BarChart, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CAPAStats, CAPA } from '@/types/capa';
import { getRecentCAPAs } from '@/services/capaService';

// Create an interface for CapaOverviewChart to avoid future prop type issues
interface CapaOverviewChartProps {
  data: {
    open: number;
    inProgress: number;
    closed: number;
    verified: number;
    overdue: number;
    pendingVerification: number;
  };
}

interface CAPADashboardProps {
  stats: CAPAStats;
}

const CAPADashboard: React.FC<CAPADashboardProps> = ({ stats }) => {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'quarter'>('month');
  const [recentCapas, setRecentCapas] = useState<CAPA[]>([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const loadRecentCapas = async () => {
      setLoading(true);
      try {
        const data = await getRecentCAPAs(5);
        setRecentCapas(data);
      } catch (error) {
        console.error('Error fetching recent CAPAs:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadRecentCapas();
  }, []);
  
  // Prepare data for the bar chart - CAPA by status
  const statusData = [
    { status: 'Open', count: stats.open },
    { status: 'In Progress', count: stats.inProgress },
    { status: 'Completed', count: stats.completed },
    { status: 'Overdue', count: stats.overdue },
  ];
  
  // Prepare data for pie chart - CAPA by priority
  const priorityData = Object.entries(stats.byPriority).map(([priority, count]) => ({
    name: priority,
    value: count,
  }));
  
  // Prepare data for pie chart - CAPA by source
  const sourceData = Object.entries(stats.bySource).map(([source, count]) => ({
    name: source.replace(/_/g, ' '),
    value: count,
  }));

  // COLORS array for the charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A374DB'];
  
  // Prepare data for line chart - CAPAs over time (dummy data for now)
  const getTimeData = () => {
    if (timeframe === 'week') {
      return [
        { name: 'Mon', value: 5 },
        { name: 'Tue', value: 8 },
        { name: 'Wed', value: 3 },
        { name: 'Thu', value: 7 },
        { name: 'Fri', value: 9 },
        { name: 'Sat', value: 2 },
        { name: 'Sun', value: 0 },
      ];
    } else if (timeframe === 'month') {
      return [
        { name: 'Week 1', value: 12 },
        { name: 'Week 2', value: 8 },
        { name: 'Week 3', value: 15 },
        { name: 'Week 4', value: 7 },
      ];
    } else {
      return [
        { name: 'Jan', value: 20 },
        { name: 'Feb', value: 30 },
        { name: 'Mar', value: 15 },
      ];
    }
  };
  
  const timelineData = getTimeData();
  
  // Function to format status for display
  const formatStatus = (status: string): string => {
    return status.replace(/_/g, ' ');
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Total CAPAs</CardTitle>
            <CardDescription>All time</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Open CAPAs</CardTitle>
            <CardDescription>Awaiting action</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-500">{stats.open}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Overdue</CardTitle>
            <CardDescription>Past due date</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-500">{stats.overdue}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Completed</CardTitle>
            <CardDescription>Successfully closed</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-500">{stats.completed}</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>CAPA Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData} margin={{ top: 10, right: 10, bottom: 50, left: 60 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" name="Count" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>CAPA Priority Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>CAPA Source Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>CAPA Timeline</CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant={timeframe === 'week' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeframe('week')}
              >
                Week
              </Button>
              <Button
                variant={timeframe === 'month' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeframe('month')}
              >
                Month
              </Button>
              <Button
                variant={timeframe === 'quarter' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeframe('quarter')}
              >
                Quarter
              </Button>
            </div>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData} margin={{ top: 10, right: 20, bottom: 50, left: 60 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#8884d8" name="CAPAs" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      {/* Department Performance chart */}
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Department Performance</CardTitle>
            <CardDescription>CAPA completion rate by department</CardDescription>
          </CardHeader>
          <CardContent className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={[
                  { department: 'QA', completed: 85, overdue: 15 },
                  { department: 'Production', completed: 70, overdue: 30 },
                  { department: 'Maintenance', completed: 90, overdue: 10 },
                  { department: 'Food Safety', completed: 95, overdue: 5 },
                  { department: 'Logistics', completed: 60, overdue: 40 },
                  { department: 'R&D', completed: 80, overdue: 20 },
                ]}
                margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="department" />
                <Tooltip />
                <Legend />
                <Bar dataKey="completed" stackId="a" fill="#4caf50" name="Completed" />
                <Bar dataKey="overdue" stackId="a" fill="#f44336" name="Overdue" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent CAPA Activities */}
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent CAPA Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="created">Created</TabsTrigger>
                <TabsTrigger value="updated">Updated</TabsTrigger>
                <TabsTrigger value="closed">Closed</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="space-y-4">
                {loading ? (
                  <p className="text-center py-4">Loading recent activities...</p>
                ) : recentCapas.length > 0 ? (
                  recentCapas.map((capa) => (
                    <div key={capa.id} className="flex items-start space-x-4 p-3 rounded-md border">
                      <div className="flex-1">
                        <p className="font-medium">{capa.title}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {capa.description?.length > 100
                            ? capa.description.substring(0, 100) + '...'
                            : capa.description}
                        </p>
                        <div className="flex items-center text-xs text-muted-foreground mt-2 space-x-2">
                          <span>Status: {formatStatus(capa.status)}</span>
                          <span>•</span>
                          <span>Created: {new Date(capa.created_at).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>Assigned to: {capa.assigned_to}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-4">No recent activities found</p>
                )}
              </TabsContent>
              
              <TabsContent value="created" className="space-y-4">
                <p className="text-center py-4">No recent creations</p>
              </TabsContent>
              
              <TabsContent value="updated" className="space-y-4">
                <p className="text-center py-4">No recent updates</p>
              </TabsContent>
              
              <TabsContent value="closed" className="space-y-4">
                <p className="text-center py-4">No recent closures</p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CAPADashboard;
