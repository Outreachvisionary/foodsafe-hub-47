
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell, PieChart, Pie } from 'recharts';
import { CAPAStats } from '@/types/capa';
import { getCAPAStats, getRecentCAPAs } from '@/services/capaService';

const CAPADashboard: React.FC = () => {
  const [stats, setStats] = useState<CAPAStats | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchCAPAStats = async () => {
      try {
        setLoading(true);
        const fetchedStats = await getCAPAStats();
        setStats(fetchedStats);
      } catch (error) {
        console.error('Error fetching CAPA stats:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCAPAStats();
  }, []);
  
  // Process data for charts
  const processSourceData = () => {
    if (!stats) return [];
    
    return Object.entries(stats.bySource).map(([source, count]) => ({
      name: source.replace(/_/g, ' '),
      value: count
    }));
  };
  
  const processPriorityData = () => {
    if (!stats) return [];
    
    return Object.entries(stats.byPriority).map(([priority, count]) => ({
      name: priority,
      value: count
    }));
  };
  
  const processDepartmentData = () => {
    if (!stats) return [];
    
    return Object.entries(stats.byDepartment).map(([dept, count]) => ({
      name: dept,
      value: count
    }));
  };
  
  const sourceColors = ['#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#6366f1', '#8b5cf6', '#d946ef'];
  const priorityColors = {
    'Low': '#10b981',
    'Medium': '#f59e0b',
    'High': '#ef4444',
    'Critical': '#7f1d1d'
  };
  
  // Calculate percentages
  const calculateCompletionRate = () => {
    if (!stats) return 0;
    const { total, completed } = stats;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };
  
  const calculateOverdueRate = () => {
    if (!stats) return 0;
    const { total, overdue } = stats;
    return total > 0 ? Math.round((overdue / total) * 100) : 0;
  };
  
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-20" />
                <Skeleton className="h-4 w-full mt-4" />
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-40" />
            </CardHeader>
            <CardContent className="h-80">
              <Skeleton className="h-full w-full" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-40" />
            </CardHeader>
            <CardContent className="h-80">
              <Skeleton className="h-full w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  if (!stats) {
    return <div>Failed to load CAPA statistics.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total CAPAs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <Progress 
              value={100} 
              className="h-2 mt-2" 
              indicatorClassName="bg-blue-500" 
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Open</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.open}</div>
            <Progress 
              value={(stats.open / Math.max(stats.total, 1)) * 100} 
              className="h-2 mt-2" 
              indicatorClassName="bg-amber-500" 
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
            <Progress 
              value={(stats.completed / Math.max(stats.total, 1)) * 100} 
              className="h-2 mt-2" 
              indicatorClassName="bg-green-500" 
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.overdue}</div>
            <Progress 
              value={(stats.overdue / Math.max(stats.total, 1)) * 100} 
              className="h-2 mt-2" 
              indicatorClassName="bg-red-500" 
            />
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>CAPA by Source</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={processSourceData()}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={120} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6">
                    {processSourceData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={sourceColors[index % sourceColors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>CAPA by Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={processPriorityData()}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    nameKey="name"
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {processPriorityData().map((entry) => (
                      <Cell 
                        key={`cell-${entry.name}`} 
                        fill={priorityColors[entry.name as keyof typeof priorityColors] || '#3b82f6'} 
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CAPADashboard;
