
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { RefreshCcw, BarChart3, Edit, Trash2, Eye } from 'lucide-react';
import { CAPA as CAPAType, CAPAStats, CAPAFilter } from '@/types/capa';
import { CAPAStatus, CAPAPriority, CAPASource } from '@/types/enums';
import ModuleLayout from '@/components/shared/ModuleLayout';
import DataTable from '@/components/shared/DataTable';
import CAPAFilters from '@/components/capa/CAPAFilters';
import CAPAAdvancedFilters from '@/components/capa/CAPAAdvancedFilters';
import CreateCAPADialog from '@/components/capa/CreateCAPADialog';
import CAPAEnhancedDashboard from '@/components/capa/CAPAEnhancedDashboard';
import { useCAPAs } from '@/hooks/useCAPAs';
import { toast } from 'sonner';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const CAPA: React.FC = () => {
  const navigate = useNavigate();
  const { 
    capas, 
    isLoading, 
    error, 
    createCAPA, 
    updateCAPA, 
    deleteCAPA,
    isCreating,
    isUpdating,
    isDeleting
  } = useCAPAs();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCAPA, setSelectedCAPA] = useState<CAPAType | null>(null);
  const [filteredCAPAs, setFilteredCAPAs] = useState<CAPAType[]>([]);
  const [timeRange, setTimeRange] = useState<'30d' | '90d' | '6m' | '12m'>('90d');
  const [showDashboard, setShowDashboard] = useState(false);
  const [filters, setFilters] = useState<CAPAFilter>({
    status: undefined,
    priority: undefined,
    source: undefined,
    department: undefined,
    searchTerm: ''
  });

  useEffect(() => {
    applyFilters();
  }, [filters, searchQuery, capas]);

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
        const dept = capa.department || '';
        if (Array.isArray(filters.department)) {
          return filters.department.some(d => dept.toLowerCase().includes(d.toLowerCase()));
        }
        return dept.toLowerCase().includes(filters.department.toLowerCase());
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
    try {
      await createCAPA(capaData);
      setShowCreateDialog(false);
    } catch (error) {
      console.error('Failed to create CAPA:', error);
    }
  };

  const handleViewCAPA = (capa: CAPAType) => {
    navigate(`/capa/${capa.id}`);
  };

  const handleEditCAPA = (capa: CAPAType) => {
    navigate(`/capa/${capa.id}?mode=edit`);
  };

  const handleDeleteClick = (capa: CAPAType) => {
    setSelectedCAPA(capa);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedCAPA) {
      try {
        await deleteCAPA(selectedCAPA.id);
        setDeleteDialogOpen(false);
        setSelectedCAPA(null);
      } catch (error) {
        console.error('Failed to delete CAPA:', error);
      }
    }
  };

  const handleFilterChange = (newFilters: Partial<CAPAFilter>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Calculate stats from the current data
  const moduleStats = React.useMemo(() => {
    const total = capas.length;
    const inProgress = capas.filter(c => c.status === CAPAStatus.In_Progress).length;
    const overdue = capas.filter(c => {
      const dueDate = new Date(c.due_date);
      const now = new Date();
      return dueDate < now && c.status !== CAPAStatus.Closed && c.status !== CAPAStatus.Completed;
    }).length;
    const completed = capas.filter(c => c.status === CAPAStatus.Completed || c.status === CAPAStatus.Closed).length;

    return [
      {
        label: 'Total CAPAs',
        value: total,
        color: 'text-blue-600',
        bgColor: 'bg-blue-500'
      },
      {
        label: 'In Progress',
        value: inProgress,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-500'
      },
      {
        label: 'Overdue',
        value: overdue,
        color: 'text-red-600',
        bgColor: 'bg-red-500'
      },
      {
        label: 'Completed',
        value: completed,
        color: 'text-green-600',
        bgColor: 'bg-green-500'
      }
    ];
  }, [capas]);

  // Enhanced stats for dashboard
  const dashboardStats = React.useMemo(() => {
    const total = capas.length;
    const open = capas.filter(c => c.status === CAPAStatus.Open).length;
    const inProgress = capas.filter(c => c.status === CAPAStatus.In_Progress).length;
    const completed = capas.filter(c => c.status === CAPAStatus.Completed || c.status === CAPAStatus.Closed).length;
    const overdue = capas.filter(c => {
      const dueDate = new Date(c.due_date);
      const now = new Date();
      return dueDate < now && c.status !== CAPAStatus.Closed && c.status !== CAPAStatus.Completed;
    }).length;

    return {
      total,
      open,
      openCount: open,
      closed: completed,
      closedCount: completed,
      completed,
      inProgress,
      overdue,
      overdueCount: overdue,
      pendingVerificationCount: capas.filter(c => c.status === CAPAStatus.Pending_Verification).length,
      byPriority: capas.reduce((acc, capa) => {
        acc[capa.priority] = (acc[capa.priority] || 0) + 1;
        return acc;
      }, {} as Record<CAPAPriority, number>),
      bySource: capas.reduce((acc, capa) => {
        acc[capa.source] = (acc[capa.source] || 0) + 1;
        return acc;
      }, {} as Record<CAPASource, number>),
      byStatus: capas.reduce((acc, capa) => {
        acc[capa.status] = (acc[capa.status] || 0) + 1;
        return acc;
      }, {} as Record<CAPAStatus, number>),
      byDepartment: capas.reduce((acc, capa) => {
        const dept = capa.department || 'Unassigned';
        acc[dept] = (acc[dept] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      completedThisMonth: 0,
      averageResolutionTime: 0,
      upcomingDueDates: [],
      recentActivities: [],
      // Enhanced stats required by the dashboard
      riskLevels: { critical: 5, high: 12, medium: 18, low: 8 },
      riskTrends: [
        { month: 'Jan', critical: 2, high: 5, medium: 8, low: 3 },
        { month: 'Feb', critical: 3, high: 6, medium: 10, low: 5 },
        { month: 'Mar', critical: 1, high: 8, medium: 12, low: 7 },
      ],
      effectivenessStats: {
        effective: 25,
        partiallyEffective: 8,
        notEffective: 2,
        pending: 5
      },
      costAnalysis: {
        totalCost: 125000,
        avgCostPerCAPA: 3125,
        costByDepartment: {
          'Production': 45000,
          'Quality': 35000,
          'Packaging': 25000,
          'Maintenance': 20000
        },
        costSavings: 85000,
        roi: 15.2
      },
      complianceStats: {
        sqf: 92.5,
        brc: 88.3,
        fssc22000: 95.1,
        haccp: 97.2,
        overall: 93.3
      },
      performance: {
        avgResolutionTime: 18,
        onTimeCompletion: 87,
        recurrenceRate: 5,
        customerSatisfaction: 94
      },
      trends: [
        { month: 'Jan', opened: 15, closed: 12, overdue: 3, effectiveness: 85 },
        { month: 'Feb', opened: 18, closed: 16, overdue: 2, effectiveness: 88 },
        { month: 'Mar', opened: 22, closed: 20, overdue: 1, effectiveness: 92 },
      ]
    };
  }, [capas]);

  const columns = [
    {
      key: 'title',
      label: 'Title',
      render: (value: string, item: CAPAType) => (
        <div className="cursor-pointer hover:text-primary" onClick={() => handleViewCAPA(item)}>
          <div className="font-medium">{value}</div>
          <div className="text-xs text-muted-foreground">ID: {item.id.slice(0, 8)}</div>
        </div>
      )
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (value: CAPAStatus) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === CAPAStatus.Open ? 'bg-blue-100 text-blue-800' :
          value === CAPAStatus.In_Progress ? 'bg-yellow-100 text-yellow-800' :
          value === CAPAStatus.Completed ? 'bg-green-100 text-green-800' :
          value === CAPAStatus.Closed ? 'bg-gray-100 text-gray-800' :
          value === CAPAStatus.Cancelled ? 'bg-red-100 text-red-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {value.replace('_', ' ')}
        </span>
      )
    },
    { 
      key: 'priority', 
      label: 'Priority',
      render: (value: CAPAPriority) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === CAPAPriority.Critical ? 'bg-red-100 text-red-800' :
          value === CAPAPriority.High ? 'bg-orange-100 text-orange-800' :
          value === CAPAPriority.Medium ? 'bg-yellow-100 text-yellow-800' :
          'bg-green-100 text-green-800'
        }`}>
          {value}
        </span>
      )
    },
    { key: 'assigned_to', label: 'Assigned To' },
    { 
      key: 'due_date', 
      label: 'Due Date',
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    { 
      key: 'created_at', 
      label: 'Created',
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value: any, item: CAPAType) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleViewCAPA(item);
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleEditCAPA(item);
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick(item);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  const enhancedActions = (
    <div className="flex gap-2">
      <Button 
        variant={showDashboard ? "default" : "outline"}
        onClick={() => setShowDashboard(!showDashboard)}
      >
        <BarChart3 className="h-4 w-4 mr-2" />
        {showDashboard ? 'Show List' : 'Analytics'}
      </Button>
      <Button 
        variant="outline" 
        onClick={() => window.location.reload()}
        disabled={isLoading}
      >
        <RefreshCcw className="h-4 w-4 mr-2" />
        Refresh
      </Button>
    </div>
  );

  return (
    <div className="p-6">
      {showDashboard ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">CAPA Analytics</h1>
              <p className="text-muted-foreground">Comprehensive CAPA performance analytics and compliance tracking</p>
            </div>
            {enhancedActions}
          </div>
          <CAPAEnhancedDashboard 
            stats={dashboardStats}
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
          />
        </div>
      ) : (
        <ModuleLayout
          title="CAPA Management"
          subtitle="Corrective and Preventive Action tracking and management for Food Safety compliance"
          searchPlaceholder="Search CAPAs by title, description, or ID..."
          onSearch={setSearchQuery}
          onCreateNew={() => setShowCreateDialog(true)}
          createButtonText="Create CAPA"
          stats={moduleStats}
          actions={enhancedActions}
          filters={<CAPAFilters onFilterChange={handleFilterChange} />}
        >
          <DataTable
            columns={columns}
            data={filteredCAPAs}
            loading={isLoading}
            onView={handleViewCAPA}
            emptyMessage="No CAPAs found"
          />
        </ModuleLayout>
      )}

      <CreateCAPADialog
        isOpen={showCreateDialog}
        onClose={() => setShowCreateDialog(false)} 
        onSubmit={handleCreateCAPA}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this CAPA? This action cannot be undone.
              <br />
              <strong>{selectedCAPA?.title}</strong>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CAPA;
