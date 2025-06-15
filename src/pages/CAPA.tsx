import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, RefreshCcw, Search, TrendingUp, AlertTriangle, Clock, CheckCircle2 } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto py-8 px-6">
          {/* Enhanced Header */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  CAPA Management
                </h1>
                <p className="text-lg text-muted-foreground">
                  Manage corrective and preventive actions with comprehensive tracking
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    fetchCAPAs();
                    fetchStats();
                  }}
                  disabled={loading}
                  className="shadow-sm hover:shadow-md transition-shadow"
                >
                  <RefreshCcw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
                <Button 
                  onClick={() => setShowCreateDialog(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create CAPA
                </Button>
              </div>
            </div>

            {/* Quick Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              <Card className="border-0 shadow-md bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm font-medium">Total CAPAs</p>
                      <p className="text-2xl font-bold">{capaStats.total}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-blue-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md bg-gradient-to-br from-amber-500 to-orange-500 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-amber-100 text-sm font-medium">In Progress</p>
                      <p className="text-2xl font-bold">{capaStats.inProgress}</p>
                    </div>
                    <Clock className="h-8 w-8 text-amber-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md bg-gradient-to-br from-red-500 to-pink-500 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-red-100 text-sm font-medium">Overdue</p>
                      <p className="text-2xl font-bold">{capaStats.overdue}</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-red-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md bg-gradient-to-br from-green-500 to-emerald-500 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm font-medium">Completed</p>
                      <p className="text-2xl font-bold">{capaStats.completed}</p>
                    </div>
                    <CheckCircle2 className="h-8 w-8 text-green-200" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Enhanced Tabs */}
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <TabsList className="grid w-full lg:w-auto grid-cols-3 lg:grid-cols-7 bg-white shadow-sm border">
                <TabsTrigger value="all" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                  All ({tabCounts.all})
                </TabsTrigger>
                <TabsTrigger value="open" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                  Open ({tabCounts.open})
                </TabsTrigger>
                <TabsTrigger value="inProgress" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white">
                  In Progress ({tabCounts.inProgress})
                </TabsTrigger>
                <TabsTrigger value="completed" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
                  Completed ({tabCounts.completed})
                </TabsTrigger>
                <TabsTrigger value="overdue" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
                  Overdue ({tabCounts.overdue})
                </TabsTrigger>
                <TabsTrigger value="automated" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
                  Automated
                </TabsTrigger>
                <TabsTrigger value="dashboard" className="data-[state=active]:bg-indigo-500 data-[state=active]:text-white">
                  Dashboard
                </TabsTrigger>
              </TabsList>
              
              {/* Enhanced Search */}
              <div className="relative w-full lg:w-80">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search CAPAs by title, description, or ID..."
                  className="pl-10 shadow-sm border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <TabsContent value="automated" className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b">
                  <CardTitle className="text-xl text-purple-800">Automated CAPA Generation</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <AutomatedCAPAGenerator onCAPACreated={handleCreateCAPA} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="dashboard" className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b">
                  <CardTitle className="text-xl text-indigo-800">CAPA Analytics Dashboard</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <CAPADashboard stats={capaStats} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="all" className="space-y-6">
              <div className="grid lg:grid-cols-4 gap-6">
                <Card className="lg:col-span-1 border-0 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 border-b">
                    <CardTitle className="text-lg text-gray-800">Filters</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <CAPAFilters onFilterChange={handleFilterChange} />
                  </CardContent>
                </Card>
                
                <div className="lg:col-span-3">
                  <Card className="border-0 shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                      <CardTitle className="text-lg text-blue-800">
                        CAPA List ({filteredCAPAs.length} items)
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <CAPAList
                        items={filteredCAPAs}
                        loading={loading}
                        error={error}
                        onCAPAClick={handleCAPAClick}
                      />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {['open', 'inProgress', 'completed', 'overdue'].map((tab) => (
              <TabsContent key={tab} value={tab} className="space-y-6">
                <div className="grid lg:grid-cols-4 gap-6">
                  <Card className="lg:col-span-1 border-0 shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 border-b">
                      <CardTitle className="text-lg text-gray-800">Filters</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <CAPAFilters onFilterChange={handleFilterChange} />
                    </CardContent>
                  </Card>
                  
                  <div className="lg:col-span-3">
                    <Card className="border-0 shadow-lg">
                      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                        <CardTitle className="text-lg text-blue-800">
                          CAPA List ({filteredCAPAs.length} items)
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        <CAPAList
                          items={filteredCAPAs}
                          loading={loading}
                          error={error}
                          onCAPAClick={handleCAPAClick}
                        />
                      </CardContent>
                    </Card>
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
      </div>
    </SidebarLayout>
  );
};

export default CAPA;
