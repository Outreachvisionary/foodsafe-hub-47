import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Input,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Badge,
  Checkbox,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem
} from '@/components/ui/';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Search, Filter, ChevronDown, PlusCircle, Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useAudits } from '@/hooks/useAudits';

// Import types from the appropriate location if needed
type Audit = {
  id: string;
  title: string;
  status: string;
  start_date: string;
  due_date: string;
  audit_type: string;
  assigned_to: string;
  findings_count: number;
};

const InternalAudits: React.FC = () => {
  const navigate = useNavigate();
  const { audits, loading, error, fetchAudits } = useAudits();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [showCompleted, setShowCompleted] = useState(true);
  const [hideCancelled, setHideCancelled] = useState(false);
  const [internalOnly, setInternalOnly] = useState(false);
  const [externalOnly, setExternalOnly] = useState(false);
  const [highRiskOnly, setHighRiskOnly] = useState(false);
  const [myAuditsOnly, setMyAuditsOnly] = useState(false);
  const [overdueOnly, setOverdueOnly] = useState(false);

  useEffect(() => {
    fetchAudits();
  }, [fetchAudits]);

  const handleStatusChange = (status: string | null) => {
    setSelectedStatus(status);
  };

  const handleTypeChange = (type: string | null) => {
    setSelectedType(type);
  };

  const filteredAudits = audits
    ? audits.filter((audit) => {
        const searchMatch =
          searchQuery === '' ||
          audit.title.toLowerCase().includes(searchQuery.toLowerCase());
        const statusMatch =
          selectedStatus === null || audit.status === selectedStatus;
        const typeMatch =
          selectedType === null || audit.audit_type === selectedType;
        const completedMatch = showCompleted || audit.status !== 'Completed';
        const cancelledMatch = hideCancelled || audit.status !== 'Cancelled';
        return (
          searchMatch && statusMatch && typeMatch && completedMatch && cancelledMatch
        );
      })
    : [];

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Internal Audits</h1>
        <Button onClick={() => navigate('/audits/new')}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Audit
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search audits..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Select onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Open">Open</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={handleTypeChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Internal">Internal</SelectItem>
            <SelectItem value="External">External</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="open">Open</TabsTrigger>
          <TabsTrigger value="inProgress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-2">
          <AuditList audits={filteredAudits} loading={loading} error={error} />
        </TabsContent>
        <TabsContent value="open" className="space-y-2">
          <AuditList
            audits={filteredAudits.filter((audit) => audit.status === 'Open')}
            loading={loading}
            error={error}
          />
        </TabsContent>
        <TabsContent value="inProgress" className="space-y-2">
          <AuditList
            audits={filteredAudits.filter(
              (audit) => audit.status === 'In Progress'
            )}
            loading={loading}
            error={error}
          />
        </TabsContent>
        <TabsContent value="completed" className="space-y-2">
          <AuditList
            audits={filteredAudits.filter(
              (audit) => audit.status === 'Completed'
            )}
            loading={loading}
            error={error}
          />
        </TabsContent>
        <TabsContent value="cancelled" className="space-y-2">
          <AuditList
            audits={filteredAudits.filter(
              (audit) => audit.status === 'Cancelled'
            )}
            loading={loading}
            error={error}
          />
        </TabsContent>
      </Tabs>

      {/* This is where the filter dropdown was causing issues */}
      <div className="flex items-center space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              <Filter className="mr-2 h-4 w-4" />
              Filter
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuCheckboxItem>
              Show Completed
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem>
              Hide Cancelled
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem>
              Internal Only
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem>
              External Only
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem>
              High Risk Only
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem>
              My Audits Only
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem>
              Overdue Only
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

interface AuditListProps {
  audits: Audit[];
  loading: boolean;
  error: any;
}

const AuditList: React.FC<AuditListProps> = ({ audits, loading, error }) => {
  const navigate = useNavigate();

  if (loading) {
    return <p>Loading audits...</p>;
  }

  if (error) {
    return <p>Error fetching audits: {error.message}</p>;
  }

  if (!audits || audits.length === 0) {
    return <p>No audits found.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Start Date</TableHead>
          <TableHead>Due Date</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Assigned To</TableHead>
          <TableHead>Findings</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {audits.map((audit) => (
          <TableRow key={audit.id}>
            <TableCell>
              <Button variant="link" onClick={() => navigate(`/audits/${audit.id}`)}>
                {audit.title}
              </Button>
            </TableCell>
            <TableCell>
              <Badge>{audit.status}</Badge>
            </TableCell>
            <TableCell>{audit.start_date}</TableCell>
            <TableCell>{audit.due_date}</TableCell>
            <TableCell>{audit.audit_type}</TableCell>
            <TableCell>{audit.assigned_to}</TableCell>
            <TableCell>{audit.findings_count}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default InternalAudits;
