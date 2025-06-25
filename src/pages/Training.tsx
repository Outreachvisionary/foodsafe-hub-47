
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { RefreshCcw, Users, BookOpen } from 'lucide-react';
import ModuleLayout from '@/components/shared/ModuleLayout';
import DataTable from '@/components/shared/DataTable';
import { TrainingSession } from '@/services/trainingPlanService';
import { trainingPlanService } from '@/services/trainingPlanService';
import { toast } from 'sonner';

const Training: React.FC = () => {
  const navigate = useNavigate();
  const [trainingSessions, setTrainingSessions] = useState<TrainingSession[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<TrainingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchTrainingSessions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, trainingSessions]);

  const fetchTrainingSessions = async () => {
    setLoading(true);
    try {
      const data = await trainingPlanService.getTrainingSessions();
      setTrainingSessions(data);
    } catch (error) {
      console.error('Error fetching training sessions:', error);
      toast.error('Failed to load training sessions');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...trainingSessions];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(session =>
        session.title.toLowerCase().includes(query) ||
        session.description?.toLowerCase().includes(query) ||
        session.training_category.toLowerCase().includes(query)
      );
    }

    setFilteredSessions(filtered);
  };

  const handleSessionClick = (session: TrainingSession) => {
    navigate(`/training/${session.id}`);
  };

  const getStats = () => {
    const total = trainingSessions.length;
    const notStarted = trainingSessions.filter(s => s.completion_status === 'Not Started').length;
    const inProgress = trainingSessions.filter(s => s.completion_status === 'In Progress').length;
    const completed = trainingSessions.filter(s => s.completion_status === 'Completed').length;

    return [
      { label: 'Total Sessions', value: total, color: 'text-blue-600', bgColor: 'bg-blue-500' },
      { label: 'Not Started', value: notStarted, color: 'text-gray-600', bgColor: 'bg-gray-500' },
      { label: 'In Progress', value: inProgress, color: 'text-yellow-600', bgColor: 'bg-yellow-500' },
      { label: 'Completed', value: completed, color: 'text-green-600', bgColor: 'bg-green-500' }
    ];
  };

  const columns = [
    {
      key: 'title',
      label: 'Training Session',
      render: (value: string, item: TrainingSession) => (
        <div className="cursor-pointer hover:text-primary" onClick={() => handleSessionClick(item)}>
          <div className="font-medium">{value}</div>
          <div className="text-xs text-muted-foreground">{item.training_category}</div>
        </div>
      )
    },
    { key: 'completion_status', label: 'Status' },
    { key: 'training_type', label: 'Type' },
    { key: 'assigned_to', label: 'Assigned To', render: (value: string[]) => `${value?.length || 0} employees` },
    { key: 'start_date', label: 'Start Date' },
    { key: 'due_date', label: 'Due Date' }
  ];

  const actions = (
    <Button variant="outline" onClick={fetchTrainingSessions} disabled={loading}>
      <RefreshCcw className="h-4 w-4 mr-2" />
      Refresh
    </Button>
  );

  return (
    <div className="p-6">
      <ModuleLayout
        title="Training Management"
        subtitle="Manage employee training sessions and certifications"
        searchPlaceholder="Search training sessions..."
        onSearch={setSearchQuery}
        onCreateNew={() => navigate('/training/create')}
        createButtonText="Create Training Session"
        stats={getStats()}
        actions={actions}
      >
        <DataTable
          columns={columns}
          data={filteredSessions}
          loading={loading}
          onView={handleSessionClick}
          emptyMessage="No training sessions found"
        />
      </ModuleLayout>
    </div>
  );
};

export default Training;
