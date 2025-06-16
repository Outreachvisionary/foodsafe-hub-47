
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Plus, RefreshCcw, Search, AlertTriangle, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import NCList from '@/components/non-conformance/NCList';
import NCForm from '@/components/non-conformance/NCForm';
import { NonConformance } from '@/types/non-conformance';
import { useNonConformances } from '@/hooks/useNonConformances';

const NonConformancePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedNC, setSelectedNC] = useState<NonConformance | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);

  const { nonConformances, isLoading, refresh } = useNonConformances();

  // Calculate stats
  const ncStats = {
    total: nonConformances.length,
    open: nonConformances.filter(nc => nc.status === 'On Hold').length,
    underReview: nonConformances.filter(nc => nc.status === 'Under Review').length,
    resolved: nonConformances.filter(nc => nc.status === 'Resolved').length,
    overdue: 0 // Would need due dates to calculate this properly
  };

  const handleCreateNew = () => {
    setShowCreateForm(true);
  };

  const handleEdit = (nc: NonConformance) => {
    setSelectedNC(nc);
    setShowEditForm(true);
  };

  const handleView = (nc: NonConformance) => {
    setSelectedNC(nc);
    // Could implement a view dialog here
    console.log('View NC:', nc);
  };

  const handleCloseForm = () => {
    setShowCreateForm(false);
    setShowEditForm(false);
    setSelectedNC(null);
  };

  const handleRefresh = () => {
    refresh();
  };

  const getTabCounts = () => {
    return {
      all: ncStats.total,
      open: ncStats.open,
      review: ncStats.underReview,
      resolved: ncStats.resolved,
      overdue: ncStats.overdue,
    };
  };

  const tabCounts = getTabCounts();

  return (
    <div className="space-y-8 p-8 bg-gradient-to-br from-slate-50 via-red-50 to-orange-50 min-h-screen">
      {/* Header */}
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 bg-clip-text text-transparent">
              Non-Conformance Management
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Track and manage non-conformances with comprehensive workflows and corrective actions
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button 
              variant="outline"
              onClick={handleRefresh}
              className="shadow-lg hover:shadow-xl transition-all duration-300 border-red-200 hover:border-red-300 hover:bg-red-50"
            >
              <RefreshCcw className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
            <Button 
              className="bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 hover:from-red-700 hover:via-orange-700 hover:to-amber-700 shadow-lg hover:shadow-xl transition-all duration-300 text-white border-0"
              onClick={handleCreateNew}
            >
              <Plus className="h-4 w-4 mr-2" />
              Report Non-Conformance
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-red-500 to-red-600 text-white transform hover:scale-105 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-red-100 text-sm font-medium uppercase tracking-wide">Total NCs</p>
                  <p className="text-3xl font-bold">{ncStats.total}</p>
                  <p className="text-red-200 text-xs">All items</p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <AlertTriangle className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-amber-500 text-white transform hover:scale-105 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-orange-100 text-sm font-medium uppercase tracking-wide">Open Items</p>
                  <p className="text-3xl font-bold">{ncStats.open}</p>
                  <p className="text-orange-200 text-xs">Need attention</p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <XCircle className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-500 to-yellow-500 text-white transform hover:scale-105 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-amber-100 text-sm font-medium uppercase tracking-wide">Under Review</p>
                  <p className="text-3xl font-bold">{ncStats.underReview}</p>
                  <p className="text-amber-200 text-xs">Being investigated</p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <Clock className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-emerald-500 text-white transform hover:scale-105 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-green-100 text-sm font-medium uppercase tracking-wide">Resolved</p>
                  <p className="text-3xl font-bold">{ncStats.resolved}</p>
                  <p className="text-green-200 text-xs">Successfully closed</p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <CheckCircle2 className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl shadow-xl border-0 overflow-hidden">
        <div className="p-6">
          <NCList 
            onItemClick={handleView}
            onCreateNew={handleCreateNew}
            onEdit={handleEdit}
          />
        </div>
      </div>

      {/* Create Form Dialog */}
      <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Non-Conformance</DialogTitle>
          </DialogHeader>
          <NCForm onClose={handleCloseForm} />
        </DialogContent>
      </Dialog>

      {/* Edit Form Dialog */}
      <Dialog open={showEditForm} onOpenChange={setShowEditForm}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Non-Conformance</DialogTitle>
          </DialogHeader>
          <NCForm id={selectedNC?.id} onClose={handleCloseForm} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NonConformancePage;
