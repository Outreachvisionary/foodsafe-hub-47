
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, RefreshCcw } from 'lucide-react';
import ProtectedSidebarLayout from '@/components/layout/ProtectedSidebarLayout';
import { LoadingState } from '@/components/ui/enhanced-loading';
import { fetchComplaints, getComplaintStatistics } from '@/services/complaintService';
import { Complaint } from '@/types/complaint';
import { ComplaintStatus, ComplaintCategory } from '@/types/enums';
import ComplaintStatsCards from '@/components/complaints/ComplaintStatsCards';
import ComplaintFilters from '@/components/complaints/ComplaintFilters';
import ComplaintsList from '@/components/complaints/ComplaintsList';
import { toast } from 'sonner';

const Complaints: React.FC = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    investigating: 0,
    resolved: 0,
    escalated: 0,
  });

  useEffect(() => {
    loadComplaints();
    loadStats();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [complaints, searchTerm, selectedStatus, selectedCategory]);

  const loadComplaints = async () => {
    try {
      setLoading(true);
      const complaintsData = await fetchComplaints();
      setComplaints(complaintsData);
    } catch (error) {
      console.error('Error loading complaints:', error);
      toast.error('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statistics = await getComplaintStatistics();
      setStats({
        total: statistics.total,
        new: statistics.byStatus['New'] || 0,
        investigating: statistics.byStatus['Under Investigation'] || 0,
        resolved: statistics.byStatus['Resolved'] || 0,
        escalated: statistics.byStatus['Escalated'] || 0,
      });
    } catch (error) {
      console.error('Error loading complaint statistics:', error);
    }
  };

  const applyFilters = () => {
    let filtered = [...complaints];

    // Apply search filter
    if (searchTerm) {
      const query = searchTerm.toLowerCase();
      filtered = filtered.filter(complaint =>
        complaint.title.toLowerCase().includes(query) ||
        complaint.description.toLowerCase().includes(query) ||
        complaint.customer_name?.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(complaint => complaint.status === selectedStatus);
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(complaint => complaint.category === selectedCategory);
    }

    setFilteredComplaints(filtered);
  };

  const handleRefresh = async () => {
    await Promise.all([loadComplaints(), loadStats()]);
    toast.success('Complaints refreshed');
  };

  return (
    <ProtectedSidebarLayout>
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Complaints Management</h1>
              <p className="text-muted-foreground text-lg">
                Track and manage customer complaints with automated CAPA integration
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleRefresh} disabled={loading}>
                <RefreshCcw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button onClick={() => navigate('/complaints/create')}>
                <Plus className="h-4 w-4 mr-2" />
                Log Complaint
              </Button>
            </div>
          </div>
        </div>

        <LoadingState
          isLoading={loading}
          error={null}
        >
          <ComplaintStatsCards stats={stats} />

          <Tabs defaultValue="all" className="space-y-6">
            <TabsList>
              <TabsTrigger value="all">All Complaints</TabsTrigger>
              <TabsTrigger value="new">New ({stats.new})</TabsTrigger>
              <TabsTrigger value="investigating">Investigating ({stats.investigating})</TabsTrigger>
              <TabsTrigger value="resolved">Resolved ({stats.resolved})</TabsTrigger>
              {stats.escalated > 0 && (
                <TabsTrigger value="escalated">Escalated ({stats.escalated})</TabsTrigger>
              )}
            </TabsList>

            <ComplaintFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              stats={stats}
            />

            <TabsContent value="all">
              <ComplaintsList 
                complaints={filteredComplaints} 
                onRefresh={handleRefresh}
              />
            </TabsContent>

            <TabsContent value="new">
              <ComplaintsList 
                complaints={filteredComplaints.filter(c => c.status === 'New')} 
                onRefresh={handleRefresh}
              />
            </TabsContent>

            <TabsContent value="investigating">
              <ComplaintsList 
                complaints={filteredComplaints.filter(c => c.status === 'Under Investigation')} 
                onRefresh={handleRefresh}
              />
            </TabsContent>

            <TabsContent value="resolved">
              <ComplaintsList 
                complaints={filteredComplaints.filter(c => c.status === 'Resolved')} 
                onRefresh={handleRefresh}
              />
            </TabsContent>

            {stats.escalated > 0 && (
              <TabsContent value="escalated">
                <ComplaintsList 
                  complaints={filteredComplaints.filter(c => c.status === 'Escalated')} 
                  onRefresh={handleRefresh}
                />
              </TabsContent>
            )}
          </Tabs>
        </LoadingState>
      </div>
    </ProtectedSidebarLayout>
  );
};

export default Complaints;
