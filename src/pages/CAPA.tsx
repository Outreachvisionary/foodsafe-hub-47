
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, RefreshCcw, Search } from 'lucide-react';
import { CAPA as CAPAType, CAPAStats, CAPAFilter } from '@/types/capa';
import { CAPAStatus, CAPAPriority, CAPASource } from '@/types/enums';
import CAPADashboard from '@/components/capa/CAPADashboard';
import CAPAList from '@/components/capa/CAPAList';
import CAPAFilters from '@/components/capa/CAPAFilters';
import CreateCAPADialog from '@/components/capa/CreateCAPADialog';
import AutomatedCAPAGenerator from '@/components/capa/AutomatedCAPAGenerator';
import SidebarLayout from '@/components/layout/SidebarLayout';
import { getCAPAs, getCAPAStats } from '@/services/capaService';
import { toast } from 'sonner';

const CAPA: React.FC = () => {
  const navigate = useNavigate();
  const [capas, setCAPAs] = useState<CAPAType[]>([]);
  const [filteredCAPAs, setFilteredCAPAs] = useState<CAPAType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [capaStats, setCAPAStats] = useState<CAPAStats>({
    total: 0,
    open: 0,
    openCount: 0,
    inProgress: 0,
    completed: 0,
    closed: 0,
    closedCount: 0,
    overdue: 0,
    overdueCount: 0,
    pendingVerificationCount: 0,
    byPriority: {} as Record<CAPAPriority, number>,
    bySource: {} as Record<CAPASource, number>,
    byStatus: {} as Record<CAPAStatus, number>,
    byDepartment: {},
    completedThisMonth: 0,
    averageResolutionTime: 0,
    upcomingDueDates: [],
    recentActivities: []
  });
  
  const [filters, setFilters] = useState<CAPAFilter>({
    status: undefined,
    priority: undefined,
    source: undefined,
    department: undefined,
    searchTerm: ''
  });

  useEffect(() => {
    fetchCAPAs();
    fetchStats();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, searchQuery, capas, activeTab]);

  const fetchCAPAs = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching CAPAs...');
      const fetchedCAPAs = await getCAPAs();
      console.log('Fetched CAPAs:', fetchedCAPAs.length);
      setCAPAs(fetchedCAPAs);
    } catch (err) {
      console.error('Error fetching CAPAs:', err);
      setError('Failed to load CAPAs. Please try again.');
      toast.error('Failed to load CAPAs');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      console.log('Fetching CAPA stats...');
      const stats = await getCAPAStats();
      console.log('Fetched stats:', stats);
      setCAPAStats(stats);
    } catch (err) {
      console.error('Error fetching CAPA stats:', err);
      toast.error('Failed to load CAPA statistics');
    }
  };

  const applyFilters = () => {
    let filtered = [...capas];

    // Apply tab filter
    if (activeTab !== 'all') {
      switch (activeTab) {
        case 'open':
          filtered = filtered.filter(capa => capa.status === CAPAStatus.Open);
          break;
        case 'inProgress':
          filtered = filtered.filter(capa => capa.status === CAPAStatus.In_Progress);
          break;
        case 'completed':
          filtered = filtered.filter(capa => 
            capa.status === CAPAStatus.Closed
          );
          break;
        case 'overdue':
          filtered = filtered.filter(capa => {
            const dueDate = new Date(capa.due_date);
            const now = new Date();
            return dueDate < now && capa.status !== CAPAStatus.Closed;
          });
          break;
      }
    }

    // Apply filters
    if (filters.status) {
      filtered = filtered.filter(capa => {
        if (Array.isArray(filters.status)) {
          return filters.status.includes(capa.status);
        }
        return capa.status === filters.status;
      });
    }

    if (filters.priority) {
      filtered = filtered.filter(capa => {
        if (Array.isArray(filters.priority)) {
          return filters.priority.includes(capa.priority);
        }
        return capa.priority === filters.priority;
      });
    }

    if (filters.source) {
      filtered = filtered.filter(capa => {
        if (Array.isArray(filters.source)) {
          return filters.source.includes(capa.source);
        }
        return capa.source === filters.source;
      });
    }

    if (filters.department) {
      filtered = filtered.filter(capa => {
        const capaDept = capa.department || 'Unassigned';
        
        if (Array.isArray(filters.department)) {
          return filters.department.includes(capaDept);
        }
        
        return capaDept === filters.department;
      });
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(capa =>
        capa.title.toLowerCase().includes(query) ||
        capa.description.toLowerCase().includes(query) ||
        capa.id.toLowerCase().includes(query)
      );
    }

    setFilteredCAPAs(filtered);
  };

  const handleCreateCAPA = async (capaData: any) => {
    console.log('CAPA created:', capaData);
    toast.success('CAPA created successfully');
    await fetchCAPAs();
    await fetchStats();
    setShowCreateDialog(false);
  };

  const handleCAPAClick = (capa: CAPAType) => {
    navigate(`/capa/${capa.id}`);
  };

  const handleFilterChange = (newFilters: Partial<CAPAFilter>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const getTabCounts = () => {
    return {
      all: capas.length,
      open: capas.filter(c => c.status === CAPAStatus.Open).length,
      inProgress: capas.filter(c => c.status === CAPAStatus.In_Progress).length,
      completed: capas.filter(c => c.status === CAPAStatus.Closed).length,
      overdue: capas.filter(c => {
        const dueDate = new Date(c.due_date);
        const now = new Date();
        return dueDate < now && c.status !== CAPAStatus.Closed;
      }).length
    };
  };

  const tabCounts = getTabCounts();

  return (
    <SidebarLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">CAPA Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage corrective and preventive actions
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                fetchCAPAs();
                fetchStats();
              }}
              disabled={loading}
            >
              <RefreshCcw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create CAPA
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="all">
                All CAPAs ({tabCounts.all})
              </TabsTrigger>
              <TabsTrigger value="open">
                Open ({tabCounts.open})
              </TabsTrigger>
              <TabsTrigger value="inProgress">
                In Progress ({tabCounts.inProgress})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed ({tabCounts.completed})
              </TabsTrigger>
              <TabsTrigger value="overdue">
                Overdue ({tabCounts.overdue})
              </TabsTrigger>
              <TabsTrigger value="automated">
                Automated CAPA
              </TabsTrigger>
              <TabsTrigger value="dashboard">
                Dashboard
              </TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2">
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search CAPAs..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          <TabsContent value="automated">
            <AutomatedCAPAGenerator onCAPACreated={handleCreateCAPA} />
          </TabsContent>

          <TabsContent value="dashboard">
            <CAPADashboard stats={capaStats} />
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            <div className="grid md:grid-cols-4 gap-4">
              <CAPAFilters onFilterChange={handleFilterChange} />
              <div className="md:col-span-3">
                <CAPAList
                  items={filteredCAPAs}
                  loading={loading}
                  error={error}
                  onCAPAClick={handleCAPAClick}
                />
              </div>
            </div>
          </TabsContent>

          {['open', 'inProgress', 'completed', 'overdue'].map((tab) => (
            <TabsContent key={tab} value={tab} className="space-y-4">
              <div className="grid md:grid-cols-4 gap-4">
                <CAPAFilters onFilterChange={handleFilterChange} />
                <div className="md:col-span-3">
                  <CAPAList
                    items={filteredCAPAs}
                    loading={loading}
                    error={error}
                    onCAPAClick={handleCAPAClick}
                  />
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <CreateCAPADialog
          isOpen={showCreateDialog}
          onClose={() => setShowCreateDialog(false)} 
          onSubmit={handleCreateCAPA}
        />
      </div>
    </SidebarLayout>
  );
};

export default CAPA;
