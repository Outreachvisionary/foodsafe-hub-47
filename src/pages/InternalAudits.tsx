
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProtectedSidebarLayout from '@/components/layout/ProtectedSidebarLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';
import { useInternalAudits } from '@/hooks/useInternalAudits';
import { LoadingState } from '@/components/ui/enhanced-loading';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import AuditStatsCards from '@/components/audits/AuditStatsCards';
import AuditFilters from '@/components/audits/AuditFilters';
import AuditListView from '@/components/audits/AuditListView';
import AuditCalendarView from '@/components/audits/AuditCalendarView';
import AuditAnalyticsView from '@/components/audits/AuditAnalyticsView';

const InternalAudits = () => {
  const navigate = useNavigate();
  const { audits, loading, error, loadAudits } = useInternalAudits();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredAudits = audits.filter(audit => {
    const matchesSearch = audit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         audit.audit_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         audit.assigned_to.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || audit.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const auditStats = {
    total: audits.length,
    scheduled: audits.filter(audit => audit.status === 'Scheduled').length,
    inProgress: audits.filter(audit => audit.status === 'In Progress').length,
    completed: audits.filter(audit => audit.status === 'Completed').length,
  };

  return (
    <ProtectedSidebarLayout>
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Internal Audits</h1>
              <p className="text-muted-foreground text-lg">
                Plan, execute, and track internal audit activities
              </p>
            </div>
            <Button onClick={() => navigate('/audits/create')}>
              <Plus className="h-4 w-4 mr-2" />
              Schedule Audit
            </Button>
          </div>
        </div>

        <LoadingState
          isLoading={loading}
          error={error}
          errorComponent={
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">Error loading audits: {error}</p>
              <Button onClick={loadAudits}>Try Again</Button>
            </div>
          }
        >
          <ErrorBoundary>
            <AuditStatsCards stats={auditStats} />
          </ErrorBoundary>

          <Tabs defaultValue="list" className="space-y-6">
            <TabsList>
              <TabsTrigger value="list">Audit List</TabsTrigger>
              <TabsTrigger value="calendar">Calendar View</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="space-y-6">
              <ErrorBoundary>
                <AuditFilters
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  selectedStatus={selectedStatus}
                  onStatusChange={setSelectedStatus}
                  stats={auditStats}
                />
                <AuditListView audits={filteredAudits} onRefresh={loadAudits} />
              </ErrorBoundary>
            </TabsContent>

            <TabsContent value="calendar">
              <ErrorBoundary>
                <AuditCalendarView audits={audits} />
              </ErrorBoundary>
            </TabsContent>

            <TabsContent value="analytics">
              <ErrorBoundary>
                <AuditAnalyticsView audits={audits} />
              </ErrorBoundary>
            </TabsContent>
          </Tabs>
        </LoadingState>
      </div>
    </ProtectedSidebarLayout>
  );
};

export default InternalAudits;
