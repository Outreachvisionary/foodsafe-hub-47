
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  AlertTriangle, 
  Calendar, 
  CheckCircle2, 
  ChevronDown, 
  ClipboardCheck, 
  Clock, 
  Eye, 
  FileText, 
  Filter, 
  MoreHorizontal, 
  Search, 
  Users, 
  XCircle 
} from 'lucide-react';

interface CAPAListProps {
  filters: {
    status: string;
    priority: string;
    source: string;
    dueDate: string;
  };
  searchQuery: string;
}

// Mock data for the CAPA list
const capaData = [
  {
    id: 'CAPA-2023-056',
    title: 'Foreign Material in Production Line 3',
    description: 'Metal fragments found during routine inspection of production line 3.',
    source: 'HACCP',
    sourceId: 'CCP-METAL-003',
    priority: 'critical',
    status: 'open',
    assignedTo: 'John Smith',
    department: 'Production',
    dueDate: '2023-12-15',
    createdDate: '2023-12-01',
    lastUpdated: '2023-12-05',
    rootCause: 'Damaged metal detector sensor causing missed detections',
    correctiveAction: 'Replace metal detector sensor and recalibrate',
    preventiveAction: 'Implement daily verification checks of metal detector functionality',
    relatedDocuments: ['MD-CALIBRATION-01', 'MAINT-SCHEDULE-Q4'],
    verificationMethod: 'Repeated testing with metal test pieces of varying sizes',
    fsma204Compliant: true
  },
  {
    id: 'CAPA-2023-062',
    title: 'Allergen Control Program Gaps',
    description: 'Internal audit identified gaps in allergen control program documentation.',
    source: 'Audit',
    sourceId: 'AUDIT-2023-11',
    priority: 'high',
    status: 'in-progress',
    assignedTo: 'Sarah Johnson',
    department: 'Quality',
    dueDate: '2023-12-20',
    createdDate: '2023-12-02',
    lastUpdated: '2023-12-10',
    rootCause: 'Outdated allergen control procedures not reflecting new product lines',
    correctiveAction: 'Update allergen control program documentation',
    preventiveAction: 'Implement quarterly review of allergen control procedures',
    relatedDocuments: ['ALLERGEN-CONTROL-SOP', 'AUDIT-FINDINGS-2023'],
    verificationMethod: 'Follow-up audit of allergen control procedures',
    fsma204Compliant: true
  },
  {
    id: 'CAPA-2023-071',
    title: 'Supplier Documentation Missing',
    description: 'Required supplier certifications missing for ingredient XYZ.',
    source: 'Supplier',
    sourceId: 'SUPP-123-ING',
    priority: 'high',
    status: 'open',
    assignedTo: 'Michael Brown',
    department: 'Procurement',
    dueDate: '2023-12-22',
    createdDate: '2023-12-05',
    lastUpdated: '2023-12-12',
    rootCause: 'Supplier onboarding checklist not followed completely',
    correctiveAction: 'Obtain missing certifications from supplier',
    preventiveAction: 'Enhance supplier onboarding system with automated certificate tracking',
    relatedDocuments: ['SUPPLIER-REQUIREMENTS', 'INGREDIENT-SPEC-XYZ'],
    verificationMethod: 'Verification of complete supplier documentation package',
    fsma204Compliant: false
  },
  {
    id: 'CAPA-2023-085',
    title: 'Temperature Control Deviation',
    description: 'Storage temperature exceeded critical limit for 2 hours.',
    source: 'HACCP',
    sourceId: 'CCP-TEMP-005',
    priority: 'medium',
    status: 'closed',
    assignedTo: 'Lisa Garcia',
    department: 'Operations',
    dueDate: '2023-12-08',
    createdDate: '2023-12-03',
    lastUpdated: '2023-12-08',
    completedDate: '2023-12-08',
    rootCause: 'Refrigeration unit maintenance overdue',
    correctiveAction: 'Service refrigeration unit and discard affected product',
    preventiveAction: 'Implement temperature monitoring system with automated alerts',
    relatedDocuments: ['TEMP-RECORDS-DEC', 'MAINTENANCE-LOGS'],
    verificationMethod: '72-hour temperature monitoring post-repair',
    fsma204Compliant: true,
    effectivenessRating: 'Effective'
  },
  {
    id: 'CAPA-2023-092',
    title: 'Personnel Training Records Incomplete',
    description: 'New employees missing required food safety training documentation.',
    source: 'Audit',
    sourceId: 'AUDIT-2023-12',
    priority: 'low',
    status: 'in-progress',
    assignedTo: 'David Wilson',
    department: 'Human Resources',
    dueDate: '2023-12-30',
    createdDate: '2023-12-07',
    lastUpdated: '2023-12-11',
    rootCause: 'Training tracking system not integrated with onboarding process',
    correctiveAction: 'Complete missing training for identified employees',
    preventiveAction: 'Implement automated training assignment for new hires',
    relatedDocuments: ['TRAINING-SOP', 'EMPLOYEE-RECORDS'],
    verificationMethod: 'Audit of employee training records',
    fsma204Compliant: true
  }
];

