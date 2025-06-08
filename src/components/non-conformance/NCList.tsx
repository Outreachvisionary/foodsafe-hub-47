
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { NonConformance } from '@/types/non-conformance';
import { NCStatus } from '@/types/enums';
import { stringToNCStatus } from '@/utils/typeAdapters';

interface FilterOptions {
  status?: NCStatus | NCStatus[];
  category?: string | string[];
  dateRange?: {
    start: string;
    end: string;
  };
  searchTerm?: string;
}

const NCList: React.FC = () => {
  const [nonConformances, setNonConformances] = useState<NonConformance[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({});
  const navigate = useNavigate();

  // Mock data for demonstration
  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      const mockData: NonConformance[] = [
        {
          id: '1',
          title: 'Quality Defect in Product A',
          status: NCStatus.On_Hold,
          reported_date: '2024-03-01',
          created_at: '2024-03-01',
          updated_at: '2024-03-01',
          item_name: 'Product A',
          item_category: 'Finished Product',
          created_by: 'john.doe@company.com',
        },
        {
          id: '2',
          title: 'Safety Issue in Packaging',
          status: NCStatus.Under_Review,
          reported_date: '2024-03-05',
          created_at: '2024-03-05',
          updated_at: '2024-03-05',
          item_name: 'Package X',
          item_category: 'Packaging',
          created_by: 'jane.smith@company.com',
        },
        {
          id: '3',
          title: 'Process Deviation in Line 3',
          status: NCStatus.Resolved,
          reported_date: '2024-03-10',
          created_at: '2024-03-10',
          updated_at: '2024-03-10',
          item_name: 'Process Y',
          item_category: 'Process',
          created_by: 'mike.johnson@company.com',
        },
        {
          id: '4',
          title: 'Equipment Failure on Machine Z',
          status: NCStatus.Closed,
          reported_date: '2024-03-15',
          created_at: '2024-03-15',
          updated_at: '2024-03-15',
          item_name: 'Machine Z',
          item_category: 'Equipment',
          created_by: 'sarah.wilson@company.com',
        },
        {
          id: '5',
          title: 'Documentation Error in SOP-001',
          status: NCStatus.Released,
          reported_date: '2024-03-20',
          created_at: '2024-03-20',
          updated_at: '2024-03-20',
          item_name: 'SOP-001',
          item_category: 'Documentation',
          created_by: 'tom.brown@company.com',
        },
        {
          id: '6',
          title: 'Another Quality Defect in Product B',
          status: NCStatus.Disposed,
          reported_date: '2024-03-25',
          created_at: '2024-03-25',
          updated_at: '2024-03-25',
          item_name: 'Product B',
          item_category: 'Finished Product',
          created_by: 'lisa.davis@company.com',
        },
      ];

      setNonConformances(mockData);
      setLoading(false);
    }, 500);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilterOptions(newFilters);
  };

  const filteredNonConformances = nonConformances.filter((nc) => {
    const searchRegex = new RegExp(searchQuery, 'i');
    const matchesSearch = searchRegex.test(nc.title) || searchRegex.test(nc.item_name);

    let matchesFilters = true;

    if (filterOptions.status) {
      if (Array.isArray(filterOptions.status)) {
        matchesFilters = matchesFilters && filterOptions.status.includes(nc.status);
      } else {
        matchesFilters = matchesFilters && nc.status === filterOptions.status;
      }
    }

    return matchesSearch && matchesFilters;
  });

  const getStatusBadgeColor = (status: NCStatus) => {
    switch (status) {
      case NCStatus.On_Hold:
        return 'bg-red-100 text-red-800';
      case NCStatus.Under_Review:
        return 'bg-yellow-100 text-yellow-800';
      case NCStatus.Released:
        return 'bg-green-100 text-green-800';
      case NCStatus.Disposed:
        return 'bg-gray-100 text-gray-800';
      case NCStatus.Resolved:
        return 'bg-blue-100 text-blue-800';
      case NCStatus.Closed:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const navigateToDetails = (id: string) => {
    navigate(`/non-conformances/${id}`);
  };

  if (loading) {
    return <div>Loading non-conformances...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Non-Conformances</CardTitle>
          <Button onClick={() => navigate('/non-conformances/new')}>
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0 md:space-x-4">
            <div className="flex items-center">
              <Input
                type="text"
                placeholder="Search non-conformances..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full md:w-auto"
              />
              <Search className="ml-2 h-4 w-4 text-gray-500" />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="mt-4">
        {filteredNonConformances.length === 0 ? (
          <p>No non-conformances found.</p>
        ) : (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredNonConformances.map((nc) => (
              <Card key={nc.id} className="cursor-pointer" onClick={() => navigateToDetails(nc.id)}>
                <CardHeader>
                  <CardTitle>{nc.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">Item: {nc.item_name}</p>
                  <p className="text-sm text-gray-500">Category: {nc.item_category}</p>
                  <div className="mt-2">
                    <Badge className={getStatusBadgeColor(nc.status)}>{nc.status}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NCList;
