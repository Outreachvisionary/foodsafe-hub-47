
import React, { useState } from 'react';
import { Complaint } from '@/types/complaint';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FilePlus } from 'lucide-react';
import ComplaintsList from '@/components/complaints/ComplaintsList';
import ComplaintFilters from '@/components/complaints/ComplaintFilters';
import ComplaintDetail from '@/components/complaints/ComplaintDetail';
import NewComplaintForm from '@/components/complaints/NewComplaintForm';
import useComplaints from '@/hooks/useComplaints';
import { ComplaintStatus } from '@/types/enums';

const ComplaintsManagement: React.FC = () => {
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isNewComplaintOpen, setIsNewComplaintOpen] = useState(false);
  
  const {
    complaints,
    isLoading,
    error,
    refresh,
    applyFilter,
    clearFilter
  } = useComplaints();

  const handleComplaintClick = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
  };

  const handleGoBack = () => {
    setSelectedComplaint(null);
  };

  const handleCreateSuccess = () => {
    refresh();
    setIsNewComplaintOpen(false);
  };

  const handleFilterChange = (filters: any) => {
    applyFilter(filters);
  };

  const handleFilterClear = () => {
    clearFilter();
  };

  return (
    <div className="container mx-auto py-6">
      {!selectedComplaint ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">Complaints Management</h1>
              <p className="text-muted-foreground">
                Manage and track customer complaints and issues
              </p>
            </div>
            
            <Dialog open={isNewComplaintOpen} onOpenChange={setIsNewComplaintOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center">
                  <FilePlus className="mr-2 h-4 w-4" />
                  New Complaint
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Create New Complaint</DialogTitle>
                </DialogHeader>
                <NewComplaintForm 
                  onSubmit={handleCreateSuccess}
                  onCancel={() => setIsNewComplaintOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
          
          <Tabs defaultValue="all" className="w-full">
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="all">All Complaints</TabsTrigger>
                <TabsTrigger value="new">New</TabsTrigger>
                <TabsTrigger value="open">Under Investigation</TabsTrigger>
                <TabsTrigger value="resolved">Resolved</TabsTrigger>
              </TabsList>
              
              <div className="text-sm text-muted-foreground">
                {complaints.length} {complaints.length === 1 ? 'complaint' : 'complaints'} found
              </div>
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
              />
            </TabsContent>
            
            <TabsContent value="new">
              <ComplaintsList 
                complaints={complaints.filter(c => c.status === ComplaintStatus.New)}
                isLoading={isLoading}
                onSelectComplaint={handleComplaintClick}
              />
            </TabsContent>
            
            <TabsContent value="open">
              <ComplaintsList 
                complaints={complaints.filter(c => c.status === ComplaintStatus.Under_Investigation)}
                isLoading={isLoading}
                onSelectComplaint={handleComplaintClick}
              />
            </TabsContent>
            
            <TabsContent value="resolved">
              <ComplaintsList 
                complaints={complaints.filter(c => c.status === ComplaintStatus.Resolved || c.status === ComplaintStatus.Closed)}
                isLoading={isLoading}
                onSelectComplaint={handleComplaintClick}
              />
            </TabsContent>
          </Tabs>
          
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-800">
              <p className="font-medium">Error loading complaints</p>
              <p className="text-sm">{error.message}</p>
            </div>
          )}
        </>
      ) : (
        <ComplaintDetail 
          complaint={selectedComplaint}
          onBack={handleGoBack}
          onUpdate={() => {
            refresh();
            // Update the selected complaint with the refreshed data
            const updated = complaints.find(c => c.id === selectedComplaint.id);
            if (updated) {
              setSelectedComplaint(updated);
            }
          }}
        />
      )}
    </div>
  );
};

export default ComplaintsManagement;
