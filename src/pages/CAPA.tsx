
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';
import { CAPA as CAPAType, CAPAStats, CAPAFilter } from '@/types/capa';
import { CAPAStatus, CAPAPriority, CAPASource } from '@/types/enums';
import ModuleLayout from '@/components/shared/ModuleLayout';
import DataTable from '@/components/shared/DataTable';
import CAPAFilters from '@/components/capa/CAPAFilters';
import CreateCAPADialog from '@/components/capa/CreateCAPADialog';
import { getCAPAs, getCAPAStats } from '@/services/capaService';
import { toast } from 'sonner';

const CAPA: React.FC = () => {
  const navigate = useNavigate();
  const [capas, setCAPAs] = useState<any[]>([]);
  const [filteredCAPAs, setFilteredCAPAs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
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
  }, [filters, searchQuery, capas]);

  const fetchCAPAs = async () => {
    setLoading(true);
    
    try {
      const fetchedCAPAs = await getCAPAs();
      setCAPAs(fetchedCAPAs);
    } catch (err) {
      console.error('Error fetching CAPAs:', err);
      toast.error('Failed to load CAPAs');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const stats = await getCAPAStats();
      setCAPAStats(stats);
    } catch (err) {
      console.error('Error fetching CAPA stats:', err);
      toast.error('Failed to load CAPA statistics');
    }
  };

  const applyFilters = () => {
    let filtered = [...capas];

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

  const stats = [
    {
      label: 'Total CAPAs',
      value: capaStats.total,
      color: 'text-blue-600',
      bgColor: 'bg-blue-500'
    },
    {
      label: 'In Progress',
      value: capaStats.inProgress,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-500'
    },
    {
      label: 'Overdue',
      value: capaStats.overdue,
      color: 'text-red-600',
      bgColor: 'bg-red-500'
    },
    {
      label: 'Completed',
      value: capaStats.completed,
      color: 'text-green-600',
      bgColor: 'bg-green-500'
    }
  ];

  const columns = [
    {
      key: 'title',
      label: 'Title',
      render: (value: string, item: any) => (
        <div className="cursor-pointer hover:text-primary" onClick={() => handleCAPAClick(item)}>
          <div className="font-medium">{value}</div>
          <div className="text-xs text-muted-foreground">ID: {item.id.slice(0, 8)}</div>
        </div>
      )
    },
    { key: 'status', label: 'Status' },
    { key: 'priority', label: 'Priority' },
    { key: 'assigned_to', label: 'Assigned To' },
    { key: 'due_date', label: 'Due Date' },
    { key: 'created_at', label: 'Created' }
  ];

  const actions = (
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
  );

  return (
    <div className="p-6">
      <ModuleLayout
        title="CAPA Management"
        subtitle="Corrective and Preventive Action tracking and management"
        searchPlaceholder="Search CAPAs by title, description, or ID..."
        onSearch={setSearchQuery}
        onCreateNew={() => setShowCreateDialog(true)}
        createButtonText="Create CAPA"
        stats={stats}
        actions={actions}
        filters={<CAPAFilters onFilterChange={handleFilterChange} />}
      >
        <DataTable
          columns={columns}
          data={filteredCAPAs}
          loading={loading}
          onView={handleCAPAClick}
          emptyMessage="No CAPAs found"
        />
      </ModuleLayout>

      <CreateCAPADialog
        isOpen={showCreateDialog}
        onClose={() => setShowCreateDialog(false)} 
        onSubmit={handleCreateCAPA}
      />
    </div>
  );
};

export default CAPA;
