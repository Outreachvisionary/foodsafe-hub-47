
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Package, Factory, Truck, AlertTriangle } from 'lucide-react';
import { Product, Component } from '@/types/traceability';

interface ProductTraceabilityViewProps {
  products: Product[];
  components: Component[];
  onSearchProduct: (batchLot: string) => Promise<void>;
  onSearchComponent: (batchLot: string) => Promise<void>;
  productComponents: Component[];
  affectedProducts: Product[];
}

const ProductTraceabilityView: React.FC<ProductTraceabilityViewProps> = ({
  products,
  components,
  onSearchProduct,
  onSearchComponent,
  productComponents,
  affectedProducts
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'product' | 'component'>('product');

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    if (searchType === 'product') {
      await onSearchProduct(searchQuery);
    } else {
      await onSearchComponent(searchQuery);
    }
  };

  const getStatusColor = (status: string | undefined) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Batch/Lot Traceability Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button
              variant={searchType === 'product' ? 'default' : 'outline'}
              onClick={() => setSearchType('product')}
              className="flex items-center gap-2"
            >
              <Package className="h-4 w-4" />
              Product
            </Button>
            <Button
              variant={searchType === 'component' ? 'default' : 'outline'}
              onClick={() => setSearchType('component')}
              className="flex items-center gap-2"
            >
              <Factory className="h-4 w-4" />
              Component
            </Button>
          </div>
          <div className="flex gap-2">
            <Input
              placeholder={`Enter ${searchType} batch/lot number...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {productComponents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Factory className="h-5 w-5" />
              Product Components
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Component Name</TableHead>
                  <TableHead>Batch/Lot Number</TableHead>
                  <TableHead>Received Date</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productComponents.map((component) => (
                  <TableRow key={component.id}>
                    <TableCell className="font-medium">{component.name}</TableCell>
                    <TableCell>{component.batch_lot_number}</TableCell>
                    <TableCell>{new Date(component.received_date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {component.expiry_date ? new Date(component.expiry_date).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(component.status)}>
                        {component.status || 'Unknown'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {affectedProducts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Affected Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Batch/Lot Number</TableHead>
                  <TableHead>Manufacturing Date</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {affectedProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.batch_lot_number}</TableCell>
                    <TableCell>{new Date(product.manufacturing_date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {product.expiry_date ? new Date(product.expiry_date).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(product.status)}>
                        {product.status || 'Unknown'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Recent Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            {products.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>No products found</p>
              </div>
            ) : (
              <div className="space-y-2">
                {products.slice(0, 5).map((product) => (
                  <div key={product.id} className="flex justify-between items-center p-2 border rounded">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.batch_lot_number}</p>
                    </div>
                    <Badge className={getStatusColor(product.status)}>
                      {product.status || 'Unknown'}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Factory className="h-5 w-5" />
              Recent Components
            </CardTitle>
          </CardHeader>
          <CardContent>
            {components.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Factory className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>No components found</p>
              </div>
            ) : (
              <div className="space-y-2">
                {components.slice(0, 5).map((component) => (
                  <div key={component.id} className="flex justify-between items-center p-2 border rounded">
                    <div>
                      <p className="font-medium">{component.name}</p>
                      <p className="text-sm text-gray-600">{component.batch_lot_number}</p>
                    </div>
                    <Badge className={getStatusColor(component.status)}>
                      {component.status || 'Unknown'}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductTraceabilityView;
