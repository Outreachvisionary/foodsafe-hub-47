
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getCAPAs } from '@/services/capaService';
import { CAPA, CAPAStats, CAPASource } from '@/types/capa';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { isStatusEqual } from '@/services/capa/capaStatusService';
import { AlertCircle } from 'lucide-react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';
import RecentCapaList from './RecentCapaList';

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
  const [capas, setCapas] = useState<CAPA[]>([]);
  const [stats, setStats] = useState<CAPAStats>({
    total: 0,
    openCount: 0,
    closedCount: 0,
    overdueCount: 0,
    pendingVerificationCount: 0,
    effectivenessRate: 0,
    byPriority: {},
    bySource: {},
    byDepartment: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCapas = async () => {
      try {
        setLoading(true);
        const fetchedCapas = await getCAPAs();
        setCapas(fetchedCapas);

        // Calculate stats
        const totalCount = fetchedCapas.length;
        const openCount = fetchedCapas.filter(c => isStatusEqual(c.status, 'Open')).length;
        const closedCount = fetchedCapas.filter(c => isStatusEqual(c.status, 'Closed')).length;
        const overdueCount = fetchedCapas.filter(c => 
          (isStatusEqual(c.status, 'Open') || isStatusEqual(c.status, 'In Progress')) && 
          new Date(c.dueDate) < new Date()
        ).length;
        const pendingVerificationCount = fetchedCapas.filter(c => 
          isStatusEqual(c.status, 'Pending Verification')
        ).length;

        // Calculate effectiveness rate (% of closed CAPAs with positive effectiveness)
        const closedWithEffectiveness = fetchedCapas.filter(c => 
          isStatusEqual(c.status, 'Verified') && 
          c.effectivenessRating && 
          (c.effectivenessRating === 'Effective' || c.effectivenessRating === 'Highly Effective')
        ).length;
        
        const effectivenessRate = closedCount > 0 
          ? Math.round((closedWithEffectiveness / closedCount) * 100) 
          : 0;

        // Group by priority
        const byPriority: Record<string, number> = {};
        fetchedCapas.forEach(capa => {
          const priority = capa.priority || 'unknown';
          byPriority[priority] = (byPriority[priority] || 0) + 1;
        });

        // Group by source
        const bySource: Record<string, number> = {};
        fetchedCapas.forEach(capa => {
          const source = capa.source || 'unknown';
          bySource[source] = (bySource[source] || 0) + 1;
        });
        
        // Group by department
        const byDepartment: Record<string, number> = {};
        fetchedCapas.forEach(capa => {
          const department = capa.department || 'unknown';
          byDepartment[department] = (byDepartment[department] || 0) + 1;
        });

        setStats({
          total: totalCount,
          openCount,
          closedCount,
          overdueCount,
          pendingVerificationCount,
          byPriority,
          bySource,
          byDepartment,
          effectivenessRate
        });

      } catch (err) {
        console.error('Error fetching CAPA data:', err);
        setError('Failed to load CAPA data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCapas();
  }, []);

  if (loading) {
    return <div className="space-y-4">{/* Loading skeletons */}</div>;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error loading CAPA data</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  const recentCapas = [...capas]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Main stats cards */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Total CAPAs</CardTitle>
          <CardDescription>Overall tracking</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.total}</div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
            <div className="flex flex-col">
              <span className="text-muted-foreground">Open</span>
              <span className="font-medium">{stats.openCount}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground">Closed</span>
              <span className="font-medium">{stats.closedCount}</span>
            </div>
            <div className="flex flex-col text-red-500">
              <span className="text-muted-foreground">Overdue</span>
              <span className="font-medium">{stats.overdueCount}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground">Pending</span>
              <span className="font-medium">{stats.pendingVerificationCount}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Effectiveness Rate</CardTitle>
          <CardDescription>Verified vs. closed actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.effectivenessRate}%</div>
          <div className="mt-2">
            <span className="text-xs text-muted-foreground">
              Based on {stats.closedCount} closed CAPAs
            </span>
          </div>
          {stats.effectivenessRate < 70 && (
            <Alert className="mt-2 p-2">
              <AlertTitle className="text-xs flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                Action needed
              </AlertTitle>
              <AlertDescription className="text-xs">
                Low effectiveness rate requires attention
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">By Priority</CardTitle>
          <CardDescription>Distribution of CAPAs</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {Object.keys(stats.byPriority).map((priority) => (
            <div key={priority} className="flex justify-between text-sm">
              <span className="capitalize">{priority}</span>
              <span className="font-medium">{stats.byPriority[priority]}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Recent CAPAs</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <RecentCapaList capas={recentCapas} showViewAll={true} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">By Source</CardTitle>
          <CardDescription>Origin of CAPAs</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {Object.keys(stats.bySource).map((source) => (
            <div key={source} className="flex justify-between text-sm">
              <span className="capitalize">{source.replace('-', ' ')}</span>
              <span className="font-medium">{stats.bySource[source]}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default CAPADashboard;
