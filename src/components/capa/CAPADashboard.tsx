import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, CheckCircle, Clock, BarChart2, PlusCircle } from 'lucide-react';
import { getCAPAs, getRecentCAPAs } from '@/services/capaService';
import { CAPA } from '@/types/capa';
import { CAPAStatus, CAPAPriority, CAPASource } from '@/types/enums';
import { createEmptyCAPAPriorityRecord, createEmptyCAPASourceRecord } from '@/utils/typeAdapters';

// Define a proper CAPAStats interface
interface CAPAStats {
  total: number;
  openCount: number;
  closedCount: number;
  overdueCount: number;
  pendingVerificationCount: number;
  effectivenessRate: number;
  byPriority: Record<CAPAPriority, number>;
  bySource: Record<CAPASource, number>;
  byDepartment: Record<string, number>;
  byStatus: Record<string, number>;
  byMonth: Record<string, number>;
  recentActivities: any[];
}

export const CAPADashboard: React.FC = () => {
  const [stats, setStats] = useState<CAPAStats>({
    total: 0,
    openCount: 0,
    closedCount: 0,
    overdueCount: 0,
    pendingVerificationCount: 0,
    effectivenessRate: 0,
    byPriority: createEmptyCAPAPriorityRecord(),
    bySource: createEmptyCAPASourceRecord(),
    byDepartment: {},
    byStatus: {},
    byMonth: {},
    recentActivities: []
  });
  
  const [loading, setLoading] = useState(true);
  const [recentCAPAs, setRecentCAPAs] = useState<CAPA[]>([]);
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch CAPAs and calculate stats
      const allCAPAs = await getCAPAs();
      const recent = await getRecentCAPAs();
      
      // Calculate stats
      const byPriority = createEmptyCAPAPriorityRecord();
      const bySource = createEmptyCAPASourceRecord();
      const byStatus: Record<string, number> = {};
      const byDepartment: Record<string, number> = {};
      
      let openCount = 0;
      let closedCount = 0;
      let overdueCount = 0;
      let pendingVerificationCount = 0;
      
      allCAPAs.forEach(capa => {
        // Update priority counts
        if (capa.priority && byPriority[capa.priority as CAPAPriority] !== undefined) {
          byPriority[capa.priority as CAPAPriority]++;
        }
        
        // Update source counts
        if (capa.source && bySource[capa.source as CAPASource] !== undefined) {
          bySource[capa.source as CAPASource]++;
        }
        
        // Update status counts
        const status = capa.status || CAPAStatus.Open;
        byStatus[status] = (byStatus[status] || 0) + 1;
        
        // Update department counts
        if (capa.department) {
          byDepartment[capa.department] = (byDepartment[capa.department] || 0) + 1;
        }
        
        // Update aggregated counts
        if (status === CAPAStatus.Open || status === CAPAStatus.InProgress) {
          openCount++;
        } else if (status === CAPAStatus.Closed || status === CAPAStatus.Completed) {
          closedCount++;
        }
        
        if (status === CAPAStatus.Overdue) {
          overdueCount++;
        }
        
        if (status === CAPAStatus.PendingVerification) {
          pendingVerificationCount++;
        }
      });
      
      // Calculate effectiveness rate (for example, based on completed vs. total)
      const effectivenessRate = allCAPAs.length > 0 
        ? Math.round((closedCount / allCAPAs.length) * 100) 
        : 0;
      
      setStats({
        total: allCAPAs.length,
        openCount,
        closedCount,
        overdueCount,
        pendingVerificationCount,
        effectivenessRate,
        byPriority,
        bySource,
        byDepartment,
        byStatus,
        byMonth: {}, // This would require date processing to generate
        recentActivities: [] // This would come from a separate API call
      });
      
      setRecentCAPAs(recent);
    } catch (error) {
      console.error('Error fetching CAPA data:', error);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">CAPA Dashboard</h2>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New CAPA
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Open CAPAs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.openCount}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0 ? Math.round((stats.openCount / stats.total) * 100) : 0}% of total
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.overdueCount}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0 ? Math.round((stats.overdueCount / stats.total) * 100) : 0}% of total
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Closed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.closedCount}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0 ? Math.round((stats.closedCount / stats.total) * 100) : 0}% of total
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Effectiveness Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.effectivenessRate}%</div>
            <Progress 
              value={stats.effectivenessRate} 
              className="h-2" 
              indicatorClassName={stats.effectivenessRate > 70 ? "bg-green-500" : "bg-amber-500"}
            />
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>CAPA Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {/* Chart component would go here */}
              <div className="flex flex-col h-full justify-center items-center text-center">
                <BarChart2 className="h-16 w-16 text-gray-300 mb-4" />
                <p className="text-muted-foreground">Status distribution chart</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Overdue CAPAs</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.overdueCount > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">Critical</span>
                  <span className="text-xs text-red-600 font-medium">{stats.overdueCount > 0 ? Math.round(stats.overdueCount * 0.3) : 0}</span>
                </div>
                <Progress value={30} className="h-2 bg-red-100" indicatorClassName="bg-red-600" />
                
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">High</span>
                  <span className="text-xs text-amber-600 font-medium">{stats.overdueCount > 0 ? Math.round(stats.overdueCount * 0.4) : 0}</span>
                </div>
                <Progress value={40} className="h-2 bg-amber-100" indicatorClassName="bg-amber-600" />
                
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">Medium</span>
                  <span className="text-xs text-blue-600 font-medium">{stats.overdueCount > 0 ? Math.round(stats.overdueCount * 0.2) : 0}</span>
                </div>
                <Progress value={20} className="h-2 bg-blue-100" indicatorClassName="bg-blue-600" />
                
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">Low</span>
                  <span className="text-xs text-green-600 font-medium">{stats.overdueCount > 0 ? Math.round(stats.overdueCount * 0.1) : 0}</span>
                </div>
                <Progress value={10} className="h-2 bg-green-100" indicatorClassName="bg-green-600" />
              </div>
            ) : (
              <div className="h-full flex flex-col justify-center items-center py-8">
                <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                <p className="text-gray-500">No overdue CAPAs</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent CAPAs</CardTitle>
        </CardHeader>
        <CardContent>
          {recentCAPAs.length > 0 ? (
            <div className="space-y-4">
              {recentCAPAs.map(capa => (
                <div key={capa.id} className="flex items-center border-b pb-3">
                  <div className="flex-1">
                    <h4 className="font-medium">{capa.title}</h4>
                    <p className="text-sm text-muted-foreground">{capa.description?.substring(0, 60)}{capa.description && capa.description.length > 60 ? '...' : ''}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-2">
                      {capa.status === CAPAStatus.Open && <Clock className="h-4 w-4 text-blue-500" />}
                      {capa.status === CAPAStatus.Completed && <CheckCircle className="h-4 w-4 text-green-500" />}
                      {capa.status === CAPAStatus.Overdue && <AlertCircle className="h-4 w-4 text-red-500" />}
                      <span className={`text-xs font-medium ${
                        capa.status === CAPAStatus.Overdue ? 'text-red-600' : 
                        capa.status === CAPAStatus.Completed ? 'text-green-600' : 'text-blue-600'
                      }`}>
                        {capa.status}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(capa.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              No recent CAPAs found
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CAPADashboard;
