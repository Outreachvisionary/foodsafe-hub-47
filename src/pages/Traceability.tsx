
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, RefreshCcw } from 'lucide-react';
import ProductTraceabilityView from '@/components/traceability/ProductTraceabilityView';
import RecallSimulationPanel from '@/components/traceability/RecallSimulationPanel';
import SupplyChainVisualization from '@/components/traceability/SupplyChainVisualization';
import TraceabilityReports from '@/components/traceability/TraceabilityReports';
import SidebarLayout from '@/components/layout/SidebarLayout';
import { useTraceability } from '@/hooks/useTraceability';

const Traceability: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const {
    products,
    components,
    productComponents,
    affectedProducts,
    loadProductComponents,
    loadAffectedProducts,
    addRecallSimulation
  } = useTraceability();

  const handleSearchProduct = async (query: string): Promise<void> => {
    console.log('Searching products:', query);
    await loadProductComponents(query);
  };

  const handleSearchComponent = async (query: string): Promise<void> => {
    console.log('Searching components:', query);
    await loadAffectedProducts(query);
  };

  const handleSelectProduct = (productId: string) => {
    console.log('Selected product:', productId);
  };

  const handleSelectComponent = (componentId: string) => {
    console.log('Selected component:', componentId);
  };

  const handleRunSimulation = async (simulationData: any) => {
    console.log('Running simulation:', simulationData);
    return await addRecallSimulation({
      ...simulationData,
      created_by: 'current-user'
    });
  };

  const mockSupplyChainData = {
    nodes: [],
    edges: []
  };

  return (
    <SidebarLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Traceability Management</h1>
            <p className="text-muted-foreground mt-1">
              Track products through the supply chain
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <RefreshCcw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Product Traceability</TabsTrigger>
            <TabsTrigger value="recall">Recall Simulation</TabsTrigger>
            <TabsTrigger value="supply-chain">Supply Chain</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Traceability Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Traceability dashboard and statistics will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products">
            <ProductTraceabilityView 
              products={products}
              components={components}
              onSearchProduct={handleSearchProduct}
              onSearchComponent={handleSearchComponent}
              productComponents={productComponents}
              affectedProducts={affectedProducts}
            />
          </TabsContent>

          <TabsContent value="recall">
            <RecallSimulationPanel 
              onRunSimulation={handleRunSimulation}
              simulations={[]}
            />
          </TabsContent>

          <TabsContent value="supply-chain">
            <SupplyChainVisualization 
              data={mockSupplyChainData}
            />
          </TabsContent>

          <TabsContent value="reports">
            <TraceabilityReports />
          </TabsContent>
        </Tabs>
      </div>
    </SidebarLayout>
  );
};

export default Traceability;
