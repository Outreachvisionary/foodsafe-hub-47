
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus,
  Search,
  Filter,
  RefreshCcw
} from 'lucide-react';
import { useFacilityStandards, useComplianceOverview } from '@/hooks/useStandards';
import { StandardsFilter } from '@/types/standards';
import StandardsOverviewCards from '@/components/standards/StandardsOverviewCards';
import StandardCard from '@/components/standards/StandardCard';
import { LoadingState } from '@/components/ui/enhanced-loading';

const Standards = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  const { data: facilityStandards = [], isLoading: isLoadingStandards, refetch } = useFacilityStandards();
  const { data: complianceOverview, isLoading: isLoadingOverview } = useComplianceOverview();

  // Filter standards based on search and status
  const filteredStandards = facilityStandards.filter(standard => {
    const matchesSearch = !searchQuery || 
      standard.standard_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      standard.standard_code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      standard.facility_name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || standard.compliance_status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleRefresh = () => {
    refetch();
  };

  const handleViewStandard = (standard: any) => {
    navigate(`/standards/${standard.id}`);
  };

  const handleEditStandard = (standard: any) => {
    navigate(`/standards/edit/${standard.id}`);
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Standards Compliance</h1>
            <p className="text-muted-foreground text-lg">
              Track compliance with regulatory and quality standards across all facilities
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRefresh} disabled={isLoadingStandards}>
              <RefreshCcw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={() => navigate('/standards/create')}>
              <Plus className="h-4 w-4 mr-2" />
              Add Standard
            </Button>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <StandardsOverviewCards 
        compliance={complianceOverview || {
          totalStandards: 0,
          certified: 0,
          compliant: 0,
          inProgress: 0,
          expired: 0,
          expiringSoon: 0,
          averageCompliance: 0
        }}
        isLoading={isLoadingOverview}
      />

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search standards, codes, or facilities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select 
                className="px-3 py-2 border rounded-md bg-background"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="Certified">Certified</option>
                <option value="Compliant">Compliant</option>
                <option value="In Progress">In Progress</option>
                <option value="Non-Compliant">Non-Compliant</option>
                <option value="Expired">Expired</option>
              </select>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Standards Grid */}
      <LoadingState isLoading={isLoadingStandards}>
        {filteredStandards.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <p className="text-muted-foreground mb-4">No standards found matching your criteria</p>
              <Button onClick={() => navigate('/standards/create')}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Standard
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredStandards.map((standard) => (
              <StandardCard
                key={standard.id}
                standard={standard}
                onView={handleViewStandard}
                onEdit={handleEditStandard}
                showFacilityInfo={true}
              />
            ))}
          </div>
        )}
      </LoadingState>
    </div>
  );
};

export default Standards;
