
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchNCStats } from '@/services/nonConformanceService';
import { NCStats } from '@/types/non-conformance';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, PlusCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import NCRecentItems from '@/components/non-conformance/NCRecentItems';
import { useToast } from '@/hooks/use-toast';
import { BarChartComponent, PieChartComponent } from '@/components/non-conformance/NCDashboardCharts';

const NonConformanceDashboard: React.FC = () => {
  const [stats, setStats] = useState<NCStats | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const data = await fetchNCStats();
        setStats(data);
      } catch (error) {
        console.error('Error loading NC stats:', error);
        toast({
          title: 'Error loading dashboard',
          description: 'Could not load non-conformance statistics.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadStats();
  }, [toast]);
  
  const handleCreateNew = () => {
    navigate('/non-conformance/new');
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  
  if (!stats) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800">Non-Conformance Dashboard</h1>
          <Button onClick={handleCreateNew}>
            <PlusCircle className="h-4 w-4 mr-2" />
            New Non-Conformance
          </Button>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-10">
              <h3 className="text-lg font-medium">No data available</h3>
              <p className="text-gray-500 mt-2">
                There are no non-conformance records to display.
              </p>
              <Button onClick={handleCreateNew} className="mt-4">
                Create Your First Non-Conformance
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Non-Conformance Dashboard</h1>
          <p className="text-gray-600 mt-1">Overview of non-conformance items and status</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => navigate('/non-conformance')} variant="outline">
            View All Items
          </Button>
          <Button onClick={handleCreateNew}>
            <PlusCircle className="h-4 w-4 mr-2" />
            New Non-Conformance
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Items</CardTitle>
            <CardDescription>All non-conformance records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <span className="text-3xl font-bold">{stats.total}</span>
              <Button variant="ghost" size="sm" onClick={() => navigate('/non-conformance')}>
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Quantity On Hold</CardTitle>
            <CardDescription>Inventory currently held</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <span className="text-3xl font-bold">{stats.totalQuantityOnHold || 0}</span>
              <Button variant="ghost" size="sm" disabled>
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Open Items</CardTitle>
            <CardDescription>Items waiting for disposition</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <span className="text-3xl font-bold">
                {(stats.byStatus['On Hold'] || 0) + (stats.byStatus['Under Review'] || 0)}
              </span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/non-conformance')}
              >
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <PieChartComponent data={Object.entries(stats.byStatus).map(([name, value]) => ({ 
              name, 
              value,
              fill: name === 'On Hold' ? '#f59e0b' : 
                    name === 'Under Review' ? '#3b82f6' :
                    name === 'Released' ? '#10b981' : '#6b7280'
            }))} />
          </CardContent>
        </Card>
        
        <Tabs defaultValue="category" className="lg:col-span-1">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Distribution by</CardTitle>
                <TabsList>
                  <TabsTrigger value="category">Item Category</TabsTrigger>
                  <TabsTrigger value="reason">Reason</TabsTrigger>
                </TabsList>
              </div>
            </CardHeader>
            <CardContent>
              <TabsContent value="category" className="mt-0">
                <BarChartComponent 
                  data={Object.entries(stats.byCategory).map(([name, value]) => ({
                    name: name.length > 15 ? name.substring(0, 12) + '...' : name,
                    value
                  }))} 
                />
              </TabsContent>
              <TabsContent value="reason" className="mt-0">
                <BarChartComponent 
                  data={Object.entries(stats.byReason).map(([name, value]) => ({
                    name: name.length > 15 ? name.substring(0, 12) + '...' : name,
                    value
                  }))} 
                />
              </TabsContent>
            </CardContent>
          </Card>
        </Tabs>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Items</CardTitle>
        </CardHeader>
        <CardContent>
          <NCRecentItems items={stats.recentItems} />
        </CardContent>
      </Card>
    </div>
  );
};

export default NonConformanceDashboard;
