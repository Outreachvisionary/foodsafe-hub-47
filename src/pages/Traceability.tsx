import React, { useState } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Plus, 
  History, 
  TrendingUp, 
  PackageCheck, 
  FileBarChart,
  AlertTriangle,
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { 
  ChartContainer,
  ChartLegend,
  ChartLegendContent 
} from '@/components/ui/chart';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { toast } from 'sonner';

// Mock data for traceability
const mockBatches = [
  {
    id: 'BAT-2023-001',
    product: 'Organic Granola',
    date: '2023-10-15',
    quantity: '500 kg',
    status: 'Released',
    suppliers: ['Organic Oats Co.', 'Natural Sweeteners Inc.'],
    location: 'Warehouse A',
  },
  {
    id: 'BAT-2023-002',
    product: 'Protein Bars',
    date: '2023-10-12',
    quantity: '350 kg',
    status: 'On Hold',
    suppliers: ['Protein Plus Inc.', 'Chocolate Suppliers Ltd.'],
    location: 'Production Line 2',
  },
  {
    id: 'BAT-2023-003',
    product: 'Fruit Juice',
    date: '2023-10-10',
    quantity: '1000 L',
    status: 'Released',
    suppliers: ['Fresh Fruit Farm', 'Sugar Solutions'],
    location: 'Warehouse B',
  },
  {
    id: 'BAT-2023-004',
    product: 'Mixed Nuts',
    date: '2023-10-08',
    quantity: '250 kg',
    status: 'Released',
    suppliers: ['Nut Farms Co.', 'Packaging Supplies Inc.'],
    location: 'Warehouse A',
  },
  {
    id: 'BAT-2023-005',
    product: 'Energy Drink',
    date: '2023-10-05',
    quantity: '750 L',
    status: 'Recalled',
    suppliers: ['Caffeine Extract Inc.', 'Flavor Systems Ltd.'],
    location: 'External Warehouse',
  },
];

const mockRecallData = [
  {
    name: 'Jan',
    mock: 3,
    actual: 0,
  },
  {
    name: 'Feb',
    mock: 2,
    actual: 0,
  },
  {
    name: 'Mar',
    mock: 1,
    actual: 1,
  },
  {
    name: 'Apr',
    mock: 2,
    actual: 0,
  },
  {
    name: 'May',
    mock: 3,
    actual: 0,
  },
  {
    name: 'Jun',
    mock: 1,
    actual: 0,
  },
  {
    name: 'Jul',
    mock: 2,
    actual: 1,
  },
  {
    name: 'Aug',
    mock: 2,
    actual: 0,
  },
  {
    name: 'Sep',
    mock: 3,
    actual: 0,
  },
  {
    name: 'Oct',
    mock: 2,
    actual: 1,
  },
  {
    name: 'Nov',
    mock: 0,
    actual: 0,
  },
  {
    name: 'Dec',
    mock: 0,
    actual: 0,
  },
];

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  let color;
  
  switch (status) {
    case 'Released':
      color = 'bg-green-100 text-green-800 border-green-200';
      break;
    case 'On Hold':
      color = 'bg-amber-100 text-amber-800 border-amber-200';
      break;
    case 'Recalled':
      color = 'bg-red-100 text-red-800 border-red-200';
      break;
    case 'In Production':
      color = 'bg-blue-100 text-blue-800 border-blue-200';
      break;
    default:
      color = 'bg-gray-100 text-gray-800 border-gray-200';
  }
  
  return (
    <Badge variant="outline" className={color}>
      {status}
    </Badge>
  );
};

