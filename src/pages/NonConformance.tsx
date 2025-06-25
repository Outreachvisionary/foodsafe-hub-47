import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';
import ModuleLayout from '@/components/shared/ModuleLayout';
import DataTable from '@/components/shared/DataTable';
import { NonConformance } from '@/types/non-conformance';
import { getAllNonConformances, createNonConformance } from '@/services/nonConformanceService';
import { toast } from 'sonner';

const NonConformancePage: React.FC = () => {
  const navigate = useNavigate();
  const [nonConformances, setNonConformances] = useState<NonConformance[]>([]);
  const [filteredNCs, setFilteredNCs] = useState<NonConformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchNonConformances();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, nonConformances]);

  const fetchNonConformances = async () => {
    setLoading(true);
    try {
      const result = await getAllNonConformances();
      setNonConformances(result.data);
    } catch (error) {
      console.error('Error fetching non-conformances:', error);
      toast.error('Failed to load non-conformances');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...nonConformances];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(nc =>
        nc.title.toLowerCase().includes(query) ||
        nc.description?.toLowerCase().includes(query) ||
        nc.item_name.toLowerCase().includes(query)
      );
    }

    setFilteredNCs(filtered);
  };

  const handleNCClick = (nc: NonConformance) => {
    navigate(`/non-conformance/${nc.id}`);
  };

  const getStats = () => {
    const total = nonConformances.length;
    const onHold = nonConformances.filter(nc => nc.status === 'On Hold').length;
    const inProgress = nonConformances.filter(nc => nc.status === 'In Progress').length;
    const resolved = nonConformances.filter(nc => nc.status === 'Resolved').length;

    return [
      { label: 'Total NCs', value: total, color: 'text-blue-600', bgColor: 'bg-blue-500' },
      { label: 'On Hold', value: onHold, color: 'text-yellow-600', bgColor: 'bg-yellow-500' },
      { label: 'In Progress', value: inProgress, color: 'text-orange-600', bgColor: 'bg-orange-500' },
      { label: 'Resolved', value: resolved, color: 'text-green-600', bgColor: 'bg-green-500' }
    ];
  };

  const columns = [
    {
      key: 'title',
      label: 'Title',
      render: (value: string, item: NonConformance) => (
        <div className="cursor-pointer hover:text-primary" onClick={() => handleNCClick(item)}>
          <div className="font-medium">{value}</div>
          <div className="text-xs text-muted-foreground">Item: {item.item_name}</div>
        </div>
      )
    },
    { key: 'status', label: 'Status' },
    { key: 'priority', label: 'Priority' },
    { key: 'item_category', label: 'Category' },
    { key: 'assigned_to', label: 'Assigned To' },
    { key: 'reported_date', label: 'Reported' }
  ];

  const actions = (
    <Button variant="outline" onClick={fetchNonConformances} disabled={loading}>
      <RefreshCcw className="h-4 w-4 mr-2" />
      Refresh
    </Button>
  );

  return (
    <div className="p-6">
      <ModuleLayout
        title="Non-Conformance Management"
        subtitle="Track and manage quality non-conformances"
        searchPlaceholder="Search non-conformances by title, item, or description..."
        onSearch={setSearchQuery}
        onCreateNew={() => navigate('/non-conformance/create')}
        createButtonText="Report Non-Conformance"
        stats={getStats()}
        actions={actions}
      >
        <DataTable
          columns={columns}
          data={filteredNCs}
          loading={loading}
          onView={handleNCClick}
          emptyMessage="No non-conformances found"
        />
      </ModuleLayout>
    </div>
  );
};

export default NonConformancePage;
