
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  AlertTriangle, 
  Check, 
  Filter, 
  LineChart, 
  LinkIcon, 
  QrCode, 
  Search, 
  ShoppingBag 
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';

// Mock batch data
const batches = [
  {
    id: 'BATCH-2023-1001',
    product: 'Organic Chicken Nuggets',
    date: '2023-11-25',
    location: 'Production Line 1',
    status: 'active',
    riskLevel: 'low'
  },
  {
    id: 'BATCH-2023-1002',
    product: 'Dairy-Free Yogurt, Strawberry',
    date: '2023-11-26',
    location: 'Production Line 3',
    status: 'active',
    riskLevel: 'medium'
  },
  {
    id: 'BATCH-2023-998',
    product: 'Gluten-Free Bread',
    date: '2023-11-23',
    location: 'Production Line 2',
    status: 'complete',
    riskLevel: 'low'
  },
  {
    id: 'BATCH-2023-995',
    product: 'Peanut Butter Cookies',
    date: '2023-11-22',
    location: 'Production Line 1',
    status: 'on-hold',
    riskLevel: 'high'
  },
  {
    id: 'BATCH-2023-990',
    product: 'Vegan Protein Bars',
    date: '2023-11-20',
    location: 'Production Line 3',
    status: 'complete',
    riskLevel: 'low'
  }
];

interface CAPATraceabilityIntegrationProps {
  onBatchSelected?: (batch: any) => void;
}

const CAPATraceabilityIntegration: React.FC<CAPATraceabilityIntegrationProps> = ({ 
  onBatchSelected 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [open, setOpen] = useState(false);
  
  const filteredBatches = batches.filter(batch => {
    const matchesSearch = 
      batch.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.product.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || batch.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getRiskBadge = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high':
        return (
          <Badge className="bg-red-100 text-red-800">
            High Risk
          </Badge>
        );
      case 'medium':
        return (
          <Badge className="bg-amber-100 text-amber-800">
            Medium Risk
          </Badge>
        );
      case 'low':
        return (
          <Badge className="bg-green-100 text-green-800">
            Low Risk
          </Badge>
        );
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge className="bg-blue-100 text-blue-800">
            Active
          </Badge>
        );
      case 'on-hold':
        return (
          <Badge className="bg-amber-100 text-amber-800">
            On Hold
          </Badge>
        );
      case 'complete':
        return (
          <Badge className="bg-green-100 text-green-800">
            Complete
          </Badge>
        );
      default:
        return null;
    }
  };

  const handleSelectBatch = (batch: any) => {
    if (onBatchSelected) {
      onBatchSelected(batch);
    }
    
    toast.success(`Selected batch: ${batch.id}`);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-1 w-full">
          <ShoppingBag className="h-4 w-4" />
          Link to Batch/Lot
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Link to Batch/Lot</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search batches..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Button variant="outline" size="icon" className="h-10 w-10">
              <QrCode className="h-4 w-4" />
            </Button>
          </div>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Production Batches</CardTitle>
              <CardDescription>Select a batch to link to this CAPA</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Batch ID</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Risk Level</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBatches.length > 0 ? (
                    filteredBatches.map((batch) => (
                      <TableRow key={batch.id}>
                        <TableCell className="font-medium">{batch.id}</TableCell>
                        <TableCell>{batch.product}</TableCell>
                        <TableCell>{batch.date}</TableCell>
                        <TableCell>{getStatusBadge(batch.status)}</TableCell>
                        <TableCell>{getRiskBadge(batch.riskLevel)}</TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleSelectBatch(batch)}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Select
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                        No batches match your search
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CAPATraceabilityIntegration;
