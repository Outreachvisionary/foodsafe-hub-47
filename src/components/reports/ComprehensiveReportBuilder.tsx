
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { BarChart3, FileText, Download, Calendar, Filter, Settings } from 'lucide-react';

interface ReportField {
  id: string;
  name: string;
  category: string;
  type: 'text' | 'number' | 'date' | 'status';
}

const ComprehensiveReportBuilder: React.FC = () => {
  const { toast } = useToast();
  const [selectedModule, setSelectedModule] = useState('');
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [reportType, setReportType] = useState('summary');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const moduleFields: Record<string, ReportField[]> = {
    documents: [
      { id: 'doc_title', name: 'Document Title', category: 'Basic', type: 'text' },
      { id: 'doc_status', name: 'Status', category: 'Basic', type: 'status' },
      { id: 'doc_category', name: 'Category', category: 'Basic', type: 'text' },
      { id: 'doc_created', name: 'Created Date', category: 'Dates', type: 'date' },
      { id: 'doc_version', name: 'Version', category: 'Basic', type: 'number' },
      { id: 'doc_expiry', name: 'Expiry Date', category: 'Dates', type: 'date' }
    ],
    audits: [
      { id: 'audit_title', name: 'Audit Title', category: 'Basic', type: 'text' },
      { id: 'audit_type', name: 'Audit Type', category: 'Basic', type: 'text' },
      { id: 'audit_status', name: 'Status', category: 'Basic', type: 'status' },
      { id: 'audit_start', name: 'Start Date', category: 'Dates', type: 'date' },
      { id: 'audit_findings', name: 'Findings Count', category: 'Metrics', type: 'number' }
    ],
    capa: [
      { id: 'capa_title', name: 'CAPA Title', category: 'Basic', type: 'text' },
      { id: 'capa_priority', name: 'Priority', category: 'Basic', type: 'text' },
      { id: 'capa_status', name: 'Status', category: 'Basic', type: 'status' },
      { id: 'capa_source', name: 'Source', category: 'Basic', type: 'text' },
      { id: 'capa_due', name: 'Due Date', category: 'Dates', type: 'date' }
    ],
    training: [
      { id: 'training_title', name: 'Training Title', category: 'Basic', type: 'text' },
      { id: 'training_type', name: 'Training Type', category: 'Basic', type: 'text' },
      { id: 'training_status', name: 'Status', category: 'Basic', type: 'status' },
      { id: 'training_completion', name: 'Completion Rate', category: 'Metrics', type: 'number' }
    ],
    'non-conformance': [
      { id: 'nc_title', name: 'NC Title', category: 'Basic', type: 'text' },
      { id: 'nc_category', name: 'Category', category: 'Basic', type: 'text' },
      { id: 'nc_status', name: 'Status', category: 'Basic', type: 'status' },
      { id: 'nc_quantity', name: 'Quantity', category: 'Metrics', type: 'number' }
    ]
  };

  const handleFieldToggle = (fieldId: string) => {
    setSelectedFields(prev => 
      prev.includes(fieldId) 
        ? prev.filter(id => id !== fieldId)
        : [...prev, fieldId]
    );
  };

  const generateReport = () => {
    if (!selectedModule || selectedFields.length === 0) {
      toast({
        title: "Configuration Required",
        description: "Please select a module and at least one field",
        variant: "destructive"
      });
      return;
    }

    // Mock report generation
    const reportData = {
      module: selectedModule,
      fields: selectedFields,
      type: reportType,
      dateRange,
      generatedAt: new Date().toISOString()
    };

    console.log('Generating report:', reportData);

    toast({
      title: "Report Generated",
      description: `${reportType} report for ${selectedModule} has been generated successfully`
    });
  };

  const exportReport = (format: 'pdf' | 'excel' | 'csv') => {
    toast({
      title: "Export Started",
      description: `Report is being exported as ${format.toUpperCase()}`
    });
  };

  const currentFields = selectedModule ? moduleFields[selectedModule] || [] : [];
  const fieldsByCategory = currentFields.reduce((acc, field) => {
    if (!acc[field.category]) acc[field.category] = [];
    acc[field.category].push(field);
    return acc;
  }, {} as Record<string, ReportField[]>);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Comprehensive Report Builder
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="configure" className="space-y-4">
            <TabsList>
              <TabsTrigger value="configure">Configure</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
            </TabsList>

            <TabsContent value="configure" className="space-y-6">
              {/* Module Selection */}
              <div>
                <label className="text-sm font-medium mb-2 block">Select Module</label>
                <Select value={selectedModule} onValueChange={setSelectedModule}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a module to report on" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="documents">Documents</SelectItem>
                    <SelectItem value="audits">Audits</SelectItem>
                    <SelectItem value="capa">CAPA</SelectItem>
                    <SelectItem value="training">Training</SelectItem>
                    <SelectItem value="non-conformance">Non-Conformance</SelectItem>
                    <SelectItem value="complaints">Complaints</SelectItem>
                    <SelectItem value="suppliers">Suppliers</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Report Type */}
              <div>
                <label className="text-sm font-medium mb-2 block">Report Type</label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="summary">Summary Report</SelectItem>
                    <SelectItem value="detailed">Detailed Report</SelectItem>
                    <SelectItem value="trends">Trend Analysis</SelectItem>
                    <SelectItem value="compliance">Compliance Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Start Date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">End Date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                  />
                </div>
              </div>

              {/* Field Selection */}
              {selectedModule && (
                <div>
                  <label className="text-sm font-medium mb-4 block">Select Fields to Include</label>
                  <div className="space-y-4">
                    {Object.entries(fieldsByCategory).map(([category, fields]) => (
                      <div key={category}>
                        <h4 className="font-medium text-sm mb-2">{category}</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {fields.map((field) => (
                            <div key={field.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={field.id}
                                checked={selectedFields.includes(field.id)}
                                onCheckedChange={() => handleFieldToggle(field.id)}
                              />
                              <label
                                htmlFor={field.id}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {field.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Selected Fields Summary */}
              {selectedFields.length > 0 && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Selected Fields ({selectedFields.length})</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedFields.map((fieldId) => {
                      const field = currentFields.find(f => f.id === fieldId);
                      return field ? (
                        <Badge key={fieldId} variant="secondary">
                          {field.name}
                        </Badge>
                      ) : null;
                    })}
                  </div>
                </div>
              )}

              {/* Generate Button */}
              <div className="flex gap-2">
                <Button onClick={generateReport} className="flex-1">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
                <Button variant="outline" onClick={() => exportReport('pdf')}>
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
                <Button variant="outline" onClick={() => exportReport('excel')}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Excel
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="preview">
              <Card>
                <CardHeader>
                  <CardTitle>Report Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedModule && selectedFields.length > 0 ? (
                    <div>
                      <div className="mb-4">
                        <h4 className="font-medium">Report Configuration</h4>
                        <p className="text-sm text-muted-foreground">
                          Module: {selectedModule} | Type: {reportType} | Fields: {selectedFields.length}
                        </p>
                      </div>
                      
                      <div className="border rounded-lg p-4 bg-gray-50">
                        <p className="text-sm text-center text-muted-foreground">
                          Report preview will appear here after generation
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground">
                      Configure your report settings to see a preview
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="schedule">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Schedule Recurring Reports
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Frequency</label>
                      <Select defaultValue="monthly">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Recipients</label>
                      <input
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="Enter email addresses separated by commas"
                      />
                    </div>
                    
                    <Button>
                      <Settings className="h-4 w-4 mr-2" />
                      Schedule Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComprehensiveReportBuilder;
