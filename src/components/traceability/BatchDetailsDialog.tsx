
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, FileText } from 'lucide-react';
import { BatchTrace, isRecallNeeded, generateFDA204Report } from '@/types/traceability';
import { evaluateRecallNeed } from '@/services/traceabilityService';
import CCPTimeline from './CCPTimeline';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

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
  const [showReportPreview, setShowReportPreview] = useState(false);
  
  if (!batch) return null;

  const recallNeeded = isRecallNeeded(batch);
  const failedCCPs = batch.haccpChecks.filter(check => !check.passed);
  const criticalFailures = failedCCPs.filter(check => check.criticality === 'CRITICAL');
  
  const handleGenerateReport = () => {
    const report = generateFDA204Report(batch);
    toast.success('FDA 204 Report generated');
    console.log('FDA 204 Report:', report);
    setShowReportPreview(true);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Batch Details: {batch.id}
            {recallNeeded && (
              <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200 ml-2">
                FSMA 204 Recall Alert
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            {batch.product} - {batch.date}
          </DialogDescription>
        </DialogHeader>

        {recallNeeded && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>
              {criticalFailures.length > 0 
                ? 'Critical CCP Failure - FSMA 204 Recall Recommended' 
                : 'Recall Recommended'}
            </AlertTitle>
            <AlertDescription>
              {failedCCPs.length > 0 
                ? `${failedCCPs.length} Critical Control Point${failedCCPs.length > 1 ? 's have' : ' has'} failed for this batch.`
                : 'Supplier quality issues detected for this batch.'
              }
              <div className="mt-2 flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-white hover:bg-white"
                  onClick={handleGenerateReport}
                >
                  <FileText className="h-4 w-4 mr-1" />
                  Generate FDA 204 Report
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {showReportPreview && (
          <div className="mb-4 p-4 border border-blue-200 rounded-lg bg-blue-50">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium text-blue-800">FDA 204 Report Preview</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowReportPreview(false)}
              >
                Close
              </Button>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <h4 className="font-medium">Batch Information</h4>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <div>Batch ID: {batch.id}</div>
                  <div>Product: {batch.product}</div>
                  <div>Date: {batch.date}</div>
                  <div>Lot Number: {batch.lotNumber || batch.id}</div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium">CCP Failures</h4>
                {failedCCPs.length > 0 ? (
                  <ul className="list-disc ml-5 mt-1">
                    {failedCCPs.map(ccp => (
                      <li key={ccp.id}>
                        {ccp.name}: {ccp.actual} {ccp.unit} 
                        {ccp.criticality === 'CRITICAL' && ' (Critical)'}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic mt-1">No CCP failures recorded</p>
                )}
              </div>
              
              <div>
                <h4 className="font-medium">Supplier Issues</h4>
                {batch.suppliers.some(supplier => supplier.auditScore !== undefined && supplier.auditScore < 80) ? (
                  <ul className="list-disc ml-5 mt-1">
                    {batch.suppliers
                      .filter(supplier => supplier.auditScore !== undefined && supplier.auditScore < 80)
                      .map(supplier => (
                        <li key={supplier.id}>
                          {supplier.name}: Audit Score {supplier.auditScore}
                        </li>
                      ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic mt-1">No supplier issues recorded</p>
                )}
              </div>
            </div>
          </div>
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

                  {supplier.ingredients && supplier.ingredients.length > 0 && (
                    <div className="mt-2">
                      <span className="text-sm text-gray-500">Ingredients:</span>
                      <div className="space-y-1 mt-1">
                        {supplier.ingredients.map((ingredient, index) => (
                          <div key={index} className="flex items-center justify-between text-xs border border-gray-100 p-2 rounded">
                            <span>{ingredient.name} (Lot: {ingredient.lotNumber})</span>
                            {ingredient.nonConformanceLevel && (
                              <Badge className={
                                ingredient.nonConformanceLevel === 'CLASS_I' ? 'bg-red-100 text-red-800' :
                                ingredient.nonConformanceLevel === 'CLASS_II' ? 'bg-amber-100 text-amber-800' :
                                'bg-yellow-100 text-yellow-800'
                              }>
                                {ingredient.nonConformanceLevel}
                              </Badge>
                            )}
                          </div>
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
                
                {batch.distribution && batch.distribution.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Distribution Chain</h4>
                    <div className="space-y-2">
                      {batch.distribution.map((node, index) => (
                        <div key={index} className="border rounded p-2 text-sm">
                          <div className="flex justify-between">
                            <span className="font-medium">{node.facilityId}</span>
                            <span>{new Date(node.date).toLocaleDateString()}</span>
                          </div>
                          <div className="text-gray-600">Location: {node.location}</div>
                          <div className="text-gray-600">Contact: {node.contact}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default BatchDetailsDialog;
