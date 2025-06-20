
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import ProtectedSidebarLayout from '@/components/layout/ProtectedSidebarLayout';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { LoadingState } from '@/components/ui/enhanced-loading';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import FacilityStatsCards from '@/components/facilities/FacilityStatsCards';
import FacilityFiltersCard from '@/components/facilities/FacilityFiltersCard';
import FacilityCard from '@/components/facilities/FacilityCard';

const Facilities = () => {
  const { user, loading: authLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [facilities, setFacilities] = useState<any[]>([]);

  useEffect(() => {
    // Simulate loading facilities data
    const loadFacilities = async () => {
      try {
        setLoading(true);
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockFacilities = [
          {
            id: '1',
            name: 'Main Production Facility',
            description: 'Primary manufacturing and processing facility',
            address: '123 Industrial Blvd, Manufacturing City, MC 12345',
            city: 'Manufacturing City',
            state: 'MC',
            country: 'United States',
            contactEmail: 'facility1@company.com',
            contactPhone: '+1 (555) 123-4567',
            status: 'active',
            employeeCount: 85,
            activeStandards: 3,
            complianceScore: 92,
            lastAudit: '2024-05-15'
          },
          {
            id: '2',
            name: 'Distribution Center',
            description: 'Warehousing and distribution operations',
            address: '456 Logistics Ave, Distribution City, DC 67890',
            city: 'Distribution City',
            state: 'DC',
            country: 'United States',
            contactEmail: 'warehouse@company.com',
            contactPhone: '+1 (555) 234-5678',
            status: 'active',
            employeeCount: 42,
            activeStandards: 2,
            complianceScore: 88,
            lastAudit: '2024-04-20'
          },
          {
            id: '3',
            name: 'R&D Laboratory',
            description: 'Research and development testing facility',
            address: '789 Innovation Dr, Tech City, TC 54321',
            city: 'Tech City',
            state: 'TC',
            country: 'United States',
            contactEmail: 'lab@company.com',
            contactPhone: '+1 (555) 345-6789',
            status: 'maintenance',
            employeeCount: 15,
            activeStandards: 1,
            complianceScore: 76,
            lastAudit: '2024-03-10'
          }
        ];
        
        setFacilities(mockFacilities);
      } catch (error) {
        console.error('Error loading facilities:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadFacilities();
    }
  }, [user]);

  if (authLoading) {
    return (
      <LoadingState 
        isLoading={true} 
        loadingComponent={
          <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
            </div>
          </div>
        }
      >
        <div />
      </LoadingState>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Filter facilities based on search and status
  const filteredFacilities = facilities.filter(facility => {
    const matchesSearch = facility.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         facility.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         facility.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || facility.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const facilityStats = {
    total: facilities.length,
    active: facilities.filter(f => f.status === 'active').length,
    totalEmployees: facilities.reduce((sum, f) => sum + f.employeeCount, 0),
    avgCompliance: Math.round(facilities.reduce((sum, f) => sum + f.complianceScore, 0) / facilities.length) || 0
  };

  return (
    <ProtectedSidebarLayout>
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Facilities</h1>
              <p className="text-muted-foreground text-lg">
                Manage facility information and compliance status
              </p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Facility
            </Button>
          </div>
        </div>

        <LoadingState
          isLoading={loading}
          error={null}
          loadingComponent={
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-sm text-muted-foreground">Loading facilities...</p>
            </div>
          }
        >
          <ErrorBoundary>
            <FacilityStatsCards stats={facilityStats} />
          </ErrorBoundary>

          <ErrorBoundary>
            <FacilityFiltersCard
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              filterStatus={filterStatus}
              onFilterStatusChange={setFilterStatus}
            />
          </ErrorBoundary>

          <ErrorBoundary>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredFacilities.map((facility) => (
                <FacilityCard key={facility.id} facility={facility} />
              ))}
            </div>
          </ErrorBoundary>
        </LoadingState>
      </div>
    </ProtectedSidebarLayout>
  );
};

export default Facilities;
