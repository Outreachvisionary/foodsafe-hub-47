
import React, { useState } from 'react';
import { Complaint } from '@/types/complaint';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, RefreshCcw, MessageSquare, AlertTriangle, Clock, CheckCircle2 } from 'lucide-react';
import ComplaintsList from '@/components/complaints/ComplaintsList';
import ComplaintFilters from '@/components/complaints/ComplaintFilters';
import ComplaintDetail from '@/components/complaints/ComplaintDetail';
import NewComplaintForm from '@/components/complaints/NewComplaintForm';
import { useComplaints } from '@/hooks/useComplaints';
import { ComplaintStatus } from '@/types/enums';

const ComplaintsManagement: React.FC = () => {
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isNewComplaintOpen, setIsNewComplaintOpen] = useState(false);
  const [currentFilter, setCurrentFilter] = useState<any>(undefined);
  
  const {
    complaints,
    isLoading,
    error,
    refresh,
    createComplaint,
    isCreating
  } = useComplaints(currentFilter);

  const handleComplaintClick = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
  };

  const handleGoBack = () => {
    setSelectedComplaint(null);
  };

  const handleCreateComplaint = (data: any) => {
    createComplaint(data);
    setIsNewComplaintOpen(false);
  };

  const handleFilterChange = (filters: any) => {
    setCurrentFilter(filters);
  };

  const handleFilterClear = () => {
    setCurrentFilter(undefined);
  };

  const handleUpdate = () => {
    refresh();
    // Update the selected complaint with the refreshed data
    if (selectedComplaint) {
      const updated = complaints.find(c => c.id === selectedComplaint.id);
      if (updated) {
        setSelectedComplaint(updated);
      }
    }
  };

  // Calculate stats
  const stats = {
    total: complaints.length,
    new: complaints.filter(c => c.status === ComplaintStatus.New).length,
    investigating: complaints.filter(c => c.status === ComplaintStatus.Under_Investigation).length,
    resolved: complaints.filter(c => c.status === ComplaintStatus.Resolved || c.status === ComplaintStatus.Closed).length,
  };

  if (selectedComplaint) {
    return (
      <ComplaintDetail 
        complaint={selectedComplaint}
        onBack={handleGoBack}
        onUpdate={handleUpdate}
      />
    );
  }

  return (
    <div className="space-y-8 p-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
      {/* Header */}
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Complaints Management
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Track and manage customer complaints with comprehensive workflows and CAPA integration
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button 
              variant="outline"
              onClick={() => refresh()}
              className="shadow-lg hover:shadow-xl transition-all duration-300 border-blue-200 hover:border-blue-300 hover:bg-blue-50"
            >
              <RefreshCcw className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
            <Dialog open={isNewComplaintOpen} onOpenChange={setIsNewComplaintOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 text-white border-0">
                  <Plus className="h-4 w-4 mr-2" />
                  New Complaint
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Create New Complaint</DialogTitle>
                </DialogHeader>
                <NewComplaintForm 
                  onSubmit={handleCreateComplaint}
                  onCancel={() => setIsNewComplaintOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white transform hover:scale-105 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-blue-100 text-sm font-medium uppercase tracking-wide">Total Complaints</p>
                  <p className="text-3xl font-bold">{stats.total}</p>
                  <p className="text-blue-200 text-xs">All items</p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <MessageSquare className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-red-500 text-white transform hover:scale-105 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-orange-100 text-sm font-medium uppercase tracking-wide">New</p>
                  <p className="text-3xl font-bold">{stats.new}</p>
                  <p className="text-orange-200 text-xs">Need attention</p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <AlertTriangle className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-500 to-orange-500 text-white transform hover:scale-105 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-yellow-100 text-sm font-medium uppercase tracking-wide">Investigating</p>
                  <p className="text-3xl font-bold">{stats.investigating}</p>
                  <p className="text-yellow-200 text-xs">In progress</p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <Clock className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-emerald-500 text-white transform hover:scale-105 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-green-100 text-sm font-medium uppercase tracking-wide">Resolved</p>
                  <p className="text-3xl font-bold">{stats.resolved}</p>
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

      {/* Main Content */}
      <div className="bg-white rounded-2xl shadow-xl border-0 overflow-hidden">
        <div className="p-6">
          <Tabs defaultValue="all" className="w-full">
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="all">All Complaints ({stats.total})</TabsTrigger>
                <TabsTrigger value="new">New ({stats.new})</TabsTrigger>
                <TabsTrigger value="investigating">Investigating ({stats.investigating})</TabsTrigger>
                <TabsTrigger value="resolved">Resolved ({stats.resolved})</TabsTrigger>
              </TabsList>
            </div>
          
            <ComplaintFilters 
              onFilterChange={handleFilterChange}
              onFilterClear={handleFilterClear}
            />
            
            <TabsContent value="all">
              <ComplaintsList 
                complaints={complaints} 
                isLoading={isLoading}
                onSelectComplaint={handleComplaintClick}
                onUpdate={handleUpdate}
              />
            </TabsContent>
            
            <TabsContent value="new">
              <ComplaintsList 
                complaints={complaints.filter(c => c.status === ComplaintStatus.New)}
                isLoading={isLoading}
                onSelectComplaint={handleComplaintClick}
                onUpdate={handleUpdate}
              />
            </TabsContent>
            
            <TabsContent value="investigating">
              <ComplaintsList 
                complaints={complaints.filter(c => c.status === ComplaintStatus.Under_Investigation)}
                isLoading={isLoading}
                onSelectComplaint={handleComplaintClick}
                onUpdate={handleUpdate}
              />
            </TabsContent>
            
            <TabsContent value="resolved">
              <ComplaintsList 
                complaints={complaints.filter(c => c.status === ComplaintStatus.Resolved || c.status === ComplaintStatus.Closed)}
                isLoading={isLoading}
                onSelectComplaint={handleComplaintClick}
                onUpdate={handleUpdate}
              />
            </TabsContent>
          </Tabs>
          
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-800">
              <p className="font-medium">Error loading complaints</p>
              <p className="text-sm">{error.message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplaintsManagement;
