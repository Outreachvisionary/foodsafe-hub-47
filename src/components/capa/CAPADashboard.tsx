
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getCAPAStats, fetchCAPAs } from '@/services/capaService';
import { CAPA, CAPAStatus, CAPAPriority, CAPASource, CAPAFilter, CAPAStats, CAPAFetchParams } from '@/types/capa';
import { Loader } from 'lucide-react';

// Placeholders for the chart components
const CapaOverviewChart = ({ data }: any) => <div>Overview Chart</div>;
const CapaPriorityChart = ({ data }: any) => <div>Priority Chart</div>;
const CapaStatusChart = ({ data }: any) => <div>Status Chart</div>;
const CapaSourceChart = ({ data }: any) => <div>Source Chart</div>;
const CapaComplianceChart = ({ data }: any) => <div>Compliance Chart</div>;
const RecentCapaList = ({ items }: { items: CAPA[] }) => <div>Recent CAPA List</div>;

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
  const [stats, setStats] = useState<CAPAStats>({
    total: 0,
    openCount: 0,
    inProgressCount: 0,
    closedCount: 0,
    verifiedCount: 0,
    pendingVerificationCount: 0,
    overdueCount: 0,
    byStatus: [],
    byPriority: [],
    bySource: []
  });
  
  const [recentCAPAs, setRecentCAPAs] = useState<CAPA[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        
        // Get CAPA statistics
        const capaStats = await getCAPAStats();
        
        setStats({
          total: capaStats.total || 0,
          openCount: capaStats.openCount || 0,
          inProgressCount: capaStats.inProgressCount || 0,
          closedCount: capaStats.closedCount || 0,
          verifiedCount: capaStats.verifiedCount || 0,
          pendingVerificationCount: capaStats.pendingVerificationCount || 0,
          overdueCount: capaStats.overdueCount || 0,
          byStatus: capaStats.byStatus || [],
          byPriority: capaStats.byPriority || [],
          bySource: capaStats.bySource || [],
          fsma204ComplianceRate: capaStats.fsma204ComplianceRate,
          effectivenessStats: capaStats.effectivenessStats
        });
        
        // Get recent CAPAs with filters
        const capaFilter: CAPAFilter = {};
        
        if (filters.status !== 'all') {
          capaFilter.status = filters.status as CAPAStatus;
        }
        
        if (filters.priority !== 'all') {
          capaFilter.priority = filters.priority as CAPAPriority;
        }
        
        if (filters.source !== 'all') {
          capaFilter.source = filters.source as CAPASource;
        }
        
        if (searchQuery) {
          capaFilter.searchTerm = searchQuery;
        }
        
        // Convert filter to fetch parameters
        const fetchParams: CAPAFetchParams = {
          status: capaFilter.status,
          priority: capaFilter.priority,
          source: capaFilter.source,
          searchQuery: capaFilter.searchTerm,
          limit: 5,
          page: 1
        };
        
        const capas = await fetchCAPAs(fetchParams);
        setRecentCAPAs(capas.slice(0, 5)); // Show only the first 5 items
      } catch (error) {
        console.error('Error loading CAPA dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadDashboardData();
  }, [filters, searchQuery]);
  
  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading CAPA dashboard...</span>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stats cards here */}
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <Tabs defaultValue="status">
              <TabsList className="mb-4">
                <TabsTrigger value="status">Status</TabsTrigger>
                <TabsTrigger value="priority">Priority</TabsTrigger>
                <TabsTrigger value="source">Source</TabsTrigger>
              </TabsList>
              <TabsContent value="status">
                <CapaStatusChart data={stats.byStatus} />
              </TabsContent>
              <TabsContent value="priority">
                <CapaPriorityChart data={stats.byPriority} />
              </TabsContent>
              <TabsContent value="source">
                <CapaSourceChart data={stats.bySource} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <Tabs defaultValue="overview">
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="compliance">Compliance</TabsTrigger>
              </TabsList>
              <TabsContent value="overview">
                <CapaOverviewChart data={{
                  open: stats.openCount,
                  inProgress: stats.inProgressCount,
                  closed: stats.closedCount,
                  verified: stats.verifiedCount,
                  overdue: stats.overdueCount,
                  pendingVerification: stats.pendingVerificationCount
                }} />
              </TabsContent>
              <TabsContent value="compliance">
                <CapaComplianceChart data={{
                  fsma204Rate: stats.fsma204ComplianceRate || 0,
                  effectiveRate: stats.effectivenessStats ? 
                    Math.round((stats.effectivenessStats.effective / stats.total) * 100) : 0,
                  closureRate: Math.round(((stats.closedCount + stats.verifiedCount) / stats.total) * 100),
                  overdueRate: Math.round((stats.overdueCount / stats.total) * 100)
                }} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent CAPAs */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">Recent CAPAs</h3>
          <RecentCapaList items={recentCAPAs} />
        </CardContent>
      </Card>
    </div>
  );
};

export default CAPADashboard;
