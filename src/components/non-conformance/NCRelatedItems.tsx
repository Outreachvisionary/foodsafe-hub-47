import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Link, 
  FileText, 
  Package, 
  AlertTriangle,
  Users,
  Building,
  Search,
  ExternalLink,
  Plus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface NCRelatedItemsProps {
  nonConformanceId: string;
}

// Mock data for demonstration
const mockRelatedItems = {
  documents: [
    {
      id: '1',
      title: 'Quality Manual v2.1',
      type: 'Policy',
      status: 'Active',
      lastModified: '2024-01-15'
    },
    {
      id: '2',
      title: 'Contamination Response Procedure',
      type: 'SOP',
      status: 'Active',
      lastModified: '2024-01-10'
    }
  ],
  products: [
    {
      id: '1',
      name: 'Product Batch #12345',
      batchNumber: 'B12345',
      status: 'On Hold',
      quantity: 500,
      location: 'Warehouse A'
    },
    {
      id: '2',
      name: 'Raw Material Lot #RM789',
      batchNumber: 'RM789',
      status: 'Quarantined',
      quantity: 200,
      location: 'Storage B'
    }
  ],
  otherNCs: [
    {
      id: '1',
      title: 'Similar contamination issue',
      status: 'Resolved',
      department: 'Production',
      reportedDate: '2024-01-08'
    },
    {
      id: '2',
      title: 'Equipment malfunction',
      status: 'Under Investigation',
      department: 'Production',
      reportedDate: '2024-01-12'
    }
  ],
  audits: [
    {
      id: '1',
      title: 'Internal Quality Audit Q1 2024',
      status: 'Completed',
      department: 'Quality',
      completionDate: '2024-01-20'
    }
  ],
  people: [
    {
      id: '1',
      name: 'John Smith',
      role: 'Quality Inspector',
      involvement: 'Reporter',
      department: 'Quality'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      role: 'Production Manager',
      involvement: 'Assignee',
      department: 'Production'
    }
  ]
};

const NCRelatedItems: React.FC<NCRelatedItemsProps> = ({ nonConformanceId }) => {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkType, setLinkType] = useState('');
  const [selectedItem, setSelectedItem] = useState('');

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000);
  }, [nonConformanceId]);

  const handleLinkItem = () => {
    if (!linkType || !selectedItem) {
      toast.error('Please select both item type and specific item');
      return;
    }

    // In real implementation, this would create the link
    toast.success('Item linked successfully');
    setShowLinkDialog(false);
    setLinkType('');
    setSelectedItem('');
  };

  const filteredItems = (items: any[], query: string) => {
    if (!query) return items;
    return items.filter(item => 
      item.title?.toLowerCase().includes(query.toLowerCase()) ||
      item.name?.toLowerCase().includes(query.toLowerCase())
    );
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Related Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Link */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Link className="h-5 w-5" />
              <span>Related Items</span>
            </CardTitle>
            <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Link Item
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Link Related Item</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Item Type</label>
                    <Select value={linkType} onValueChange={setLinkType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select item type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="document">Document</SelectItem>
                        <SelectItem value="product">Product/Batch</SelectItem>
                        <SelectItem value="audit">Audit</SelectItem>
                        <SelectItem value="nc">Non-Conformance</SelectItem>
                        <SelectItem value="capa">CAPA</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Select Item</label>
                    <Select value={selectedItem} onValueChange={setSelectedItem}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose specific item" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="item1">Sample Item 1</SelectItem>
                        <SelectItem value="item2">Sample Item 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowLinkDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleLinkItem}>
                      Link Item
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search related items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Related Items Tabs */}
      <Tabs defaultValue="documents" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="documents" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Documents</span>
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center space-x-2">
            <Package className="h-4 w-4" />
            <span>Products</span>
          </TabsTrigger>
          <TabsTrigger value="ncs" className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4" />
            <span>NCs</span>
          </TabsTrigger>
          <TabsTrigger value="audits" className="flex items-center space-x-2">
            <Building className="h-4 w-4" />
            <span>Audits</span>
          </TabsTrigger>
          <TabsTrigger value="people" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>People</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Related Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredItems(mockRelatedItems.documents, searchQuery).map((doc, index) => (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 border rounded-lg hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium">{doc.title}</p>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Badge variant="outline">{doc.type}</Badge>
                          <span>Modified: {doc.lastModified}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={doc.status === 'Active' ? 'default' : 'secondary'}>
                        {doc.status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Related Products & Batches</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredItems(mockRelatedItems.products, searchQuery).map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 border rounded-lg hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-center space-x-3">
                      <Package className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <span>Batch: {product.batchNumber}</span>
                          <span>•</span>
                          <span>{product.quantity} units</span>
                          <span>•</span>
                          <span>{product.location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={product.status === 'On Hold' ? 'destructive' : 'secondary'}>
                        {product.status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ncs">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Related Non-Conformances</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredItems(mockRelatedItems.otherNCs, searchQuery).map((nc, index) => (
                  <motion.div
                    key={nc.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 border rounded-lg hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="h-5 w-5 text-orange-500" />
                      <div>
                        <p className="font-medium">{nc.title}</p>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <span>{nc.department}</span>
                          <span>•</span>
                          <span>Reported: {nc.reportedDate}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={nc.status === 'Resolved' ? 'default' : 'secondary'}>
                        {nc.status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audits">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Related Audits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredItems(mockRelatedItems.audits, searchQuery).map((audit, index) => (
                  <motion.div
                    key={audit.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 border rounded-lg hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-center space-x-3">
                      <Building className="h-5 w-5 text-purple-500" />
                      <div>
                        <p className="font-medium">{audit.title}</p>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <span>{audit.department}</span>
                          <span>•</span>
                          <span>Completed: {audit.completionDate}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="default">{audit.status}</Badge>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="people">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Involved People</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredItems(mockRelatedItems.people, searchQuery).map((person, index) => (
                  <motion.div
                    key={person.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 border rounded-lg hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-center space-x-3">
                      <Users className="h-5 w-5 text-indigo-500" />
                      <div>
                        <p className="font-medium">{person.name}</p>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <span>{person.role}</span>
                          <span>•</span>
                          <span>{person.department}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline">{person.involvement}</Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NCRelatedItems;