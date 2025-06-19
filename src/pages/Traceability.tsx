
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import ProtectedSidebarLayout from '@/components/layout/ProtectedSidebarLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

  if (loading) {
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

  // Enhanced mock data
  const products = [
    {
      id: '1',
      name: 'Organic Apple Juice',
      batchNumber: 'APJ-2024-0615-001',
      manufacturingDate: '2024-06-15',
      expiryDate: '2024-12-15',
      quantity: 500,
      location: 'Warehouse A',
      status: 'In Stock',
      supplier: 'Fresh Orchards Co.',
      components: ['Organic Apples', 'Citric Acid', 'Natural Flavoring']
    },
    {
      id: '2',
      name: 'Premium Beef Patties',
      batchNumber: 'BP-2024-0618-002',
      manufacturingDate: '2024-06-18',
      expiryDate: '2024-07-18',
      quantity: 200,
      location: 'Cold Storage B',
      status: 'Distributed',
      supplier: 'Prime Cattle Ranch',
      components: ['Ground Beef', 'Seasoning Mix', 'Natural Preservatives']
    },
    {
      id: '3',
      name: 'Artisan Bread',
      batchNumber: 'AB-2024-0620-003',
      manufacturingDate: '2024-06-20',
      expiryDate: '2024-06-25',
      quantity: 150,
      location: 'Distribution Center',
      status: 'Recalled',
      supplier: 'Golden Fields Bakery',
      components: ['Wheat Flour', 'Yeast', 'Salt', 'Water']
    }
  ];

  const components = [
    {
      id: '1',
      name: 'Organic Apples',
      batchNumber: 'OA-2024-0610-001',
      supplier: 'Fresh Orchards Co.',
      receivedDate: '2024-06-10',
      expiryDate: '2024-07-10',
      quantity: 1000,
      status: 'Active'
    },
    {
      id: '2',
      name: 'Ground Beef',
      batchNumber: 'GB-2024-0617-001',
      supplier: 'Prime Cattle Ranch',
      receivedDate: '2024-06-17',
      expiryDate: '2024-06-27',
      quantity: 300,
      status: 'Active'
    },
    {
      id: '3',
      name: 'Wheat Flour',
      batchNumber: 'WF-2024-0615-002',
      supplier: 'Golden Fields Mill',
      receivedDate: '2024-06-15',
      expiryDate: '2024-12-15',
      quantity: 800,
      status: 'Recalled'
    }
  ];

  const recalls = [
    {
      id: '1',
      title: 'Artisan Bread Recall - Allergen Alert',
      productName: 'Artisan Bread',
      batchNumbers: ['AB-2024-0620-003', 'AB-2024-0621-004'],
      reason: 'Undeclared nuts allergen',
      status: 'In Progress',
      initiatedDate: '2024-06-22',
      affectedQuantity: 300,
      customerNotifications: 45,
      retailerNotifications: 12
    },
    {
      id: '2',
      title: 'Organic Apple Juice - Quality Issue',
      productName: 'Organic Apple Juice',
      batchNumbers: ['APJ-2024-0610-001'],
      reason: 'Off-taste complaints',
      status: 'Completed',
      initiatedDate: '2024-06-12',
      affectedQuantity: 150,
      customerNotifications: 23,
      retailerNotifications: 8
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Stock': return 'bg-green-100 text-green-800';
      case 'Distributed': return 'bg-blue-100 text-blue-800';
      case 'Recalled': return 'bg-red-100 text-red-800';
      case 'Active': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800';
      case 'Completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.batchNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredComponents = components.filter(component =>
    component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    component.batchNumber.toLowerCase().includes(searchTerm.toLowerCase())
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
              <Button variant="outline">
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
                          <p className="text-sm text-muted-foreground">{product.batchNumber}</p>
                        </div>
                        <Badge className={getStatusColor(product.status)}>
                          {product.status}
                        </Badge>
                      </div>
                    ))}
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
                        <p className="text-sm text-muted-foreground">{product.batchNumber}</p>
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
                          <p className="font-medium">{product.manufacturingDate}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Expires</p>
                          <p className="font-medium">{product.expiryDate}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{product.location}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <Archive className="h-4 w-4 text-muted-foreground" />
                        <span>{product.quantity} units</span>
                      </div>

                      <div className="pt-2">
                        <p className="text-xs text-muted-foreground mb-2">Components:</p>
                        <div className="flex flex-wrap gap-1">
                          {product.components.slice(0, 2).map((component, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {component}
                            </Badge>
                          ))}
                          {product.components.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{product.components.length - 2} more
                            </Badge>
                          )}
                        </div>
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
                        <p className="text-sm text-muted-foreground">{component.batchNumber}</p>
                      </div>
                      <Badge className={getStatusColor(component.status)}>
                        {component.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Truck className="h-4 w-4 text-muted-foreground" />
                        <span>{component.supplier}</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Received</p>
                          <p className="font-medium">{component.receivedDate}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Expires</p>
                          <p className="font-medium">{component.expiryDate}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <Archive className="h-4 w-4 text-muted-foreground" />
                        <span>{component.quantity} units available</span>
                      </div>
                      
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
                        <p className="text-sm text-muted-foreground">{recall.productName}</p>
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
                          <p className="font-medium">{recall.initiatedDate}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-muted-foreground">Affected Quantity</p>
                          <p className="font-medium">{recall.affectedQuantity} units</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Batch Numbers</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {recall.batchNumbers.map((batch, index) => (
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
                          <p className="font-medium">{recall.customerNotifications} sent</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Retailer Notifications</p>
                          <p className="font-medium">{recall.retailerNotifications} sent</p>
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
