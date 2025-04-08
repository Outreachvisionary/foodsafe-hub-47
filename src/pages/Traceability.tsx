import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Input,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Badge,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  Label,
  Switch
} from '@/components/ui/index';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, PlusCircle, ArrowRight, AlertTriangle, Mail, Send } from 'lucide-react';
import { useTraceability } from '@/hooks/useTraceability';
import { Product, Component, Recall, TreeNode, GraphData } from '@/types/traceability';
import { toast } from 'sonner';
import { Chart } from "@/components/ui/chart"

const Traceability = () => {
  const navigate = useNavigate();
  const {
    products,
    components,
    recalls,
    loadProducts,
    loadComponents,
    loadRecalls,
    loadGenealogyTree,
    loadSupplyChainVisualization,
    loadProductComponents,
    loadAffectedProducts,
    loadProductByBatchLot,
    addProduct,
    addComponent,
    addRecall,
    addGenealogyLink,
    addRecallSimulation,
    addRecallSchedule,
    addNotification,
    sendAllNotifications,
    selectedProduct,
    setSelectedProduct,
    genealogyTree,
    supplyChainData,
    loading,
    error
  } = useTraceability();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProductState] = useState<Product | null>(null);
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);
  const [selectedRecall, setSelectedRecall] = useState<Recall | null>(null);
  const [newProductName, setNewProductName] = useState('');
  const [newComponent, setNewComponent] = useState('');
  const [newRecall, setNewRecall] = useState('');
  const [newGenealogyLink, setNewGenealogyLink] = useState('');
  const [newRecallSimulation, setNewRecallSimulation] = useState('');
  const [newRecallSchedule, setNewRecallSchedule] = useState('');
  const [newNotification, setNewNotification] = useState('');
  const [batchLotNumber, setBatchLotNumber] = useState('');
  const [productComponents, setProductComponents] = useState<Component[]>([]);
  const [affectedProducts, setAffectedProducts] = useState<Product[]>([]);
  const [recall, setRecall] = useState<Recall | null>(null);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showAffectedProducts, setShowAffectedProducts] = useState(false);

  useEffect(() => {
    loadProducts();
    loadComponents();
    loadRecalls();
  }, [loadProducts, loadComponents, loadRecalls]);

  useEffect(() => {
    if (selectedProduct) {
      loadGenealogyTree(selectedProduct.id);
      loadSupplyChainVisualization(selectedProduct.id);
    }
  }, [selectedProduct, loadGenealogyTree, loadSupplyChainVisualization]);

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
  };

  const handleSearch = () => {
    console.log("Searching for:", searchQuery);
  };

  const handleSelectProduct = (product: any) => {
    if (!product) return;
    console.log("Selected product:", product);
    setSelectedProduct(product);
    loadGenealogyTree(product.id);
  };

  const handleSelectComponent = (component: Component) => {
    console.log("Selected component:", component);
    setSelectedComponent(component);
  };

  const handleSelectRecall = (recall: Recall) => {
    console.log("Selected recall:", recall);
    setSelectedRecall(recall);
    setRecall(recall);
  };

  const handleCreateNewProduct = () => {
    console.log("Creating new product:", newProductName);
  };

  const handleCreateNewComponent = () => {
    console.log("Creating new component:", newComponent);
  };

  const handleCreateNewRecall = () => {
    console.log("Creating new recall:", newRecall);
  };

  const handleCreateNewGenealogyLink = () => {
    console.log("Creating new genealogy link:", newGenealogyLink);
  };

  const handleCreateNewRecallSimulation = () => {
    console.log("Creating new recall simulation:", newRecallSimulation);
  };

  const handleCreateNewRecallSchedule = () => {
    console.log("Creating new recall schedule:", newRecallSchedule);
  };

  const handleCreateNewNotification = () => {
    console.log("Creating new notification:", newNotification);
  };

  const handleLoadProductComponents = async () => {
    if (batchLotNumber) {
      const components = await loadProductComponents(batchLotNumber);
      setProductComponents(components || []);
    }
  };

  const handleLoadAffectedProducts = async () => {
    if (batchLotNumber) {
      const products = await loadAffectedProducts(batchLotNumber);
      setAffectedProducts(products || []);
    }
  };

  const generateNotification = async () => {
    if (!recall) return;
    setIsSending(true);
    try {
      if (recall.id) {
        await sendAllNotifications(recall.id, subject, message, 'admin');
        toast.success("Notifications sent successfully!");
      } else {
        toast.error("Recall ID is missing.");
      }
    } catch (err) {
      console.error("Error sending notifications:", err);
      toast.error("Failed to send notifications.");
    } finally {
      setIsSending(false);
    }
  };

  const chartData = [
    { name: "Jan", value: 400 },
    { name: "Feb", value: 300 },
    { name: "Mar", value: 200 },
    { name: "Apr", value: 278 },
    { name: "May", value: 189 },
    { name: "Jun", value: 239 },
    { name: "Jul", value: 349 },
  ];

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Traceability</h1>
        <Button onClick={() => navigate('/traceability/new')}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Item
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Select onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Raw Materials">Raw Materials</SelectItem>
            <SelectItem value="Packaging">Packaging</SelectItem>
            <SelectItem value="Finished Goods">Finished Goods</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleSearch}>Search</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Products</CardTitle>
            <CardDescription>List of all products</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Batch/Lot</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products && products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Button variant="link" onClick={() => handleSelectProduct(product)}>
                        {product.name}
                      </Button>
                    </TableCell>
                    <TableCell>{product.batch_lot_number}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Components</CardTitle>
            <CardDescription>List of all components</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Batch/Lot</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {components && components.map((component) => (
                  <TableRow key={component.id}>
                    <TableCell>
                      <Button variant="link" onClick={() => handleSelectComponent(component)}>
                        {component.name}
                      </Button>
                    </TableCell>
                    <TableCell>{component.batch_lot_number}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recalls</CardTitle>
            <CardDescription>List of all recalls</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recalls && recalls.map((recall) => (
                  <TableRow key={recall.id}>
                    <TableCell>
                      <Button variant="link" onClick={() => handleSelectRecall(recall)}>
                        {recall.title}
                      </Button>
                    </TableCell>
                    <TableCell>{recall.recall_type}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {selectedProduct && (
          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
              <CardDescription>Details for {selectedProduct.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Name: {selectedProduct.name}</p>
              <p>Batch/Lot: {selectedProduct.batch_lot_number}</p>
              <p>Manufacturing Date: {selectedProduct.manufacturing_date}</p>
            </CardContent>
          </Card>
        )}

        {genealogyTree && (
          <Card>
            <CardHeader>
              <CardTitle>Genealogy Tree</CardTitle>
              <CardDescription>Component and supplier genealogy</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Tree Data: {JSON.stringify(genealogyTree)}</p>
            </CardContent>
          </Card>
        )}

        {supplyChainData && (
          <Card>
            <CardHeader>
              <CardTitle>Supply Chain Visualization</CardTitle>
              <CardDescription>Graphical representation of supply chain</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Graph Data: {JSON.stringify(supplyChainData)}</p>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Product Components</CardTitle>
            <CardDescription>Load components by batch/lot number</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Input
                placeholder="Enter batch/lot number"
                value={batchLotNumber}
                onChange={(e) => setBatchLotNumber(e.target.value)}
              />
              <Button onClick={handleLoadProductComponents}>Load Components</Button>
            </div>
            {productComponents.length > 0 && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Batch/Lot</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productComponents.map((component) => (
                    <TableRow key={component.id}>
                      <TableCell>{component.name}</TableCell>
                      <TableCell>{component.batch_lot_number}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Affected Products</CardTitle>
            <CardDescription>Find products affected by a component</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Input
                placeholder="Enter batch/lot number"
                value={batchLotNumber}
                onChange={(e) => setBatchLotNumber(e.target.value)}
              />
              <Button onClick={handleLoadAffectedProducts}>Load Products</Button>
            </div>
            {affectedProducts.length > 0 && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Batch/Lot</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {affectedProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.batch_lot_number}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {recall && (
        <Card>
          <CardHeader>
            <CardTitle>Recall Notifications</CardTitle>
            <CardDescription>Send notifications to affected parties</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="Notification Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Notification Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            <Button disabled={isSending} onClick={generateNotification}>
              {isSending ? (
                <>
                  Sending...
                  <svg className="animate-spin h-5 w-5 ml-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </>
              ) : (
                <>
                  Send Notification
                  <Send className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Traceability;