// Mock Recall Dialog Component
const MockRecallDialog = ({ onComplete }: { onComplete: () => void }) => {
  const [step, setStep] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [timeframe, setTimeframe] = useState('7');

  const handleSubmitStep1 = () => {
    if (!selectedProduct) {
      toast.error('Please select a product to continue');
      return;
    }
    setStep(2);
  };

  const handleSubmitStep2 = () => {
    if (!timeframe) {
      toast.error('Please select a timeframe to continue');
      return;
    }
    setStep(3);
  };

  const handleComplete = () => {
    toast.success('Mock recall initiated successfully');
    onComplete();
  };

  return (
    <div className="space-y-6">
      {step === 1 && (
        <>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Product *</label>
              <select 
                className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
              >
                <option value="">Select a product</option>
                <option value="Organic Granola">Organic Granola</option>
                <option value="Protein Bars">Protein Bars</option>
                <option value="Fruit Juice">Fruit Juice</option>
                <option value="Mixed Nuts">Mixed Nuts</option>
                <option value="Energy Drink">Energy Drink</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Recall Reason</label>
              <select 
                className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select a reason</option>
                <option value="Quality Issue">Quality Issue</option>
                <option value="Foreign Material">Foreign Material</option>
                <option value="Allergen Control">Allergen Control</option>
                <option value="Microbiological Issue">Microbiological Issue</option>
                <option value="Labeling Error">Labeling Error</option>
                <option value="Mock Recall Test">Mock Recall Test</option>
              </select>
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={handleSubmitStep1} type="button">
              Next Step <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </DialogFooter>
        </>
      )}
      
      {step === 2 && (
        <>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product: {selectedProduct}</label>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Timeframe (days) *</label>
              <select 
                className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
              >
                <option value="7">Last 7 days</option>
                <option value="14">Last 14 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notification Method</label>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input type="checkbox" id="email" className="mr-2" defaultChecked />
                  <label htmlFor="email">Email</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="sms" className="mr-2" defaultChecked />
                  <label htmlFor="sms">SMS</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="in-app" className="mr-2" defaultChecked />
                  <label htmlFor="in-app">In-App Notification</label>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex justify-between">
            <Button onClick={() => setStep(1)} variant="outline" type="button">
              Back
            </Button>
            <Button onClick={handleSubmitStep2} type="button">
              Next Step <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </DialogFooter>
        </>
      )}
      
      {step === 3 && (
        <>
          <div className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Confirm Mock Recall</AlertTitle>
              <AlertDescription>
                You are about to initiate a mock recall for <strong>{selectedProduct}</strong> for the last {timeframe} days. This will notify your team and be recorded in your audit logs.
              </AlertDescription>
            </Alert>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Batches</label>
              <div className="text-2xl font-bold">{Number(timeframe) > 20 ? 5 : 2}</div>
              <p className="text-sm text-gray-500 mt-1">Batches produced in the selected timeframe</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Affected Stakeholders</label>
              <ul className="list-disc pl-5 text-sm">
                <li>Quality Assurance Team</li>
                <li>Production Managers</li>
                <li>Warehouse Staff</li>
                <li>Supply Chain Team</li>
              </ul>
            </div>
          </div>
          
          <DialogFooter className="flex justify-between">
            <Button onClick={() => setStep(2)} variant="outline" type="button">
              Back
            </Button>
            <Button onClick={handleComplete} type="button" className="bg-red-600 hover:bg-red-700">
              Start Mock Recall <RotateCcw className="ml-2 h-4 w-4" />
            </Button>
          </DialogFooter>
        </>
      )}
    </div>
  );
};

