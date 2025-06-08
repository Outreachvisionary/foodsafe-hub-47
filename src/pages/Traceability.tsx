
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, Factory, AlertTriangle, PlayCircle, Send, Network } from 'lucide-react';
import { useTraceability } from '@/hooks/useTraceability';
import { toast } from 'sonner';
import DashboardHeader from '@/components/DashboardHeader';
import ProductTraceabilityView from '@/components/traceability/ProductTraceabilityView';
import RecallSimulationPanel from '@/components/traceability/RecallSimulationPanel';
import NotificationPanel from '@/components/traceability/NotificationPanel';
import SupplyChainVisualization from '@/components/traceability/SupplyChainVisualization';

const Traceability = () => {
  const {
    products,
    components,
    recalls,
    loadProducts,
    loadComponents,
    loadRecalls,
    loadSupplyChainVisualization,
    loadProductComponents,
    loadAffectedProducts,
    addRecallSimulation,
    addNotification,
    supplyChainData,
    productComponents,
    affectedProducts,
    recallSimulations,
    notifications,
    loading,
    error
  } = useTraceability();

  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const initializeData = async () => {
      try {
        await Promise.all([
          loadProducts(),
          loadComponents(),
          loadRecalls()
        ]);
      } catch (err) {
        console.error('Error loading traceability data:', err);
        toast.error('Failed to load traceability data');
      }
    };

    initializeData();
  }, [loadProducts, loadComponents, loadRecalls]);

  useEffect(() => {
    // Load supply chain visualization for the first product if available
    if (products.length > 0) {
      loadSupplyChainVisualization(products[0].id);
    }
  }, [products, loadSupplyChainVisualization]);

  const handleSearchProduct = async (batchLot: string) => {
    try {
      await loadProductComponents(batchLot);
      toast.success('Product components loaded successfully');
    } catch (err) {
      console.error('Error searching product:', err);
      toast.error('Failed to search product components');
    }
  };

  const handleSearchComponent = async (batchLot: string) => {
    try {
      await loadAffectedProducts(batchLot);
      toast.success('Affected products loaded successfully');
    } catch (err) {
      console.error('Error searching component:', err);
      toast.error('Failed to search affected products');
    }
  };

  const statsCards = [
    {
      title: 'Total Products',
      value: products.length,
      icon: Package,
      color: 'text-blue-600'
    },
    {
      title: 'Total Components',
      value: components.length,
      icon: Factory,
      color: 'text-green-600'
    },
    {
      title: 'Active Recalls',
      value: recalls.filter(r => r.status === 'In Progress').length,
      icon: AlertTriangle,
      color: 'text-orange-600'
    },
    {
      title: 'Simulations Run',
      value: recallSimulations.length,
      icon: PlayCircle,
      color: 'text-purple-600'
    }
  ];

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error loading traceability data. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <DashboardHeader 
        title="Traceability & Recall Management" 
        subtitle="Track products, manage recalls, and maintain supply chain visibility"
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="traceability">Traceability</TabsTrigger>
          <TabsTrigger value="supply-chain">Supply Chain</TabsTrigger>
          <TabsTrigger value="simulations">Simulations</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Recalls</CardTitle>
              </CardHeader>
              <CardContent>
                {recalls.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p>No recalls found</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recalls.slice(0, 5).map((recall) => (
                      <div key={recall.id} className="flex justify-between items-center p-3 border rounded">
                        <div>
                          <p className="font-medium">{recall.title}</p>
                          <p className="text-sm text-gray-600">{recall.recall_type}</p>
                        </div>
                        <Badge variant={recall.status === 'In Progress' ? 'destructive' : 'secondary'}>
                          {recall.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Traceability System</span>
                    <Badge className="bg-green-100 text-green-800">Online</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Database Sync</span>
                    <Badge className="bg-green-100 text-green-800">Synchronized</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Notification Service</span>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Last Data Update</span>
                    <span className="text-sm text-gray-600">{new Date().toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="traceability">
          <ProductTraceabilityView
            products={products}
            components={components}
            onSearchProduct={handleSearchProduct}
            onSearchComponent={handleSearchComponent}
            productComponents={productComponents}
            affectedProducts={affectedProducts}
          />
        </TabsContent>

        <TabsContent value="supply-chain">
          <SupplyChainVisualization 
            data={supplyChainData}
            onNodeClick={(nodeId) => console.log('Node clicked:', nodeId)}
          />
        </TabsContent>

        <TabsContent value="simulations">
          <RecallSimulationPanel
            onRunSimulation={addRecallSimulation}
            simulations={recallSimulations}
          />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationPanel
            onSendNotification={addNotification}
            notifications={notifications}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Traceability;
