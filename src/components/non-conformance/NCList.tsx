
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Plus, Eye, Edit, Trash } from 'lucide-react';
import { NonConformance } from '@/types/non-conformance';
import { useNonConformances } from '@/hooks/useNonConformances';

interface NCListProps {
  onItemClick?: (nc: NonConformance) => void;
  onCreateNew?: () => void;
  onEdit?: (nc: NonConformance) => void;
}

const NCList: React.FC<NCListProps> = ({ onItemClick, onCreateNew, onEdit }) => {
  const { nonConformances, isLoading, deleteNonConformance } = useNonConformances();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNCs = nonConformances.filter(nc =>
    nc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    nc.item_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'On Hold':
        return 'bg-yellow-100 text-yellow-800';
      case 'Under Review':
        return 'bg-blue-100 text-blue-800';
      case 'Resolved':
        return 'bg-green-100 text-green-800';
      case 'Closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
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
            Track and manage quality issues ({nonConformances.length} total)
          </p>
        </div>
        {onCreateNew && (
          <Button onClick={onCreateNew}>
            <Plus className="h-4 w-4 mr-2" />
            Create NC
          </Button>
        )}
      </div>

      {/* Search */}
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
                <div className="ml-4 flex items-center gap-2">
                  <Badge className={getStatusColor(nc.status)}>
                    {nc.status}
                  </Badge>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    onItemClick?.(nc);
                  }}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit?.(nc);
                  }}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('Are you sure you want to delete this non-conformance?')) {
                      deleteNonConformance(nc.id);
                    }
                  }}
                >
                  <Trash className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredNCs.length === 0 && !isLoading && (
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
