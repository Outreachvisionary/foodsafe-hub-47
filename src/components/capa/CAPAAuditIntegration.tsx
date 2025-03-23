
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  AlertTriangle, 
  Check, 
  ClipboardList, 
  LinkIcon, 
  Search,
  Filter
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';

// Mock data for audit findings
const auditFindings = [
  {
    id: 'AF-2023-101',
    auditId: 'AUDIT-2023-15',
    description: 'Temperature monitoring records missing for Cold Storage Room 2',
    severity: 'major',
    status: 'open',
    dateIdentified: '2023-11-15'
  },
  {
    id: 'AF-2023-102',
    auditId: 'AUDIT-2023-15',
    description: 'Employee GMP training records incomplete for 3 new hires',
    severity: 'minor',
    status: 'open',
    dateIdentified: '2023-11-15'
  },
  {
    id: 'AF-2023-098',
    auditId: 'AUDIT-2023-14',
    description: 'Allergen control program documentation needs updating to reflect new product lines',
    severity: 'major',
    status: 'in-progress',
    dateIdentified: '2023-11-10'
  },
  {
    id: 'AF-2023-095',
    auditId: 'AUDIT-2023-14',
    description: 'Sanitation verification swab results show recurring issues in packaging area',
    severity: 'critical',
    status: 'open',
    dateIdentified: '2023-11-10'
  },
  {
    id: 'AF-2023-088',
    auditId: 'AUDIT-2023-13',
    description: 'Pest control log missing entries for October 2023',
    severity: 'minor',
    status: 'closed',
    dateIdentified: '2023-11-01'
  }
];

interface CAPAAuditIntegrationProps {
  onFindingSelected?: (finding: any) => void;
}

const CAPAAuditIntegration: React.FC<CAPAAuditIntegrationProps> = ({ onFindingSelected }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [open, setOpen] = useState(false);
  
  const filteredFindings = auditFindings.filter(finding => {
    const matchesSearch = 
      finding.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      finding.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || finding.status === statusFilter;
    const matchesSeverity = severityFilter === 'all' || finding.severity === severityFilter;
    
    return matchesSearch && matchesStatus && matchesSeverity;
  });

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return (
          <Badge className="bg-red-100 text-red-800">
            Critical
          </Badge>
        );
      case 'major':
        return (
          <Badge className="bg-amber-100 text-amber-800">
            Major
          </Badge>
        );
      case 'minor':
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            Minor
          </Badge>
        );
      case 'observation':
        return (
          <Badge className="bg-blue-100 text-blue-800">
            Observation
          </Badge>
        );
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return (
          <Badge className="bg-blue-100 text-blue-800">
            Open
          </Badge>
        );
      case 'in-progress':
        return (
          <Badge className="bg-amber-100 text-amber-800">
            In Progress
          </Badge>
        );
      case 'closed':
        return (
          <Badge className="bg-green-100 text-green-800">
            Closed
          </Badge>
        );
      default:
        return null;
    }
  };

  const handleSelectFinding = (finding: any) => {
    if (onFindingSelected) {
      onFindingSelected(finding);
    }
    
    toast.success(`Selected audit finding: ${finding.id}`);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-1 w-full">
          <LinkIcon className="h-4 w-4" />
          Link to Audit Finding
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Link to Audit Finding</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search findings..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-[140px]">
                <AlertTriangle className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severity</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="major">Major</SelectItem>
                <SelectItem value="minor">Minor</SelectItem>
                <SelectItem value="observation">Observation</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Audit Findings</CardTitle>
              <CardDescription>Select a finding to link to this CAPA</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Audit</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFindings.length > 0 ? (
                    filteredFindings.map((finding) => (
                      <TableRow key={finding.id}>
                        <TableCell className="font-medium">{finding.id}</TableCell>
                        <TableCell>{finding.auditId}</TableCell>
                        <TableCell>
                          <div className="max-w-md truncate" title={finding.description}>
                            {finding.description}
                          </div>
                        </TableCell>
                        <TableCell>{getSeverityBadge(finding.severity)}</TableCell>
                        <TableCell>{getStatusBadge(finding.status)}</TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleSelectFinding(finding)}
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
                        No audit findings match your search
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

export default CAPAAuditIntegration;
