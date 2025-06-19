
import React, { useState, useEffect } from 'react';
import { useRecalls, useProducts } from '@/hooks/useTraceability';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Link as LinkIcon, AlertTriangle, Package } from 'lucide-react';

interface CAPATraceabilityIntegrationProps {
  capaId: string;
}

const CAPATraceabilityIntegration: React.FC<CAPATraceabilityIntegrationProps> = ({ capaId }) => {
  const { recalls, loading: recallsLoading, refetch: refetchRecalls, addRecall } = useRecalls();
  const { products, loading: productsLoading } = useProducts();
  const [linkedRecalls, setLinkedRecalls] = useState<any[]>([]);

  const loading = recallsLoading || productsLoading;

  useEffect(() => {
    if (recalls.length > 0) {
      // Filter recalls that are linked to this CAPA
      const linked = recalls.filter(
        recall => recall.title?.includes(capaId) || 
                 recall.title?.toLowerCase().includes('capa')
      );
      setLinkedRecalls(linked);
    }
  }, [recalls, capaId]);

  const handleCreateRecall = async () => {
    const newRecall = {
      title: `CAPA-Initiated Recall ${capaId.substring(0, 8)}`,
      product_name: 'Associated Product',
      batch_numbers: ['BATCH-001'],
      reason: `Product quality issue identified through CAPA process. Immediate recall required to ensure consumer safety.`,
      status: 'In Progress',
      created_by: 'CAPA System'
    };

    await addRecall(newRecall);
    refetchRecalls();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Package className="h-5 w-5" />
            Traceability Integration
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-4">
              {/* Linked Recalls Section */}
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Related Recalls
                </h4>
                {linkedRecalls.length > 0 ? (
                  <div className="space-y-2">
                    {linkedRecalls.map(recall => (
                      <div key={recall.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <LinkIcon className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{recall.title}</p>
                            <p className="text-sm text-muted-foreground">Product: {recall.product_name}</p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(recall.status)}>
                          {recall.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground bg-gray-50 p-3 rounded">
                    No recalls linked to this CAPA.
                  </p>
                )}
              </div>

              {/* Affected Products */}
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Potentially Affected Products
                </h4>
                {products.length > 0 ? (
                  <div className="text-sm text-muted-foreground">
                    <p>{products.length} products in the system may be affected.</p>
                    <p className="text-xs mt-1">Traceability analysis can help identify specific impact.</p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No products found in the system.</p>
                )}
              </div>

              {/* Actions */}
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Quick Actions</h4>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    size="sm"
                    onClick={handleCreateRecall}
                    disabled={loading}
                    className="flex items-center gap-2"
                  >
                    <AlertTriangle className="h-4 w-4" />
                    Initiate Recall
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open('/traceability', '_blank')}
                  >
                    <Package className="h-4 w-4 mr-2" />
                    View Traceability
                  </Button>
                </div>
              </div>

              {/* Integration Status */}
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-start gap-2">
                  <LinkIcon className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-900">Traceability Integration Active</p>
                    <p className="text-blue-700">
                      This CAPA is connected to the traceability system. Any recalls created will automatically link to this CAPA for full audit trail.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CAPATraceabilityIntegration;
