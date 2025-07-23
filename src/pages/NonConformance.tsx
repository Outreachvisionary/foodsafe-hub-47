import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCcw, Filter, Download, Plus, TrendingUp, AlertTriangle, CheckCircle, Eye, Edit } from 'lucide-react';
import NCQuickActions from '@/components/non-conformance/NCQuickActions';
import ModuleLayout from '@/components/shared/ModuleLayout';
import DataTable from '@/components/shared/DataTable';
import { NonConformance } from '@/types/non-conformance';
import { useNonConformances } from '@/hooks/useNonConformances';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';

const NonConformancePage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    nonConformances, 
    isLoading, 
    error, 
    createNonConformance, 
    refresh 
  } = useNonConformances();
  
  const [filteredNCs, setFilteredNCs] = useState<NonConformance[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterPriority, setFilterPriority] = useState<string>('');

  useEffect(() => {
    applyFilters();
  }, [searchQuery, filterStatus, filterPriority, nonConformances]);

  const applyFilters = () => {
    let filtered = [...nonConformances];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(nc =>
        nc.title?.toLowerCase().includes(query) ||
        nc.description?.toLowerCase().includes(query) ||
        nc.item_name?.toLowerCase().includes(query) ||
        nc.department?.toLowerCase().includes(query) ||
        nc.location?.toLowerCase().includes(query)
      );
    }

    if (filterStatus) {
      filtered = filtered.filter(nc => nc.status === filterStatus);
    }

    if (filterPriority) {
      filtered = filtered.filter(nc => nc.priority === filterPriority);
    }

    setFilteredNCs(filtered);
  };

  const handleNCClick = (nc: NonConformance) => {
    navigate(`/non-conformance/${nc.id}`);
  };

  const handleCreateNew = () => {
    console.log('Navigating to create new NC');
    navigate('/non-conformance/create');
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'On Hold': return 'destructive';
      case 'Under Investigation': return 'secondary';
      case 'Under Review': return 'outline';
      case 'Approved for Use': return 'default';
      case 'Released': return 'default';
      case 'Disposed': return 'secondary';
      case 'Resolved': return 'default';
      case 'Closed': return 'secondary';
      default: return 'outline';
    }
  };

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getRiskBadgeVariant = (riskLevel: string) => {
    switch (riskLevel?.toLowerCase()) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'default';
      default: return 'outline';
    }
  };

  const getStats = () => {
    const total = nonConformances.length;
    const onHold = nonConformances.filter(nc => nc.status === 'On Hold').length;
    const inProgress = nonConformances.filter(nc => nc.status === 'Under Investigation').length;
    const resolved = nonConformances.filter(nc => nc.status === 'Resolved' || nc.status === 'Closed').length;
    const critical = nonConformances.filter(nc => nc.risk_level === 'Critical').length;
    const withCAPA = nonConformances.filter(nc => nc.capa_id).length;

    return [
      { label: 'Total NCs', value: total, color: 'text-blue-600', bgColor: 'bg-blue-500' },
      { label: 'On Hold', value: onHold, color: 'text-yellow-600', bgColor: 'bg-yellow-500' },
      { label: 'In Progress', value: inProgress, color: 'text-orange-600', bgColor: 'bg-orange-500' },
      { label: 'Resolved', value: resolved, color: 'text-green-600', bgColor: 'bg-green-500' },
      { label: 'Critical Risk', value: critical, color: 'text-red-600', bgColor: 'bg-red-500' },
      { label: 'With CAPA', value: withCAPA, color: 'text-purple-600', bgColor: 'bg-purple-500' }
    ];
  };

  const handleEdit = (nc: NonConformance) => {
    navigate(`/non-conformance/edit/${nc.id}`);
  };

  const handleView = (nc: NonConformance) => {
    navigate(`/non-conformance/${nc.id}`);
  };

  const handleDeleteSuccess = () => {
    refresh();
  };

  const columns = [
    {
      key: 'title',
      label: 'Non-Conformance',
      render: (value: string, item: NonConformance) => (
        <div 
          className="cursor-pointer hover:text-primary transition-colors" 
          onClick={() => handleNCClick(item)}
        >
          <div className="font-medium text-sm">{value}</div>
          <div className="text-xs text-muted-foreground">
            Item: {item.item_name} • {item.item_category}
          </div>
          {item.department && (
            <div className="text-xs text-muted-foreground">
              Dept: {item.department}
            </div>
          )}
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <Badge variant={getStatusBadgeVariant(value)}>
          {value}
        </Badge>
      )
    },
    {
      key: 'priority',
      label: 'Priority',
      render: (value: string) => value ? (
        <Badge variant={getPriorityBadgeVariant(value)}>
          {value}
        </Badge>
      ) : <span className="text-muted-foreground">—</span>
    },
    {
      key: 'risk_level',
      label: 'Risk Level',
      render: (value: string) => value ? (
        <Badge variant={getRiskBadgeVariant(value)}>
          {value}
        </Badge>
      ) : <span className="text-muted-foreground">—</span>
    },
    {
      key: 'assigned_to',
      label: 'Assigned To',
      render: (value: string) => value || <span className="text-muted-foreground">Unassigned</span>
    },
    {
      key: 'capa_id',
      label: 'CAPA',
      render: (value: string) => value ? (
        <Badge variant="default" className="bg-primary/10 text-primary">
          Linked
        </Badge>
      ) : (
        <Badge variant="outline">
          None
        </Badge>
      )
    },
    {
      key: 'reported_date',
      label: 'Reported',
      render: (value: string) => {
        if (!value) return '—';
        return new Date(value).toLocaleDateString();
      }
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value: any, item: NonConformance) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleView(item);
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(item);
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <NCQuickActions
            id={item.id!}
            onEditClick={() => handleEdit(item)}
            onDeleteSuccess={handleDeleteSuccess}
          />
        </div>
      )
    }
  ];

  const actions = (
    <div className="flex gap-2">
      <Button variant="outline" size="sm">
        <Filter className="h-4 w-4 mr-2" />
        Advanced Filter
      </Button>
      <Button variant="outline" size="sm">
        <Download className="h-4 w-4 mr-2" />
        Export
      </Button>
      <Button variant="outline" onClick={() => refresh()} disabled={isLoading}>
        <RefreshCcw className="h-4 w-4 mr-2" />
        Refresh
      </Button>
    </div>
  );

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-destructive">
              <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
              <p>Error loading non-conformances: {String(error)}</p>
              <Button onClick={() => refresh()} className="mt-4">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <motion.div 
      className="p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <ModuleLayout
        title="Non-Conformance Management"
        subtitle="Track, investigate, and resolve quality non-conformances with integrated CAPA generation"
        searchPlaceholder="Search by title, item, description, department, or location..."
        onSearch={setSearchQuery}
        onCreateNew={handleCreateNew}
        createButtonText="Report Non-Conformance"
        stats={getStats()}
        actions={actions}
      >
        <div className="space-y-6">
          {/* Enhanced Data Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Non-Conformance Records</span>
                <Badge variant="outline">
                  {filteredNCs.length} of {nonConformances.length} records
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns}
                data={filteredNCs}
                loading={isLoading}
                onView={handleNCClick}
                emptyMessage="No non-conformances found"
              />
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={handleCreateNew}>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Plus className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Quick Report</h3>
                    <p className="text-sm text-muted-foreground">
                      Report a new non-conformance
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-secondary/10 rounded-full">
                    <TrendingUp className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Analytics</h3>
                    <p className="text-sm text-muted-foreground">
                      View trends and insights
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-accent/10 rounded-full">
                    <CheckCircle className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-medium">Bulk Actions</h3>
                    <p className="text-sm text-muted-foreground">
                      Process multiple records
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </ModuleLayout>
    </motion.div>
  );
};

export default NonConformancePage;