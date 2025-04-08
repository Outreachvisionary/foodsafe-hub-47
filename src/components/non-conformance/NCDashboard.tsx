import React, { useState, useEffect } from 'react';
import { fetchNCStats } from '@/services/nonConformanceService';
import { NCStats } from '@/types/non-conformance';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { AlertTriangle, PackageCheck, PackageX, Ban, Clock, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import NCRecentItems from './NCRecentItems';

const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];
const STATUS_COLORS = {
  'On Hold': '#f97316',
  'Under Review': '#3b82f6',
  'Released': '#22c55e', 
  'Disposed': '#6b7280'
};

const NCDashboard: React.FC = () => {
  const [stats, setStats] = useState<NCStats | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const loadStats = async () => {
      try {
        const statsData = await fetchNCStats();
        setStats(statsData);
      } catch (error) {
        console.error('Error loading non-conformance stats:', error);
        toast({
          title: 'Failed to load dashboard',
          description: 'There was an error loading the dashboard data.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [toast]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center p-10">
        <h3 className="text-lg font-medium">No data available</h3>
        <p className="text-gray-500 mt-2">
          There might be an issue fetching the dashboard data.
        </p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Refresh
        </Button>
      </div>
    );
  }

  // Prepare data for charts
  const statusData = Object.entries(stats.byStatus).map(([name, value]) => ({ name, value }));
  const categoryData = Object.entries(stats.byCategory).map(([name, value]) => ({ name, value }));
  const reasonData = Object.entries(stats.byReason).map(([name, value]) => ({ name, value }));

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Summary Cards */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Items</CardTitle>
          <AlertTriangle className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
          <p className="text-xs text-gray-500">Non-conforming items tracked</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">On Hold</CardTitle>
          <Ban className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.byStatus['On Hold'] || 0}</div>
          <p className="text-xs text-gray-500">Items requiring action</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Under Review</CardTitle>
          <Clock className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.byStatus['Under Review'] || 0}</div>
          <p className="text-xs text-gray-500">Items being evaluated</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Quantity On Hold</CardTitle>
          <Package className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalQuantityOnHold || 0}</div>
          <p className="text-xs text-gray-500">Total quantity of items on hold</p>
        </CardContent>
      </Card>

      {/* Status Distribution Chart */}
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Status Distribution</CardTitle>
          <CardDescription>
            Distribution of non-conformance items by status
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {statusData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={STATUS_COLORS[entry.name as keyof typeof STATUS_COLORS] || COLORS[index % COLORS.length]} 
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Category Distribution Chart */}
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Item Categories</CardTitle>
          <CardDescription>
            Distribution of items by category
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoryData}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recent Non-Conformance Items */}
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Recent Non-Conformance Items</CardTitle>
          <CardDescription>
            The most recently reported non-conformance items
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NCRecentItems items={stats.recentItems} onViewDetails={(id) => navigate(`/non-conformance/${id}`)} />
        </CardContent>
      </Card>

      {/* Reason Distribution Chart */}
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Non-Conformance Reasons</CardTitle>
          <CardDescription>
            Distribution of items by reason category
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={reasonData}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                layout="vertical"
              >
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={150} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Count" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Create New Button */}
      <div className="col-span-4 flex justify-center">
        <Button size="lg" onClick={() => navigate('/non-conformance/new')}>
          Create New Non-Conformance
        </Button>
      </div>
    </div>
  );
};

export default NCDashboard;
