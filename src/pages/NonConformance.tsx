
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Plus, RefreshCcw, Search, AlertTriangle, Clock, CheckCircle2, XCircle, TrendingUp, Eye } from 'lucide-react';
import NCDashboard from '@/components/non-conformance/NCDashboard';
import NCList from '@/components/non-conformance/NCList';
import NCRecentItems from '@/components/non-conformance/NCRecentItems';

const NonConformance: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock stats - in real app these would come from service
  const ncStats = {
    total: 89,
    open: 34,
    underReview: 21,
    resolved: 34,
    overdue: 12
  };

  // Mock stats for NCDashboard component
  const mockNCStats = {
    total: ncStats.total,
    byStatus: {
      'Open': ncStats.open,
      'Under Review': ncStats.underReview,
      'On Hold': 8,
      'Released': ncStats.resolved
    },
    byCategory: {
      'Quality Control': 25,
      'Manufacturing': 18,
      'Documentation': 12,
      'Safety': 15,
      'Process': 19
    },
    byReasonCategory: {
      'Equipment Failure': 20,
      'Human Error': 15,
      'Material Defect': 18,
      'Process Deviation': 22,
      'Documentation Error': 14
    },
    totalQuantityOnHold: 156
  };

  const handleCreateNew = () => {
    console.log('Creating new non-conformance');
    // In real app, this would open a form or navigate to creation page
  };

  const getTabCounts = () => {
    return {
      all: ncStats.total,
      open: ncStats.open,
      review: ncStats.underReview,
      resolved: ncStats.resolved,
      overdue: ncStats.overdue,
      dashboard: 0
    };
  };

  const tabCounts = getTabCounts();

  return (
    <div className="space-y-8 p-8 bg-gradient-to-br from-slate-50 via-red-50 to-orange-50 min-h-screen">
      {/* Enhanced Header */}
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

        {/* Enhanced Quick Stats Cards */}
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
                  <Eye className="h-8 w-8 text-white" />
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

      {/* Enhanced Tabs */}
      <div className="bg-white rounded-2xl shadow-xl border-0 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-red-50 px-6 py-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <TabsList className="grid w-full lg:w-auto grid-cols-3 lg:grid-cols-6 bg-white/70 backdrop-blur-sm shadow-md border border-gray-200/50">
                <TabsTrigger value="all" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-red-600 data-[state=active]:text-white transition-all duration-200">
                  All ({tabCounts.all})
                </TabsTrigger>
                <TabsTrigger value="open" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white transition-all duration-200">
                  Open ({tabCounts.open})
                </TabsTrigger>
                <TabsTrigger value="review" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-yellow-500 data-[state=active]:text-white transition-all duration-200">
                  Review ({tabCounts.review})
                </TabsTrigger>
                <TabsTrigger value="resolved" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white transition-all duration-200">
                  Resolved ({tabCounts.resolved})
                </TabsTrigger>
                <TabsTrigger value="overdue" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-pink-600 data-[state=active]:text-white transition-all duration-200">
                  Overdue ({tabCounts.overdue})
                </TabsTrigger>
                <TabsTrigger value="dashboard" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white transition-all duration-200">
                  Dashboard
                </TabsTrigger>
              </TabsList>
              
              {/* Enhanced Search */}
              <div className="relative w-full lg:w-96">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search non-conformances by ID, description, or category..."
                  className="pl-12 pr-4 py-3 shadow-lg border-gray-200 focus:border-red-400 focus:ring-2 focus:ring-red-400/20 bg-white/80 backdrop-blur-sm transition-all duration-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="p-6">
            <TabsContent value="dashboard" className="mt-0">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-orange-50">
                <CardHeader className="bg-gradient-to-r from-red-100 to-orange-100 border-b border-red-200/50">
                  <CardTitle className="text-xl text-red-800 flex items-center gap-3">
                    <div className="p-2 bg-red-500 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                    Non-Conformance Analytics Dashboard
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <NCDashboard stats={mockNCStats} onCreateNew={handleCreateNew} />
                </CardContent>
              </Card>
            </TabsContent>

            {['all', 'open', 'review', 'resolved', 'overdue'].map((tab) => (
              <TabsContent key={tab} value={tab} className="mt-0">
                <Card className="border-0 shadow-lg bg-white">
                  <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 border-b border-red-200/50">
                    <CardTitle className="text-lg text-red-800 flex items-center gap-3">
                      <div className="p-2 bg-red-500 rounded-lg">
                        <AlertTriangle className="h-5 w-5 text-white" />
                      </div>
                      Non-Conformance List ({tabCounts[tab as keyof typeof tabCounts]} items)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <NCList />
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default NonConformance;
