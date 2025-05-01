
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus, FilterX, SlidersHorizontal } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { NonConformance } from '@/types/non-conformance';
import NCDetails from '@/components/non-conformance/NCDetails';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import DashboardHeader from '@/components/DashboardHeader';
import Breadcrumbs from '@/components/layout/Breadcrumbs';

const NonConformancePage = () => {
  const [nonConformances, setNonConformances] = useState<NonConformance[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedNCId, setSelectedNCId] = useState<string | null>(null);
  const [showNCDetails, setShowNCDetails] = useState(false);
  const [selectedNC, setSelectedNC] = useState<NonConformance | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Mock data for now
    const mockData: NonConformance[] = [
      {
        id: 'NC-2023-001',
        title: 'Foreign material in product batch',
        description: 'Metal fragments detected during quality inspection',
        item_name: 'Product Batch 12345',
        item_category: 'Finished Product',
        reason_category: 'Foreign Material',
        status: 'On Hold',
        reported_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: 'Quality Inspector',
        assigned_to: 'Quality Manager',
        capa_id: 'CAPA-2023-001',
        reason_details: 'Metal contamination',
        department: 'Production',
        location: 'Production Line 3',
        risk_level: 'Critical',
        quantity: 100,
        quantity_on_hold: 100,
        resolution_date: null,
        resolution_details: null,
        review_date: null,
        reviewer: null
      },
      {
        id: 'NC-2023-002',
        title: 'Incorrect labeling on packaging',
        description: 'Incorrect expiration date printed on product labels',
        item_name: 'Product Batch 67890',
        item_category: 'Packaging',
        reason_category: 'Quality Issue',
        status: 'Under Investigation',
        reported_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: 'Packaging Operator',
        assigned_to: 'Production Supervisor',
        capa_id: null,
        reason_details: 'Misprint on labels',
        department: 'Packaging',
        location: 'Packaging Line 1',
        risk_level: 'Major',
        quantity: 500,
        quantity_on_hold: 500,
        resolution_date: null,
        resolution_details: null,
        review_date: null,
        reviewer: null
      }
    ];
    setNonConformances(mockData);
  }, []);

  const handleViewDetails = (id: string) => {
    const nc = nonConformances.find(nc => nc.id === id) || null;
    setSelectedNC(nc);
    setSelectedNCId(id);
    setShowNCDetails(true);
  };

  const handleCreateNC = () => {
    navigate('/non-conformance/create');
  };

  const resetFilters = () => {
    setSearchQuery('');
    toast({
      title: "Filters Reset",
      description: "All filters have been cleared"
    });
  };

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
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => toast({
                title: "Advanced Filters",
                description: "Advanced filtering options"
              })}
            >
              <SlidersHorizontal className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
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
          {nonConformances.map((nc) => (
            <Card key={nc.id} className="hover:bg-gray-50 transition-colors">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-grow">
                    <h3 className="font-medium">{nc.title}</h3>
                    <p className="text-sm text-gray-500 mt-1 truncate">{nc.description}</p>
                  </div>

                  <div className="flex flex-col sm:items-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleViewDetails(nc.id)}>
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
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
