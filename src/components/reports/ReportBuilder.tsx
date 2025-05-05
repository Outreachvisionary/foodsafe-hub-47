
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { BarChart2, LineChart, PieChart, Table2, Save, Download, Eye, FilePlus2, Calendar } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const ReportBuilder = () => {
  const [reportTitle, setReportTitle] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [selectedModule, setSelectedModule] = useState('');
  const [visualizationType, setVisualizationType] = useState('table');
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [activeStep, setActiveStep] = useState('define');
  const [showPreview, setShowPreview] = useState(false);

  const modules = [
    { id: 'documents', name: 'Documents' },
    { id: 'training', name: 'Training' },
    { id: 'capa', name: 'CAPA' },
    { id: 'audits', name: 'Audits' },
    { id: 'non-conformance', name: 'Non-Conformance' },
    { id: 'complaints', name: 'Complaints' },
    { id: 'suppliers', name: 'Suppliers' },
  ];

  const fields: Record<string, string[]> = {
    documents: ['Title', 'Category', 'Created Date', 'Expiry Date', 'Status', 'Version'],
    training: ['Course Name', 'Completion Rate', 'Due Date', 'Session Type', 'Assigned Users'],
    capa: ['Title', 'Status', 'Due Date', 'Priority', 'Source', 'Department'],
    audits: ['Title', 'Status', 'Due Date', 'Findings', 'Assigned To', 'Completion Date'],
    'non-conformance': ['Title', 'Status', 'Reported Date', 'Category', 'Risk Level', 'Department'],
    complaints: ['Title', 'Status', 'Report Date', 'Category', 'Product', 'Customer'],
    suppliers: ['Name', 'Category', 'Risk Score', 'Compliance Status', 'Last Audit Date', 'Products'],
  };

  const handleFieldToggle = (field: string) => {
    setSelectedFields((prev) =>
      prev.includes(field)
        ? prev.filter((f) => f !== field)
        : [...prev, field]
    );
  };

  const handleSave = () => {
    if (!reportTitle) {
      toast({
        title: "Report title required",
        description: "Please provide a title for your report.",
        variant: "destructive",
      });
      return;
    }
    
    if (!selectedModule) {
      toast({
        title: "Module selection required",
        description: "Please select a module for your report data.",
        variant: "destructive",
      });
      return;
    }
    
    if (selectedFields.length === 0) {
      toast({
        title: "Fields required",
        description: "Please select at least one field for your report.",
        variant: "destructive",
      });
      return;
    }

    // In a real application, this would save the report definition
    console.log({
      title: reportTitle,
      description: reportDescription,
      module: selectedModule,
      fields: selectedFields,
      visualization: visualizationType,
    });

    toast({
      title: "Report saved successfully",
      description: "Your custom report has been saved and is now available.",
    });
  };

  const handleSchedule = () => {
    if (!reportTitle) {
      toast({
        title: "Report title required",
        description: "Please provide a title for your report before scheduling.",
        variant: "destructive",
      });
      return;
    }

    // In a real application, this would open a schedule dialog
    toast({
      title: "Schedule report",
      description: "Your report has been scheduled for regular generation.",
    });
  };

  const handlePreview = () => {
    if (selectedFields.length === 0) {
      toast({
        title: "No fields selected",
        description: "Please select at least one field to preview the report.",
        variant: "destructive",
      });
      return;
    }

    setShowPreview(true);
  };

  const renderVisualizationIcon = () => {
    switch (visualizationType) {
      case 'bar':
        return <BarChart2 className="h-16 w-16 text-muted-foreground" />;
      case 'line':
        return <LineChart className="h-16 w-16 text-muted-foreground" />;
      case 'pie':
        return <PieChart className="h-16 w-16 text-muted-foreground" />;
      default:
        return <Table2 className="h-16 w-16 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Report Builder</h3>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePreview}>
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button variant="outline" onClick={handleSchedule}>
            <Calendar className="h-4 w-4 mr-2" />
            Schedule
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Report
          </Button>
        </div>
      </div>

      <Tabs value={activeStep} onValueChange={setActiveStep}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="define">1. Define Report</TabsTrigger>
          <TabsTrigger value="configure">2. Configure Data</TabsTrigger>
          <TabsTrigger value="visualize">3. Visualize</TabsTrigger>
        </TabsList>
        
        <TabsContent value="define">
          <Card>
            <CardHeader>
              <CardTitle>Define Report</CardTitle>
              <CardDescription>Set the basic information for your custom report</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="report-title">Report Title</Label>
                <Input
                  id="report-title"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  placeholder="Enter report title"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="report-description">Description</Label>
                <Textarea
                  id="report-description"
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  placeholder="Enter a brief description of the report"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="module">Data Source Module</Label>
                <Select value={selectedModule} onValueChange={setSelectedModule}>
                  <SelectTrigger id="module">
                    <SelectValue placeholder="Select module" />
                  </SelectTrigger>
                  <SelectContent>
                    {modules.map((module) => (
                      <SelectItem key={module.id} value={module.id}>
                        {module.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={() => setActiveStep("configure")}>Continue</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="configure">
          <Card>
            <CardHeader>
              <CardTitle>Configure Data</CardTitle>
              <CardDescription>Select the fields and apply filters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedModule ? (
                <>
                  <div className="space-y-3">
                    <Label>Select Fields</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {fields[selectedModule]?.map((field) => (
                        <div className="flex items-center space-x-2" key={field}>
                          <Checkbox
                            id={`field-${field}`}
                            checked={selectedFields.includes(field)}
                            onCheckedChange={() => handleFieldToggle(field)}
                          />
                          <Label htmlFor={`field-${field}`} className="cursor-pointer">
                            {field}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Filters</Label>
                    <Card className="bg-muted/50">
                      <CardContent className="p-4 flex flex-col items-center justify-center">
                        <FilePlus2 className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">Add filters to refine your report data</p>
                        <Button variant="outline" size="sm" className="mt-2">
                          Add Filter
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">Please select a module in the Define Report step first</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveStep("define")}>Back</Button>
              <Button onClick={() => setActiveStep("visualize")}>Continue</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="visualize">
          <Card>
            <CardHeader>
              <CardTitle>Visualize Data</CardTitle>
              <CardDescription>Choose how to display your report data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Visualization Type</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                  {['table', 'bar', 'line', 'pie'].map((type) => (
                    <Card
                      key={type}
                      className={`cursor-pointer hover:border-primary transition-colors ${
                        visualizationType === type ? 'border-2 border-primary' : ''
                      }`}
                      onClick={() => setVisualizationType(type)}
                    >
                      <CardContent className="p-4 flex flex-col items-center justify-center">
                        {type === 'table' && <Table2 className="h-8 w-8 mb-2" />}
                        {type === 'bar' && <BarChart2 className="h-8 w-8 mb-2" />}
                        {type === 'line' && <LineChart className="h-8 w-8 mb-2" />}
                        {type === 'pie' && <PieChart className="h-8 w-8 mb-2" />}
                        <span className="text-sm capitalize">{type} Chart</span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Additional Settings</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="show-legend" />
                    <Label htmlFor="show-legend">Show Legend</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="show-grid" />
                    <Label htmlFor="show-grid">Show Grid Lines</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="show-values" defaultChecked />
                    <Label htmlFor="show-values">Show Data Values</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="enable-export" defaultChecked />
                    <Label htmlFor="enable-export">Enable Export</Label>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveStep("configure")}>Back</Button>
              <Button onClick={handleSave}>Save Report</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {showPreview && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{reportTitle || "Untitled Report"}</CardTitle>
              <CardDescription>
                {reportDescription || "Report preview based on selected configuration"}
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowPreview(false)}>
              Close Preview
            </Button>
          </CardHeader>
          <CardContent className="min-h-[400px] flex flex-col items-center justify-center">
            {renderVisualizationIcon()}
            <h4 className="mt-4 text-lg font-medium">Report Preview</h4>
            <p className="text-sm text-muted-foreground mt-2 text-center max-w-md">
              In a full implementation, this would display a live preview of your report with sample data based on your configured settings.
            </p>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default ReportBuilder;
