
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { 
  BarChart2, 
  PieChart, 
  LineChart, 
  Table as TableIcon, 
  Plus, 
  Trash, 
  ArrowRight, 
  Copy, 
  Save,
  Download,
  FileText,
  Settings,
  CalendarDays,
  Eye
} from 'lucide-react';

interface FieldOption {
  id: string;
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean';
  module: string;
}

interface ModuleOption {
  id: string;
  name: string;
  description: string;
  fields: FieldOption[];
}

const ReportBuilder = () => {
  const { toast } = useToast();
  const [reportName, setReportName] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [selectedModule, setSelectedModule] = useState<string>('');
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<{field: string, operator: string, value: string}[]>([]);
  const [chartType, setChartType] = useState('table');
  const [isScheduled, setIsScheduled] = useState(false);
  const [frequency, setFrequency] = useState('weekly');
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // Module options with their available fields
  const moduleOptions: ModuleOption[] = [
    {
      id: 'training',
      name: 'Training',
      description: 'Training records and courses data',
      fields: [
        { id: 'employee', name: 'Employee Name', type: 'string', module: 'training' },
        { id: 'course', name: 'Course Name', type: 'string', module: 'training' },
        { id: 'status', name: 'Status', type: 'string', module: 'training' },
        { id: 'dueDate', name: 'Due Date', type: 'date', module: 'training' },
        { id: 'completionDate', name: 'Completion Date', type: 'date', module: 'training' },
        { id: 'department', name: 'Department', type: 'string', module: 'training' },
        { id: 'score', name: 'Score', type: 'number', module: 'training' }
      ]
    },
    {
      id: 'documents',
      name: 'Documents',
      description: 'Document control and management data',
      fields: [
        { id: 'documentNumber', name: 'Document Number', type: 'string', module: 'documents' },
        { id: 'title', name: 'Title', type: 'string', module: 'documents' },
        { id: 'type', name: 'Document Type', type: 'string', module: 'documents' },
        { id: 'status', name: 'Status', type: 'string', module: 'documents' },
        { id: 'approvedDate', name: 'Approved Date', type: 'date', module: 'documents' },
        { id: 'reviewDate', name: 'Review Date', type: 'date', module: 'documents' },
        { id: 'department', name: 'Department', type: 'string', module: 'documents' }
      ]
    },
    {
      id: 'audits',
      name: 'Audits',
      description: 'Internal and external audit data',
      fields: [
        { id: 'auditNumber', name: 'Audit Number', type: 'string', module: 'audits' },
        { id: 'auditType', name: 'Audit Type', type: 'string', module: 'audits' },
        { id: 'auditDate', name: 'Audit Date', type: 'date', module: 'audits' },
        { id: 'findings', name: 'Findings Count', type: 'number', module: 'audits' },
        { id: 'status', name: 'Status', type: 'string', module: 'audits' },
        { id: 'auditor', name: 'Auditor', type: 'string', module: 'audits' },
        { id: 'facility', name: 'Facility', type: 'string', module: 'audits' }
      ]
    },
    {
      id: 'nonconformance',
      name: 'Non-Conformances',
      description: 'Non-conformance and corrective actions data',
      fields: [
        { id: 'ncNumber', name: 'NC Number', type: 'string', module: 'nonconformance' },
        { id: 'description', name: 'Description', type: 'string', module: 'nonconformance' },
        { id: 'category', name: 'Category', type: 'string', module: 'nonconformance' },
        { id: 'severity', name: 'Severity', type: 'string', module: 'nonconformance' },
        { id: 'status', name: 'Status', type: 'string', module: 'nonconformance' },
        { id: 'identifiedDate', name: 'Identified Date', type: 'date', module: 'nonconformance' },
        { id: 'dueDate', name: 'Due Date', type: 'date', module: 'nonconformance' },
        { id: 'department', name: 'Department', type: 'string', module: 'nonconformance' }
      ]
    }
  ];

  // Get fields for currently selected module
  const getAvailableFields = () => {
    const module = moduleOptions.find(mod => mod.id === selectedModule);
    return module ? module.fields : [];
  };

  // Mock data for preview based on selected module
  const generatePreviewData = () => {
    const mockData: any[] = [];
    const selectedFieldOptions = getAvailableFields().filter(field => 
      selectedFields.includes(field.id)
    );
    
    // Generate 5 rows of mock data
    for (let i = 0; i < 5; i++) {
      const row: Record<string, any> = {};
      
      selectedFieldOptions.forEach(field => {
        switch (field.type) {
          case 'string':
            if (field.name.includes('Status')) {
              const statuses = ['Completed', 'In Progress', 'Not Started', 'Overdue'];
              row[field.id] = statuses[Math.floor(Math.random() * statuses.length)];
            } 
            else if (field.name.includes('Department')) {
              const departments = ['Production', 'Quality', 'Operations', 'Maintenance'];
              row[field.id] = departments[Math.floor(Math.random() * departments.length)];
            }
            else {
              row[field.id] = `${field.name} ${i + 1}`;
            }
            break;
          case 'number':
            row[field.id] = Math.floor(Math.random() * 100);
            break;
          case 'date':
            const date = new Date();
            date.setDate(date.getDate() - Math.floor(Math.random() * 30));
            row[field.id] = date.toISOString().split('T')[0];
            break;
          case 'boolean':
            row[field.id] = Math.random() > 0.5;
            break;
          default:
            row[field.id] = `${field.name} ${i + 1}`;
        }
      });
      
      mockData.push(row);
    }
    
    return mockData;
  };

  const handleShowPreview = () => {
    if (!selectedModule || selectedFields.length === 0) {
      toast({
        title: "Cannot generate preview",
        description: "Please select a module and at least one field",
        variant: "destructive"
      });
      return;
    }
    
    const data = generatePreviewData();
    setPreviewData(data);
    setShowPreview(true);
  };

  const handleAddField = (fieldId: string) => {
    if (!selectedFields.includes(fieldId)) {
      setSelectedFields([...selectedFields, fieldId]);
    }
  };

  const handleRemoveField = (fieldId: string) => {
    setSelectedFields(selectedFields.filter(id => id !== fieldId));
    // Also remove any filters using this field
    setSelectedFilters(selectedFilters.filter(filter => filter.field !== fieldId));
  };

  const handleAddFilter = () => {
    if (selectedFields.length === 0) {
      toast({
        title: "Cannot add filter",
        description: "Please select at least one field first",
      });
      return;
    }
    
    setSelectedFilters([
      ...selectedFilters, 
      { field: selectedFields[0], operator: '=', value: '' }
    ]);
  };

  const handleRemoveFilter = (index: number) => {
    const newFilters = [...selectedFilters];
    newFilters.splice(index, 1);
    setSelectedFilters(newFilters);
  };

  const handleUpdateFilter = (index: number, key: string, value: string) => {
    const newFilters = [...selectedFilters];
    newFilters[index] = { ...newFilters[index], [key]: value };
    setSelectedFilters(newFilters);
  };

  const handleGenerateReport = () => {
    if (!reportName) {
      toast({
        title: "Report name required",
        description: "Please enter a name for your report",
        variant: "destructive"
      });
      return;
    }
    
    if (!selectedModule || selectedFields.length === 0) {
      toast({
        title: "Cannot generate report",
        description: "Please select a module and at least one field",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Report Generated",
      description: `"${reportName}" has been created successfully.`,
    });
    
    // Reset form for a new report after submission
    setShowPreview(false);
  };

  const handleSaveReport = () => {
    if (!reportName) {
      toast({
        title: "Report name required",
        description: "Please enter a name for your report",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Report Saved",
      description: `"${reportName}" has been saved to your reports.`,
    });
  };

  const renderChartPreview = () => {
    if (previewData.length === 0) return null;
    
    switch (chartType) {
      case 'bar':
        return (
          <div className="flex items-center justify-center h-80 border rounded-md bg-muted/20">
            <div className="text-center">
              <BarChart2 className="h-16 w-16 mx-auto text-primary/50" />
              <p className="mt-2 text-muted-foreground">Bar Chart Preview</p>
              <p className="text-xs text-muted-foreground">
                (This would be an actual chart in a production application)
              </p>
            </div>
          </div>
        );
      case 'pie':
        return (
          <div className="flex items-center justify-center h-80 border rounded-md bg-muted/20">
            <div className="text-center">
              <PieChart className="h-16 w-16 mx-auto text-primary/50" />
              <p className="mt-2 text-muted-foreground">Pie Chart Preview</p>
              <p className="text-xs text-muted-foreground">
                (This would be an actual chart in a production application)
              </p>
            </div>
          </div>
        );
      case 'line':
        return (
          <div className="flex items-center justify-center h-80 border rounded-md bg-muted/20">
            <div className="text-center">
              <LineChart className="h-16 w-16 mx-auto text-primary/50" />
              <p className="mt-2 text-muted-foreground">Line Chart Preview</p>
              <p className="text-xs text-muted-foreground">
                (This would be an actual chart in a production application)
              </p>
            </div>
          </div>
        );
      case 'table':
      default:
        return (
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  {selectedFields.map(fieldId => {
                    const field = getAvailableFields().find(f => f.id === fieldId);
                    return (
                      <TableHead key={fieldId} className="whitespace-nowrap">
                        {field?.name || fieldId}
                      </TableHead>
                    );
                  })}
                </TableRow>
              </TableHeader>
              <TableBody>
                {previewData.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {selectedFields.map(fieldId => (
                      <TableCell key={`${rowIndex}-${fieldId}`}>
                        {fieldId === 'status' ? (
                          <Badge 
                            variant="outline"
                            className={
                              row[fieldId] === 'Completed' ? 'bg-green-100 text-green-800' :
                              row[fieldId] === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                              row[fieldId] === 'Overdue' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }
                          >
                            {row[fieldId]}
                          </Badge>
                        ) : (
                          row[fieldId]
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-medium">Report Builder</h3>
          <p className="text-sm text-muted-foreground">Create custom reports across all system modules</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handleSaveReport} disabled={!reportName || selectedFields.length === 0}>
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
          <Button onClick={handleGenerateReport} disabled={!reportName || selectedFields.length === 0}>
            <FileText className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Report Details</CardTitle>
              <CardDescription>Basic information about your report</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Report Name</Label>
                  <Input 
                    id="name" 
                    placeholder="Enter a name for your report" 
                    value={reportName}
                    onChange={(e) => setReportName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description (optional)</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Enter a description for your report"
                    value={reportDescription}
                    onChange={(e) => setReportDescription(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Configuration</CardTitle>
              <CardDescription>Select data source and fields</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="module">Data Source</Label>
                <Select value={selectedModule} onValueChange={(value) => {
                  setSelectedModule(value);
                  setSelectedFields([]);
                  setSelectedFilters([]);
                }}>
                  <SelectTrigger id="module">
                    <SelectValue placeholder="Select a module" />
                  </SelectTrigger>
                  <SelectContent>
                    {moduleOptions.map(module => (
                      <SelectItem key={module.id} value={module.id}>
                        {module.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedModule && (
                  <p className="text-xs text-muted-foreground">
                    {moduleOptions.find(mod => mod.id === selectedModule)?.description}
                  </p>
                )}
              </div>
              
              {selectedModule && (
                <>
                  <div className="border rounded-md">
                    <div className="p-4 border-b">
                      <h4 className="font-medium">Available Fields</h4>
                      <p className="text-xs text-muted-foreground">Select fields to include in your report</p>
                    </div>
                    <ScrollArea className="h-56 p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {getAvailableFields().map(field => (
                          <div 
                            key={field.id}
                            className={`flex items-center justify-between p-2 rounded-md border ${
                              selectedFields.includes(field.id) ? 'border-primary bg-primary/5' : ''
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <Checkbox 
                                checked={selectedFields.includes(field.id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    handleAddField(field.id);
                                  } else {
                                    handleRemoveField(field.id);
                                  }
                                }}
                                id={`field-${field.id}`}
                              />
                              <Label 
                                htmlFor={`field-${field.id}`} 
                                className="text-sm cursor-pointer flex-1"
                              >
                                {field.name}
                                <span className="ml-1 text-xs text-muted-foreground">({field.type})</span>
                              </Label>
                            </div>
                            {selectedFields.includes(field.id) && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-6 w-6 p-0" 
                                onClick={() => handleRemoveField(field.id)}
                              >
                                <Trash className="h-3 w-3" />
                                <span className="sr-only">Remove</span>
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">Filters</h4>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleAddFilter}
                        disabled={selectedFields.length === 0}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Filter
                      </Button>
                    </div>
                    
                    {selectedFilters.length === 0 ? (
                      <div className="text-center p-6 border rounded-md text-sm text-muted-foreground">
                        No filters applied. Click "Add Filter" to add one.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {selectedFilters.map((filter, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 border rounded-md">
                            <Select 
                              value={filter.field} 
                              onValueChange={(value) => handleUpdateFilter(index, 'field', value)}
                            >
                              <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Field" />
                              </SelectTrigger>
                              <SelectContent>
                                {selectedFields.map(fieldId => {
                                  const field = getAvailableFields().find(f => f.id === fieldId);
                                  return (
                                    <SelectItem key={fieldId} value={fieldId}>
                                      {field?.name || fieldId}
                                    </SelectItem>
                                  );
                                })}
                              </SelectContent>
                            </Select>
                            
                            <Select 
                              value={filter.operator} 
                              onValueChange={(value) => handleUpdateFilter(index, 'operator', value)}
                            >
                              <SelectTrigger className="w-[100px]">
                                <SelectValue placeholder="Operator" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="=">=</SelectItem>
                                <SelectItem value="!=">!=</SelectItem>
                                <SelectItem value=">">{">"}</SelectItem>
                                <SelectItem value="<">{"<"}</SelectItem>
                                <SelectItem value="contains">Contains</SelectItem>
                              </SelectContent>
                            </Select>
                            
                            <Input 
                              className="flex-1"
                              placeholder="Value"
                              value={filter.value}
                              onChange={(e) => handleUpdateFilter(index, 'value', e.target.value)}
                            />
                            
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleRemoveFilter(index)}
                            >
                              <Trash className="h-4 w-4" />
                              <span className="sr-only">Remove filter</span>
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Visualization Options</CardTitle>
              <CardDescription>Choose how to display your report data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Chart Type</Label>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant={chartType === 'table' ? 'default' : 'outline'} 
                      className="flex-1"
                      onClick={() => setChartType('table')}
                    >
                      <TableIcon className="h-4 w-4 mr-2" />
                      Table
                    </Button>
                    <Button 
                      variant={chartType === 'bar' ? 'default' : 'outline'} 
                      className="flex-1"
                      onClick={() => setChartType('bar')}
                    >
                      <BarChart2 className="h-4 w-4 mr-2" />
                      Bar Chart
                    </Button>
                    <Button 
                      variant={chartType === 'line' ? 'default' : 'outline'} 
                      className="flex-1"
                      onClick={() => setChartType('line')}
                    >
                      <LineChart className="h-4 w-4 mr-2" />
                      Line Chart
                    </Button>
                    <Button 
                      variant={chartType === 'pie' ? 'default' : 'outline'} 
                      className="flex-1"
                      onClick={() => setChartType('pie')}
                    >
                      <PieChart className="h-4 w-4 mr-2" />
                      Pie Chart
                    </Button>
                  </div>
                </div>
                
                {chartType === 'table' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="sortBy">Sort By</Label>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger id="sortBy">
                          <SelectValue placeholder="Select a field" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">None</SelectItem>
                          {selectedFields.map(fieldId => {
                            const field = getAvailableFields().find(f => f.id === fieldId);
                            return (
                              <SelectItem key={fieldId} value={fieldId}>
                                {field?.name || fieldId}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {sortBy && (
                      <div className="space-y-2">
                        <Label>Sort Order</Label>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="asc" 
                              checked={sortOrder === 'asc'} 
                              onCheckedChange={() => setSortOrder('asc')}
                            />
                            <Label htmlFor="asc">Ascending</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="desc" 
                              checked={sortOrder === 'desc'} 
                              onCheckedChange={() => setSortOrder('desc')}
                            />
                            <Label htmlFor="desc">Descending</Label>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="scheduled">Schedule Report</Label>
                      <p className="text-xs text-muted-foreground">
                        Automatically generate and send this report on a schedule
                      </p>
                    </div>
                    <Switch 
                      id="scheduled" 
                      checked={isScheduled}
                      onCheckedChange={setIsScheduled}
                    />
                  </div>
                  
                  {isScheduled && (
                    <div className="space-y-2 p-4 border rounded-md">
                      <Label htmlFor="frequency">Frequency</Label>
                      <Select value={frequency} onValueChange={setFrequency}>
                        <SelectTrigger id="frequency">
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <Button variant="outline" onClick={() => setShowPreview(false)} disabled={!showPreview}>
                <Settings className="mr-2 h-4 w-4" />
                Configure Report
              </Button>
              <Button onClick={handleShowPreview} disabled={selectedFields.length === 0}>
                <Eye className="mr-2 h-4 w-4" />
                Preview Report
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Report Preview</CardTitle>
              <CardDescription>
                {showPreview 
                  ? 'A preview of your generated report' 
                  : 'Configure your report and click "Preview Report" to see a preview'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {showPreview ? (
                renderChartPreview()
              ) : (
                <div className="text-center p-8 border rounded-md">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p className="text-muted-foreground">No preview available</p>
                  <p className="text-xs text-muted-foreground mt-1">Configure your report and click Preview</p>
                </div>
              )}
            </CardContent>
            {showPreview && (
              <CardFooter className="flex justify-between border-t pt-6">
                <Button variant="outline" className="w-full" onClick={() => handleSaveReport()}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Report
                </Button>
                <Button className="w-full ml-2" onClick={() => handleGenerateReport()}>
                  <Download className="mr-2 h-4 w-4" />
                  Generate
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReportBuilder;
