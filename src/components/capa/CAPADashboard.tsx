import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { ChevronUp, Clock, AlertTriangle, ClipboardCheck, CheckCircle, FileText, Loader2 } from 'lucide-react';
import { CAPAStats, CAPAPriority, CAPASource } from '@/types/capa';
import { createEmptyCAPAPriorityRecord, createEmptyCAPASourceRecord } from '@/utils/typeAdapters';
import { getCAPAStats } from '@/services/capaService';

// Define the props interface for CAPADashboard
interface CAPADashboardProps {
  stats?: CAPAStats;
}

const CAPADashboard: React.FC<CAPADashboardProps> = ({ stats: initialStats }) => {
  const [stats, setStats] = useState<CAPAStats | null>(null);
  const [loading, setLoading] = useState(!initialStats);
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  
  useEffect(() => {
    if (initialStats) {
      setStats(initialStats);
      setLoading(false);
    } else {
      // If no stats provided, initialize with empty values
      const emptyStats: CAPAStats = {
        total: 0,
        open: 0,
        inProgress: 0,
        completed: 0,
        overdue: 0,
        byPriority: createEmptyCAPAPriorityRecord(),
        bySource: createEmptyCAPASourceRecord(),
        byDepartment: {},
        recentActivities: []
      };
      setStats(emptyStats);
      fetchStats();
    }
  }, [initialStats]);
  
  useEffect(() => {
    fetchStats();
  }, [dateRange]);
  
  const fetchStats = async () => {
    try {
      setLoading(true);
      // In a real implementation, we would pass dateRange to the API
      const fetchedStats = await getCAPAStats(dateRange);
      setStats(fetchedStats);
    } catch (error) {
      console.error("Error fetching CAPA stats:", error);
      // If fetch fails, keep using initial stats or empty stats
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center p-10">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="ml-2">Loading CAPA statistics...</p>
      </div>
    );
  }
  
  if (!stats) {
    return (
      <div className="text-center p-10 bg-gray-50 rounded-lg">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
        <h3 className="text-lg font-semibold">No Data Available</h3>
        <p className="text-gray-500">
          There is no CAPA data available to display.
        </p>
      </div>
    );
  }
  
  // Calculate percentages for pie charts
  const priorityData = Object.entries(stats.byPriority).map(([priority, count]) => ({
    name: priority.replace(/_/g, ' '),
    value: count
  }));
  
  const sourceData = Object.entries(stats.bySource).map(([source, count]) => ({
    name: source.replace(/_/g, ' '),
    value: count
  }));
  
  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD', '#5DADE2', '#45B39D'];
  
  const statusData = [
    { name: 'Open', value: stats.open || 0 },
    { name: 'In Progress', value: stats.inProgress || 0 },
    { name: 'Completed', value: stats.completed || 0 },
    { name: 'Overdue', value: stats.overdue || 0 }
  ];
  
  // Mock data for trend chart (in a real app, this would come from the API)
  const trendData = [
    { name: 'Jan', open: 4, closed: 2 },
    { name: 'Feb', open: 3, closed: 4 },
    { name: 'Mar', open: 6, closed: 3 },
    { name: 'Apr', open: 5, closed: 6 },
    { name: 'May', open: 7, closed: 4 },
    { name: 'Jun', open: 4, closed: 5 }
  ];
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Open CAPAs</p>
                <p className="text-3xl font-bold mt-1">{stats.open}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-700" />
              </div>
            </div>
            <div className="mt-4 text-sm text-green-600 flex items-center">
              <ChevronUp className="h-4 w-4 mr-1" />
              <span>{Math.round((stats.open / stats.total) * 100) || 0}% of total</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Overdue</p>
                <p className="text-3xl font-bold mt-1">{stats.overdue}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-700" />
              </div>
            </div>
            <div className="mt-4 text-sm text-red-600 flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>Requires immediate attention</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Completed</p>
                <p className="text-3xl font-bold mt-1">{stats.completed}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-700" />
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600 flex items-center">
              <ClipboardCheck className="h-4 w-4 mr-1" />
              <span>{stats.completed} CAPAs successfully closed</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Effectiveness Rate</p>
                <p className="text-3xl font-bold mt-1">75%</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-amber-700" />
              </div>
            </div>
            <div className="mt-4 text-sm text-amber-600 flex items-center">
              <ChevronUp className="h-4 w-4 mr-1" />
              <span>5% increase from previous period</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>CAPA Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>CAPA by Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={priorityData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8">
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>CAPA by Source</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {sourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>CAPA Trend (Last 6 Months)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={trendData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="open" stroke="#8884d8" activeDot={{ r: 8 }} name="New CAPAs" />
                  <Line type="monotone" dataKey="closed" stroke="#82ca9d" name="Closed CAPAs" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Overdue CAPAs</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.overdue === 0 ? (
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold">No Overdue CAPAs</h3>
              <p className="text-gray-500">
                All CAPAs are currently on track. Great job!
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span>Overdue CAPAs</span>
                <span>{stats.overdue} of {stats.total} ({Math.round((stats.overdue / stats.total) * 100)}%)</span>
              </div>
              {/* This would be a list of overdue CAPAs in a real implementation */}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CAPADashboard;
