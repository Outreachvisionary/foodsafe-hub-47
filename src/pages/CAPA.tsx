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
import { getCAPAs, getCAPAStats } from '@/services/capaService';
import { toast } from 'sonner';

const CAPA: React.FC = () => {
  const navigate = useNavigate();
  const [capas, setCAPAs] = useState<any[]>([]); // Use any[] to avoid type conflicts
  const [filteredCAPAs, setFilteredCAPAs] = useState<any[]>([]);
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
          filtered = filtered.filter(capa => capa.status === 'Open');
          break;
        case 'inProgress':
          filtered = filtered.filter(capa => capa.status === 'In_Progress');
          break;
        case 'completed':
          filtered = filtered.filter(capa => capa.status === 'Closed');
          break;
        case 'overdue':
          filtered = filtered.filter(capa => {
            const dueDate = new Date(capa.due_date);
            const now = new Date();
            return dueDate < now && capa.status !== 'Closed';
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

  const handleCAPAClick = (capa: any) => {
    navigate(`/capa/${capa.id}`);
  };

  const handleFilterChange = (newFilters: Partial<CAPAFilter>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const getTabCounts = () => {
    return {
      all: capas.length,
      open: capas.filter(c => c.status === 'Open').length,
      inProgress: capas.filter(c => c.status === 'In_Progress').length,
      completed: capas.filter(c => c.status === 'Closed').length,
      overdue: capas.filter(c => {
        const dueDate = new Date(c.due_date);
        const now = new Date();
        return dueDate < now && c.status !== 'Closed';
      }).length
    };
  };

  const tabCounts = getTabCounts();

  return (
    <div className="space-y-8 p-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
      {/* Enhanced Header */}
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              CAPA Management
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Comprehensive tracking and management of corrective and preventive actions with real-time analytics
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
              className="shadow-lg hover:shadow-xl transition-all duration-300 border-blue-200 hover:border-blue-300 hover:bg-blue-50"
            >
              <RefreshCcw className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
            <Button 
              onClick={() => setShowCreateDialog(true)}
              className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 text-white border-0"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New CAPA
            </Button>
          </div>
        </div>

        {/* Enhanced Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white transform hover:scale-105 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-blue-100 text-sm font-medium uppercase tracking-wide">Total CAPAs</p>
                  <p className="text-3xl font-bold">{capaStats.total}</p>
                  <p className="text-blue-200 text-xs">Active items</p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-500 to-orange-500 text-white transform hover:scale-105 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-amber-100 text-sm font-medium uppercase tracking-wide">In Progress</p>
                  <p className="text-3xl font-bold">{capaStats.inProgress}</p>
                  <p className="text-amber-200 text-xs">Active work</p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <Clock className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-red-500 to-pink-500 text-white transform hover:scale-105 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-red-100 text-sm font-medium uppercase tracking-wide">Overdue</p>
                  <p className="text-3xl font-bold">{capaStats.overdue}</p>
                  <p className="text-red-200 text-xs">Needs attention</p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <AlertTriangle className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-emerald-500 text-white transform hover:scale-105 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-green-100 text-sm font-medium uppercase tracking-wide">Completed</p>
                  <p className="text-3xl font-bold">{capaStats.completed}</p>
                  <p className="text-green-200 text-xs">Successfully closed</p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <CheckCircle2 className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Enhanced Tabs with improved styling */}
      <div className="bg-white rounded-2xl shadow-xl border-0 overflow-hidden">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <TabsList className="grid w-full lg:w-auto grid-cols-3 lg:grid-cols-7 bg-white/70 backdrop-blur-sm shadow-md border border-gray-200/50">
                <TabsTrigger value="all" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white transition-all duration-200">
                  All ({tabCounts.all})
                </TabsTrigger>
                <TabsTrigger value="open" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white transition-all duration-200">
                  Open ({tabCounts.open})
                </TabsTrigger>
                <TabsTrigger value="inProgress" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white transition-all duration-200">
                  In Progress ({tabCounts.inProgress})
                </TabsTrigger>
                <TabsTrigger value="completed" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white transition-all duration-200">
                  Completed ({tabCounts.completed})
                </TabsTrigger>
                <TabsTrigger value="overdue" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-pink-500 data-[state=active]:text-white transition-all duration-200">
                  Overdue ({tabCounts.overdue})
                </TabsTrigger>
                <TabsTrigger value="automated" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white transition-all duration-200">
                  Automated
                </TabsTrigger>
                <TabsTrigger value="dashboard" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white transition-all duration-200">
                  Dashboard
                </TabsTrigger>
              </TabsList>
              
              {/* Enhanced Search with better styling */}
              <div className="relative w-full lg:w-96">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search CAPAs by title, description, or ID..."
                  className="pl-12 pr-4 py-3 shadow-lg border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 bg-white/80 backdrop-blur-sm transition-all duration-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="p-6">
            <TabsContent value="automated" className="mt-0">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-indigo-50">
                <CardHeader className="bg-gradient-to-r from-purple-100 to-indigo-100 border-b border-purple-200/50">
                  <CardTitle className="text-xl text-purple-800 flex items-center gap-3">
                    <div className="p-2 bg-purple-500 rounded-lg">
                      <Plus className="h-5 w-5 text-white" />
                    </div>
                    Automated CAPA Generation
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <AutomatedCAPAGenerator onCAPACreated={handleCreateCAPA} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="dashboard" className="mt-0">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-blue-50">
                <CardHeader className="bg-gradient-to-r from-indigo-100 to-blue-100 border-b border-indigo-200/50">
                  <CardTitle className="text-xl text-indigo-800 flex items-center gap-3">
                    <div className="p-2 bg-indigo-500 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                    CAPA Analytics Dashboard
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <CAPADashboard stats={capaStats} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="all" className="mt-0">
              <div className="grid lg:grid-cols-4 gap-8">
                <Card className="lg:col-span-1 border-0 shadow-lg bg-gradient-to-br from-gray-50 to-slate-50">
                  <CardHeader className="bg-gradient-to-r from-gray-100 to-slate-100 border-b border-gray-200/50">
                    <CardTitle className="text-lg text-gray-800 flex items-center gap-2">
                      <div className="p-1.5 bg-gray-500 rounded-lg">
                        <Search className="h-4 w-4 text-white" />
                      </div>
                      Filters & Search
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <CAPAFilters onFilterChange={handleFilterChange} />
                  </CardContent>
                </Card>
                
                <div className="lg:col-span-3">
                  <Card className="border-0 shadow-lg bg-white">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200/50">
                      <CardTitle className="text-lg text-blue-800 flex items-center gap-3">
                        <div className="p-2 bg-blue-500 rounded-lg">
                          <CheckCircle2 className="h-5 w-5 text-white" />
                        </div>
                        CAPA List ({filteredCAPAs.length} items)
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
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
              <TabsContent key={tab} value={tab} className="mt-0">
                <div className="grid lg:grid-cols-4 gap-8">
                  <Card className="lg:col-span-1 border-0 shadow-lg bg-gradient-to-br from-gray-50 to-slate-50">
                    <CardHeader className="bg-gradient-to-r from-gray-100 to-slate-100 border-b border-gray-200/50">
                      <CardTitle className="text-lg text-gray-800 flex items-center gap-2">
                        <div className="p-1.5 bg-gray-500 rounded-lg">
                          <Search className="h-4 w-4 text-white" />
                        </div>
                        Filters & Search
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <CAPAFilters onFilterChange={handleFilterChange} />
                    </CardContent>
                  </Card>
                  
                  <div className="lg:col-span-3">
                    <Card className="border-0 shadow-lg bg-white">
                      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200/50">
                        <CardTitle className="text-lg text-blue-800 flex items-center gap-3">
                          <div className="p-2 bg-blue-500 rounded-lg">
                            <CheckCircle2 className="h-5 w-5 text-white" />
                          </div>
                          CAPA List ({filteredCAPAs.length} items)
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-8">
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
          </div>
        </Tabs>

        <CreateCAPADialog
          isOpen={showCreateDialog}
          onClose={() => setShowCreateDialog(false)} 
          onSubmit={handleCreateCAPA}
        />
      </div>
    </div>
  );
};

export default CAPA;
