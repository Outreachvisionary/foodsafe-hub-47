
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { BatchTrace, isRecallNeeded } from '@/types/traceability';
import CCPTimeline from './CCPTimeline';

interface BatchDetailsDialogProps {
  batch: BatchTrace | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRecallInitiate: () => void;
  onViewCCP: (ccpId: string) => void;
}

const BatchDetailsDialog: React.FC<BatchDetailsDialogProps> = ({
  batch,
  open,
  onOpenChange,
  onRecallInitiate,
  onViewCCP
}) => {
  if (!batch) return null;

  const recallNeeded = isRecallNeeded(batch);
  const failedCCPs = batch.haccpChecks.filter(check => !check.passed);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Batch Details: {batch.id}
          </DialogTitle>
          <DialogDescription>
            {batch.product} - {batch.date}
          </DialogDescription>
        </DialogHeader>

        {recallNeeded && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Recall Recommended</AlertTitle>
            <AlertDescription>
              {failedCCPs.length > 0 
                ? `${failedCCPs.length} Critical Control Point${failedCCPs.length > 1 ? 's have' : ' has'} failed for this batch.`
                : 'Supplier quality issues detected for this batch.'
              }
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="ccps">
          <TabsList className="mb-4">
            <TabsTrigger value="ccps">HACCP Control Points</TabsTrigger>
            <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
            <TabsTrigger value="distribution">Distribution</TabsTrigger>
          </TabsList>

          <TabsContent value="ccps">
            <CCPTimeline 
              checks={batch.haccpChecks}
              onCCPClick={(ccp) => onViewCCP(ccp.ccpId)}
              onRecallInitiate={onRecallInitiate}
            />
          </TabsContent>

          <TabsContent value="suppliers">
            <div className="space-y-4">
              <h3 className="font-medium">Supplier Information</h3>
              {batch.suppliers.map(supplier => (
                <div key={supplier.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">{supplier.name}</h4>
                    {supplier.auditScore !== undefined && (
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        supplier.auditScore >= 90 ? 'bg-green-100 text-green-800' :
                        supplier.auditScore >= 80 ? 'bg-amber-100 text-amber-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        Audit Score: {supplier.auditScore}
                      </div>
                    )}
                  </div>
                  
                  {supplier.certificates && supplier.certificates.length > 0 && (
                    <div className="mt-2">
                      <span className="text-sm text-gray-500">Certificates:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {supplier.certificates.map((cert, index) => (
                          <span key={index} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                            {cert}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="distribution">
            <div className="space-y-4">
              <h3 className="font-medium">Distribution Information</h3>
              <div className="border rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Current Location</h4>
                    <p>{batch.location}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Status</h4>
                    <p>{batch.status}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Quantity</h4>
                    <p>{batch.quantity}</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default BatchDetailsDialog;