// Main Traceability Component
const Traceability = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Filter batches based on search term
  const filteredBatches = mockBatches.filter(batch => 
    batch.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    batch.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
    batch.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    batch.location.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const chartConfig = {
    mock: {
      label: "Mock Recalls",
      color: "#60a5fa", // blue-400
    },
    actual: {
      label: "Actual Recalls",
      color: "#f87171", // red-400
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader 
        title="Traceability & Recall Management" 
        subtitle="Track ingredients and products throughout your supply chain and perform mock recalls." 
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <History className="h-5 w-5 text-fsms-blue mr-2" />
                Recent Recalls
              </CardTitle>
              <CardDescription>Last 12 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ChartContainer config={chartConfig}>
                  <BarChart data={mockRecallData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="mock" fill={chartConfig.mock.color} name="Mock Recalls" />
                    <Bar dataKey="actual" fill={chartConfig.actual.color} name="Actual Recalls" />
                  </BarChart>
                </ChartContainer>
              </div>
              <div className="mt-2">
                <ChartContainer config={chartConfig}>
                  <ChartLegendContent
                    payload={[
                      { value: 'Mock Recalls', color: chartConfig.mock.color, dataKey: 'mock' },
                      { value: 'Actual Recalls', color: chartConfig.actual.color, dataKey: 'actual' }
                    ]}
                  />
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <TrendingUp className="h-5 w-5 text-fsms-blue mr-2" />
                Traceability Metrics
              </CardTitle>
              <CardDescription>Performance indicators</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Average Trace Time</span>
                  <span className="text-sm font-bold text-fsms-blue">2.3 hours</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-fsms-blue h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Target: 4 hours</span>
                  <span>85% faster than target</span>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Trace Completion Rate</span>
                  <span className="text-sm font-bold text-green-600">98%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '98%' }}></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Target: 95%</span>
                  <span>3% above target</span>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Supplier Traceability</span>
                  <span className="text-sm font-bold text-yellow-600">92%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Target: 100%</span>
                  <span>8% below target</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <PackageCheck className="h-5 w-5 text-fsms-blue mr-2" />
                Recall Readiness
              </CardTitle>
              <CardDescription>Tools and compliance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
                    <PackageCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Mock Recall Program</div>
                    <div className="text-xs text-gray-500">Last test: 15 days ago</div>
                  </div>
                </div>
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                  Active
                </Badge>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                    <FileBarChart className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Regulatory Compliance</div>
                    <div className="text-xs text-gray-500">FDA & GFSI requirements</div>
                  </div>
                </div>
                <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                  Compliant
                </Badge>
              </div>
              
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full mt-2">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Start Mock Recall
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Initiate Mock Recall</DialogTitle>
                    <DialogDescription>
                      Test your recall procedures with a simulated product recall exercise.
                    </DialogDescription>
                  </DialogHeader>
                  <MockRecallDialog onComplete={() => setIsDialogOpen(false)} />
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="batches" className="w-full animate-fade-in">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <TabsList>
              <TabsTrigger value="batches">Batch Tracking</TabsTrigger>
              <TabsTrigger value="traceability">Traceability Maps</TabsTrigger>
              <TabsTrigger value="recall-history">Recall History</TabsTrigger>
            </TabsList>
            
            <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input 
                type="search" 
                placeholder="Search batches..." 
                className="pl-8" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <TabsContent value="batches">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Product Batches</CardTitle>
                <CardDescription>
                  Showing {filteredBatches.length} batches
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Batch ID</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="hidden md:table-cell">Quantity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden md:table-cell">Location</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBatches.map(batch => (
                      <TableRow key={batch.id}>
                        <TableCell className="font-medium">{batch.id}</TableCell>
                        <TableCell>{batch.product}</TableCell>
                        <TableCell>{batch.date}</TableCell>
                        <TableCell className="hidden md:table-cell">{batch.quantity}</TableCell>
                        <TableCell>
                          <StatusBadge status={batch.status} />
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{batch.location}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="traceability">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Traceability Maps</CardTitle>
                <CardDescription>
                  Visualize the flow of ingredients and products
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg border border-gray-200">
                  <div className="text-center p-6">
                    <PackageCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">Traceability Visualization</h3>
                    <p className="text-gray-500 mb-4">Select a batch to view its complete traceability map from suppliers to customers.</p>
                    <Button>
                      Select Batch
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="recall-history">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Recall History</CardTitle>
                <CardDescription>
                  Past mock and actual recalls
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead className="hidden md:table-cell">Reason</TableHead>
                      <TableHead>Time to Complete</TableHead>
                      <TableHead className="hidden md:table-cell">Recovery Rate</TableHead>
                      <TableHead className="text-right">Report</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>2023-10-05</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                          Actual
                        </Badge>
                      </TableCell>
                      <TableCell>Energy Drink</TableCell>
                      <TableCell className="hidden md:table-cell">Allergen not declared</TableCell>
                      <TableCell>3.2 hours</TableCell>
                      <TableCell className="hidden md:table-cell">97%</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>2023-09-15</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                          Mock
                        </Badge>
                      </TableCell>
                      <TableCell>Protein Bars</TableCell>
                      <TableCell className="hidden md:table-cell">Quarterly test</TableCell>
                      <TableCell>2.5 hours</TableCell>
                      <TableCell className="hidden md:table-cell">99%</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>2023-07-22</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                          Actual
                        </Badge>
                      </TableCell>
                      <TableCell>Fruit Juice</TableCell>
                      <TableCell className="hidden md:table-cell">Foreign material</TableCell>
                      <TableCell>2.8 hours</TableCell>
                      <TableCell className="hidden md:table-cell">95%</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>2023-06-10</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                          Mock
                        </Badge>
                      </TableCell>
                      <TableCell>Mixed Nuts</TableCell>
                      <TableCell className="hidden md:table-cell">Quarterly test</TableCell>
                      <TableCell>1.9 hours</TableCell>
                      <TableCell className="hidden md:table-cell">100%</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Traceability;
