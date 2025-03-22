
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Calendar,
  User,
  ClipboardList,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Shield,
  RefreshCw
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import AuditChecklist from './AuditChecklist';
import { useToast } from '@/components/ui/use-toast';

interface AuditDetailsProps {
  audit: {
    id: string;
    title: string;
    standard: string;
    status: string;
    scheduledDate: string;
    completedDate: string | null;
    assignedTo: string;
    findings: number;
    recurrence?: string;
    lastCompleted?: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

const AuditDetailsDialog: React.FC<AuditDetailsProps> = ({ 
  audit, 
  isOpen, 
  onClose 
}) => {
  const [activeTab, setActiveTab] = useState('details');
  const [isRunningAudit, setIsRunningAudit] = useState(false);
  const { toast } = useToast();

  const handleStartAudit = () => {
    setIsRunningAudit(true);
    setActiveTab('checklist');
  };

  const handleCompleteAudit = (findings: number) => {
    toast({
      title: "Audit Completed",
      description: `Audit ${audit.id} completed with ${findings} findings`,
    });
    setIsRunningAudit(false);
    onClose();
  };

  const handleCancelAudit = () => {
    setIsRunningAudit(false);
    setActiveTab('details');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'text-green-600 bg-green-100';
      case 'In Progress':
        return 'text-blue-600 bg-blue-100';
      case 'Scheduled':
        return 'text-amber-600 bg-amber-100';
      case 'Due Soon':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // Get template name based on audit title
  const getTemplateName = () => {
    if (audit.title.includes("Mock Recall")) {
      return "SQF Mock Recall Exercise";
    } else if (audit.title.includes("Environmental Monitoring")) {
      return "FSSC 22000 Environmental Monitoring";
    } else if (audit.title.includes("Food Defense")) {
      return "SQF Food Defense Assessment";
    } else {
      return `${audit.standard} Internal Audit`;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Shield className="h-5 w-5 text-fsms-blue" />
            {audit.title}
          </DialogTitle>
          <DialogDescription>
            Audit #{audit.id} - {audit.standard}
          </DialogDescription>
        </DialogHeader>

        {isRunningAudit ? (
          <AuditChecklist 
            auditId={audit.id}
            standardType={audit.standard}
            templateName={getTemplateName()}
            onComplete={handleCompleteAudit}
            onCancel={handleCancelAudit}
          />
        ) : (
          <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="details">
                <FileText className="h-4 w-4 mr-2" />
                Details
              </TabsTrigger>
              <TabsTrigger value="checklist">
                <ClipboardList className="h-4 w-4 mr-2" />
                Checklist
              </TabsTrigger>
              {audit.status === 'Completed' && (
                <TabsTrigger value="findings">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Findings
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="details">
              <div className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-start space-x-3">
                        <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500">Scheduled Date</p>
                          <p className="font-medium">{audit.scheduledDate}</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <User className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500">Assigned To</p>
                          <p className="font-medium">{audit.assignedTo || 'Unassigned'}</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <CheckCircle2 className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500">Status</p>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(audit.status)}`}>
                            {audit.status}
                          </span>
                        </div>
                      </div>

                      {audit.recurrence && (
                        <div className="flex items-start space-x-3">
                          <RefreshCw className="h-5 w-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-500">Recurrence</p>
                            <p className="font-medium">{audit.recurrence}</p>
                            {audit.lastCompleted && (
                              <p className="text-xs text-gray-500 mt-1">
                                Last completed: {audit.lastCompleted}
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {audit.completedDate && (
                        <div className="flex items-start space-x-3">
                          <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-500">Completed Date</p>
                            <p className="font-medium">{audit.completedDate}</p>
                          </div>
                        </div>
                      )}

                      {audit.status === 'Completed' && (
                        <div className="flex items-start space-x-3">
                          <AlertTriangle className="h-5 w-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-500">Findings</p>
                            <Badge variant="outline" className={`
                              ${audit.findings > 0 ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}
                            `}>
                              {audit.findings} {audit.findings === 1 ? 'finding' : 'findings'}
                            </Badge>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Standard Requirements */}
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-sm font-medium mb-2 flex items-center">
                      <Shield className="h-4 w-4 text-fsms-blue mr-2" />
                      {audit.standard} Requirements
                    </h3>
                    
                    {audit.standard === 'SQF' && (
                      <ul className="text-sm space-y-2 list-disc pl-5">
                        <li>Annual internal audits covering all SQF System elements</li>
                        <li>Mock recall exercises every 6 months</li>
                        <li>Food defense assessments annually</li>
                        <li>Crisis management drills annually</li>
                      </ul>
                    )}
                    
                    {audit.standard === 'FSSC 22000' && (
                      <ul className="text-sm space-y-2 list-disc pl-5">
                        <li>Internal audits covering all FSSC 22000 requirements</li>
                        <li>Environmental monitoring program verification</li>
                        <li>Food fraud vulnerability assessment annually</li>
                        <li>Food defense assessment annually</li>
                      </ul>
                    )}
                    
                    {(audit.standard !== 'SQF' && audit.standard !== 'FSSC 22000') && (
                      <p className="text-sm text-gray-500">
                        Standard requirements specific to {audit.standard}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="checklist">
              {audit.status === 'Completed' ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
                  <h3 className="text-lg font-medium">Audit Completed</h3>
                  <p className="text-gray-500 max-w-md mt-2">
                    This audit has been completed on {audit.completedDate} with {audit.findings} findings.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <ClipboardList className="h-12 w-12 text-fsms-blue mb-4" />
                  <h3 className="text-lg font-medium">Start Audit Checklist</h3>
                  <p className="text-gray-500 max-w-md mt-2">
                    Begin the audit process by completing the checklist items for {audit.standard}.
                  </p>
                  <Button className="mt-4" onClick={handleStartAudit}>
                    Start Audit
                  </Button>
                </div>
              )}
            </TabsContent>

            {audit.status === 'Completed' && (
              <TabsContent value="findings">
                <div className="space-y-4">
                  {audit.findings > 0 ? (
                    <Card>
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          {/* Example findings - in a real app, these would be dynamically loaded */}
                          <div className="bg-amber-50 p-4 rounded-md border border-amber-100">
                            <h4 className="font-medium text-amber-800 flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4 text-amber-500" />
                              Finding #1
                            </h4>
                            <p className="mt-1 text-amber-700">
                              Incomplete documentation for supplier approval process.
                            </p>
                            <div className="mt-3 flex justify-between items-center">
                              <Badge variant="outline" className="bg-blue-100 text-blue-800">
                                Minor Non-Conformance
                              </Badge>
                              <span className="text-xs text-gray-500">Due: 30 days</span>
                            </div>
                          </div>

                          {audit.findings > 1 && (
                            <div className="bg-amber-50 p-4 rounded-md border border-amber-100">
                              <h4 className="font-medium text-amber-800 flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 text-amber-500" />
                                Finding #2
                              </h4>
                              <p className="mt-1 text-amber-700">
                                Temperature monitoring records missing for cold storage area.
                              </p>
                              <div className="mt-3 flex justify-between items-center">
                                <Badge variant="outline" className="bg-amber-100 text-amber-800">
                                  Major Non-Conformance
                                </Badge>
                                <span className="text-xs text-gray-500">Due: 14 days</span>
                              </div>
                            </div>
                          )}

                          {audit.findings > 2 && (
                            <div className="bg-amber-50 p-4 rounded-md border border-amber-100">
                              <h4 className="font-medium text-amber-800 flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 text-amber-500" />
                                Finding #3
                              </h4>
                              <p className="mt-1 text-amber-700">
                                Employee training records not up-to-date.
                              </p>
                              <div className="mt-3 flex justify-between items-center">
                                <Badge variant="outline" className="bg-blue-100 text-blue-800">
                                  Minor Non-Conformance
                                </Badge>
                                <span className="text-xs text-gray-500">Due: 30 days</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
                      <h3 className="text-lg font-medium">No Findings</h3>
                      <p className="text-gray-500 max-w-md mt-2">
                        This audit was completed with no non-conformances or findings.
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
            )}
          </Tabs>
        )}

        {!isRunningAudit && (
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            {(audit.status === 'Scheduled' || audit.status === 'Due Soon') && (
              <Button onClick={handleStartAudit}>
                Start Audit
              </Button>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuditDetailsDialog;
