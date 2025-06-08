
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
import { supabase } from '@/integrations/supabase/client';

interface NCListProps {
  onItemClick?: (nc: NonConformance) => void;
  onCreateNew?: () => void;
}

const NCList: React.FC<NCListProps> = ({ onItemClick, onCreateNew }) => {
  const [nonConformances, setNonConformances] = useState<NonConformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredNCs, setFilteredNCs] = useState<NonConformance[]>([]);

  useEffect(() => {
    fetchNonConformances();
  }, []);

  const fetchNonConformances = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('non_conformances')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedData: NonConformance[] = (data || []).map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        status: item.status as NCStatus,
        reported_date: item.reported_date,
        created_at: item.created_at,
        updated_at: item.updated_at,
        item_name: item.item_name,
        item_category: item.item_category,
        created_by: item.created_by,
        assigned_to: item.assigned_to,
        reviewer: item.reviewer,
        resolution_details: item.resolution_details,
        location: item.location,
        department: item.department,
        priority: item.priority,
        risk_level: item.risk_level,
        tags: item.tags,
        units: item.units,
        quantity: item.quantity,
        quantity_on_hold: item.quantity_on_hold,
        item_id: item.item_id,
        reason_details: item.reason_details,
        review_date: item.review_date,
        resolution_date: item.resolution_date,
        capa_id: item.capa_id,
        reason_category: item.reason_category
      }));

      setNonConformances(transformedData);
      setFilteredNCs(transformedData);
    } catch (error) {
      console.error('Error fetching non-conformances:', error);
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading non-conformances...</div>
      </div>
    );
  }

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
        <Card className="cursor-pointer hover:shadow-md" onClick={() => handleStatusFilter('On_Hold')}>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{counts.open}</div>
            <div className="text-sm text-muted-foreground">Open</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md" onClick={() => handleStatusFilter('Under_Review')}>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{counts.inReview}</div>
            <div className="text-sm text-muted-foreground">In Review</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md" onClick={() => handleStatusFilter('Resolved')}>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{counts.resolved}</div>
            <div className="text-sm text-muted-foreground">Resolved</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md" onClick={() => handleStatusFilter('Closed')}>
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

      {filteredNCs.length === 0 && !loading && (
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
