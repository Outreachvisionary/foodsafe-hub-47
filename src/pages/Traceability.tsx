
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCcw, TrendingUp, Package, AlertTriangle, Factory } from 'lucide-react';
import ProductTraceabilityView from '@/components/traceability/ProductTraceabilityView';
import RecallSimulationPanel from '@/components/traceability/RecallSimulationPanel';
import SupplyChainVisualization from '@/components/traceability/SupplyChainVisualization';
import TraceabilityReports from '@/components/traceability/TraceabilityReports';
import CreateProductDialog from '@/components/traceability/CreateProductDialog';
import CreateComponentDialog from '@/components/traceability/CreateComponentDialog';
import CreateRecallDialog from '@/components/traceability/CreateRecallDialog';
import GenealogyForm from '@/components/traceability/GenealogyForm';
import SidebarLayout from '@/components/layout/SidebarLayout';
import { useTraceability } from '@/hooks/useTraceability';

const Traceability: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const {
    products,
    components,
    recalls,
    productComponents,
    affectedProducts,
    supplyChainData,
    loading,
    loadProducts,
    loadComponents,
    loadRecalls,
    loadProductComponents,
    loadAffectedProducts,
    loadSupplyChainVisualization,
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

  const handleRunSimulation = async (simulationData: any) => {
    console.log('Running simulation:', simulationData);
    return await addRecallSimulation({
      ...simulationData,
      created_by: 'current-user'
    });
  };

  const handleRefresh = () => {
    loadProducts();
    loadComponents();
    loadRecalls();
    loadSupplyChainVisualization();
  };

  return (
    <SidebarLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Traceability Management</h1>
            <p className="text-muted-foreground mt-1">
              Track products through the supply chain and manage recalls
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRefresh} disabled={loading}>
              <RefreshCcw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <CreateComponentDialog />
            <CreateRecallDialog />
            <CreateProductDialog />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Product Traceability</TabsTrigger>
            <TabsTrigger value="recall">Recall Management</TabsTrigger>
            <TabsTrigger value="supply-chain">Supply Chain</TabsTrigger>
            <TabsTrigger value="genealogy">Product Genealogy</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{products.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Tracked in system
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Components</CardTitle>
                  <Factory className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{components.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Raw materials tracked
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Recalls</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {recalls.filter(r => r.status === 'In Progress' || r.status === 'Scheduled').length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Recalls in progress
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Traceability Score</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">95%</div>
                  <p className="text-xs text-muted-foreground">
                    Supply chain visibility
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Products</CardTitle>
                </CardHeader>
                <CardContent>
                  {products.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p>No products found</p>
                      <p className="text-sm">Create your first product to start tracking</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {products.slice(0, 5).map((product) => (
                        <div key={product.id} className="flex justify-between items-center p-2 border rounded">
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-gray-600">{product.batch_lot_number}</p>
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(product.manufacturing_date).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Recalls</CardTitle>
                </CardHeader>
                <CardContent>
                  {recalls.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p>No recalls found</p>
                      <p className="text-sm">All products are currently safe</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {recalls.slice(0, 5).map((recall) => (
                        <div key={recall.id} className="flex justify-between items-center p-2 border rounded">
                          <div>
                            <p className="font-medium">{recall.title}</p>
                            <p className="text-sm text-gray-600">{recall.recall_type}</p>
                          </div>
                          <div className="text-sm">
                            <span className={`px-2 py-1 rounded text-xs ${
                              recall.status === 'Completed' ? 'bg-green-100 text-green-800' :
                              recall.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {recall.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
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
              data={supplyChainData || { nodes: [], edges: [] }}
            />
          </TabsContent>

          <TabsContent value="genealogy">
            <Card>
              <CardHeader>
                <CardTitle>Product Genealogy Management</CardTitle>
              </CardHeader>
              <CardContent>
                <GenealogyForm
                  products={products}
                  components={components}
                  onSubmit={async (data) => {
                    console.log('Creating genealogy link:', data);
                    // Handle genealogy link creation
                  }}
                />
              </CardContent>
            </Card>
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