const CAPAList: React.FC<CAPAListProps> = ({ filters, searchQuery }) => {
  const [selectedCAPA, setSelectedCAPA] = useState<any>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  // Filter the CAPA data based on search query and filters
  const filteredCAPAs = capaData.filter(capa => {
    const matchesSearch = 
      searchQuery === '' || 
      capa.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      capa.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      capa.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      capa.assignedTo.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filters.status === 'all' || capa.status === filters.status;
    const matchesPriority = filters.priority === 'all' || capa.priority === filters.priority;
    const matchesSource = filters.source === 'all' || capa.source.toLowerCase() === filters.source;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesSource;
  });

  const handleViewCAPA = (capa: any) => {
    setSelectedCAPA(capa);
    setViewDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return (
          <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Open
          </Badge>
        );
      case 'in-progress':
        return (
          <Badge className="bg-amber-100 text-amber-800 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            In Progress
          </Badge>
        );
      case 'closed':
        return (
          <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Closed
          </Badge>
        );
      case 'verified':
        return (
          <Badge className="bg-purple-100 text-purple-800 flex items-center gap-1">
            <ClipboardCheck className="h-3 w-3" />
            Verified
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800">
            {status}
          </Badge>
        );
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'critical':
        return (
          <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Critical
          </Badge>
        );
      case 'high':
        return (
          <Badge className="bg-amber-100 text-amber-800">
            High
          </Badge>
        );
      case 'medium':
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            Medium
          </Badge>
        );
      case 'low':
        return (
          <Badge className="bg-green-100 text-green-800">
            Low
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800">
            {priority}
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-bold flex items-center">
            <ClipboardCheck className="h-5 w-5 mr-2 text-blue-500" />
            CAPA List
          </CardTitle>
          <CardDescription>
            Manage and track all corrective and preventive actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>CAPA ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCAPAs.length > 0 ? (
                filteredCAPAs.map((capa) => (
                  <TableRow key={capa.id}>
                    <TableCell className="font-medium">{capa.id}</TableCell>
                    <TableCell>{capa.title}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span>{capa.source}</span>
                        <span className="text-xs text-gray-500">({capa.sourceId})</span>
                      </div>
                    </TableCell>
                    <TableCell>{getPriorityBadge(capa.priority)}</TableCell>
                    <TableCell>{getStatusBadge(capa.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5 text-gray-500" />
                        <span>{capa.assignedTo}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-gray-500" />
                        <span>{capa.dueDate}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewCAPA(capa)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4 text-muted-foreground">
                    No CAPAs found matching your filters
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>CAPA Details</DialogTitle>
            <DialogDescription>
              View details and manage this corrective and preventive action plan
            </DialogDescription>
          </DialogHeader>

          {selectedCAPA && (
            <Tabs defaultValue="details">
              <TabsList className="mb-4">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="plan">CAPA Plan</TabsTrigger>
                <TabsTrigger value="verification">Verification</TabsTrigger>
                <TabsTrigger value="related">Related Items</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{selectedCAPA.id}: {selectedCAPA.title}</h3>
                    <p className="text-gray-600 text-sm mt-1">{selectedCAPA.description}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {getPriorityBadge(selectedCAPA.priority)}
                    {getStatusBadge(selectedCAPA.status)}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Source</h4>
                    <p className="mt-1">{selectedCAPA.source} ({selectedCAPA.sourceId})</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Assigned To</h4>
                    <p className="mt-1">{selectedCAPA.assignedTo} ({selectedCAPA.department})</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Created Date</h4>
                    <p className="mt-1">{selectedCAPA.createdDate}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Due Date</h4>
                    <p className="mt-1">{selectedCAPA.dueDate}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Last Updated</h4>
                    <p className="mt-1">{selectedCAPA.lastUpdated}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">FSMA 204 Compliant</h4>
                    <p className="mt-1 flex items-center">
                      {selectedCAPA.fsma204Compliant ? (
                        <span className="flex items-center text-green-600">
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Yes
                        </span>
                      ) : (
                        <span className="flex items-center text-red-600">
                          <XCircle className="h-4 w-4 mr-1" />
                          No
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="plan" className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Root Cause Analysis</h4>
                  <p className="mt-1 p-3 bg-gray-50 rounded-md border">{selectedCAPA.rootCause}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Corrective Action</h4>
                  <p className="mt-1 p-3 bg-gray-50 rounded-md border">{selectedCAPA.correctiveAction}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Preventive Action</h4>
                  <p className="mt-1 p-3 bg-gray-50 rounded-md border">{selectedCAPA.preventiveAction}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Verification Method</h4>
                  <p className="mt-1 p-3 bg-gray-50 rounded-md border">{selectedCAPA.verificationMethod}</p>
                </div>
                
                {selectedCAPA.status === 'open' && (
                  <div className="flex justify-end space-x-3 mt-4">
                    <Button variant="outline">Update Plan</Button>
                    <Button>Mark In Progress</Button>
                  </div>
                )}
                {selectedCAPA.status === 'in-progress' && (
                  <div className="flex justify-end mt-4">
                    <Button>Complete Corrective Action</Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="verification" className="space-y-4">
                {selectedCAPA.status === 'closed' ? (
                  <>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Verification Status</h4>
                      <div className="mt-1 p-3 bg-green-50 rounded-md border border-green-100 flex items-center">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mr-2" />
                        <div>
                          <p className="font-medium">Verified on {selectedCAPA.completedDate}</p>
                          <p className="text-sm text-gray-600">Effectiveness: {selectedCAPA.effectivenessRating}</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Verification Evidence</h4>
                      <div className="mt-1 flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4 mr-1" />
                          View Verification Report
                        </Button>
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4 mr-1" />
                          View Effectiveness Data
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-amber-50 p-4 rounded-md border border-amber-100">
                      <h4 className="font-medium flex items-center text-amber-800">
                        <AlertTriangle className="h-5 w-5 mr-2" />
                        Verification Pending
                      </h4>
                      <p className="text-sm text-amber-700 mt-1">
                        This CAPA has not been verified yet. Verification can be performed once corrective actions are complete.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Verification Checklist</h4>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="check1" className="h-4 w-4" disabled />
                          <Label htmlFor="check1">Corrective action implemented</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="check2" className="h-4 w-4" disabled />
                          <Label htmlFor="check2">Preventive measures in place</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="check3" className="h-4 w-4" disabled />
                          <Label htmlFor="check3">Effectiveness verified</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="check4" className="h-4 w-4" disabled />
                          <Label htmlFor="check4">Documentation complete</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="related" className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Related Documents</h4>
                  <div className="mt-2 space-y-2">
                    {selectedCAPA.relatedDocuments.map((doc: string, index: number) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-md border">
                        <FileText className="h-4 w-4 text-blue-500" />
                        <span>{doc}</span>
                        <Button variant="ghost" size="sm" className="ml-auto h-6">
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Related Training</h4>
                  {selectedCAPA.source === 'Audit' ? (
                    <div className="mt-2 p-3 bg-gray-50 rounded-md border">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">Food Safety Refresher</p>
                          <p className="text-sm text-gray-600">Assigned to 5 employees</p>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-2 text-gray-600 text-sm">No related training assignments found.</p>
                  )}
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Related CAPAs</h4>
                  <p className="mt-2 text-gray-600 text-sm">No related CAPAs found.</p>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CAPAList;
