
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

const Traceability: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data and handlers
  const mockProducts = [];
  const mockComponents = [];
  const mockSimulations = [];
  const mockSupplyChainData = {
    nodes: [],
    links: []
  };

  const handleSearchProduct = (query: string) => {
    console.log('Searching products:', query);
  };

  const handleSearchComponent = (query: string) => {
    console.log('Searching components:', query);
  };

  const handleSelectProduct = (productId: string) => {
    console.log('Selected product:', productId);
  };

  const handleSelectComponent = (componentId: string) => {
    console.log('Selected component:', componentId);
  };

  const handleRunSimulation = (config: any) => {
    console.log('Running simulation:', config);
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
              products={mockProducts}
              components={mockComponents}
              onSearchProduct={handleSearchProduct}
              onSearchComponent={handleSearchComponent}
              onSelectProduct={handleSelectProduct}
              onSelectComponent={handleSelectComponent}
            />
          </TabsContent>

          <TabsContent value="recall">
            <RecallSimulationPanel 
              onRunSimulation={handleRunSimulation}
              simulations={mockSimulations}
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
