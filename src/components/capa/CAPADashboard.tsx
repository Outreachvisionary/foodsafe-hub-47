
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell, Pie, PieChart, Legend } from 'recharts';
import { getCAPAs } from '@/services/capaService';
import { CAPA, CAPAStats } from '@/types/capa';
import { isStatusEqual } from '@/services/capa/capaStatusService';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, Clock, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CAPADashboardProps {
  filters: {
    status: string;
    priority: string;
    source: string;
    dueDate: string;
  };
  searchQuery: string;
}

const CAPADashboard: React.FC<CAPADashboardProps> = ({ filters, searchQuery }) => {
  const [stats, setStats] = useState<CAPAStats | null>(null);
  const [capas, setCapas] = useState<CAPA[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const capaData = await getCAPAs();
        setCapas(capaData);
        
        // Calculate stats
        const totalCount = capaData.length;
        const openCount = capaData.filter(capa => isStatusEqual(capa.status, 'Open')).length;
        const closedCount = capaData.filter(capa => isStatusEqual(capa.status, 'Closed')).length;
        const overdueCount = capaData.filter(capa => {
          if (isStatusEqual(capa.status, 'Open') || isStatusEqual(capa.status, 'In Progress')) {
            const dueDate = new Date(capa.dueDate);
            const now = new Date();
            return dueDate < now;
          }
          return false;
        }).length;
        const pendingVerificationCount = capaData.filter(capa => 
          isStatusEqual(capa.status, 'Pending Verification')
        ).length;
        
        // By priority
        const byPriority: Record<string, number> = {};
        capaData.forEach(capa => {
          const priority = capa.priority || 'unknown';
          byPriority[priority] = (byPriority[priority] || 0) + 1;
        });
        
        // By source
        const bySource: Record<string, number> = {};
        capaData.forEach(capa => {
          let sourceMap: Record<string, string> = {
            'audit': 'Audit',
            'customer-complaint': 'Customer Complaint',
            'internal-qc': 'Internal QC',
            'supplier-issue': 'Supplier Issue',
            'other': 'Other'
          };
          
          const source = sourceMap[capa.source as string] || capa.source || 'unknown';
          bySource[source] = (bySource[source] || 0) + 1;
        });
        
        // By department
        const byDepartment: Record<string, number> = {};
        capaData.forEach(capa => {
          const department = capa.department || 'unassigned';
          byDepartment[department] = (byDepartment[department] || 0) + 1;
        });
        
        // Set stats
        setStats({
          total: totalCount,
          openCount,
          closedCount,
          overdueCount,
          pendingVerificationCount,
          byPriority,
          bySource,
          byDepartment,
          effectivenessRate: Math.round((closedCount / (totalCount || 1)) * 100)
        });
      } catch (err) {
        console.error('Error fetching CAPA dashboard data:', err);
        setError('Failed to load CAPA dashboard data');
        toast({
          title: "Error",
          description: "Failed to load CAPA dashboard data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [toast, filters, searchQuery]);
  
  const priorityColors: Record<string, string> = {
    critical: '#ef4444',
    high: '#f97316',
    medium: '#f59e0b',
    low: '#22c55e',
  };
  
  const statusColors: Record<string, string> = {
    open: '#f59e0b',
    'in-progress': '#3b82f6',
    closed: '#22c55e',
    overdue: '#ef4444',
    'pending-verification': '#a855f7',
  };
  
  const sourceColors: Record<string, string> = {
    'Audit': '#3b82f6',
    'Customer Complaint': '#f97316',
    'Internal QC': '#a855f7',
    'Supplier Issue': '#ec4899',
    'Other': '#64748b',
  };
  
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <Card key={item}>
            <CardHeader>
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/3" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[200px] w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }
  
  if (!stats) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <span>Loading dashboard data...</span>
      </div>
    );
  }
  
  const statusData = [
    { name: 'Open', value: stats.openCount, color: statusColors.open },
    { name: 'Closed', value: stats.closedCount, color: statusColors.closed },
    { name: 'Overdue', value: stats.overdueCount, color: statusColors.overdue },
    { name: 'Pending Verification', value: stats.pendingVerificationCount, color: statusColors['pending-verification'] },
  ];
  
  const priorityData = Object.keys(stats.byPriority).map(key => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value: stats.byPriority[key],
    color: priorityColors[key] || '#64748b',
  }));
  
  const sourceData = Object.keys(stats.bySource).map(key => ({
    name: key,
    value: stats.bySource[key],
    color: sourceColors[key] || '#64748b',
  }));
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{stats.total}</CardTitle>
            <CardDescription>Total CAPAs</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-amber-500">{stats.openCount}</CardTitle>
            <CardDescription>Open CAPAs</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-red-500">{stats.overdueCount}</CardTitle>
            <CardDescription>Overdue CAPAs</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-green-500">{stats.closedCount}</CardTitle>
            <CardDescription>Closed CAPAs</CardDescription>
          </CardHeader>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>CAPAs by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>CAPAs by Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={priorityData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value">
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>CAPAs by Source</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sourceData} layout="vertical">
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={120} />
                <Tooltip />
                <Bar dataKey="value">
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CAPADashboard;
