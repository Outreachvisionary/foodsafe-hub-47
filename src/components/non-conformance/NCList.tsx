
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Plus } from 'lucide-react';
import { NonConformance } from '@/types/non-conformance';
import { NCStatus } from '@/types/enums';
import { stringToNCStatus } from '@/utils/typeAdapters';
import NCStatusBadge from './NCStatusBadge';

interface NCListProps {
  onItemClick?: (nc: NonConformance) => void;
  onCreateNew?: () => void;
}

const NCList: React.FC<NCListProps> = ({ onItemClick, onCreateNew }) => {
  const [nonConformances, setNonConformances] = useState<NonConformance[]>([
    {
      id: '1',
      title: 'Temperature deviation in cold storage',
      status: NCStatus.On_Hold,
      reported_date: '2024-01-15',
      created_at: '2024-01-15',
      updated_at: '2024-01-15',
      item_name: 'Frozen chicken',
      item_category: 'Raw Materials',
      created_by: 'John Doe'
    },
    {
      id: '2',
      title: 'Packaging material defect',
      status: NCStatus.Under_Review,
      reported_date: '2024-01-14',
      created_at: '2024-01-14',
      updated_at: '2024-01-14',
      item_name: 'Plastic containers',
      item_category: 'Packaging',
      created_by: 'Jane Smith'
    },
    {
      id: '3',
      title: 'Foreign object found in production line',
      status: NCStatus.Resolved,
      reported_date: '2024-01-13',
      created_at: '2024-01-13',
      updated_at: '2024-01-13',
      item_name: 'Metal fragment',
      item_category: 'Foreign Object',
      created_by: 'Mike Johnson'
    },
    {
      id: '4',
      title: 'Expired ingredient used in batch',
      status: NCStatus.Closed,
      reported_date: '2024-01-12',
      created_at: '2024-01-12',
      updated_at: '2024-01-12',
      item_name: 'Flour',
      item_category: 'Ingredient',
      created_by: 'Sarah Wilson'
    },
    {
      id: '5',
      title: 'Improper labeling on finished product',
      status: NCStatus.Released,
      reported_date: '2024-01-11',
      created_at: '2024-01-11',
      updated_at: '2024-01-11',
      item_name: 'Ready meals',
      item_category: 'Finished Product',
      created_by: 'Tom Brown'
    },
    {
      id: '6',
      title: 'Equipment malfunction affecting quality',
      status: NCStatus.Disposed,
      reported_date: '2024-01-10',
      created_at: '2024-01-10',
      updated_at: '2024-01-10',
      item_name: 'Mixer unit',
      item_category: 'Equipment',
      created_by: 'Lisa Davis'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredNCs, setFilteredNCs] = useState<NonConformance[]>(nonConformances);

  useEffect(() => {
    const filtered = nonConformances.filter(nc =>
      nc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      nc.item_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredNCs(filtered);
  }, [searchQuery, nonConformances]);

  const getStatusCounts = () => {
    const counts = {
      total: nonConformances.length,
      open: nonConformances.filter(nc => nc.status === NCStatus.On_Hold).length,
      inReview: nonConformances.filter(nc => nc.status === NCStatus.Under_Review).length,
      resolved: nonConformances.filter(nc => nc.status === NCStatus.Resolved).length,
      closed: nonConformances.filter(nc => nc.status === NCStatus.Closed).length,
    };
    return counts;
  };

  const counts = getStatusCounts();

  const handleStatusFilter = (status: string) => {
    if (status === 'all') {
      setFilteredNCs(nonConformances);
    } else {
      const ncStatus = stringToNCStatus(status);
      const filtered = nonConformances.filter(nc => nc.status === ncStatus);
      setFilteredNCs(filtered);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Non-Conformances</h2>
          <p className="text-muted-foreground">
            Track and manage quality issues
          </p>
        </div>
        {onCreateNew && (
          <Button onClick={onCreateNew}>
            <Plus className="h-4 w-4 mr-2" />
            Create NC
          </Button>
        )}
      </div>

      {/* Status Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="cursor-pointer hover:shadow-md" onClick={() => handleStatusFilter('all')}>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{counts.total}</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md" onClick={() => handleStatusFilter(NCStatus.On_Hold)}>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{counts.open}</div>
            <div className="text-sm text-muted-foreground">Open</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md" onClick={() => handleStatusFilter(NCStatus.Under_Review)}>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{counts.inReview}</div>
            <div className="text-sm text-muted-foreground">In Review</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md" onClick={() => handleStatusFilter(NCStatus.Resolved)}>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{counts.resolved}</div>
            <div className="text-sm text-muted-foreground">Resolved</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md" onClick={() => handleStatusFilter(NCStatus.Closed)}>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-600">{counts.closed}</div>
            <div className="text-sm text-muted-foreground">Closed</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search non-conformances..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* NC List */}
      <div className="grid gap-4">
        {filteredNCs.map((nc) => (
          <Card 
            key={nc.id} 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onItemClick?.(nc)}
          >
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">{nc.title}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Item:</span>
                      <div className="font-medium">{nc.item_name}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Category:</span>
                      <div className="font-medium">{nc.item_category}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Reported:</span>
                      <div className="font-medium">{formatDate(nc.reported_date)}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Created by:</span>
                      <div className="font-medium">{nc.created_by}</div>
                    </div>
                  </div>
                </div>
                <div className="ml-4">
                  <NCStatusBadge status={nc.status} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredNCs.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-muted-foreground">
              No non-conformances found matching your search criteria.
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NCList;
