
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, FileText, AlertCircle } from 'lucide-react';
import { BatchTrace, isRecallNeeded, generateFDA204Report } from '@/types/traceability';
import { evaluateRecallNeed, getComplaintTrend } from '@/services/traceabilityService';
import { toast } from 'sonner';

interface RecallRiskDashboardProps {
  batches: BatchTrace[];
  onRecallInitiate: (batch: BatchTrace) => void;
}

const RecallRiskDashboard: React.FC<RecallRiskDashboardProps> = ({ 
  batches,
  onRecallInitiate
}) => {
  // Filter batches that are at risk of recall
  const atRiskBatches = batches.filter(batch => isRecallNeeded(batch));
  
  // Get batches with complaint trends
  const batchesWithComplaints = batches.filter(batch => 
    batch.productId && getComplaintTrend(batch.productId) > 15
  );
  
  const handleGenerateReport = (batch: BatchTrace) => {
    const report = generateFDA204Report(batch);
    toast.success('FDA 204 Report generated');
    console.log('FDA 204 Report:', report);
    // In a real application, this would handle the report appropriately
    // e.g., download as PDF, send to regulatory affairs, etc.
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          Recall Risk Assessment
        </CardTitle>
        <CardDescription>
          Monitoring {batches.length} batches for FSMA 204 compliance
        </CardDescription>
      </CardHeader>
      <CardContent>
        {atRiskBatches.length > 0 ? (
          <div className="space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Recall Risk Detected</AlertTitle>
              <AlertDescription>
                {atRiskBatches.length} {atRiskBatches.length === 1 ? 'batch requires' : 'batches require'} immediate attention
              </AlertDescription>
            </Alert>
            
            <div className="space-y-3">
              {atRiskBatches.map(batch => (
                <div key={batch.id} className="border rounded-lg p-3 bg-red-50 border-red-200">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">{batch.product} - {batch.id}</h4>
                    <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                      Recall Recommended
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    <div>Date: {batch.date}</div>
                    <div>Location: {batch.location}</div>
                  </div>
                  <div className="text-sm mb-2">
                    <span className="font-medium">Risk Factors:</span>
                    <ul className="list-disc ml-5 mt-1">
                      {batch.haccpChecks.some(check => !check.passed) && (
                        <li>CCP Failures: {batch.haccpChecks.filter(check => !check.passed).length}</li>
                      )}
                      {batch.suppliers.some(supplier => supplier.auditScore !== undefined && supplier.auditScore < 80) && (
                        <li>Supplier Issues: {batch.suppliers.filter(supplier => supplier.auditScore !== undefined && supplier.auditScore < 80).length}</li>
                      )}
                      {batch.productId && getComplaintTrend(batch.productId) > 15 && (
                        <li>Complaint Trend: {getComplaintTrend(batch.productId)}% increase</li>
                      )}
                    </ul>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button 
                      onClick={() => onRecallInitiate(batch)}
                      variant="destructive"
                      size="sm"
                    >
                      Initiate Recall
                    </Button>
                    <Button
                      onClick={() => handleGenerateReport(batch)}
                      variant="outline"
                      size="sm"
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      Generate FDA 204 Report
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : batchesWithComplaints.length > 0 ? (
          <div className="space-y-4">
            <Alert variant="default" className="bg-amber-50 border-amber-200">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertTitle className="text-amber-800">Complaint Trends Detected</AlertTitle>
              <AlertDescription className="text-amber-700">
                {batchesWithComplaints.length} {batchesWithComplaints.length === 1 ? 'product has' : 'products have'} elevated complaint levels
              </AlertDescription>
            </Alert>
            
            <div className="space-y-3">
              {batchesWithComplaints.map(batch => (
                <div key={batch.id} className="border rounded-lg p-3 bg-amber-50 border-amber-200">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">{batch.product} - {batch.id}</h4>
                    <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
                      Monitoring
                    </Badge>
                  </div>
                  <div className="text-sm mb-2">
                    <span className="font-medium">Complaint Trend:</span> {batch.productId && getComplaintTrend(batch.productId)}% increase
                  </div>
                  <Button
                    onClick={() => handleGenerateReport(batch)}
                    variant="outline"
                    size="sm"
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    Generate FDA 204 Report
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="py-8 text-center">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
              <span className="text-green-600 text-xl">✓</span>
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No Recall Risks</h3>
            <p className="mt-1 text-sm text-gray-500">All monitored batches are currently compliant with FSMA 204 requirements.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecallRiskDashboard;
