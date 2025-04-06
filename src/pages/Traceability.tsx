
import React, { useState, useEffect } from 'react';
import { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent 
} from '@/components/ui/tabs';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter 
} from '@/components/ui/dialog';
import { 
  Button,
  Input,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Badge
} from '@/components/ui/';
import { Search, Plus, Info, Calendar, AlertCircle, CheckCircle, ChevronRight, RefreshCw } from 'lucide-react';
import { useTraceability } from '@/hooks/useTraceability';
import ProductForm from '@/components/traceability/ProductForm';
import ComponentForm from '@/components/traceability/ComponentForm';
import GenealogyForm from '@/components/traceability/GenealogyForm';
import GenealogyTree from '@/components/traceability/GenealogyTree';
import RecallForm from '@/components/traceability/RecallForm';
import RecallSimulationForm from '@/components/traceability/RecallSimulationForm';
import RecallScheduleForm from '@/components/traceability/RecallScheduleForm';
import NotificationForm from '@/components/traceability/NotificationForm';
import SupplyChainVisualization from '@/components/traceability/SupplyChainVisualization';
import { format } from 'date-fns';

const Traceability: React.FC = () => {
  const { 
    products,
    components,
    recalls,
    recallSchedules,
    selectedProduct,
    selectedComponent,
    selectedRecall,
    selectedSchedule,
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
    loadGenealogyTree,
    loadSupplyChainVisualization,
    loadRecallSimulations,
    loadNotifications,
    loadProductComponents,
    loadAffectedProducts,
    
    addProduct,
    addComponent,
    addGenealogyLink,
    addRecall,
    addRecallSimulation,
    addRecallSchedule,
    addNotification,
    sendAllNotifications,
    
    setSelectedProduct,
    setSelectedComponent,
    setSelectedRecall
  } = useTraceability();
  
  const [activeTab, setActiveTab] = useState('products');
  const [showProductForm, setShowProductForm] = useState(false);
  const [showComponentForm, setShowComponentForm] = useState(false);
  const [showGenealogyForm, setShowGenealogyForm] = useState(false);
  const [showRecallForm, setShowRecallForm] = useState(false);
  const [showRecallScheduleForm, setShowRecallScheduleForm] = useState(false);
  const [showSimulationForm, setShowSimulationForm] = useState(false);
  const [showNotificationForm, setShowNotificationForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [trackingQuery, setTrackingQuery] = useState('');
  const [traceResult, setTraceResult] = useState<'product' | 'component' | null>(null);
  
  // Initialize data on component mount
  useEffect(() => {
    loadProducts();
    loadComponents();
    loadRecalls();
    loadRecallSchedules();
  }, [loadProducts, loadComponents, loadRecalls, loadRecallSchedules]);
  
  // Filter products based on search query
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.batch_lot_number.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Filter components based on search query
  const filteredComponents = components.filter(component => 
    component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    component.batch_lot_number.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Filter recalls based on search query
  const filteredRecalls = recalls.filter(recall => 
    recall.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (recall.description && recall.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
    recall.recall_reason.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Filter schedules based on search query
  const filteredSchedules = recallSchedules.filter(schedule => 
    schedule.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (schedule.description && schedule.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  // Handler for product selection
  const handleProductSelect = async (productId: string) => {
    const product = await loadProduct(productId);
    if (product) {
      setSelectedProduct(product);
      await loadGenealogyTree(productId);
      await loadSupplyChainVisualization(productId);
    }
  };
  
  // Handler for component selection
  const handleComponentSelect = async (componentId: string) => {
    const component = await loadComponent(componentId);
    if (component) {
      setSelectedComponent(component);
      // Load affected products for this component
      await loadAffectedProducts(component.batch_lot_number);
    }
  };
  
  // Handler for recall selection
  const handleRecallSelect = async (recallId: string) => {
    const recall = await loadRecall(recallId);
    if (recall) {
      setSelectedRecall(recall);
      await loadRecallSimulations(recallId);
      await loadNotifications(recallId);
    }
  };
  
  // Handler for product form submission
  const handleProductSubmit = async (data: any) => {
    await addProduct(data);
    setShowProductForm(false);
    loadProducts();
  };
  
  // Handler for component form submission
  const handleComponentSubmit = async (data: any) => {
    await addComponent(data);
    setShowComponentForm(false);
    loadComponents();
  };
  
  // Handler for genealogy form submission
  const handleGenealogySubmit = async (data: any) => {
    await addGenealogyLink(data);
    setShowGenealogyForm(false);
    if (selectedProduct) {
      await loadGenealogyTree(selectedProduct.id);
    }
  };
  
  // Handler for recall form submission
  const handleRecallSubmit = async (data: any) => {
    await addRecall(data);
    setShowRecallForm(false);
    loadRecalls();
  };
  
  // Handler for recall schedule form submission
  const handleRecallScheduleSubmit = async (data: any) => {
    await addRecallSchedule(data);
    setShowRecallScheduleForm(false);
    loadRecallSchedules();
  };
  
  // Handler for simulation form submission
  const handleSimulationSubmit = async (data: any) => {
    if (selectedRecall) {
      await addRecallSimulation({
        ...data,
        recall_id: selectedRecall.id
      });
      setShowSimulationForm(false);
      await loadRecallSimulations(selectedRecall.id);
    }
  };
  
  // Handler for notification form submission
  const handleNotificationSubmit = async (data: any) => {
    if (selectedRecall) {
      await addNotification({
        ...data,
        recall_id: selectedRecall.id,
        created_by: 'Current User' // Replace with actual user info
      });
      setShowNotificationForm(false);
      await loadNotifications(selectedRecall.id);
    }
  };
  
  // Handler for sending bulk notifications
  const handleSendAllNotifications = async () => {
    if (selectedRecall) {
      await sendAllNotifications(
        selectedRecall.id,
        `IMPORTANT: Recall Notice - ${selectedRecall.title}`,
        `This is an official recall notice for products affected by recall: ${selectedRecall.title}. Reason: ${selectedRecall.recall_reason}. Please take immediate action as required.`,
        'System'
      );
      await loadNotifications(selectedRecall.id);
    }
  };
  
  // Handler for tracing a product or component by batch/lot number
  const handleTraceProduct = async () => {
    // Check if it's a product first
    const productResult = await loadProductByBatchLot(trackingQuery);
    
    if (productResult) {
      setSelectedProduct(productResult);
      await loadGenealogyTree(productResult.id);
      await loadProductComponents(trackingQuery);
      setTraceResult('product');
    } else {
      // Check if it's a component
      await loadAffectedProducts(trackingQuery);
      if (affectedProducts.length > 0) {
        setTraceResult('component');
      } else {
        setTraceResult(null);
        alert('No product or component found with this batch/lot number');
      }
    }
  };
  
  // Reset trace results
  const handleResetTrace = () => {
    setTrackingQuery('');
    setTraceResult(null);
    setSelectedProduct(null);
    setSelectedComponent(null);
  };
  
  // Render the products tab content
  const renderProductsTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={() => setShowProductForm(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
          <CardDescription>
            View and manage products in the system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Batch/Lot Number</TableHead>
                <TableHead>Manufacturing Date</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Loading products...
                  </TableCell>
                </TableRow>
              ) : filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No products found
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.batch_lot_number}</Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(product.manufacturing_date), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      {product.expiry_date 
                        ? format(new Date(product.expiry_date), 'MMM d, yyyy')
                        : 'N/A'}
                    </TableCell>
                    <TableCell>{product.category || 'N/A'}</TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleProductSelect(product.id)}
                      >
                        <Info className="h-4 w-4 mr-1" /> Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {selectedProduct && (
        <Card>
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
            <CardDescription>
              {selectedProduct.name} ({selectedProduct.batch_lot_number})
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-medium">Basic Information</h3>
                <div className="mt-2 space-y-2">
                  <div>
                    <span className="font-medium">SKU:</span> {selectedProduct.sku || 'N/A'}
                  </div>
                  <div>
                    <span className="font-medium">Category:</span> {selectedProduct.category || 'N/A'}
                  </div>
                  <div>
                    <span className="font-medium">Manufacturing Date:</span> {
                      format(new Date(selectedProduct.manufacturing_date), 'MMM d, yyyy')
                    }
                  </div>
                  <div>
                    <span className="font-medium">Expiry Date:</span> {
                      selectedProduct.expiry_date 
                        ? format(new Date(selectedProduct.expiry_date), 'MMM d, yyyy')
                        : 'N/A'
                    }
                  </div>
                  <div>
                    <span className="font-medium">Created By:</span> {selectedProduct.created_by}
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium">Description</h3>
                <p className="mt-2 text-sm">
                  {selectedProduct.description || 'No description available.'}
                </p>
                
                <div className="mt-4 flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setShowGenealogyForm(true)}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Component
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setShowRecallForm(true)}
                  >
                    <AlertCircle className="h-4 w-4 mr-1" /> Initiate Recall
                  </Button>
                </div>
              </div>
            </div>
            
            {genealogyTree && (
              <GenealogyTree 
                data={genealogyTree} 
                onNodeClick={(node) => {
                  if (node.type === 'component') {
                    handleComponentSelect(node.id);
                  }
                }}
              />
            )}
            
            {supplyChainData && (
              <SupplyChainVisualization 
                data={supplyChainData} 
              />
            )}
          </CardContent>
        </Card>
      )}
      
      <Dialog open={showProductForm} onOpenChange={setShowProductForm}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>
              Enter the details of the new product to add to the system.
            </DialogDescription>
          </DialogHeader>
          <ProductForm onSubmit={handleProductSubmit} onCancel={() => setShowProductForm(false)} />
        </DialogContent>
      </Dialog>
      
      <Dialog open={showGenealogyForm} onOpenChange={setShowGenealogyForm}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Add Component to Product</DialogTitle>
            <DialogDescription>
              Link a component to this product to build the genealogy.
            </DialogDescription>
          </DialogHeader>
          <GenealogyForm 
            productId={selectedProduct?.id || ''} 
            onSubmit={handleGenealogySubmit} 
            onCancel={() => setShowGenealogyForm(false)} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
  
  // Render the components tab content
  const renderComponentsTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search components..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={() => setShowComponentForm(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Component
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Components</CardTitle>
          <CardDescription>
            View and manage components (raw materials, ingredients, etc.).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Batch/Lot Number</TableHead>
                <TableHead>Received Date</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Loading components...
                  </TableCell>
                </TableRow>
              ) : filteredComponents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No components found
                  </TableCell>
                </TableRow>
              ) : (
                filteredComponents.map((component) => (
                  <TableRow key={component.id}>
                    <TableCell>{component.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{component.batch_lot_number}</Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(component.received_date), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      {component.expiry_date 
                        ? format(new Date(component.expiry_date), 'MMM d, yyyy')
                        : 'N/A'}
                    </TableCell>
                    <TableCell>{component.category || 'N/A'}</TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleComponentSelect(component.id)}
                      >
                        <Info className="h-4 w-4 mr-1" /> Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {selectedComponent && (
        <Card>
          <CardHeader>
            <CardTitle>Component Details</CardTitle>
            <CardDescription>
              {selectedComponent.name} ({selectedComponent.batch_lot_number})
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-medium">Basic Information</h3>
                <div className="mt-2 space-y-2">
                  <div>
                    <span className="font-medium">Category:</span> {selectedComponent.category || 'N/A'}
                  </div>
                  <div>
                    <span className="font-medium">Received Date:</span> {
                      format(new Date(selectedComponent.received_date), 'MMM d, yyyy')
                    }
                  </div>
                  <div>
                    <span className="font-medium">Expiry Date:</span> {
                      selectedComponent.expiry_date 
                        ? format(new Date(selectedComponent.expiry_date), 'MMM d, yyyy')
                        : 'N/A'
                    }
                  </div>
                  <div>
                    <span className="font-medium">Created By:</span> {selectedComponent.created_by}
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium">Description</h3>
                <p className="mt-2 text-sm">
                  {selectedComponent.description || 'No description available.'}
                </p>
              </div>
            </div>
            
            {affectedProducts.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-2">Affected Products</h3>
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product Name</TableHead>
                        <TableHead>Batch/Lot Number</TableHead>
                        <TableHead>Manufacturing Date</TableHead>
                        <TableHead>Expiry Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {affectedProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>{product.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{product.batch_lot_number}</Badge>
                          </TableCell>
                          <TableCell>
                            {format(new Date(product.manufacturing_date), 'MMM d, yyyy')}
                          </TableCell>
                          <TableCell>
                            {product.expiry_date 
                              ? format(new Date(product.expiry_date), 'MMM d, yyyy')
                              : 'N/A'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
      
      <Dialog open={showComponentForm} onOpenChange={setShowComponentForm}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Add New Component</DialogTitle>
            <DialogDescription>
              Enter the details of the new component to add to the system.
            </DialogDescription>
          </DialogHeader>
          <ComponentForm onSubmit={handleComponentSubmit} onCancel={() => setShowComponentForm(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
  
  // Render the recalls tab content
  const renderRecallsTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search recalls..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setShowRecallScheduleForm(true)}>
            <Calendar className="mr-2 h-4 w-4" /> Schedule Recall
          </Button>
          <Button onClick={() => setShowRecallForm(true)}>
            <Plus className="mr-2 h-4 w-4" /> New Recall
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recalls</CardTitle>
          <CardDescription>
            View and manage product recalls.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Initiated</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Loading recalls...
                  </TableCell>
                </TableRow>
              ) : filteredRecalls.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No recalls found
                  </TableCell>
                </TableRow>
              ) : (
                filteredRecalls.map((recall) => (
                  <TableRow key={recall.id}>
                    <TableCell>{recall.title}</TableCell>
                    <TableCell>
                      <Badge variant={recall.recall_type === 'Mock' ? 'outline' : 'destructive'}>
                        {recall.recall_type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        recall.status === 'Completed' ? 'success' :
                        recall.status === 'In Progress' ? 'warning' :
                        recall.status === 'Cancelled' ? 'secondary' : 'default'
                      }>
                        {recall.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(recall.initiated_at || ''), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {recall.recall_reason}
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleRecallSelect(recall.id)}
                      >
                        <Info className="h-4 w-4 mr-1" /> Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {selectedRecall && (
        <Card>
          <CardHeader>
            <CardTitle>Recall Details</CardTitle>
            <CardDescription>
              {selectedRecall.title} ({selectedRecall.recall_type} Recall)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-medium">Basic Information</h3>
                <div className="mt-2 space-y-2">
                  <div>
                    <span className="font-medium">Status:</span> 
                    <Badge className="ml-2" variant={
                      selectedRecall.status === 'Completed' ? 'success' :
                      selectedRecall.status === 'In Progress' ? 'warning' :
                      selectedRecall.status === 'Cancelled' ? 'secondary' : 'default'
                    }>
                      {selectedRecall.status}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium">Initiated By:</span> {selectedRecall.initiated_by}
                  </div>
                  <div>
                    <span className="font-medium">Initiated At:</span> {
                      format(new Date(selectedRecall.initiated_at || ''), 'MMM d, yyyy h:mm a')
                    }
                  </div>
                  {selectedRecall.completed_at && (
                    <div>
                      <span className="font-medium">Completed At:</span> {
                        format(new Date(selectedRecall.completed_at), 'MMM d, yyyy h:mm a')
                      }
                    </div>
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium">Recall Reason</h3>
                <p className="mt-2 text-sm">
                  {selectedRecall.recall_reason}
                </p>
                
                <h4 className="font-medium mt-4">Corrective Actions</h4>
                <p className="mt-1 text-sm">
                  {selectedRecall.corrective_actions || 'No corrective actions specified.'}
                </p>
                
                <div className="mt-4 flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setShowSimulationForm(true)}
                  >
                    <RefreshCw className="h-4 w-4 mr-1" /> Run Simulation
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setShowNotificationForm(true)}
                  >
                    <AlertCircle className="h-4 w-4 mr-1" /> Send Notification
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={handleSendAllNotifications}
                  >
                    Notify All Stakeholders
                  </Button>
                </div>
              </div>
            </div>
            
            {recallSimulations.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-2">Recall Simulations</h3>
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Duration (sec)</TableHead>
                        <TableHead>Success Rate</TableHead>
                        <TableHead>Bottlenecks</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recallSimulations.map((simulation) => (
                        <TableRow key={simulation.id}>
                          <TableCell>
                            {format(new Date(simulation.simulation_date || ''), 'MMM d, yyyy')}
                          </TableCell>
                          <TableCell>{simulation.duration || 'N/A'}</TableCell>
                          <TableCell>
                            {simulation.success_rate ? `${simulation.success_rate}%` : 'N/A'}
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {simulation.bottlenecks || 'None reported'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
            
            {notifications.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-2">Notifications</h3>
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Recipient</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Sent At</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {notifications.map((notification) => (
                        <TableRow key={notification.id}>
                          <TableCell>
                            {notification.recipient_email || notification.recipient_type}
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {notification.subject}
                          </TableCell>
                          <TableCell>
                            <Badge variant={
                              notification.status === 'Sent' ? 'success' :
                              notification.status === 'Failed' ? 'destructive' : 'default'
                            }>
                              {notification.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {notification.sent_at 
                              ? format(new Date(notification.sent_at), 'MMM d, yyyy h:mm a') 
                              : 'Not sent yet'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
      
      <Dialog open={showRecallForm} onOpenChange={setShowRecallForm}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Initiate New Recall</DialogTitle>
            <DialogDescription>
              Enter the details for the new recall.
            </DialogDescription>
          </DialogHeader>
          <RecallForm onSubmit={handleRecallSubmit} onCancel={() => setShowRecallForm(false)} />
        </DialogContent>
      </Dialog>
      
      <Dialog open={showRecallScheduleForm} onOpenChange={setShowRecallScheduleForm}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Schedule a Recall</DialogTitle>
            <DialogDescription>
              Set up a one-time or recurring mock recall.
            </DialogDescription>
          </DialogHeader>
          <RecallScheduleForm 
            onSubmit={handleRecallScheduleSubmit} 
            onCancel={() => setShowRecallScheduleForm(false)} 
          />
        </DialogContent>
      </Dialog>
      
      <Dialog open={showSimulationForm} onOpenChange={setShowSimulationForm}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Run Recall Simulation</DialogTitle>
            <DialogDescription>
              Configure this simulation run for the recall.
            </DialogDescription>
          </DialogHeader>
          {selectedRecall && (
            <RecallSimulationForm 
              recallId={selectedRecall.id} 
              onSubmit={handleSimulationSubmit} 
              onCancel={() => setShowSimulationForm(false)} 
            />
          )}
        </DialogContent>
      </Dialog>
      
      <Dialog open={showNotificationForm} onOpenChange={setShowNotificationForm}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Send Recall Notification</DialogTitle>
            <DialogDescription>
              Send a notification to a specific recipient.
            </DialogDescription>
          </DialogHeader>
          <NotificationForm 
            onSubmit={handleNotificationSubmit} 
            onCancel={() => setShowNotificationForm(false)} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
  
  // Render the schedules tab content
  const renderSchedulesTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search schedules..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={() => setShowRecallScheduleForm(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Schedule
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recall Schedules</CardTitle>
          <CardDescription>
            View and manage scheduled recalls.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Next Execution</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Loading schedules...
                  </TableCell>
                </TableRow>
              ) : filteredSchedules.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No schedules found
                  </TableCell>
                </TableRow>
              ) : (
                filteredSchedules.map((schedule) => (
                  <TableRow key={schedule.id}>
                    <TableCell>{schedule.title}</TableCell>
                    <TableCell>
                      <Badge variant={schedule.recall_type === 'Mock' ? 'outline' : 'destructive'}>
                        {schedule.recall_type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {schedule.is_recurring 
                        ? `${schedule.recurrence_pattern || 'Custom'} (every ${schedule.recurrence_interval || 1})`
                        : 'One-time'}
                    </TableCell>
                    <TableCell>
                      {schedule.next_execution_at 
                        ? format(new Date(schedule.next_execution_at), 'MMM d, yyyy')
                        : 'Not scheduled'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={schedule.status === 'active' ? 'success' : 'secondary'}>
                        {schedule.status || 'Unknown'}
                      </Badge>
                    </TableCell>
                    <TableCell>{schedule.created_by}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
  
  // Render the tracing tab content
  const renderTracingTab = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Product & Component Tracing</CardTitle>
          <CardDescription>
            Trace a product or component through the supply chain using its batch/lot number.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex space-x-2">
              <div className="flex-1">
                <Input
                  placeholder="Enter batch/lot number to trace..."
                  value={trackingQuery}
                  onChange={(e) => setTrackingQuery(e.target.value)}
                />
              </div>
              <Button onClick={handleTraceProduct} disabled={!trackingQuery}>
                Trace
              </Button>
              {traceResult && (
                <Button variant="outline" onClick={handleResetTrace}>
                  Reset
                </Button>
              )}
            </div>
            
            {loading && (
              <div className="text-center py-4">
                Searching for batch/lot number...
              </div>
            )}
            
            {traceResult === 'product' && selectedProduct && (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                  <h3 className="text-lg font-medium flex items-center text-green-800">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Product Found
                  </h3>
                  <p className="mt-1 text-sm text-green-700">
                    Found product "{selectedProduct.name}" with batch/lot number "{selectedProduct.batch_lot_number}".
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-medium">Product Details</h3>
                    <div className="mt-2 space-y-2">
                      <div>
                        <span className="font-medium">Name:</span> {selectedProduct.name}
                      </div>
                      <div>
                        <span className="font-medium">Batch/Lot:</span> {selectedProduct.batch_lot_number}
                      </div>
                      <div>
                        <span className="font-medium">Manufacturing Date:</span> {
                          format(new Date(selectedProduct.manufacturing_date), 'MMM d, yyyy')
                        }
                      </div>
                      <div>
                        <span className="font-medium">Expiry Date:</span> {
                          selectedProduct.expiry_date 
                            ? format(new Date(selectedProduct.expiry_date), 'MMM d, yyyy')
                            : 'N/A'
                        }
                      </div>
                    </div>
                  </div>
                  
                  {productComponents.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium">Components Used</h3>
                      <div className="mt-2 space-y-1">
                        {productComponents.map((component, index) => (
                          <div key={index} className="flex items-center">
                            <ChevronRight className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span>
                              {component.component_name} ({component.component_batch_lot})
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {genealogyTree && (
                  <GenealogyTree 
                    data={genealogyTree} 
                    onNodeClick={(node) => {
                      if (node.type === 'component') {
                        handleComponentSelect(node.id);
                      }
                    }}
                  />
                )}
              </div>
            )}
            
            {traceResult === 'component' && affectedProducts.length > 0 && (
              <div className="space-y-4">
                <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
                  <h3 className="text-lg font-medium flex items-center text-amber-800">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    Component Found in Products
                  </h3>
                  <p className="mt-1 text-sm text-amber-700">
                    The component with batch/lot number "{trackingQuery}" was found in {affectedProducts.length} product(s).
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Affected Products</h3>
                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product Name</TableHead>
                          <TableHead>Batch/Lot Number</TableHead>
                          <TableHead>Manufacturing Date</TableHead>
                          <TableHead>Expiry Date</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {affectedProducts.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{product.batch_lot_number}</Badge>
                            </TableCell>
                            <TableCell>
                              {format(new Date(product.manufacturing_date), 'MMM d, yyyy')}
                            </TableCell>
                            <TableCell>
                              {product.expiry_date 
                                ? format(new Date(product.expiry_date), 'MMM d, yyyy')
                                : 'N/A'}
                            </TableCell>
                            <TableCell>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleProductSelect(product.id)}
                              >
                                <Info className="h-4 w-4 mr-1" /> Details
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <h3 className="text-md font-medium text-blue-800">Consider a Recall?</h3>
                  <p className="mt-1 text-sm text-blue-700">
                    If this component has an issue, you may need to recall the affected products.
                  </p>
                  <Button 
                    className="mt-2" 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setActiveTab('recalls');
                      setShowRecallForm(true);
                    }}
                  >
                    <AlertCircle className="h-4 w-4 mr-1" /> Initiate Recall
                  </Button>
                </div>
              </div>
            )}
            
            {traceResult === null && trackingQuery && !loading && (
              <div className="bg-gray-50 border border-gray-200 rounded-md p-4 text-center">
                No product or component found with this batch/lot number.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
  
  return (
    <div className="container py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Traceability</h1>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 w-[600px]">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="components">Components</TabsTrigger>
          <TabsTrigger value="recalls">Recalls</TabsTrigger>
          <TabsTrigger value="schedules">Schedules</TabsTrigger>
          <TabsTrigger value="tracing">Tracing</TabsTrigger>
        </TabsList>
        
        <TabsContent value="products" className="mt-6">
          {renderProductsTab()}
        </TabsContent>
        
        <TabsContent value="components" className="mt-6">
          {renderComponentsTab()}
        </TabsContent>
        
        <TabsContent value="recalls" className="mt-6">
          {renderRecallsTab()}
        </TabsContent>
        
        <TabsContent value="schedules" className="mt-6">
          {renderSchedulesTab()}
        </TabsContent>
        
        <TabsContent value="tracing" className="mt-6">
          {renderTracingTab()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Traceability;
