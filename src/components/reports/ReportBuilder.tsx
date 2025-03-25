
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  FileText, 
  Plus, 
  ChevronRight, 
  Download, 
  Filter, 
  Calendar, 
  Save,
  Share2,
  Table,
  BarChart,
  PieChart,
  List,
  LineChart,
  LayoutDashboard,
  Copy
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table as TableUI, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface ReportBuilderProps {}

const ReportBuilder: React.FC<ReportBuilderProps> = () => {
  const [reportName, setReportName] = useState('');
  const [dataSource, setDataSource] = useState('');
  const [reportFormat, setReportFormat] = useState('pdf');
  const [activeTab, setActiveTab] = useState('data');
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [filterConditions, setFilterConditions] = useState<any[]>([]);
  const { toast } = useToast();
  
  const handleSaveReport = () => {
    if (!reportName) {
      toast({
        title: "Report name required",
        description: "Please enter a name for your report.",
        variant: "destructive"
      });
      return;
    }
    
    if (!dataSource) {
      toast({
        title: "Data source required",
        description: "Please select a data source for your report.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Report Template Saved",
      description: `Your custom report "${reportName}" has been saved.`
    });
  };
  
  const handleGenerateReport = () => {
    if (!reportName || !dataSource) {
      toast({
        title: "Incomplete report configuration",
        description: "Please complete all required fields before generating the report.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Generating Report",
      description: "Your report is being generated. It will be available for download shortly."
    });
  };
  
  const handleAddFilter = () => {
    setFilterConditions([...filterConditions, { field: '', operator: 'equals', value: '' }]);
  };
  
  const handleRemoveFilter = (index: number) => {
    const newFilters = [...filterConditions];
    newFilters.splice(index, 1);
    setFilterConditions(newFilters);
  };
  
  const toggleColumnSelection = (column: string) => {
    if (selectedColumns.includes(column)) {
      setSelectedColumns(selectedColumns.filter(c => c !== column));
    } else {
      setSelectedColumns([...selectedColumns, column]);
    }
  };
  
  // Available data sources
  const dataSources = [
    { id: 'documents', name: 'Documents', icon: <FileText className="h-4 w-4" /> },
    { id: 'audits', name: 'Audits', icon: <FileText className="h-4 w-4" /> },
    { id: 'capa', name: 'CAPA', icon: <FileText className="h-4 w-4" /> },
    { id: 'training', name: 'Training', icon: <FileText className="h-4 w-4" /> },
    { id: 'complaints', name: 'Complaints', icon: <FileText className="h-4 w-4" /> },
    { id: 'haccp', name: 'HACCP', icon: <FileText className="h-4 w-4" /> },
  ];
  
  // Available columns based on selected data source
  const getAvailableColumns = () => {
    switch (dataSource) {
      case 'documents':
        return [
          'Title', 'Category', 'Status', 'Version', 'Created By', 'Created Date', 
          'Updated Date', 'Expiry Date', 'Approval Status', 'Days Until Expiry'
        ];
      case 'audits':
        return [
          'Audit Name', 'Audit Type', 'Status', 'Scheduled Date', 'Completed Date',
          'Findings Count', 'Critical Findings', 'Major Findings', 'Minor Findings'
        ];
      case 'capa':
        return [
          'CAPA ID', 'Title', 'Status', 'Priority', 'Source', 'Created Date',
          'Due Date', 'Assigned To', 'Days Open', 'Root Cause', 'Effectiveness'
        ];
      case 'training':
        return [
          'Training Name', 'Category', 'Status', 'Assigned Employees', 'Completion Rate',
          'Average Score', 'Due Date', 'Department', 'Certification Required'
        ];
      default:
        return [];
    }
  };
  
  // Sample preview data based on selected data source
  const getPreviewData = () => {
    switch (dataSource) {
      case 'documents':
        return [
          { Title: 'HACCP Plan', Category: 'HACCP Plan', Status: 'Approved', Version: '2.1', 'Created By': 'John Smith', 'Created Date': '2023-05-15', 'Expiry Date': '2024-05-15' },
          { Title: 'Allergen Control Policy', Category: 'Policy', Status: 'Pending Approval', Version: '1.0', 'Created By': 'Jane Doe', 'Created Date': '2023-08-22', 'Expiry Date': '2024-08-22' },
          { Title: 'GMP Inspection Form', Category: 'Form', Status: 'Published', Version: '3.2', 'Created By': 'Robert Johnson', 'Created Date': '2023-02-10', 'Expiry Date': '2024-02-10' },
        ];
      case 'audits':
        return [
          { 'Audit Name': 'Monthly GMP Audit', 'Audit Type': 'Internal', Status: 'Completed', 'Scheduled Date': '2023-07-10', 'Findings Count': 12, 'Critical Findings': 0, 'Major Findings': 3 },
          { 'Audit Name': 'FSSC 22000 Surveillance', 'Audit Type': 'External', Status: 'Scheduled', 'Scheduled Date': '2023-09-15', 'Findings Count': 0, 'Critical Findings': 0, 'Major Findings': 0 },
          { 'Audit Name': 'Supplier Audit - ABC Foods', 'Audit Type': 'Supplier', Status: 'Completed', 'Scheduled Date': '2023-06-22', 'Findings Count': 8, 'Critical Findings': 1, 'Major Findings': 2 },
        ];
      case 'capa':
        return [
          { 'CAPA ID': 'CAPA-2023-001', Title: 'Temperature Control Deviation', Status: 'Closed', Priority: 'High', Source: 'Audit', 'Created Date': '2023-04-12', 'Days Open': 15 },
          { 'CAPA ID': 'CAPA-2023-008', Title: 'Missing Training Records', Status: 'Open', Priority: 'Medium', Source: 'Internal Audit', 'Created Date': '2023-07-18', 'Days Open': 42 },
          { 'CAPA ID': 'CAPA-2023-012', Title: 'Allergen Cross-Contact Risk', Status: 'In Progress', Priority: 'Critical', Source: 'Complaint', 'Created Date': '2023-08-05', 'Days Open': 24 },
        ];
      default:
        return [];
    }
  };
  
  const visualizationOptions = [
    { id: 'table', name: 'Table', icon: <Table className="h-4 w-4" /> },
    { id: 'bar', name: 'Bar Chart', icon: <BarChart className="h-4 w-4" /> },
    { id: 'pie', name: 'Pie Chart', icon: <PieChart className="h-4 w-4" /> },
    { id: 'line', name: 'Line Chart', icon: <LineChart className="h-4 w-4" /> },
  ];
  
  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Custom Report Builder</CardTitle>
            <CardDescription>
              Create custom reports by selecting data sources, columns, and filters
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="data" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="data" className="flex items-center gap-2">
                  <Table className="h-4 w-4" />
                  <span>Data Source</span>
                </TabsTrigger>
                <TabsTrigger value="columns" className="flex items-center gap-2">
                  <List className="h-4 w-4" />
                  <span>Columns</span>
                </TabsTrigger>
                <TabsTrigger value="filters" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span>Filters</span>
                </TabsTrigger>
                <TabsTrigger value="visualization" className="flex items-center gap-2">
                  <BarChart className="h-4 w-4" />
                  <span>Visualization</span>
                </TabsTrigger>
                <TabsTrigger value="preview" className="flex items-center gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Preview</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="data">
                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-4">
                    <div className="col-span-3">
                      <Label htmlFor="report-name">Report Name</Label>
                      <Input 
                        id="report-name" 
                        placeholder="Enter report name" 
                        value={reportName} 
                        onChange={(e) => setReportName(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="report-format">Format</Label>
                      <Select value={reportFormat} onValueChange={setReportFormat}>
                        <SelectTrigger id="report-format">
                          <SelectValue placeholder="Select format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pdf">PDF</SelectItem>
                          <SelectItem value="excel">Excel</SelectItem>
                          <SelectItem value="csv">CSV</SelectItem>
                          <SelectItem value="html">HTML</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Select Data Source</Label>
                    <div className="grid grid-cols-3 gap-3 mt-2">
                      {dataSources.map((source) => (
                        <Button
                          key={source.id}
                          variant={dataSource === source.id ? "default" : "outline"}
                          className="justify-start h-auto py-3"
                          onClick={() => setDataSource(source.id)}
                        >
                          <div className="flex items-center">
                            {source.icon}
                            <span className="ml-2">{source.name}</span>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button 
                      onClick={() => setActiveTab('columns')}
                      disabled={!dataSource}
                      className="flex items-center"
                    >
                      Next: Select Columns
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="columns">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label>Available Columns</Label>
                      <Badge variant="outline">{selectedColumns.length} selected</Badge>
                    </div>
                    <ScrollArea className="h-72 border rounded-md p-4">
                      <div className="space-y-2">
                        {getAvailableColumns().map((column) => (
                          <div key={column} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`column-${column}`} 
                              checked={selectedColumns.includes(column)}
                              onCheckedChange={() => toggleColumnSelection(column)}
                            />
                            <Label htmlFor={`column-${column}`} className="cursor-pointer">
                              {column}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                  
                  <div className="flex justify-between pt-4">
                    <Button 
                      variant="outline"
                      onClick={() => setActiveTab('data')}
                    >
                      Back
                    </Button>
                    <Button 
                      onClick={() => setActiveTab('filters')}
                      disabled={selectedColumns.length === 0}
                      className="flex items-center"
                    >
                      Next: Define Filters
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="filters">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label>Filter Conditions</Label>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleAddFilter}
                      className="flex items-center"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Filter
                    </Button>
                  </div>
                  
                  {filterConditions.length === 0 ? (
                    <div className="border rounded-md p-8 text-center text-gray-500">
                      <Filter className="h-12 w-12 mx-auto mb-2 opacity-20" />
                      <p>No filters defined. Add filters to narrow down your report data.</p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={handleAddFilter}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Filter
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filterConditions.map((filter, index) => (
                        <div key={index} className="flex items-center gap-2 border p-3 rounded-md">
                          <Select value={filter.field} onValueChange={(value) => {
                            const newFilters = [...filterConditions];
                            newFilters[index].field = value;
                            setFilterConditions(newFilters);
                          }}>
                            <SelectTrigger className="w-[200px]">
                              <SelectValue placeholder="Select field" />
                            </SelectTrigger>
                            <SelectContent>
                              {selectedColumns.map((column) => (
                                <SelectItem key={column} value={column}>{column}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          
                          <Select value={filter.operator} onValueChange={(value) => {
                            const newFilters = [...filterConditions];
                            newFilters[index].operator = value;
                            setFilterConditions(newFilters);
                          }}>
                            <SelectTrigger className="w-[150px]">
                              <SelectValue placeholder="Operator" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="equals">Equals</SelectItem>
                              <SelectItem value="contains">Contains</SelectItem>
                              <SelectItem value="greater_than">Greater than</SelectItem>
                              <SelectItem value="less_than">Less than</SelectItem>
                              <SelectItem value="is_empty">Is empty</SelectItem>
                              <SelectItem value="not_empty">Not empty</SelectItem>
                            </SelectContent>
                          </Select>
                          
                          <Input 
                            placeholder="Value" 
                            className="flex-1"
                            value={filter.value}
                            onChange={(e) => {
                              const newFilters = [...filterConditions];
                              newFilters[index].value = e.target.value;
                              setFilterConditions(newFilters);
                            }}
                            disabled={filter.operator === 'is_empty' || filter.operator === 'not_empty'}
                          />
                          
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleRemoveFilter(index)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-red-500"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex justify-between pt-4">
                    <Button 
                      variant="outline"
                      onClick={() => setActiveTab('columns')}
                    >
                      Back
                    </Button>
                    <Button 
                      onClick={() => setActiveTab('visualization')}
                      className="flex items-center"
                    >
                      Next: Visualization
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="visualization">
                <div className="space-y-4">
                  <div>
                    <Label>Visualization Type</Label>
                    <div className="grid grid-cols-4 gap-3 mt-2">
                      {visualizationOptions.map((viz) => (
                        <Button
                          key={viz.id}
                          variant="outline"
                          className="justify-start h-auto py-3"
                        >
                          <div className="flex items-center">
                            {viz.icon}
                            <span className="ml-2">{viz.name}</span>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Chart Settings</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="x-axis" className="text-sm">X-Axis</Label>
                        <Select>
                          <SelectTrigger id="x-axis">
                            <SelectValue placeholder="Select field" />
                          </SelectTrigger>
                          <SelectContent>
                            {selectedColumns.map((column) => (
                              <SelectItem key={column} value={column}>{column}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="y-axis" className="text-sm">Y-Axis</Label>
                        <Select>
                          <SelectTrigger id="y-axis">
                            <SelectValue placeholder="Select field" />
                          </SelectTrigger>
                          <SelectContent>
                            {selectedColumns.map((column) => (
                              <SelectItem key={column} value={column}>{column}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Additional Options</Label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="show-legend" className="cursor-pointer">Show Legend</Label>
                        <Switch id="show-legend" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="show-grid" className="cursor-pointer">Show Grid Lines</Label>
                        <Switch id="show-grid" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="show-labels" className="cursor-pointer">Show Data Labels</Label>
                        <Switch id="show-labels" defaultChecked />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between pt-4">
                    <Button 
                      variant="outline"
                      onClick={() => setActiveTab('filters')}
                    >
                      Back
                    </Button>
                    <Button 
                      onClick={() => setActiveTab('preview')}
                      className="flex items-center"
                    >
                      Next: Preview
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="preview">
                <div className="space-y-4">
                  <div className="border rounded-md p-4">
                    <div className="font-medium text-lg mb-2">{reportName || "Untitled Report"}</div>
                    <ScrollArea className="h-72">
                      {dataSource && (
                        <TableUI>
                          <TableHeader>
                            <TableRow>
                              {selectedColumns.map((column) => (
                                <TableHead key={column}>{column}</TableHead>
                              ))}
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {getPreviewData().map((item, index) => (
                              <TableRow key={index}>
                                {selectedColumns.map((column) => (
                                  <TableCell key={column}>{(item as any)[column] || '-'}</TableCell>
                                ))}
                              </TableRow>
                            ))}
                          </TableBody>
                        </TableUI>
                      )}
                    </ScrollArea>
                  </div>
                  
                  <div className="flex justify-between pt-4">
                    <Button 
                      variant="outline"
                      onClick={() => setActiveTab('visualization')}
                    >
                      Back
                    </Button>
                    <div className="space-x-2">
                      <Button 
                        variant="outline"
                        onClick={handleSaveReport}
                        className="flex items-center"
                      >
                        <Save className="h-4 w-4 mr-1" />
                        Save Template
                      </Button>
                      <Button 
                        onClick={handleGenerateReport}
                        className="flex items-center"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Generate Report
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      <div className="col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Saved Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="border rounded-md p-3 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-sm">Monthly Compliance Summary</h4>
                    <p className="text-xs text-gray-500">Documents, Audits, CAPA</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-md p-3 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-sm">Training Compliance By Department</h4>
                    <p className="text-xs text-gray-500">Training</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-md p-3 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-sm">CAPA Effectiveness Analysis</h4>
                    <p className="text-xs text-gray-500">CAPA</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Reporting Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-2">
                <div className="bg-blue-100 text-blue-700 rounded-full p-1 mt-0.5">
                  <ChevronRight className="h-3 w-3" />
                </div>
                <p>Use filters to focus on specific time periods or statuses</p>
              </div>
              
              <div className="flex items-start space-x-2">
                <div className="bg-blue-100 text-blue-700 rounded-full p-1 mt-0.5">
                  <ChevronRight className="h-3 w-3" />
                </div>
                <p>Bar charts work best for comparing values across categories</p>
              </div>
              
              <div className="flex items-start space-x-2">
                <div className="bg-blue-100 text-blue-700 rounded-full p-1 mt-0.5">
                  <ChevronRight className="h-3 w-3" />
                </div>
                <p>Pie charts are ideal for showing proportions of a whole</p>
              </div>
              
              <div className="flex items-start space-x-2">
                <div className="bg-blue-100 text-blue-700 rounded-full p-1 mt-0.5">
                  <ChevronRight className="h-3 w-3" />
                </div>
                <p>Save your common report templates for quick access</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportBuilder;
