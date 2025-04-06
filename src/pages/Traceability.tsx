
import React, { useEffect, useState } from 'react';
import { useTraceability } from '@/hooks/useTraceability';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';

import ProductForm from '@/components/traceability/ProductForm';
import RawMaterialForm from '@/components/traceability/RawMaterialForm';
import GenealogyForm from '@/components/traceability/GenealogyForm';
import GenealogyTree from '@/components/traceability/GenealogyTree';
import RecallForm from '@/components/traceability/RecallForm';
import RecallScheduleForm from '@/components/traceability/RecallScheduleForm';
import RecallSimulationForm from '@/components/traceability/RecallSimulationForm';
import NotificationForm from '@/components/traceability/NotificationForm';
import SupplyChainVisualization from '@/components/traceability/SupplyChainVisualization';
import TraceabilityStatistics from '@/components/traceability/TraceabilityStatistics';
import TraceabilityReports from '@/components/traceability/TraceabilityReports';

import { 
  Search, 
  Plus, 
  RefreshCw, 
  AlertTriangle, 
  Calendar, 
  BarChart2, 
  Link, 
  Send, 
  Check,
  Trash2,
  Edit,
  MoreHorizontal
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Traceability = () => {
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
    loadComponent,
    loadRecall,
    loadGenealogyTree,
    loadSupplyChainVisualization,
    loadRecallSimulations,
    loadNotifications,
    loadProductComponents,
    loadAffectedProducts,
    loadProductByBatchLot,
    
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

  // Local state for UI
  const [activeTab, setActiveTab] = useState('products');
  const [batchLotSearch, setBatchLotSearch] = useState('');
  const [searchResults, setSearchResults] = useState<any | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showComponentForm, setShowComponentForm] = useState(false);
  const [showGenealogyForm, setShowGenealogyForm] = useState(false);
  const [showRecallForm, setShowRecallForm] = useState(false);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [showSimulationForm, setShowSimulationForm] = useState(false);
  const [showNotificationForm, setShowNotificationForm] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{type: string, id: string} | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);

  useEffect(() => {
    // Load initial data when component mounts
    loadProducts();
    loadComponents();
    loadRecalls();
    loadRecallSchedules();
  }, [loadProducts, loadComponents, loadRecalls, loadRecallSchedules]);

  const handleSearch = async () => {
    if (!batchLotSearch.trim()) {
      toast({
        title: "Search Error",
        description: "Please enter a batch or lot number",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await loadProductByBatchLot(batchLotSearch);
      setSearchResults(result);
      
      if (result) {
        loadGenealogyTree(result.id);
        toast({
          title: "Product Found",
          description: `Found product: ${result.name}`,
        });
      } else {
        toast({
          title: "No Results",
          description: "No product found with that batch/lot number",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Search error:", err);
      toast({
        title: "Search Error",
        description: "An error occurred during search",
        variant: "destructive",
      });
    }
  };

  const handleProductView = async (product) => {
    setSelectedProduct(product);
    await loadGenealogyTree(product.id);
    await loadProductComponents(product.batch_lot_number);
    setActiveTab('products');
  };
  
  const handleRawMaterialView = async (component) => {
    setSelectedComponent(component);
    await loadAffectedProducts(component.batch_lot_number);
    setActiveTab('components');
  };
  
  const handleRecallView = async (recall) => {
    setSelectedRecall(recall);
    await loadRecallSimulations(recall.id);
    await loadNotifications(recall.id);
    setActiveTab('recalls');
  };

  const handleProductSubmit = async (data) => {
    try {
      if (editingItem && editingItem.type === 'product') {
        // Update existing product logic would go here
        console.log("Updating product:", editingItem.id, data);
        toast({
          title: "Product Updated",
          description: `${data.name} has been updated successfully.`
        });
      } else {
        await addProduct(data);
        toast({
          title: "Product Added",
          description: `${data.name} has been added successfully.`
        });
      }
      setShowProductForm(false);
      setEditingItem(null);
      loadProducts();
    } catch (err) {
      console.error("Error saving product:", err);
      toast({
        title: "Error",
        description: "Failed to save product information.",
        variant: "destructive",
      });
    }
  };

  const handleComponentSubmit = async (data) => {
    try {
      if (editingItem && editingItem.type === 'component') {
        // Update existing raw material logic would go here
        console.log("Updating raw material:", editingItem.id, data);
        toast({
          title: "Raw Material Updated",
          description: `${data.name} has been updated successfully.`
        });
      } else {
        await addComponent(data);
        toast({
          title: "Raw Material Added",
          description: `${data.name} has been added successfully.`
        });
      }
      setShowComponentForm(false);
      setEditingItem(null);
      loadComponents();
    } catch (err) {
      console.error("Error saving raw material:", err);
      toast({
        title: "Error",
        description: "Failed to save raw material information.",
        variant: "destructive",
      });
    }
  };

  const handleGenealogySubmit = async (data) => {
    try {
      await addGenealogyLink(data);
      setShowGenealogyForm(false);
      
      // Reload genealogy tree if we have a selected product
      if (selectedProduct) {
        await loadGenealogyTree(selectedProduct.id);
        await loadProductComponents(selectedProduct.batch_lot_number);
      }
      
      toast({
        title: "Link Added",
        description: "Raw material has been linked to the product."
      });
    } catch (err) {
      console.error("Error adding genealogy link:", err);
      toast({
        title: "Error",
        description: "Failed to link raw material to product.",
        variant: "destructive",
      });
    }
  };

  const handleRecallSubmit = async (data) => {
    try {
      if (editingItem && editingItem.type === 'recall') {
        // Update existing recall logic would go here
        console.log("Updating recall:", editingItem.id, data);
        toast({
          title: "Recall Updated",
          description: `${data.title} has been updated successfully.`
        });
      } else {
        const newRecall = await addRecall(data);
        if (newRecall) {
          setSelectedRecall(newRecall);
        }
        toast({
          title: "Recall Created",
          description: `${data.title} has been created successfully.`
        });
      }
      setShowRecallForm(false);
      setEditingItem(null);
      loadRecalls();
    } catch (err) {
      console.error("Error creating recall:", err);
      toast({
        title: "Error",
        description: "Failed to create recall.",
        variant: "destructive",
      });
    }
  };

  const handleScheduleSubmit = async (data) => {
    try {
      if (editingItem && editingItem.type === 'schedule') {
        // Update existing schedule logic would go here
        console.log("Updating schedule:", editingItem.id, data);
        toast({
          title: "Schedule Updated",
          description: `${data.title} has been updated successfully.`
        });
      } else {
        await addRecallSchedule(data);
        toast({
          title: "Schedule Created",
          description: `${data.title} has been scheduled successfully.`
        });
      }
      setShowScheduleForm(false);
      setEditingItem(null);
      loadRecallSchedules();
    } catch (err) {
      console.error("Error creating schedule:", err);
      toast({
        title: "Error",
        description: "Failed to create recall schedule.",
        variant: "destructive",
      });
    }
  };

  const handleSimulationSubmit = async (data) => {
    try {
      await addRecallSimulation(data);
      setShowSimulationForm(false);
      
      if (selectedRecall) {
        await loadRecallSimulations(selectedRecall.id);
      }
      
      toast({
        title: "Simulation Recorded",
        description: "Recall simulation results have been saved."
      });
    } catch (err) {
      console.error("Error saving simulation:", err);
      toast({
        title: "Error",
        description: "Failed to save simulation results.",
        variant: "destructive",
      });
    }
  };

  const handleNotificationSubmit = async (data) => {
    try {
      await addNotification({
        ...data,
        recall_id: selectedRecall.id,
      });
      
      setShowNotificationForm(false);
      
      if (selectedRecall) {
        await loadNotifications(selectedRecall.id);
      }
      
      toast({
        title: "Notification Sent",
        description: "Notification has been sent successfully."
      });
    } catch (err) {
      console.error("Error sending notification:", err);
      toast({
        title: "Error",
        description: "Failed to send notification.",
        variant: "destructive",
      });
    }
  };

  const handleSendAllNotifications = async () => {
    if (!selectedRecall) return;
    
    try {
      await sendAllNotifications(
        selectedRecall.id,
        `Recall Notice: ${selectedRecall.title}`,
        `A recall has been initiated for products related to: ${selectedRecall.recall_reason}`,
        "System"
      );
      
      await loadNotifications(selectedRecall.id);
      
      toast({
        title: "Notifications Sent",
        description: "Notifications have been sent to all affected parties."
      });
    } catch (err) {
      console.error("Error sending notifications:", err);
      toast({
        title: "Error",
        description: "Failed to send notifications.",
        variant: "destructive",
      });
    }
  };

  const confirmDelete = (type, id) => {
    setItemToDelete({ type, id });
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;

    try {
      const { type, id } = itemToDelete;
      
      // For a real implementation, these would call your API to delete the items
      switch (type) {
        case 'product':
          // deleteProduct(id) would go here
          console.log("Deleting product:", id);
          toast({
            title: "Product Deleted",
            description: "The product has been deleted successfully."
          });
          loadProducts();
          if (selectedProduct?.id === id) {
            setSelectedProduct(null);
          }
          break;
          
        case 'component':
          // deleteComponent(id) would go here
          console.log("Deleting raw material:", id);
          toast({
            title: "Raw Material Deleted",
            description: "The raw material has been deleted successfully."
          });
          loadComponents();
          if (selectedComponent?.id === id) {
            setSelectedComponent(null);
          }
          break;
          
        case 'recall':
          // deleteRecall(id) would go here
          console.log("Deleting recall:", id);
          toast({
            title: "Recall Deleted",
            description: "The recall has been deleted successfully."
          });
          loadRecalls();
          if (selectedRecall?.id === id) {
            setSelectedRecall(null);
          }
          break;
          
        case 'schedule':
          // deleteSchedule(id) would go here
          console.log("Deleting schedule:", id);
          toast({
            title: "Schedule Deleted",
            description: "The recall schedule has been deleted successfully."
          });
          loadRecallSchedules();
          break;
      }
    } catch (err) {
      console.error("Error deleting item:", err);
      toast({
        title: "Error",
        description: "Failed to delete the item.",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const handleEdit = (type, item) => {
    setEditingItem({ type, ...item });
    
    switch (type) {
      case 'product':
        setShowProductForm(true);
        break;
      case 'component':
        setShowComponentForm(true);
        break;
      case 'recall':
        setShowRecallForm(true);
        break;
      case 'schedule':
        setShowScheduleForm(true);
        break;
    }
  };

  const renderStatusBadge = (status) => {
    let variant = "secondary";
    
    if (typeof status === 'string') {
      switch (status.toLowerCase()) {
        case 'in progress':
          variant = "secondary";
          break;
        case 'completed':
          variant = "success";
          break;
        case 'scheduled':
          variant = "secondary";
          break;
        case 'cancelled':
          variant = "destructive";
          break;
        default:
          variant = "secondary";
          break;
      }
    }
    
    return <Badge variant={variant}>{status}</Badge>;
  };

  const renderItemActions = (type, item) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleEdit(type, item)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => confirmDelete(type, item.id)} className="text-red-600">
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Traceability</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p><strong>Error:</strong> {error.message || "An unknown error occurred."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Product Traceability</h1>
        <p className="text-muted-foreground mt-1">
          Track products through the supply chain and manage recalls
        </p>
      </div>

      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <div className="flex-1">
            <div className="relative flex items-center">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by batch/lot number"
                className="pl-8"
                value={batchLotSearch}
                onChange={(e) => setBatchLotSearch(e.target.value)}
              />
            </div>
          </div>
          <Button onClick={handleSearch}>Search</Button>
        </div>

        {searchResults && (
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle>Search Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium">{searchResults.name}</h3>
                  <p className="text-muted-foreground">Batch/Lot: {searchResults.batch_lot_number}</p>
                  <p className="text-muted-foreground">
                    Manufactured: {new Date(searchResults.manufacturing_date).toLocaleDateString()}
                  </p>
                  {searchResults.quantity && searchResults.units && (
                    <p className="text-muted-foreground">
                      Quantity: {searchResults.quantity} {searchResults.units}
                    </p>
                  )}
                </div>
                <Button onClick={() => handleProductView(searchResults)}>View Details</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="components">Raw Materials</TabsTrigger>
          <TabsTrigger value="recalls">Recalls</TabsTrigger>
          <TabsTrigger value="schedules">Schedules</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Products</h2>
            <div className="flex gap-2">
              <Button onClick={() => {
                setEditingItem(null);
                setShowProductForm(true);
              }}>
                <Plus className="mr-2 h-4 w-4" /> Add Product
              </Button>
              {selectedProduct && (
                <Button onClick={() => setShowGenealogyForm(true)}>
                  <Link className="mr-2 h-4 w-4" /> Link Raw Material
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-4">
              <Card className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle>Product List</CardTitle>
                  <CardDescription>Select a product to view details</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="max-h-[500px] overflow-y-auto">
                    {loading ? (
                      <div className="p-4 text-center">Loading products...</div>
                    ) : products.length > 0 ? (
                      <div>
                        {products.map((product) => (
                          <div
                            key={product.id}
                            className={`p-3 border-b hover:bg-gray-50 cursor-pointer flex justify-between items-center ${
                              selectedProduct?.id === product.id ? 'bg-gray-50' : ''
                            }`}
                            onClick={() => handleProductView(product)}
                          >
                            <div>
                              <p className="font-medium truncate">{product.name}</p>
                              <p className="text-sm text-muted-foreground">
                                Batch: {product.batch_lot_number}
                              </p>
                              {product.quantity && product.units && (
                                <p className="text-sm text-muted-foreground">
                                  Quantity: {product.quantity} {product.units}
                                </p>
                              )}
                            </div>
                            {renderItemActions('product', product)}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center">No products found</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2 space-y-4">
              {selectedProduct ? (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>{selectedProduct.name}</CardTitle>
                      <CardDescription>
                        Batch/Lot: {selectedProduct.batch_lot_number}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Manufacturing Date</h3>
                          <p>{new Date(selectedProduct.manufacturing_date).toLocaleDateString()}</p>
                        </div>
                        
                        {selectedProduct.expiry_date && (
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Expiry Date</h3>
                            <p>{new Date(selectedProduct.expiry_date).toLocaleDateString()}</p>
                          </div>
                        )}
                        
                        {selectedProduct.category && (
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Category</h3>
                            <p>{selectedProduct.category}</p>
                          </div>
                        )}
                        
                        {selectedProduct.sku && (
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground">SKU</h3>
                            <p>{selectedProduct.sku}</p>
                          </div>
                        )}
                        
                        {selectedProduct.quantity && (
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Quantity</h3>
                            <p>{selectedProduct.quantity} {selectedProduct.units || ''}</p>
                          </div>
                        )}
                      </div>
                      
                      {selectedProduct.description && (
                        <div className="mb-4">
                          <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                          <p>{selectedProduct.description}</p>
                        </div>
                      )}
                      
                      <div className="flex justify-end">
                        <Button variant="outline" onClick={() => handleEdit('product', selectedProduct)}>
                          <Edit className="mr-2 h-4 w-4" /> Edit Product
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <GenealogyTree data={genealogyTree} onNodeClick={(node) => {
                    if (node.type === 'component') {
                      handleRawMaterialView(node.data);
                    }
                  }} />
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Raw Materials Used</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {productComponents.length > 0 ? (
                        <div className="space-y-2">
                          {productComponents.map((component) => (
                            <div key={component.id} className="p-3 border rounded-md hover:bg-gray-50">
                              <div className="flex justify-between">
                                <div>
                                  <p className="font-medium">{component.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    Batch: {component.batch_lot_number}
                                  </p>
                                  {component.quantity && (
                                    <p className="text-sm text-muted-foreground">
                                      Quantity: {component.quantity} {component.units || ''}
                                    </p>
                                  )}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRawMaterialView(component)}
                                >
                                  View
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4 text-muted-foreground">
                          No raw materials linked to this product yet.
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </>
              ) : (
                <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border border-dashed">
                  <div className="text-center">
                    <h3 className="font-medium">No Product Selected</h3>
                    <p className="text-muted-foreground">Select a product from the list or add a new one</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Raw Materials Tab */}
        <TabsContent value="components" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Raw Materials</h2>
            <Button onClick={() => {
              setEditingItem(null);
              setShowComponentForm(true);
            }}>
              <Plus className="mr-2 h-4 w-4" /> Add Raw Material
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle>Raw Materials List</CardTitle>
                  <CardDescription>Select a raw material to view details</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="max-h-[500px] overflow-y-auto">
                    {loading ? (
                      <div className="p-4 text-center">Loading raw materials...</div>
                    ) : components.length > 0 ? (
                      <div>
                        {components.map((component) => (
                          <div
                            key={component.id}
                            className={`p-3 border-b hover:bg-gray-50 cursor-pointer flex justify-between items-center ${
                              selectedComponent?.id === component.id ? 'bg-gray-50' : ''
                            }`}
                            onClick={() => handleRawMaterialView(component)}
                          >
                            <div>
                              <p className="font-medium truncate">{component.name}</p>
                              <p className="text-sm text-muted-foreground">
                                Batch: {component.batch_lot_number}
                              </p>
                              {component.quantity && component.units && (
                                <p className="text-sm text-muted-foreground">
                                  Quantity: {component.quantity} {component.units}
                                </p>
                              )}
                            </div>
                            {renderItemActions('component', component)}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center">No raw materials found</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2 space-y-4">
              {selectedComponent ? (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>{selectedComponent.name}</CardTitle>
                      <CardDescription>
                        Batch/Lot: {selectedComponent.batch_lot_number}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Received Date</h3>
                          <p>{new Date(selectedComponent.received_date).toLocaleDateString()}</p>
                        </div>
                        
                        {selectedComponent.expiry_date && (
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Expiry Date</h3>
                            <p>{new Date(selectedComponent.expiry_date).toLocaleDateString()}</p>
                          </div>
                        )}
                        
                        {selectedComponent.category && (
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Category</h3>
                            <p>{selectedComponent.category}</p>
                          </div>
                        )}
                        
                        {selectedComponent.quantity && (
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Quantity</h3>
                            <p>{selectedComponent.quantity} {selectedComponent.units || ''}</p>
                          </div>
                        )}
                      </div>
                      
                      {selectedComponent.description && (
                        <div className="mb-4">
                          <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                          <p>{selectedComponent.description}</p>
                        </div>
                      )}
                      
                      <div className="flex justify-end">
                        <Button variant="outline" onClick={() => handleEdit('component', selectedComponent)}>
                          <Edit className="mr-2 h-4 w-4" /> Edit Raw Material
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Affected Products</CardTitle>
                      <CardDescription>Products containing this raw material</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {affectedProducts.length > 0 ? (
                        <div className="space-y-2">
                          {affectedProducts.map((product) => (
                            <div key={product.id} className="p-3 border rounded-md hover:bg-gray-50">
                              <div className="flex justify-between">
                                <div>
                                  <p className="font-medium">{product.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    Batch: {product.batch_lot_number}
                                  </p>
                                  {product.quantity && (
                                    <p className="text-sm text-muted-foreground">
                                      Quantity: {product.quantity} {product.units || ''}
                                    </p>
                                  )}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleProductView(product)}
                                >
                                  View
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4 text-muted-foreground">
                          This raw material is not linked to any products yet.
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </>
              ) : (
                <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border border-dashed">
                  <div className="text-center">
                    <h3 className="font-medium">No Raw Material Selected</h3>
                    <p className="text-muted-foreground">Select a raw material from the list or add a new one</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Recalls Tab */}
        <TabsContent value="recalls" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Recalls</h2>
            <Button onClick={() => {
              setEditingItem(null);
              setShowRecallForm(true);
            }}>
              <Plus className="mr-2 h-4 w-4" /> Create Recall
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle>Recall List</CardTitle>
                  <CardDescription>Select a recall to view details</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="max-h-[500px] overflow-y-auto">
                    {loading ? (
                      <div className="p-4 text-center">Loading recalls...</div>
                    ) : recalls.length > 0 ? (
                      <div>
                        {recalls.map((recall) => (
                          <div
                            key={recall.id}
                            className={`p-3 border-b hover:bg-gray-50 cursor-pointer flex justify-between items-center ${
                              selectedRecall?.id === recall.id ? 'bg-gray-50' : ''
                            }`}
                            onClick={() => handleRecallView(recall)}
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium truncate">{recall.title}</p>
                                {renderStatusBadge(recall.status)}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {recall.recall_type === 'Actual' ? (
                                  <span className="text-red-500 font-medium">Actual Recall</span>
                                ) : (
                                  <span>Mock Recall</span>
                                )}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Initiated: {recall.initiated_at ? new Date(recall.initiated_at).toLocaleDateString() : 'N/A'}
                              </p>
                            </div>
                            {renderItemActions('recall', recall)}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center">No recalls found</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2 space-y-4">
              {selectedRecall ? (
                <>
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {selectedRecall.title}
                            {renderStatusBadge(selectedRecall.status)}
                          </CardTitle>
                          <CardDescription>
                            {selectedRecall.recall_type === 'Actual' ? (
                              <span className="text-red-500 font-medium">Actual Recall</span>
                            ) : (
                              <span>Mock Recall</span>
                            )}
                          </CardDescription>
                        </div>
                        <Button variant="outline" onClick={() => handleEdit('recall', selectedRecall)}>
                          <Edit className="mr-2 h-4 w-4" /> Edit Recall
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Initiated By</h3>
                          <p>{selectedRecall.initiated_by}</p>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Initiated Date</h3>
                          <p>{selectedRecall.initiated_at ? new Date(selectedRecall.initiated_at).toLocaleDateString() : 'N/A'}</p>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <h3 className="text-sm font-medium text-muted-foreground">Recall Reason</h3>
                        <p>{selectedRecall.recall_reason}</p>
                      </div>
                      
                      {selectedRecall.description && (
                        <div className="mb-4">
                          <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                          <p>{selectedRecall.description}</p>
                        </div>
                      )}
                      
                      {selectedRecall.corrective_actions && (
                        <div className="mb-4">
                          <h3 className="text-sm font-medium text-muted-foreground">Corrective Actions</h3>
                          <p>{selectedRecall.corrective_actions}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle>Simulations</CardTitle>
                          <Button size="sm" variant="ghost" onClick={() => setShowSimulationForm(true)}>
                            <Plus className="h-4 w-4 mr-1" /> Add
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {recallSimulations.length > 0 ? (
                          <div className="space-y-3">
                            {recallSimulations.map((sim) => (
                              <div key={sim.id} className="p-3 border rounded-md">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="font-medium">
                                      {sim.simulation_date
                                        ? new Date(sim.simulation_date).toLocaleDateString()
                                        : 'Simulation'}
                                    </p>
                                    <p className="text-sm">
                                      Success Rate: {sim.success_rate ? `${sim.success_rate}%` : 'N/A'}
                                    </p>
                                    <p className="text-sm">
                                      Duration: {sim.duration ? `${sim.duration} hrs` : 'N/A'}
                                    </p>
                                    {sim.quantity_recovered && (
                                      <p className="text-sm">
                                        Recovered: {sim.quantity_recovered} {sim.units || ''}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-3 text-muted-foreground">
                            No simulations recorded
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle>Notifications</CardTitle>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setShowNotificationForm(true)}
                            >
                              <Plus className="h-4 w-4 mr-1" /> Add
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={handleSendAllNotifications}
                            >
                              <Send className="h-4 w-4 mr-1" /> Send All
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {notifications.length > 0 ? (
                          <div className="space-y-3">
                            {notifications.map((notification) => (
                              <div key={notification.id} className="p-3 border rounded-md">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="font-medium truncate">{notification.subject}</p>
                                    <p className="text-sm">
                                      To: {notification.recipient_email || notification.recipient_type}
                                    </p>
                                    <p className="text-sm flex items-center">
                                      Status: {' '}
                                      {notification.status === 'Sent' ? (
                                        <span className="flex items-center text-green-600">
                                          <Check className="h-3 w-3 mr-1" /> Sent
                                        </span>
                                      ) : notification.status === 'Failed' ? (
                                        <span className="flex items-center text-red-600">
                                          <AlertTriangle className="h-3 w-3 mr-1" /> Failed
                                        </span>
                                      ) : (
                                        <span className="flex items-center text-yellow-600">
                                          <RefreshCw className="h-3 w-3 mr-1" /> Pending
                                        </span>
                                      )}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-3 text-muted-foreground">
                            No notifications sent
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border border-dashed">
                  <div className="text-center">
                    <h3 className="font-medium">No Recall Selected</h3>
                    <p className="text-muted-foreground">Select a recall from the list or create a new one</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Schedules Tab */}
        <TabsContent value="schedules" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Recall Schedules</h2>
            <Button onClick={() => {
              setEditingItem(null);
              setShowScheduleForm(true);
            }}>
              <Plus className="mr-2 h-4 w-4" /> Add Schedule
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Scheduled Recalls</CardTitle>
              <CardDescription>
                Upcoming recall drills and simulations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-4">Loading schedules...</div>
              ) : recallSchedules.length > 0 ? (
                <div className="space-y-3">
                  {recallSchedules.map((schedule) => (
                    <div
                      key={schedule.id}
                      className="p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{schedule.title}</h3>
                            <Badge>{schedule.recall_type}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {schedule.is_recurring
                              ? `Recurring: ${schedule.recurrence_pattern} (every ${schedule.recurrence_interval || 1})`
                              : `One-time: ${
                                  schedule.one_time_date
                                    ? new Date(schedule.one_time_date).toLocaleDateString()
                                    : 'Date not set'
                                }`}
                          </p>
                          {schedule.next_execution_at && (
                            <p className="text-sm flex items-center gap-1 mt-1">
                              <Calendar className="h-3 w-3" />
                              Next: {new Date(schedule.next_execution_at).toLocaleDateString()}
                            </p>
                          )}
                          {schedule.description && (
                            <p className="text-sm mt-2">{schedule.description}</p>
                          )}
                        </div>
                        {renderItemActions('schedule', schedule)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No recall schedules found. Create a schedule to run regular recall drills.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Statistics Tab */}
        <TabsContent value="statistics" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Traceability Statistics</h2>
            <Button>
              <BarChart2 className="mr-2 h-4 w-4" /> Export Data
            </Button>
          </div>
          
          <TraceabilityStatistics />
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Reports</h2>
          </div>
          
          <TraceabilityReports />
        </TabsContent>
      </Tabs>

      {/* Dialogs and Forms */}
      {showProductForm && (
        <Card className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-2xl p-6">
            <ProductForm
              initialData={editingItem?.type === 'product' ? editingItem : undefined}
              onSubmit={handleProductSubmit}
              onCancel={() => {
                setShowProductForm(false);
                setEditingItem(null);
              }}
              loading={loading}
            />
          </div>
        </Card>
      )}

      {showComponentForm && (
        <Card className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-2xl p-6">
            <RawMaterialForm
              initialData={editingItem?.type === 'component' ? editingItem : undefined}
              onSubmit={handleComponentSubmit}
              onCancel={() => {
                setShowComponentForm(false);
                setEditingItem(null);
              }}
              loading={loading}
            />
          </div>
        </Card>
      )}

      {showGenealogyForm && (
        <Card className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-2xl p-6">
            <GenealogyForm
              products={products}
              components={components}
              preselectedProductId={selectedProduct?.id}
              onSubmit={handleGenealogySubmit}
              onCancel={() => setShowGenealogyForm(false)}
              loading={loading}
            />
          </div>
        </Card>
      )}

      {showRecallForm && (
        <Card className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-2xl p-6">
            <RecallForm
              initialData={editingItem?.type === 'recall' ? editingItem : undefined}
              onSubmit={handleRecallSubmit}
              onCancel={() => {
                setShowRecallForm(false);
                setEditingItem(null);
              }}
              loading={loading}
            />
          </div>
        </Card>
      )}

      {showScheduleForm && (
        <Card className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-2xl p-6">
            <RecallScheduleForm
              initialData={editingItem?.type === 'schedule' ? editingItem : undefined}
              onSubmit={handleScheduleSubmit}
              onCancel={() => {
                setShowScheduleForm(false);
                setEditingItem(null);
              }}
              loading={loading}
            />
          </div>
        </Card>
      )}

      {showSimulationForm && selectedRecall && (
        <Card className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-2xl p-6">
            <RecallSimulationForm
              recallId={selectedRecall.id}
              onSubmit={handleSimulationSubmit}
              onCancel={() => setShowSimulationForm(false)}
              loading={loading}
            />
          </div>
        </Card>
      )}

      {showNotificationForm && selectedRecall && (
        <Card className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-2xl p-6">
            <NotificationForm
              recallId={selectedRecall.id}
              onSubmit={handleNotificationSubmit}
              onCancel={() => setShowNotificationForm(false)}
              loading={loading}
            />
          </div>
        </Card>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this item. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Traceability;
