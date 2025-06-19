
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import ProtectedSidebarLayout from '@/components/layout/ProtectedSidebarLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProducts, useComponents, useRecalls } from '@/hooks/useTraceability';
import { 
  RefreshCcw, 
  TrendingUp, 
  Package, 
  AlertTriangle, 
  Factory,
  Search,
  Plus,
  Eye,
  Download,
  MapPin,
  Calendar,
  Truck,
  Archive
} from 'lucide-react';

const Traceability = () => {
  const { user, loading: authLoading } = useAuth();
  const { products, loading: productsLoading, error: productsError, refetch: refetchProducts } = useProducts();
  const { components, loading: componentsLoading, error: componentsError, refetch: refetchComponents } = useComponents();
  const { recalls, loading: recallsLoading, error: recallsError, refetch: refetchRecalls } = useRecalls();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

  if (authLoading || productsLoading || componentsLoading || recallsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (productsError || componentsError || recallsError) {
    return (
      <ProtectedSidebarLayout>
        <div className="container mx-auto p-6 max-w-7xl">
          <div className="text-center py-8">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <p className="text-red-600 mb-4">Error loading data: {productsError || componentsError || recallsError}</p>
            <Button onClick={() => { refetchProducts(); refetchComponents(); refetchRecalls(); }}>
              <RefreshCcw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </ProtectedSidebarLayout>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Stock': return 'bg-green-100 text-green-800';
      case 'Distributed': return 'bg-blue-100 text-blue-800';
      case 'Recalled': return 'bg-red-100 text-red-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'recalled': return 'bg-red-100 text-red-800';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800';
      case 'Completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.batch_lot_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredComponents = components.filter(component =>
    component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    component.batch_lot_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ProtectedSidebarLayout>
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Traceability Management</h1>
              <p className="text-muted-foreground text-lg">
                Track products through the supply chain, manage recalls, and ensure compliance
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => { refetchProducts(); refetchComponents(); refetchRecalls(); }}>
                <RefreshCcw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Product
              </Button>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Product Traceability</TabsTrigger>
            <TabsTrigger value="components">Components</TabsTrigger>
            <TabsTrigger value="recalls">Recall Management</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Products</p>
                      <p className="text-2xl font-bold">{products.length}</p>
                    </div>
                    <Package className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Components</p>
                      <p className="text-2xl font-bold">{components.length}</p>
                    </div>
                    <Factory className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Recalls</p>
                      <p className="text-2xl font-bold">{recalls.filter(r => r.status === 'In Progress').length}</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Traceability Score</p>
                      <p className="text-2xl font-bold">95%</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {products.slice(0, 3).map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">{product.batch_lot_number}</p>
                        </div>
                        <Badge className={getStatusColor(product.status)}>
                          {product.status}
                        </Badge>
                      </div>
                    ))}
                    {products.length === 0 && (
                      <div className="text-center py-4">
                        <Package className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-gray-500 text-sm">No products found</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Recalls</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recalls.map((recall) => (
                      <div key={recall.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{recall.title}</p>
                          <p className="text-sm text-muted-foreground">{recall.reason}</p>
                        </div>
                        <Badge className={getStatusColor(recall.status)}>
                          {recall.status}
                        </Badge>
                      </div>
                    ))}
                    {recalls.length === 0 && (
                      <div className="text-center py-4">
                        <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-gray-500 text-sm">No recalls found</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search products by name or batch number..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Products List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{product.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{product.batch_lot_number}</p>
                      </div>
                      <Badge className={getStatusColor(product.status)}>
                        {product.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Manufactured</p>
                          <p className="font-medium">{new Date(product.manufacturing_date).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Expires</p>
                          <p className="font-medium">{product.expiry_date ? new Date(product.expiry_date).toLocaleDateString() : 'N/A'}</p>
                        </div>
                      </div>
                      
                      {product.location && (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{product.location}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 text-sm">
                        <Archive className="h-4 w-4 text-muted-foreground" />
                        <span>{product.quantity} units</span>
                      </div>
                      
                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="h-3 w-3 mr-1" />
                          Trace
                        </Button>
                        <Button size="sm" className="flex-1">
                          Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500">No products found matching your criteria</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="components" className="space-y-6">
            {/* Components List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredComponents.map((component) => (
                <Card key={component.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{component.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{component.batch_lot_number}</p>
                      </div>
                      <Badge className={getStatusColor(component.status)}>
                        {component.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Received</p>
                          <p className="font-medium">{new Date(component.received_date).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Expires</p>
                          <p className="font-medium">{component.expiry_date ? new Date(component.expiry_date).toLocaleDateString() : 'N/A'}</p>
                        </div>
                      </div>
                      
                      {component.quantity && (
                        <div className="flex items-center gap-2 text-sm">
                          <Archive className="h-4 w-4 text-muted-foreground" />
                          <span>{component.quantity} units available</span>
                        </div>
                      )}
                      
                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="h-3 w-3 mr-1" />
                          Track Usage
                        </Button>
                        <Button size="sm" className="flex-1">
                          Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredComponents.length === 0 && (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <Factory className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500">No components found matching your criteria</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="recalls" className="space-y-6">
            {/* Recalls List */}
            <div className="space-y-6">
              {recalls.map((recall) => (
                <Card key={recall.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{recall.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">{recall.product_name}</p>
                      </div>
                      <Badge className={getStatusColor(recall.status)}>
                        {recall.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-muted-foreground">Reason</p>
                          <p className="font-medium">{recall.reason}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Initiated Date</p>
                          <p className="font-medium">{new Date(recall.initiated_date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-muted-foreground">Affected Quantity</p>
                          <p className="font-medium">{recall.affected_quantity} units</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Batch Numbers</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {recall.batch_numbers.map((batch, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {batch}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-muted-foreground">Customer Notifications</p>
                          <p className="font-medium">{recall.customer_notifications} sent</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Retailer Notifications</p>
                          <p className="font-medium">{recall.retailer_notifications} sent</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 pt-4 mt-4 border-t">
                      <Button variant="outline" size="sm">
                        View Timeline
                      </Button>
                      <Button variant="outline" size="sm">
                        Generate Report
                      </Button>
                      <Button size="sm">
                        Manage Recall
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {recalls.length === 0 && (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500">No recalls found</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Traceability Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500">Advanced reporting and analytics coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedSidebarLayout>
  );
};

export default Traceability;
