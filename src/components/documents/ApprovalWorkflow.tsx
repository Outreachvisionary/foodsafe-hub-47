
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  FileEdit, 
  CheckCircle, 
  Clock, 
  User, 
  FileText, 
  Filter,
  Search,
  Eye
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';

interface ApprovalItem {
  id: string;
  documentTitle: string;
  documentType: string;
  requestedBy: string;
  requestedDate: string;
  dueDate: string;
  stage: string;
  progress: number;
  avatarSrc?: string;
}

const pendingApprovals: ApprovalItem[] = [
  {
    id: '1',
    documentTitle: 'Food Safety Policy 2024',
    documentType: 'Policy',
    requestedBy: 'John Doe',
    requestedDate: '2023-10-15',
    dueDate: '2023-10-25',
    stage: 'Awaiting Your Approval',
    progress: 50,
    avatarSrc: ''
  },
  {
    id: '2',
    documentTitle: 'Allergen Management SOP v2',
    documentType: 'SOP',
    requestedBy: 'Jane Smith',
    requestedDate: '2023-10-12',
    dueDate: '2023-10-22',
    stage: 'Awaiting Your Approval',
    progress: 75,
    avatarSrc: ''
  },
  {
    id: '3',
    documentTitle: 'Crisis Management Plan',
    documentType: 'Policy',
    requestedBy: 'Mike Brown',
    requestedDate: '2023-10-05',
    dueDate: '2023-10-20',
    stage: 'Awaiting Quality Manager',
    progress: 25,
    avatarSrc: ''
  }
];

const initiated: ApprovalItem[] = [
  {
    id: '4',
    documentTitle: 'Environmental Monitoring Program',
    documentType: 'SOP',
    requestedBy: 'You',
    requestedDate: '2023-10-18',
    dueDate: '2023-10-28',
    stage: 'Awaiting Department Head',
    progress: 25,
    avatarSrc: ''
  },
  {
    id: '5',
    documentTitle: 'HACCP Plan - Raw Materials v3',
    documentType: 'HACCP Plan',
    requestedBy: 'You',
    requestedDate: '2023-10-08',
    dueDate: '2023-10-18',
    stage: 'Awaiting CEO Approval',
    progress: 75,
    avatarSrc: ''
  }
];

const completed: ApprovalItem[] = [
  {
    id: '6',
    documentTitle: 'Sanitation Procedures - Production Line 1',
    documentType: 'SOP',
    requestedBy: 'Sarah Johnson',
    requestedDate: '2023-09-25',
    dueDate: '2023-10-05',
    stage: 'Published',
    progress: 100,
    avatarSrc: ''
  },
  {
    id: '7',
    documentTitle: 'Supplier Approval Process',
    documentType: 'Policy',
    requestedBy: 'You',
    requestedDate: '2023-09-20',
    dueDate: '2023-09-30',
    stage: 'Published',
    progress: 100,
    avatarSrc: ''
  }
];

const ApprovalWorkflow = () => {
  return (
    <Card className="animate-fade-in">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">Document Approval Workflow</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mt-2 mb-6">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search approvals..."
              className="pl-8 w-full md:max-w-md"
            />
          </div>
        </div>
        
        <Tabs defaultValue="pending">
          <TabsList>
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Pending My Approval</span>
              <Badge className="ml-1 bg-yellow-100 text-yellow-800 hover:bg-yellow-100">{pendingApprovals.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="initiated" className="flex items-center gap-2">
              <FileEdit className="h-4 w-4" />
              <span>Initiated by Me</span>
              <Badge className="ml-1 bg-blue-100 text-blue-800 hover:bg-blue-100">{initiated.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              <span>Completed</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending" className="mt-4">
            <ApprovalTable items={pendingApprovals} type="pending" />
          </TabsContent>
          
          <TabsContent value="initiated" className="mt-4">
            <ApprovalTable items={initiated} type="initiated" />
          </TabsContent>
          
          <TabsContent value="completed" className="mt-4">
            <ApprovalTable items={completed} type="completed" />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

interface ApprovalTableProps {
  items: ApprovalItem[];
  type: 'pending' | 'initiated' | 'completed';
}

const ApprovalTable: React.FC<ApprovalTableProps> = ({ items, type }) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Document</TableHead>
            <TableHead>Requested By</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length > 0 ? (
            items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <div>
                      <div>{item.documentTitle}</div>
                      <div className="text-xs text-gray-500">{item.documentType}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={item.avatarSrc} />
                      <AvatarFallback className="text-xs">
                        {item.requestedBy.split(' ').map(name => name[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span>{item.requestedBy}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(item.dueDate) < new Date() ? (
                    <span className="text-red-500 font-medium">{new Date(item.dueDate).toLocaleDateString()}</span>
                  ) : (
                    new Date(item.dueDate).toLocaleDateString()
                  )}
                </TableCell>
                <TableCell>
                  <Badge className={`
                    ${item.stage === 'Published' ? 'bg-green-100 text-green-800' : 
                      item.stage === 'Awaiting Your Approval' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-blue-100 text-blue-800'}
                  `} variant="outline">
                    {item.stage}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="w-[100px]">
                    <Progress value={item.progress} className="h-2" />
                    <div className="text-xs text-gray-500 mt-1">{item.progress}% Complete</div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-1">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                    {type === 'pending' && (
                      <>
                        <Button variant="ghost" size="icon" className="text-green-600">
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                No {type === 'pending' ? 'pending approvals' : type === 'initiated' ? 'documents initiated by you' : 'completed approvals'} found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ApprovalWorkflow;
