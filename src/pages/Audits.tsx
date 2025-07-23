
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { RefreshCcw, Calendar, MapPin } from 'lucide-react';
import ModuleLayout from '@/components/shared/ModuleLayout';
import DataTable from '@/components/shared/DataTable';
import { toast } from 'sonner';

interface Audit {
  id: string;
  title: string;
  audit_type: string;
  status: string;
  assigned_to: string;
  start_date: string;
  due_date: string;
  completion_date?: string;
  location?: string;
  department?: string;
  findings_count: number;
  related_standard?: string;
  created_at: string;
}

const Audits: React.FC = () => {
  const navigate = useNavigate();
  const [audits, setAudits] = useState<Audit[]>([]);
  const [filteredAudits, setFilteredAudits] = useState<Audit[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchAudits();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, audits]);

  const fetchAudits = async () => {
    setLoading(true);
    try {
      // Use the real audit service
      const { fetchAudits: loadAudits } = await import('@/services/realAuditService');
      const auditsData = await loadAudits();
      
      // Transform data to match the expected interface
      const transformedAudits = auditsData.map(audit => ({
        id: audit.id,
        title: audit.title,
        audit_type: audit.audit_type,
        status: audit.status,
        assigned_to: audit.assigned_to,
        start_date: audit.start_date,
        due_date: audit.due_date,
        completion_date: audit.completion_date,
        location: audit.location,
        department: audit.department,
        findings_count: audit.findings_count,
        related_standard: audit.related_standard,
        created_at: audit.created_at
      }));
      
      setAudits(transformedAudits);
    } catch (error) {
      console.error('Error fetching audits:', error);
      toast.error('Failed to load audits');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...audits];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(audit =>
        audit.title.toLowerCase().includes(query) ||
        audit.audit_type.toLowerCase().includes(query) ||
        audit.location?.toLowerCase().includes(query)
      );
    }

    setFilteredAudits(filtered);
  };

  const handleAuditClick = (audit: Audit) => {
    navigate(`/audits/${audit.id}`);
  };

  const getStats = () => {
    const total = audits.length;
    const scheduled = audits.filter(a => a.status === 'Scheduled').length;
    const inProgress = audits.filter(a => a.status === 'In Progress').length;
    const completed = audits.filter(a => a.status === 'Completed').length;

    return [
      { label: 'Total Audits', value: total, color: 'text-blue-600', bgColor: 'bg-blue-500' },
      { label: 'Scheduled', value: scheduled, color: 'text-blue-600', bgColor: 'bg-blue-500' },
      { label: 'In Progress', value: inProgress, color: 'text-yellow-600', bgColor: 'bg-yellow-500' },
      { label: 'Completed', value: completed, color: 'text-green-600', bgColor: 'bg-green-500' }
    ];
  };

  const columns = [
    {
      key: 'title',
      label: 'Audit',
      render: (value: string, item: Audit) => (
        <div className="cursor-pointer hover:text-primary" onClick={() => handleAuditClick(item)}>
          <div className="font-medium">{value}</div>
          <div className="text-xs text-muted-foreground flex items-center gap-2">
            <span>{item.audit_type}</span>
            {item.location && (
              <>
                <span>•</span>
                <MapPin className="h-3 w-3" />
                <span>{item.location}</span>
              </>
            )}
          </div>
        </div>
      )
    },
    { key: 'status', label: 'Status' },
    { key: 'assigned_to', label: 'Auditor' },
    { key: 'start_date', label: 'Start Date' },
    { key: 'due_date', label: 'Due Date' },
    {
      key: 'findings_count',
      label: 'Findings',
      render: (value: number) => (
        <span className={value > 0 ? 'text-red-600 font-medium' : 'text-muted-foreground'}>
          {value}
        </span>
      )
    }
  ];

  const actions = (
    <Button variant="outline" onClick={fetchAudits} disabled={loading}>
      <RefreshCcw className="h-4 w-4 mr-2" />
      Refresh
    </Button>
  );

  return (
    <div className="p-6">
      <ModuleLayout
        title="Audit Management"
        subtitle="Schedule, conduct, and track audit activities"
        searchPlaceholder="Search audits by title, type, or location..."
        onSearch={setSearchQuery}
        onCreateNew={() => navigate('/audits/create')}
        createButtonText="Schedule Audit"
        stats={getStats()}
        actions={actions}
      >
        <DataTable
          columns={columns}
          data={filteredAudits}
          loading={loading}
          onView={handleAuditClick}
          emptyMessage="No audits found"
        />
      </ModuleLayout>
    </div>
  );
};

export default Audits;
