
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { NCStats } from '@/types/non-conformance';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

interface ChartData {
  name: string;
  value: number;
  fill?: string;
}

interface NCDashboardProps {
  stats: NCStats;
  onCreateNew: () => void;
}

const NCDashboard: React.FC<NCDashboardProps> = ({ stats, onCreateNew }) => {
  // Transform data for charts
  const statusData: ChartData[] = Object.entries(stats.byStatus).map(([name, value]) => ({ 
    name, 
    value: value as number,
    fill: name === 'On Hold' ? '#f59e0b' : 
          name === 'Under Review' ? '#3b82f6' :
          name === 'Released' ? '#10b981' : '#6b7280'
  }));
  
  const categoryData: ChartData[] = Object.entries(stats.byCategory).map(([name, value]) => ({
    name: name.length > 15 ? name.substring(0, 12) + '...' : name,
    value: value as number
  }));
  
  const reasonData: ChartData[] = Object.entries(stats.byReasonCategory).map(([name, value]) => ({
    name: name.length > 15 ? name.substring(0, 12) + '...' : name,
    value: value as number
  }));
  
  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">On Hold</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.byStatus['On Hold'] || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quantity On Hold</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalQuantityOnHold || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill || `#${((index * 123456) % 0xffffff).toString(16)}`} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>By Category</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      <Button onClick={onCreateNew} className="w-full md:w-auto">
        Create New Non-Conformance
      </Button>
    </div>
  );
};

export default NCDashboard;
