
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTraceability } from '@/hooks/useTraceability';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Plus, 
  Filter, 
  Package, 
  Layers, 
  AlertTriangle, 
  Bell, 
  Calendar,
  ChevronRight,
  X,
  RotateCw,
  ArrowUpRight,
  Send,
  Users,
  CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import ProductForm from '@/components/traceability/ProductForm';
import ComponentForm from '@/components/traceability/ComponentForm';
import GenealogyForm from '@/components/traceability/GenealogyForm';
import RecallForm from '@/components/traceability/RecallForm';
import RecallScheduleForm from '@/components/traceability/RecallScheduleForm';
import GenealogyTree from '@/components/traceability/GenealogyTree';
import SupplyChainVisualization from '@/components/traceability/SupplyChainVisualization';
import NotificationForm from '@/components/traceability/NotificationForm';
import RecallSimulationForm from '@/components/traceability/RecallSimulationForm';

import { 
  Product, 
  Component, 
  ProductGenealogy, 
  Recall,
  RecallStatus,
  RecallType,
  RecallSimulation,
  RecallSchedule,
  TraceabilityNotification,
  SupplyChainPartner,
  SupplyChainLink,
  TreeNode,
  GraphData
} from '@/types/traceability';

const Traceability: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const activeTab = urlParams.get('tab') || 'products';
  
  const {
    products,
    components,
    recalls,
    recallSchedules,
    selectedProduct,
    selectedComponent,
    selectedRecall,
    genealogyTree,
    supplyChainData,
    recallSimulations,
    notifications,
    productComponents,
    affectedProducts,
    loading,
    error,
    
    loadProducts,
    loadComponents,
    loadRecalls,
    loadRecallSchedules,
    loadProduct,
    loadProductByBatchLot,
    loadComponent,
    loadRecall,
    loadGenealogyTree,
    loadSupplyChainVisualization,
    loadRecallSimulations,
    loadNotifications,
    loadProductComponents,
    loadAffectedProducts,
    
    addProduct,
    editProduct,
    removeProduct,
    addComponent,
    editComponent,
    removeComponent,
    addGenealogyLink,
    removeGenealogyLink,
    addRecall,
    editRecall,
    removeRecall,
    addRecallSimulation,
    addRecallSchedule,
    editRecallSchedule,
    removeRecallSchedule,
    addNotification,
    sendAllNotifications,
    
    setSelectedProduct,
    setSelectedComponent,
    setSelectedRecall
  } = useTraceability();
  
  // State for dialogs
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [componentDialogOpen, setComponentDialogOpen] = useState(false);
  const [genealogyDialogOpen, setGenealogyDialogOpen] = useState(false);
  const [recallDialogOpen, setRecallDialogOpen] = useState(false);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [simulationDialogOpen, setSimulationDialogOpen] = useState(false);
  const [notificationDialogOpen, setNotificationDialogOpen] = useState(false);
  const [bulkNotificationDialogOpen, setBulkNotificationDialogOpen] = useState(false);
  
  // State for filters
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [componentSearchTerm, setComponentSearchTerm] = useState('');
  const [recallSearchTerm, setRecallSearchTerm] = useState('');
  const [scheduleSearchTerm, setScheduleSearchTerm] = useState('');
  
  const [statusFilter, setStatusFilter] = useState<RecallStatus[]>([]);
  const [typeFilter, setTypeFilter] = useState<RecallType[]>([]);

  const [selectedProductBatchLot, setSelectedProductBatchLot] = useState('');
  const [selectedComponentBatchLot, setSelectedComponentBatchLot] = useState('');
  
  // Function to set active tab
  const setActiveTab = (tab: string) => {
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('tab', tab);
    navigate('?' + newUrl.searchParams.toString(), { replace: true });
  };
  
  // Load data on component mount
  useEffect(() => {
    loadProducts();
    loadComponents();
    loadRecalls();
    loadRecallSchedules();
  }, [loadProducts, loadComponents, loadRecalls, loadRecallSchedules]);
  
  // Handle product selection
  const handleProductSelect = async (productId: string) => {
    const product = await loadProduct(productId);
    if (product) {
      await loadGenealogyTree(productId);
      await loadSupplyChainVisualization(productId);
    }
  };
  
  // Handle recall selection
  const handleRecallSelect = async (recallId: string) => {
    const recall = await loadRecall(recallId);
    if (recall) {
      await loadRecallSimulations(recallId);
      await loadNotifications(recallId);
    }
  };
  
  // Handle form submissions
  const handleProductSubmit = async (data: Partial<Product>) => {
    if (selectedProduct && selectedProduct.id) {
      await editProduct(selectedProduct.id, data);
    } else {
      const newProduct = await addProduct({
        ...data,
        created_by: 'Current User', // In a real app, get the current user
      } as Omit<Product, 'id'>);
      
      if (newProduct) {
        setSelectedProduct(newProduct);
      }
    }
    setProductDialogOpen(false);
  };
  
  const handleComponentSubmit = async (data: Partial<Component>) => {
    if (selectedComponent && selectedComponent.id) {
      await editComponent(selectedComponent.id, data);
    } else {
      const newComponent = await addComponent({
        ...data,
        created_by: 'Current User', // In a real app, get the current user
      } as Omit<Component, 'id'>);
      
      if (newComponent) {
        setSelectedComponent(newComponent);
      }
    }
    setComponentDialogOpen(false);
  };
  
  const handleGenealogySubmit = async (data: Partial<ProductGenealogy>) => {
    const newGenealogy = await addGenealogyLink({
      ...data,
      created_by: 'Current User', // In a real app, get the current user
    } as Omit<ProductGenealogy, 'id'>);
    
    if (newGenealogy && selectedProduct) {
      // Reload the genealogy tree
      await loadGenealogyTree(selectedProduct.id);
    }
    setGenealogyDialogOpen(false);
  };
  
  const handleRecallSubmit = async (data: Partial<Recall>) => {
    if (selectedRecall && selectedRecall.id) {
      await editRecall(selectedRecall.id, data);
    } else {
      const newRecall = await addRecall({
        ...data,
        initiated_by: 'Current User', // In a real app, get the current user
      } as Omit<Recall, 'id'>);
      
      if (newRecall) {
        setSelectedRecall(newRecall);
      }
    }
    setRecallDialogOpen(false);
  };
  
  const handleScheduleSubmit = async (data: Partial<RecallSchedule>) => {
    const newSchedule = await addRecallSchedule({
      ...data,
      created_by: 'Current User', // In a real app, get the current user
    } as Omit<RecallSchedule, 'id'>);
    
    setScheduleDialogOpen(false);
  };
  
  const handleSimulationSubmit = async (data: Partial<RecallSimulation>) => {
    if (selectedRecall) {
      const newSimulation = await addRecallSimulation({
        ...data,
        recall_id: selectedRecall.id,
        created_by: 'Current User', // In a real app, get the current user
      } as Omit<RecallSimulation, 'id'>);
      
      if (newSimulation) {
        // Reload simulations
        await loadRecallSimulations(selectedRecall.id);
      }
    }
    setSimulationDialogOpen(false);
  };
  
  const handleNotificationSubmit = async (data: Partial<TraceabilityNotification>) => {
    if (selectedRecall) {
      const newNotification = await addNotification({
        ...data,
        recall_id: selectedRecall.id,
        created_by: 'Current User', // In a real app, get the current user
      } as Omit<TraceabilityNotification, 'id' | 'status' | 'sent_at'>);
      
      if (newNotification) {
        // Reload notifications
        await loadNotifications(selectedRecall.id);
      }
    }
    setNotificationDialogOpen(false);
  };
  
  const handleBulkNotificationSubmit = async (subject: string, message: string) => {
    if (selectedRecall) {
      await sendAllNotifications(
        selectedRecall.id,
        subject,
        message,
        'Current User' // In a real app, get the current user
      );
    }
    setBulkNotificationDialogOpen(false);
  };
  
  // Handle search by batch/lot number
  const handleProductBatchLotSearch = async () => {
    if (selectedProductBatchLot) {
      const product = await loadProductByBatchLot(selectedProductBatchLot);
      if (product) {
        await loadGenealogyTree(product.id);
        await loadSupplyChainVisualization(product.id);
      }
    }
  };
  
  const handleComponentBatchLotSearch = async () => {
    if (selectedComponentBatchLot) {
      const affectedProds = await loadAffectedProducts(selectedComponentBatchLot);
      // If products are found, you might want to show them in a dialog or a new view
    }
  };
  
  // Filter functions
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
    product.batch_lot_number.toLowerCase().includes(productSearchTerm.toLowerCase())
  );
  
  const filteredComponents = components.filter(component => 
    component.name.toLowerCase().includes(componentSearchTerm.toLowerCase()) ||
    component.batch_lot_number.toLowerCase().includes(componentSearchTerm.toLowerCase())
  );
  
  const filteredRecalls = recalls.filter(recall => {
    // Apply text search
    const matchesSearch = recall.title.toLowerCase().includes(recallSearchTerm.toLowerCase()) ||
                          recall.recall_reason.toLowerCase().includes(recallSearchTerm.toLowerCase());
    
    // Apply status filter if any are selected
    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(recall.status as RecallStatus);
    
    // Apply type filter if any are selected
    const matchesType = typeFilter.length === 0 || typeFilter.includes(recall.recall_type as RecallType);
    
    return matchesSearch && matchesStatus && matchesType;
  });
  
  const filteredSchedules = recallSchedules.filter(schedule => 
    schedule.title.toLowerCase().includes(scheduleSearchTerm.toLowerCase())
  );
  
  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };
  
  // Status badge color
  const getStatusColor = (status: RecallStatus) => {
    switch (status) {
      case 'Scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Type badge color
  const getTypeColor = (type: RecallType) => {
    switch (type) {
      case 'Mock':
        return 'bg-purple-100 text-purple-800';
      case 'Actual':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Traceability Management</h1>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="components">Components</TabsTrigger>
          <TabsTrigger value="recalls">Recalls</TabsTrigger>
          <TabsTrigger value="schedules">Recall Schedules</TabsTrigger>
        </TabsList>
        
        {/* Products Tab */}
        <TabsContent value="products">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle>Products</CardTitle>
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedProduct(null);
                      setProductDialogOpen(true);
                    }}
                  >
                    <Plus className="mr-1 h-4 w-4" /> Add Product
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-2 mb-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                      <Input
                        placeholder="Search products..."
                        className="pl-8"
                        value={productSearchTerm}
                        onChange={(e) => setProductSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4 mt-4">
                    {filteredProducts.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">No products found</p>
                    ) : (
                      filteredProducts.map((product) => (
                        <div 
                          key={product.id}
                          className={`p-3 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors ${
                            selectedProduct?.id === product.id ? 'bg-gray-50 border-blue-500' : ''
                          }`}
                          onClick={() => handleProductSelect(product.id)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{product.name}</h3>
                              <p className="text-sm text-gray-500">
                                Batch/Lot: {product.batch_lot_number}
                              </p>
                            </div>
                            <ChevronRight className="h-5 w-5 text-gray-400" />
                          </div>
                          <div className="mt-2 flex items-center text-xs text-gray-500">
                            <span className="mr-2">Mfg: {formatDate(product.manufacturing_date)}</span>
                            {product.expiry_date && (
                              <span>Exp: {formatDate(product.expiry_date)}</span>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="flex items-center w-full">
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">
                        {filteredProducts.length} products
                      </p>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Input 
                        placeholder="Search by Batch/Lot..."
                        className="text-sm"
                        value={selectedProductBatchLot}
                        onChange={(e) => setSelectedProductBatchLot(e.target.value)}
                      />
                      <Button size="sm" onClick={handleProductBatchLotSearch}>
                        Search
                      </Button>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </div>
            
            <div className="lg:col-span-2">
              {selectedProduct ? (
                <div className="space-y-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <div>
                        <CardTitle>{selectedProduct.name}</CardTitle>
                        <CardDescription>Batch/Lot: {selectedProduct.batch_lot_number}</CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setProductDialogOpen(true)}
                        >
                          Edit Product
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setGenealogyDialogOpen(true)}
                        >
                          <Plus className="mr-1 h-4 w-4" /> Add Component
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Manufacturing Date</h4>
                          <p>{formatDate(selectedProduct.manufacturing_date)}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Expiry Date</h4>
                          <p>{formatDate(selectedProduct.expiry_date)}</p>
                        </div>
                        {selectedProduct.category && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Category</h4>
                            <p>{selectedProduct.category}</p>
                          </div>
                        )}
                        {selectedProduct.sku && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">SKU</h4>
                            <p>{selectedProduct.sku}</p>
                          </div>
                        )}
                      </div>
                      
                      {selectedProduct.description && (
                        <div className="mb-6">
                          <h4 className="text-sm font-medium text-gray-500">Description</h4>
                          <p className="text-sm">{selectedProduct.description}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  <GenealogyTree data={genealogyTree} />
                  
                  <SupplyChainVisualization data={supplyChainData} />
                </div>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Product Details</CardTitle>
                    <CardDescription>Select a product to view its details</CardDescription>
                  </CardHeader>
                  <CardContent className="h-60 flex items-center justify-center text-gray-500">
                    No product selected
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
        
        {/* Components Tab */}
        <TabsContent value="components">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle>Components</CardTitle>
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedComponent(null);
                      setComponentDialogOpen(true);
                    }}
                  >
                    <Plus className="mr-1 h-4 w-4" /> Add Component
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-2 mb-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                      <Input
                        placeholder="Search components..."
                        className="pl-8"
                        value={componentSearchTerm}
                        onChange={(e) => setComponentSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4 mt-4">
                    {filteredComponents.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">No components found</p>
                    ) : (
                      filteredComponents.map((component) => (
                        <div 
                          key={component.id}
                          className={`p-3 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors ${
                            selectedComponent?.id === component.id ? 'bg-gray-50 border-blue-500' : ''
                          }`}
                          onClick={() => loadComponent(component.id)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{component.name}</h3>
                              <p className="text-sm text-gray-500">
                                Batch/Lot: {component.batch_lot_number}
                              </p>
                            </div>
                            <ChevronRight className="h-5 w-5 text-gray-400" />
                          </div>
                          <div className="mt-2 flex items-center text-xs text-gray-500">
                            <span className="mr-2">Received: {formatDate(component.received_date)}</span>
                            {component.expiry_date && (
                              <span>Exp: {formatDate(component.expiry_date)}</span>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="flex items-center w-full">
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">
                        {filteredComponents.length} components
                      </p>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Input 
                        placeholder="Search by Batch/Lot..."
                        className="text-sm"
                        value={selectedComponentBatchLot}
                        onChange={(e) => setSelectedComponentBatchLot(e.target.value)}
                      />
                      <Button size="sm" onClick={handleComponentBatchLotSearch}>
                        Search
                      </Button>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </div>
            
            <div className="lg:col-span-2">
              {selectedComponent ? (
                <div className="space-y-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <div>
                        <CardTitle>{selectedComponent.name}</CardTitle>
                        <CardDescription>Batch/Lot: {selectedComponent.batch_lot_number}</CardDescription>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setComponentDialogOpen(true)}
                      >
                        Edit Component
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Received Date</h4>
                          <p>{formatDate(selectedComponent.received_date)}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Expiry Date</h4>
                          <p>{formatDate(selectedComponent.expiry_date)}</p>
                        </div>
                        {selectedComponent.category && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Category</h4>
                            <p>{selectedComponent.category}</p>
                          </div>
                        )}
                        {selectedComponent.supplier_id && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Supplier</h4>
                            <p>{selectedComponent.supplier_id}</p>
                          </div>
                        )}
                      </div>
                      
                      {selectedComponent.description && (
                        <div className="mb-6">
                          <h4 className="text-sm font-medium text-gray-500">Description</h4>
                          <p className="text-sm">{selectedComponent.description}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  {affectedProducts.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Products Using This Component</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {affectedProducts.map((product) => (
                            <div 
                              key={product.id}
                              className="p-3 border rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
                              onClick={() => handleProductSelect(product.id)}
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <h3 className="font-medium">{product.name}</h3>
                                  <p className="text-sm text-gray-500">
                                    Batch/Lot: {product.batch_lot_number}
                                  </p>
                                </div>
                                <ArrowUpRight className="h-4 w-4 text-gray-400" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Component Details</CardTitle>
                    <CardDescription>Select a component to view its details</CardDescription>
                  </CardHeader>
                  <CardContent className="h-60 flex items-center justify-center text-gray-500">
                    No component selected
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
        
        {/* Recalls Tab */}
        <TabsContent value="recalls">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle>Recalls</CardTitle>
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedRecall(null);
                      setRecallDialogOpen(true);
                    }}
                  >
                    <Plus className="mr-1 h-4 w-4" /> New Recall
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-2 mb-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                      <Input
                        placeholder="Search recalls..."
                        className="pl-8"
                        value={recallSearchTerm}
                        onChange={(e) => setRecallSearchTerm(e.target.value)}
                      />
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Filter className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuCheckboxItem
                          checked={statusFilter.includes('Scheduled')}
                          onCheckedChange={(checked) => {
                            setStatusFilter(prev => 
                              checked 
                                ? [...prev, 'Scheduled']
                                : prev.filter(s => s !== 'Scheduled')
                            );
                          }}
                        >
                          Scheduled
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          checked={statusFilter.includes('In Progress')}
                          onCheckedChange={(checked) => {
                            setStatusFilter(prev => 
                              checked 
                                ? [...prev, 'In Progress']
                                : prev.filter(s => s !== 'In Progress')
                            );
                          }}
                        >
                          In Progress
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          checked={statusFilter.includes('Completed')}
                          onCheckedChange={(checked) => {
                            setStatusFilter(prev => 
                              checked 
                                ? [...prev, 'Completed']
                                : prev.filter(s => s !== 'Completed')
                            );
                          }}
                        >
                          Completed
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          checked={statusFilter.includes('Cancelled')}
                          onCheckedChange={(checked) => {
                            setStatusFilter(prev => 
                              checked 
                                ? [...prev, 'Cancelled']
                                : prev.filter(s => s !== 'Cancelled')
                            );
                          }}
                        >
                          Cancelled
                        </DropdownMenuCheckboxItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Layers className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuCheckboxItem
                          checked={typeFilter.includes('Mock')}
                          onCheckedChange={(checked) => {
                            setTypeFilter(prev => 
                              checked 
                                ? [...prev, 'Mock']
                                : prev.filter(t => t !== 'Mock')
                            );
                          }}
                        >
                          Mock
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          checked={typeFilter.includes('Actual')}
                          onCheckedChange={(checked) => {
                            setTypeFilter(prev => 
                              checked 
                                ? [...prev, 'Actual']
                                : prev.filter(t => t !== 'Actual')
                            );
                          }}
                        >
                          Actual
                        </DropdownMenuCheckboxItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div className="space-y-4 mt-4">
                    {filteredRecalls.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">No recalls found</p>
                    ) : (
                      filteredRecalls.map((recall) => (
                        <div 
                          key={recall.id}
                          className={`p-3 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors ${
                            selectedRecall?.id === recall.id ? 'bg-gray-50 border-blue-500' : ''
                          }`}
                          onClick={() => handleRecallSelect(recall.id)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{recall.title}</h3>
                              <div className="flex flex-wrap gap-2 mt-1">
                                <Badge variant="secondary" className={getStatusColor(recall.status as RecallStatus)}>
                                  {recall.status}
                                </Badge>
                                <Badge variant="secondary" className={getTypeColor(recall.recall_type as RecallType)}>
                                  {recall.recall_type}
                                </Badge>
                              </div>
                            </div>
                            <ChevronRight className="h-5 w-5 text-gray-400" />
                          </div>
                          <div className="mt-2 text-xs text-gray-500">
                            Initiated: {formatDate(recall.initiated_at)}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <p className="text-sm text-gray-500">
                    {filteredRecalls.length} recalls
                  </p>
                </CardFooter>
              </Card>
            </div>
            
            <div className="lg:col-span-2">
              {selectedRecall ? (
                <div className="space-y-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <div>
                        <div className="flex items-center space-x-2">
                          <CardTitle>{selectedRecall.title}</CardTitle>
                          <Badge variant="secondary" className={getTypeColor(selectedRecall.recall_type as RecallType)}>
                            {selectedRecall.recall_type}
                          </Badge>
                        </div>
                        <CardDescription>Status: {selectedRecall.status}</CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setRecallDialogOpen(true)}
                        >
                          Edit Recall
                        </Button>
                        {selectedRecall.recall_type === 'Mock' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSimulationDialogOpen(true)}
                          >
                            <RotateCw className="mr-1 h-4 w-4" /> Run Simulation
                          </Button>
                        )}
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => setBulkNotificationDialogOpen(true)}
                        >
                          <Send className="mr-1 h-4 w-4" /> Notify All
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Initiated By</h4>
                          <p>{selectedRecall.initiated_by}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Initiated On</h4>
                          <p>{formatDate(selectedRecall.initiated_at)}</p>
                        </div>
                        {selectedRecall.completed_at && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Completed On</h4>
                            <p>{formatDate(selectedRecall.completed_at)}</p>
                          </div>
                        )}
                      </div>
                      
                      <Separator className="my-4" />
                      
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-500">Recall Reason</h4>
                        <p className="text-sm mt-1">{selectedRecall.recall_reason}</p>
                      </div>
                      
                      {selectedRecall.description && (
                        <div className="mb-6">
                          <h4 className="text-sm font-medium text-gray-500">Description</h4>
                          <p className="text-sm mt-1">{selectedRecall.description}</p>
                        </div>
                      )}
                      
                      {selectedRecall.corrective_actions && (
                        <div className="mb-6">
                          <h4 className="text-sm font-medium text-gray-500">Corrective Actions</h4>
                          <p className="text-sm mt-1">{selectedRecall.corrective_actions}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  {/* Simulations Card */}
                  {recallSimulations.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Recall Simulations</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {recallSimulations.map((simulation) => (
                            <div key={simulation.id} className="p-3 border rounded-md">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-medium">
                                    Simulation from {formatDate(simulation.simulation_date)}
                                  </h3>
                                  <div className="flex items-center mt-1">
                                    <Badge className="bg-blue-100 text-blue-800">
                                      Success Rate: {simulation.success_rate}%
                                    </Badge>
                                    <span className="text-sm text-gray-500 ml-3">
                                      Duration: {simulation.duration}s
                                    </span>
                                  </div>
                                </div>
                              </div>
                              {simulation.bottlenecks && (
                                <div className="mt-2">
                                  <h4 className="text-xs font-medium text-gray-500">Bottlenecks/Issues</h4>
                                  <p className="text-sm">{simulation.bottlenecks}</p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSimulationDialogOpen(true)}
                        >
                          <RotateCw className="mr-1 h-4 w-4" /> Run New Simulation
                        </Button>
                      </CardFooter>
                    </Card>
                  )}
                  
                  {/* Notifications Card */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle>Notifications</CardTitle>
                      <Button
                        size="sm"
                        onClick={() => setNotificationDialogOpen(true)}
                      >
                        <Bell className="mr-1 h-4 w-4" /> Send Notification
                      </Button>
                    </CardHeader>
                    <CardContent>
                      {notifications.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">No notifications sent yet</p>
                      ) : (
                        <div className="space-y-4">
                          {notifications.map((notification) => (
                            <div key={notification.id} className="p-3 border rounded-md">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-medium">{notification.subject}</h3>
                                  <div className="flex items-center mt-1">
                                    <Badge className={
                                      notification.status === 'Sent' 
                                        ? 'bg-green-100 text-green-800' 
                                        : notification.status === 'Failed'
                                        ? 'bg-red-100 text-red-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                    }>
                                      {notification.status}
                                    </Badge>
                                    <span className="text-sm text-gray-500 ml-3">
                                      To: {notification.recipient_type}
                                      {notification.recipient_email && ` (${notification.recipient_email})`}
                                    </span>
                                  </div>
                                </div>
                                {notification.sent_at && (
                                  <span className="text-xs text-gray-500">
                                    {formatDate(notification.sent_at)}
                                  </span>
                                )}
                              </div>
                              <div className="mt-2">
                                <p className="text-sm">{notification.message}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => setBulkNotificationDialogOpen(true)}
                      >
                        <Users className="mr-1 h-4 w-4" /> Notify All Stakeholders
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Recall Details</CardTitle>
                    <CardDescription>Select a recall to view its details</CardDescription>
                  </CardHeader>
                  <CardContent className="h-60 flex items-center justify-center text-gray-500">
                    No recall selected
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
        
        {/* Recall Schedules Tab */}
        <TabsContent value="schedules">
          <div className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle>Recall Schedules</CardTitle>
                <Button
                  size="sm"
                  onClick={() => setScheduleDialogOpen(true)}
                >
                  <Plus className="mr-1 h-4 w-4" /> Schedule Recall
                </Button>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search schedules..."
                      className="pl-8"
                      value={scheduleSearchTerm}
                      onChange={(e) => setScheduleSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                
                {filteredSchedules.length === 0 ? (
                  <div className="text-center py-10">
                    <Calendar className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                    <h3 className="text-lg font-medium text-gray-900">No recall schedules</h3>
                    <p className="text-gray-500 mt-1">
                      Schedule your first mock or actual recall
                    </p>
                    <Button
                      className="mt-3"
                      onClick={() => setScheduleDialogOpen(true)}
                    >
                      <Plus className="mr-1 h-4 w-4" /> Schedule Recall
                    </Button>
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredSchedules.map((schedule) => (
                      <div key={schedule.id} className="py-4 first:pt-0 last:pb-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{schedule.title}</h3>
                            <div className="flex items-center mt-1">
                              <Badge className={
                                schedule.recall_type === 'Mock' 
                                  ? 'bg-purple-100 text-purple-800' 
                                  : 'bg-red-100 text-red-800'
                              }>
                                {schedule.recall_type}
                              </Badge>
                              <Badge className="ml-2 bg-blue-100 text-blue-800">
                                {schedule.is_recurring ? 'Recurring' : 'One-time'}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      // Implement edit logic
                                    }}
                                  >
                                    Edit
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Edit this schedule</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => {
                                      // Implement delete logic
                                    }}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Delete this schedule</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>
                        
                        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2">
                          <div>
                            <h4 className="text-xs font-medium text-gray-500">Next Execution</h4>
                            <p className="text-sm">
                              {schedule.next_execution_at 
                                ? formatDate(schedule.next_execution_at)
                                : 'Not scheduled'}
                            </p>
                          </div>
                          {schedule.is_recurring && (
                            <div>
                              <h4 className="text-xs font-medium text-gray-500">Recurrence</h4>
                              <p className="text-sm capitalize">
                                {schedule.recurrence_pattern} 
                                {schedule.recurrence_interval && schedule.recurrence_interval > 1 
                                  ? ` (every ${schedule.recurrence_interval} ${schedule.recurrence_pattern}s)`
                                  : ''}
                              </p>
                            </div>
                          )}
                          {schedule.last_executed_at && (
                            <div>
                              <h4 className="text-xs font-medium text-gray-500">Last Executed</h4>
                              <p className="text-sm">{formatDate(schedule.last_executed_at)}</p>
                            </div>
                          )}
                        </div>
                        
                        {schedule.description && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-600">{schedule.description}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Recalls</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="divide-y">
                  {filteredSchedules
                    .filter(schedule => schedule.next_execution_at)
                    .sort((a, b) => new Date(a.next_execution_at || '').getTime() - new Date(b.next_execution_at || '').getTime())
                    .slice(0, 5)
                    .map((schedule) => (
                      <div key={schedule.id} className="flex items-center py-3 first:pt-0 last:pb-0">
                        <div className={`w-2 h-2 rounded-full mr-3 ${
                          schedule.recall_type === 'Mock' ? 'bg-purple-500' : 'bg-red-500'
                        }`} />
                        <div className="flex-1">
                          <p className="font-medium">{schedule.title}</p>
                          <p className="text-sm text-gray-500">
                            {formatDate(schedule.next_execution_at)}
                          </p>
                        </div>
                        <Badge>
                          {schedule.recall_type}
                        </Badge>
                      </div>
                    ))}
                  
                  {filteredSchedules.filter(schedule => schedule.next_execution_at).length === 0 && (
                    <p className="text-gray-500 text-center py-4">No upcoming recalls scheduled</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Dialogs */}
      <Dialog open={productDialogOpen} onOpenChange={setProductDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{selectedProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            <DialogDescription>
              {selectedProduct ? 'Update the product details' : 'Create a new product entry'}
            </DialogDescription>
          </DialogHeader>
          <ProductForm 
            initialData={selectedProduct || undefined}
            onSubmit={handleProductSubmit}
            loading={loading}
          />
        </DialogContent>
      </Dialog>
      
      <Dialog open={componentDialogOpen} onOpenChange={setComponentDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{selectedComponent ? 'Edit Component' : 'Add New Component'}</DialogTitle>
            <DialogDescription>
              {selectedComponent ? 'Update the component details' : 'Create a new component entry'}
            </DialogDescription>
          </DialogHeader>
          <ComponentForm 
            initialData={selectedComponent || undefined}
            onSubmit={handleComponentSubmit}
            loading={loading}
          />
        </DialogContent>
      </Dialog>
      
      <Dialog open={genealogyDialogOpen} onOpenChange={setGenealogyDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Add Component to Product</DialogTitle>
            <DialogDescription>
              Link a component to a product to build its genealogy
            </DialogDescription>
          </DialogHeader>
          <GenealogyForm 
            products={products}
            components={components}
            preselectedProductId={selectedProduct?.id}
            onSubmit={handleGenealogySubmit}
            loading={loading}
          />
        </DialogContent>
      </Dialog>
      
      <Dialog open={recallDialogOpen} onOpenChange={setRecallDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{selectedRecall ? 'Edit Recall' : 'Create New Recall'}</DialogTitle>
            <DialogDescription>
              {selectedRecall ? 'Update the recall details' : 'Create a new product recall'}
            </DialogDescription>
          </DialogHeader>
          <RecallForm 
            initialData={selectedRecall || undefined}
            onSubmit={handleRecallSubmit}
            loading={loading}
          />
        </DialogContent>
      </Dialog>
      
      <Dialog open={scheduleDialogOpen} onOpenChange={setScheduleDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Schedule a Recall</DialogTitle>
            <DialogDescription>
              Set up a one-time or recurring recall schedule
            </DialogDescription>
          </DialogHeader>
          <RecallScheduleForm 
            onSubmit={handleScheduleSubmit}
            loading={loading}
          />
        </DialogContent>
      </Dialog>
      
      <Dialog open={simulationDialogOpen} onOpenChange={setSimulationDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Run Mock Recall Simulation</DialogTitle>
            <DialogDescription>
              Simulate a recall to test your readiness
            </DialogDescription>
          </DialogHeader>
          {selectedRecall && (
            <RecallSimulationForm 
              recallId={selectedRecall.id}
              onSubmit={handleSimulationSubmit}
              loading={loading}
            />
          )}
        </DialogContent>
      </Dialog>
      
      <Dialog open={notificationDialogOpen} onOpenChange={setNotificationDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Send Notification</DialogTitle>
            <DialogDescription>
              Send a notification to a specific stakeholder
            </DialogDescription>
          </DialogHeader>
          {selectedRecall && (
            <NotificationForm 
              recallId={selectedRecall.id}
              onSubmit={handleNotificationSubmit}
              loading={loading}
            />
          )}
        </DialogContent>
      </Dialog>
      
      <Dialog open={bulkNotificationDialogOpen} onOpenChange={setBulkNotificationDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Notify All Stakeholders</DialogTitle>
            <DialogDescription>
              Send a notification to all stakeholders with a single click
            </DialogDescription>
          </DialogHeader>
          {selectedRecall && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium">Subject</h3>
                    <Input 
                      placeholder="Enter notification subject"
                      defaultValue={`Recall Notice: ${selectedRecall.title}`}
                      className="mt-1"
                      id="bulk-notification-subject"
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Message</h3>
                    <Textarea 
                      placeholder="Enter notification message"
                      defaultValue={`Dear Stakeholder,\n\nThis is to inform you about a ${selectedRecall.recall_type.toLowerCase()} recall for products related to "${selectedRecall.title}".\n\nReason for recall: ${selectedRecall.recall_reason}\n\nPlease take appropriate action immediately.\n\nRegards,\nQuality Assurance Team`}
                      className="mt-1 min-h-32"
                      id="bulk-notification-message"
                    />
                  </div>
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setBulkNotificationDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      variant="default"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => {
                        const subject = (document.getElementById('bulk-notification-subject') as HTMLInputElement)?.value || '';
                        const message = (document.getElementById('bulk-notification-message') as HTMLTextAreaElement)?.value || '';
                        handleBulkNotificationSubmit(subject, message);
                      }}
                    >
                      <Send className="mr-1 h-4 w-4" /> Send to All Stakeholders
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Traceability;
