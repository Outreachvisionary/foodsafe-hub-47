
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus, FilterX, SlidersHorizontal } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { NonConformance } from '@/types/non-conformance';
import NCDetails from '@/components/non-conformance/NCDetails';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import DashboardHeader from '@/components/DashboardHeader';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import useNonConformances from '@/hooks/useNonConformances';

const NonConformancePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedNC, setSelectedNC] = useState<NonConformance | null>(null);
  const [showNCDetails, setShowNCDetails] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { nonConformances, isLoading, error, refresh } = useNonConformances();

  const handleViewDetails = (nc: NonConformance) => {
    setSelectedNC(nc);
    setShowNCDetails(true);
  };

  const handleCreateNC = () => {
    navigate('/non-conformance/new');
  };

  const resetFilters = () => {
    setSearchQuery('');
    toast({
      title: "Filters Reset",
      description: "All filters have been cleared"
    });
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Filter non-conformances based on search query
  const filteredNonConformances = nonConformances.filter(nc => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      nc.title.toLowerCase().includes(query) ||
      nc.description?.toLowerCase().includes(query) ||
      nc.id.toLowerCase().includes(query) ||
      nc.item_name.toLowerCase().includes(query)
    );
  });

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader
          title="Non-Conformance Management"
          subtitle="Identify, track, and resolve non-conforming materials and products"
        />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-red-600">Error loading non-conformances: {error.message}</p>
              <Button onClick={refresh} className="mt-4">
                Try Again
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader
        title="Non-Conformance Management"
        subtitle="Identify, track, and resolve non-conforming materials and products"
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Breadcrumbs />

        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="flex-1 flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search non-conformances..."
                className="pl-8"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>

            <Button
              variant="outline"
              size="icon"
              type="button"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              type="button"
              onClick={resetFilters}
            >
              <FilterX className="h-4 w-4" />
            </Button>
          </div>

          <Button onClick={handleCreateNC}>
            <Plus className="h-4 w-4 mr-2" />
            Create Non-Conformance
          </Button>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : filteredNonConformances.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                <p>No non-conformances found.</p>
                <p className="text-sm mt-1">
                  {searchQuery ? 'Try adjusting your search terms.' : 'Create a new non-conformance to get started.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredNonConformances.map((nc) => (
              <Card key={nc.id} className="hover:bg-gray-50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium">{nc.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          nc.status === 'On Hold' ? 'bg-yellow-100 text-yellow-800' :
                          nc.status === 'Under Review' ? 'bg-blue-100 text-blue-800' :
                          nc.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {nc.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mb-1">
                        Item: {nc.item_name} | Category: {nc.item_category}
                      </p>
                      <p className="text-sm text-gray-500 truncate">{nc.description}</p>
                    </div>

                    <div className="flex flex-col sm:items-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleViewDetails(nc)}>
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
        
        {showNCDetails && selectedNC && (
          <Dialog open={showNCDetails} onOpenChange={setShowNCDetails}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <NCDetails 
                id={selectedNC.id}
                title={selectedNC.title}
                status={selectedNC.status.toString()}
                description={selectedNC.description}
                itemName={selectedNC.item_name}
                itemCategory={selectedNC.item_category.toString()}
                reportedDate={selectedNC.reported_date}
                createdBy={selectedNC.created_by}
                assignedTo={selectedNC.assigned_to}
                reviewDate={selectedNC.review_date}
                resolutionDate={selectedNC.resolution_date}
                quantity={selectedNC.quantity}
                quantityOnHold={selectedNC.quantity_on_hold}
                units={selectedNC.units}
                reasonCategory={selectedNC.reason_category?.toString()}
                reasonDetails={selectedNC.reason_details}
                resolution={selectedNC.resolution_details}
              />
            </DialogContent>
          </Dialog>
        )}
      </main>
    </div>
  );
};

export default NonConformancePage;
