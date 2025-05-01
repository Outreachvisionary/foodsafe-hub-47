
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CAPAStats } from '@/types/capa';

interface CAPADashboardProps {
  stats: CAPAStats;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1', '#a4de6c', '#d0ed57'];

const CAPADashboard: React.FC<CAPADashboardProps> = ({ stats }) => {
  // Convert objects to arrays for charts
  const priorityData = Object.entries(stats.byPriority).map(([name, value]) => ({ name, value }));
  const sourceData = Object.entries(stats.bySource).map(([name, value]) => ({ name: name.replace(/_/g, ' '), value }));
  const departmentData = Object.entries(stats.byDepartment).map(([name, value]) => ({ name, value }));
  
  // Current Performance KPIs
  const completionRate = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;
  const overdueRate = stats.total > 0 ? (stats.overdue / stats.total) * 100 : 0;
  
  return (
    <div className="space-y-6">
      {/* Summary KPIs */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total CAPAs</CardDescription>
            <CardTitle className="text-3xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Open CAPAs</CardDescription>
            <CardTitle className="text-3xl">{stats.open}</CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>In Progress</CardDescription>
            <CardTitle className="text-3xl">{stats.inProgress}</CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Completed</CardDescription>
            <CardTitle className="text-3xl">{stats.completed}</CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Overdue</CardDescription>
            <CardTitle className="text-3xl text-destructive">{stats.overdue}</CardTitle>
          </CardHeader>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        {/* CAPA by Priority */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>CAPAs by Priority</CardTitle>
            <CardDescription>Distribution of CAPAs by priority level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={priorityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* CAPA by Source */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>CAPAs by Source</CardTitle>
            <CardDescription>Distribution of CAPAs by source</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {sourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* CAPA by Department */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>CAPAs by Department</CardTitle>
            <CardDescription>Distribution of CAPAs by department</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={departmentData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Performance Metrics */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>Key metrics for CAPA process</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={[
                    { name: 'Completion Rate', value: Math.round(completionRate) },
                    { name: 'Overdue Rate', value: Math.round(overdueRate) },
                  ]}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent CAPA Activities</CardTitle>
          <CardDescription>Latest updates to CAPA items</CardDescription>
        </CardHeader>
        <CardContent>
          {stats.recentActivities && stats.recentActivities.length > 0 ? (
            <ul className="space-y-4">
              {stats.recentActivities.map(activity => (
                <li key={activity.id} className="border-b pb-2">
                  <div className="flex justify-between">
                    <span className="font-medium">{activity.action_type}</span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(activity.performed_at).toLocaleString()}
                    </span>
                  </div>
                  <p>{activity.action_description}</p>
                  <p className="text-sm text-muted-foreground">By: {activity.performed_by}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">No recent activities</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CAPADashboard;
