
import React, { useState } from 'react';
import ProtectedSidebarLayout from '@/components/layout/ProtectedSidebarLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, CheckCircle, Clock, AlertCircle, Search, Plus, FileText, TrendingUp } from 'lucide-react';
import { useInternalAudits } from '@/hooks/useInternalAudits';

const InternalAudits = () => {
  const { audits, loading, error, loadAudits } = useInternalAudits();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'In Progress':
        return <Clock className="h-4 w-4" />;
      case 'Scheduled':
        return <Calendar className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Scheduled':
        return 'bg-yellow-100 text-yellow-800';
      case 'Overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <ProtectedSidebarLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </ProtectedSidebarLayout>
    );
  }

  if (error) {
    return (
      <ProtectedSidebarLayout>
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">Error loading audits: {error}</p>
          <Button onClick={loadAudits}>Try Again</Button>
        </div>
      </ProtectedSidebarLayout>
    );
  }

  const filteredAudits = audits.filter(audit => {
    const matchesSearch = audit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         audit.audit_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         audit.assigned_to.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || audit.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const scheduledAudits = filteredAudits.filter(audit => audit.status === 'Scheduled');
  const inProgressAudits = filteredAudits.filter(audit => audit.status === 'In Progress');
  const completedAudits = filteredAudits.filter(audit => audit.status === 'Completed');

  const auditStats = {
    total: audits.length,
    scheduled: scheduledAudits.length,
    inProgress: inProgressAudits.length,
    completed: completedAudits.length,
    overdue: 0 // Calculate based on due dates if needed
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
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Schedule Audit
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Audits</p>
                  <p className="text-2xl font-bold">{auditStats.total}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Scheduled</p>
                  <p className="text-2xl font-bold">{auditStats.scheduled}</p>
                </div>
                <Calendar className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                  <p className="text-2xl font-bold">{auditStats.inProgress}</p>
                </div>
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">{auditStats.completed}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="list" className="space-y-6">
          <TabsList>
            <TabsTrigger value="list">Audit List</TabsTrigger>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search audits..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant={selectedStatus === 'all' ? 'default' : 'outline'}
                      onClick={() => setSelectedStatus('all')}
                    >
                      All ({audits.length})
                    </Button>
                    <Button 
                      variant={selectedStatus === 'Scheduled' ? 'default' : 'outline'}
                      onClick={() => setSelectedStatus('Scheduled')}
                    >
                      Scheduled ({auditStats.scheduled})
                    </Button>
                    <Button 
                      variant={selectedStatus === 'In Progress' ? 'default' : 'outline'}
                      onClick={() => setSelectedStatus('In Progress')}
                    >
                      In Progress ({auditStats.inProgress})
                    </Button>
                    <Button 
                      variant={selectedStatus === 'Completed' ? 'default' : 'outline'}
                      onClick={() => setSelectedStatus('Completed')}
                    >
                      Completed ({auditStats.completed})
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Audit List */}
            <div className="space-y-4">
              {filteredAudits.map((audit) => (
                <Card key={audit.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{audit.title}</h3>
                          <Badge className={getStatusColor(audit.status)}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(audit.status)}
                              {audit.status}
                            </div>
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                          <div>
                            <strong>Type:</strong> {audit.audit_type}
                          </div>
                          <div>
                            <strong>Assigned to:</strong> {audit.assigned_to}
                          </div>
                          <div>
                            <strong>Findings:</strong> {audit.findings_count}
                          </div>
                          <div>
                            <strong>Start Date:</strong> {formatDate(audit.start_date)}
                          </div>
                          <div>
                            <strong>Due Date:</strong> {formatDate(audit.due_date)}
                          </div>
                          {audit.completion_date && (
                            <div>
                              <strong>Completed:</strong> {formatDate(audit.completion_date)}
                            </div>
                          )}
                        </div>

                        {audit.description && (
                          <p className="mt-3 text-sm text-muted-foreground">
                            {audit.description}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        <Button variant="outline" size="sm">
                          Generate Report
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredAudits.length === 0 && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-500">No audits found matching your criteria</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="calendar">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Audit Calendar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500">Calendar view for scheduled audits coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Audit Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500">Advanced analytics and reporting coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedSidebarLayout>
  );
};

export default InternalAudits;
