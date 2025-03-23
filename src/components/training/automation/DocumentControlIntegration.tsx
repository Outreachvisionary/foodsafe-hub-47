
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { FileText, Link2, Users, Bell, CalendarClock, Zap } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const DocumentControlIntegration: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sample linked documents
  const linkedDocuments = [
    {
      id: 'SOP-001',
      title: 'Statistical Process Control Implementation',
      version: '2.3',
      type: 'SOP',
      department: 'Quality',
      linkedCourses: ['SPC Fundamentals', 'Quality Management Systems'],
      trainingRequired: true,
      affectedRoles: ['Operator', 'Supervisor', 'Quality'],
      lastUpdated: '2023-05-10',
      status: 'Published'
    },
    {
      id: 'WI-042',
      title: 'Control Chart Creation and Monitoring',
      version: '1.2',
      type: 'Work Instruction',
      department: 'Production',
      linkedCourses: ['SPC Fundamentals'],
      trainingRequired: true,
      affectedRoles: ['Operator', 'Supervisor'],
      lastUpdated: '2023-04-28',
      status: 'Published'
    },
    {
      id: 'FORM-103',
      title: 'Process Capability Analysis Form',
      version: '1.0',
      type: 'Form',
      department: 'Quality',
      linkedCourses: ['Quality Data Analysis'],
      trainingRequired: false,
      affectedRoles: ['Quality'],
      lastUpdated: '2023-05-05',
      status: 'Draft'
    },
    {
      id: 'SOP-015',
      title: 'Product Nonconformity Handling',
      version: '3.1',
      type: 'SOP',
      department: 'Quality',
      linkedCourses: ['Quality Management Systems', 'Corrective Actions'],
      trainingRequired: true,
      affectedRoles: ['Quality', 'Production', 'Supervisor'],
      lastUpdated: '2023-05-12',
      status: 'Published'
    },
    {
      id: 'POL-007',
      title: 'Quality Policy',
      version: '2.0',
      type: 'Policy',
      department: 'Management',
      linkedCourses: ['Company Orientation', 'Quality Management Systems'],
      trainingRequired: true,
      affectedRoles: ['All'],
      lastUpdated: '2023-03-15',
      status: 'Published'
    }
  ];
  
  // Filter documents based on search query
  const filteredDocuments = linkedDocuments.filter(doc => 
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    doc.id.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Document Control Integration</h2>
        <Button variant="outline">
          <Link2 className="h-4 w-4 mr-2" />
          Link New Document
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 text-blue-500 mr-2" />
            Linked Documents
          </CardTitle>
          <CardDescription>
            Documents from Document Control that trigger training assignments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Input
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="sop">SOPs</SelectItem>
                  <SelectItem value="work-instruction">Work Instructions</SelectItem>
                  <SelectItem value="policy">Policies</SelectItem>
                  <SelectItem value="form">Forms</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Training</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">{doc.id}</TableCell>
                      <TableCell>{doc.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-gray-50">
                          {doc.type}
                        </Badge>
                      </TableCell>
                      <TableCell>v{doc.version}</TableCell>
                      <TableCell>{formatDate(doc.lastUpdated)}</TableCell>
                      <TableCell>
                        {doc.trainingRequired ? (
                          <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                            Required
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-gray-500">
                            Optional
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={doc.status === 'Published' ? 'default' : 'secondary'}>
                          {doc.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Manage</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Automation Rules</CardTitle>
          <CardDescription>
            Configure how document changes trigger training assignments
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Document Update Triggers</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-start space-x-3">
                    <FileText className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">New SOP Version</h4>
                      <p className="text-sm text-muted-foreground">
                        When a new version of an SOP is published
                      </p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-start space-x-3">
                    <FileText className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">New Work Instruction</h4>
                      <p className="text-sm text-muted-foreground">
                        When a new work instruction is published
                      </p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-start space-x-3">
                    <FileText className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Policy Updates</h4>
                      <p className="text-sm text-muted-foreground">
                        When company policies are updated
                      </p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Assignment Settings</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-start space-x-3">
                    <Users className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Auto-assign to affected roles</h4>
                      <p className="text-sm text-muted-foreground">
                        Automatically assign training to all roles listed in the document
                      </p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-start space-x-3">
                    <Bell className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Email notifications</h4>
                      <p className="text-sm text-muted-foreground">
                        Send email notifications about new training assignments
                      </p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-start space-x-3">
                    <CalendarClock className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Default due date</h4>
                      <p className="text-sm text-muted-foreground">
                        Set default training deadline from document publication
                      </p>
                    </div>
                  </div>
                  <Select defaultValue="14">
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Select days" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 days</SelectItem>
                      <SelectItem value="14">14 days</SelectItem>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="60">60 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <h3 className="text-lg font-medium mb-4">Recent Automated Assignments</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-md bg-blue-50 border-blue-200">
                <div className="flex items-start space-x-3">
                  <Zap className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">SOP-001 updated to v2.3</h4>
                    <p className="text-sm text-muted-foreground">
                      Training assigned to 12 employees in Production, Quality
                    </p>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">Today</span>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex items-start space-x-3">
                  <Zap className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">WI-042 updated to v1.2</h4>
                    <p className="text-sm text-muted-foreground">
                      Training assigned to 8 operators
                    </p>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">2 days ago</span>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex items-start space-x-3">
                  <Zap className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">SOP-015 updated to v3.1</h4>
                    <p className="text-sm text-muted-foreground">
                      Training assigned to 15 employees in Production, Quality
                    </p>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">3 days ago</span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2 border-t pt-4">
          <Button variant="outline">Reset to Defaults</Button>
          <Button>Save Settings</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DocumentControlIntegration;
