
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';
import RecentCapaList from './RecentCapaList';
import { getCAPAs } from '@/services/capaService';
import { CAPA, CAPAStats, CAPASource } from '@/types/capa';
import { isStatusEqual } from '@/services/capa/capaStatusService';

const CAPADashboard = () => {
  const [capas, setCapas] = useState<CAPA[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  useEffect(() => {
    const fetchCAPAs = async () => {
      try {
        setLoading(true);
        const data = await getCAPAs();
        setCapas(data);
        calculateStats(data);
      } catch (err) {
        console.error('Error fetching CAPAs:', err);
        setError('Failed to fetch CAPA data');
      } finally {
        setLoading(false);
      }
    };

    fetchCAPAs();
  }, []);

  const calculateStats = (data: CAPA[]) => {
    const openCount = data.filter(capa => isStatusEqual(capa.status, 'Open')).length;
    const closedCount = data.filter(capa => isStatusEqual(capa.status, 'Closed')).length;
    const overdueCount = data.filter(capa => 
      !isStatusEqual(capa.status, 'Closed') && 
      !isStatusEqual(capa.status, 'Verified') && 
      new Date(capa.dueDate) < new Date()
    ).length;
    const pendingVerificationCount = data.filter(capa => 
      isStatusEqual(capa.status, 'Pending Verification')
    ).length;

    // Group by priority
    const byPriority: Record<string, number> = {};
    data.forEach(capa => {
      byPriority[capa.priority] = (byPriority[capa.priority] || 0) + 1;
    });

    // Group by source
    const bySource: Record<string, number> = {};
    data.forEach(capa => {
      bySource[capa.source] = (bySource[capa.source] || 0) + 1;
    });

    // Group by department
    const byDepartment: Record<string, number> = {};
    data.forEach(capa => {
      if (capa.department) {
        byDepartment[capa.department] = (byDepartment[capa.department] || 0) + 1;
      }
    });

    // Calculate effectiveness rate (simplified)
    const verifiedCount = data.filter(capa => 
      isStatusEqual(capa.status, 'Verified')
    ).length;
    const effectivenessRate = closedCount > 0 
      ? (verifiedCount / closedCount) * 100 
      : 0;

    setStats({
      total: data.length,
      openCount,
      closedCount,
      overdueCount,
      pendingVerificationCount,
      byPriority,
      bySource,
      byDepartment,
      effectivenessRate: Math.round(effectivenessRate)
    });
  };

  const recentCapas = [...capas]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
            <Alert className="mt-2 p-2" variant="warning">
              <AlertTitle className="text-xs flex items-center">
                <InfoIcon className="h-3 w-3 mr-1" />
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
