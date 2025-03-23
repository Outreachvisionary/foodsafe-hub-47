
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  Download, 
  FileText, 
  ListFilter, 
  PieChart as PieChartIcon, 
  Printer, 
  Calendar,
  FileBarChart,
  ClipboardList,
  AlertTriangle,
  Copy
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

const CAPAReports: React.FC = () => {
  const [dateRange, setDateRange] = useState('last-30');
  const [department, setDepartment] = useState('all');
  const [reportFormat, setReportFormat] = useState('pdf');
  const { toast } = useToast();
  
  const handleGenerateReport = (reportType: string) => {
    toast({
      title: `Generating ${reportType} Report`,
      description: "Your report is being generated. It will be available for download shortly."
    });
  };
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="standard">
        <TabsList className="mb-6">
          <TabsTrigger value="standard">Standard Reports</TabsTrigger>
          <TabsTrigger value="regulatory">Regulatory Reports</TabsTrigger>
          <TabsTrigger value="custom">Custom Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="standard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base flex items-center">
                      <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                      CAPA Status Summary
                    </CardTitle>
                    <CardDescription>
                      Overview of all CAPAs by status
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-36 flex items-center justify-center bg-gray-50 rounded-md border mb-4">
                  <div className="text-center">
                    <PieChartIcon className="h-10 w-10 mx-auto text-gray-300" />
                    <p className="text-xs text-gray-500 mt-1">Status distribution chart</p>
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Open</span>
                    <span>12 (24%)</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>In Progress</span>
                    <span>18 (36%)</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Closed</span>
                    <span>15 (30%)</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Verified</span>
                    <span>5 (10%)</span>
                  </div>
                </div>
                <Button 
                  className="w-full mt-4"
                  variant="outline"
                  onClick={() => handleGenerateReport('Status Summary')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Report
                </Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base flex items-center">
                      <FileBarChart className="h-5 w-5 mr-2 text-purple-600" />
                      Source Analysis
                    </CardTitle>
                    <CardDescription>
                      CAPAs by source and priority
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-36 flex items-center justify-center bg-gray-50 rounded-md border mb-4">
                  <div className="text-center">
                    <BarChart3 className="h-10 w-10 mx-auto text-gray-300" />
                    <p className="text-xs text-gray-500 mt-1">CAPA source breakdown</p>
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Audit</span>
                    <span>15 (30%)</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>HACCP</span>
                    <span>20 (40%)</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Supplier</span>
                    <span>8 (16%)</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Complaint</span>
                    <span>7 (14%)</span>
                  </div>
                </div>
                <Button 
                  className="w-full mt-4"
                  variant="outline"
                  onClick={() => handleGenerateReport('Source Analysis')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Report
                </Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base flex items-center">
                      <ClipboardList className="h-5 w-5 mr-2 text-green-600" />
                      Effectiveness Report
                    </CardTitle>
                    <CardDescription>
                      CAPA effectiveness metrics
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-36 flex items-center justify-center bg-gray-50 rounded-md border mb-4">
                  <div className="text-center">
                    <BarChart3 className="h-10 w-10 mx-auto text-gray-300" />
                    <p className="text-xs text-gray-500 mt-1">Effectiveness metrics</p>
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Effective</span>
                    <span>12 (60%)</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Partially Effective</span>
                    <span>6 (30%)</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Not Effective</span>
                    <span>2 (10%)</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Recurrence Rate</span>
                    <span>8%</span>
                  </div>
                </div>
                <Button 
                  className="w-full mt-4"
                  variant="outline"
                  onClick={() => handleGenerateReport('Effectiveness Report')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Report
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                Scheduled Reports
              </CardTitle>
              <CardDescription>
                Configure automated report generation and distribution
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-md p-4 bg-gray-50 flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Weekly CAPA Status Report</h4>
                    <p className="text-sm text-gray-600">Every Monday at 8:00 AM</p>
                    <div className="text-xs text-gray-500 mt-1">
                      Recipients: Quality Team, Management
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button variant="outline" size="sm">Disable</Button>
                  </div>
                </div>
                
                <div className="border rounded-md p-4 bg-gray-50 flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Monthly Effectiveness Summary</h4>
                    <p className="text-sm text-gray-600">1st day of month at 9:00 AM</p>
                    <div className="text-xs text-gray-500 mt-1">
                      Recipients: Executive Team, Department Heads
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button variant="outline" size="sm">Disable</Button>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full">
                  Schedule New Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="regulatory" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-blue-600" />
                  FSMA 204 Compliance Report
                </CardTitle>
                <CardDescription>
                  Generate reports that meet FSMA 204 requirements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-100 rounded-md">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-sm">Regulatory Compliance</p>
                      <p className="text-xs text-blue-700">
                        This report is designed to meet FDA reporting requirements
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="date-range-fsma">Date Range</Label>
                    <Select defaultValue="last-quarter">
                      <SelectTrigger id="date-range-fsma">
                        <SelectValue placeholder="Select date range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="last-quarter">Last Quarter</SelectItem>
                        <SelectItem value="last-month">Last Month</SelectItem>
                        <SelectItem value="year-to-date">Year to Date</SelectItem>
                        <SelectItem value="custom">Custom Range</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="include-kdes">Include Key Data Elements</Label>
                    <Select defaultValue="all">
                      <SelectTrigger id="include-kdes">
                        <SelectValue placeholder="Select KDEs to include" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All KDEs</SelectItem>
                        <SelectItem value="critical">Critical KDEs Only</SelectItem>
                        <SelectItem value="custom">Custom Selection</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="report-format-fsma">Report Format</Label>
                    <Select defaultValue="pdf">
                      <SelectTrigger id="report-format-fsma">
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="xml">XML (FDA Compatible)</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="pt-2">
                    <Button 
                      className="w-full"
                      onClick={() => handleGenerateReport('FSMA 204 Compliance')}
                    >
                      Generate FSMA 204 Report
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
                  Recall Documentation
                </CardTitle>
                <CardDescription>
                  Generate FDA-compliant recall documentation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-red-50 border border-red-100 rounded-md">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="font-medium text-sm">Official Records</p>
                      <p className="text-xs text-red-700">
                        These documents may be submitted to regulatory agencies
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="recall-type">Recall Type</Label>
                    <Select defaultValue="class2">
                      <SelectTrigger id="recall-type">
                        <SelectValue placeholder="Select recall class" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="class1">Class I (Serious Health Hazard)</SelectItem>
                        <SelectItem value="class2">Class II (Temporary Health Issue)</SelectItem>
                        <SelectItem value="class3">Class III (Minimal Risk)</SelectItem>
                        <SelectItem value="market-withdrawal">Market Withdrawal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="product-selection">Select Products</Label>
                    <Select defaultValue="product1">
                      <SelectTrigger id="product-selection">
                        <SelectValue placeholder="Select products" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="product1">Product A (Lot 12345)</SelectItem>
                        <SelectItem value="product2">Product B (Lot 23456)</SelectItem>
                        <SelectItem value="product3">Product C (Lot 34567)</SelectItem>
                        <SelectItem value="multiple">Multiple Products</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="report-format-recall">Report Format</Label>
                    <Select defaultValue="fda-form">
                      <SelectTrigger id="report-format-recall">
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fda-form">FDA Form 3177</SelectItem>
                        <SelectItem value="internal">Internal Documentation</SelectItem>
                        <SelectItem value="customer">Customer Communication</SelectItem>
                        <SelectItem value="complete">Complete Package</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="pt-2">
                    <Button 
                      className="w-full"
                      onClick={() => handleGenerateReport('Recall Documentation')}
                    >
                      Generate Recall Documentation
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Copy className="h-5 w-5 mr-2 text-blue-600" />
                21 CFR Part 11 Audit Trail
              </CardTitle>
              <CardDescription>
                Electronic signature and system access audit trail for regulatory compliance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="date-range-audit">Date Range</Label>
                    <Select defaultValue="last-30">
                      <SelectTrigger id="date-range-audit">
                        <SelectValue placeholder="Select date range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="last-7">Last 7 Days</SelectItem>
                        <SelectItem value="last-30">Last 30 Days</SelectItem>
                        <SelectItem value="last-90">Last 90 Days</SelectItem>
                        <SelectItem value="custom">Custom Range</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="user-filter">User Filter</Label>
                    <Select defaultValue="all-users">
                      <SelectTrigger id="user-filter">
                        <SelectValue placeholder="Select users" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all-users">All Users</SelectItem>
                        <SelectItem value="quality">Quality Team</SelectItem>
                        <SelectItem value="management">Management</SelectItem>
                        <SelectItem value="production">Production</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="action-type">Action Type</Label>
                    <Select defaultValue="all-actions">
                      <SelectTrigger id="action-type">
                        <SelectValue placeholder="Select actions" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all-actions">All Actions</SelectItem>
                        <SelectItem value="signatures">E-Signatures Only</SelectItem>
                        <SelectItem value="capa-creation">CAPA Creation</SelectItem>
                        <SelectItem value="capa-approval">CAPA Approval</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="pt-2 flex justify-end space-x-2">
                  <Button 
                    variant="outline"
                    onClick={() => handleGenerateReport('Audit Trail CSV')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Raw Data
                  </Button>
                  <Button 
                    onClick={() => handleGenerateReport('21 CFR Part 11 Audit')}
                  >
                    Generate Audit Trail Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="custom" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ListFilter className="h-5 w-5 mr-2 text-blue-600" />
                Custom Report Builder
              </CardTitle>
              <CardDescription>
                Build custom reports with the exact data you need
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <Label htmlFor="report-title">Report Title</Label>
                      <Input id="report-title" placeholder="Enter report title" />
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor="date-range-custom">Date Range</Label>
                      <Select 
                        value={dateRange} 
                        onValueChange={setDateRange}
                      >
                        <SelectTrigger id="date-range-custom">
                          <SelectValue placeholder="Select date range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="last-7">Last 7 Days</SelectItem>
                          <SelectItem value="last-30">Last 30 Days</SelectItem>
                          <SelectItem value="last-90">Last 90 Days</SelectItem>
                          <SelectItem value="year-to-date">Year to Date</SelectItem>
                          <SelectItem value="custom">Custom Range</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {dateRange === 'custom' && (
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <Label htmlFor="start-date">Start Date</Label>
                          <Input id="start-date" type="date" />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="end-date">End Date</Label>
                          <Input id="end-date" type="date" />
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-1">
                      <Label htmlFor="department-filter">Department</Label>
                      <Select 
                        value={department} 
                        onValueChange={setDepartment}
                      >
                        <SelectTrigger id="department-filter">
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Departments</SelectItem>
                          <SelectItem value="quality">Quality</SelectItem>
                          <SelectItem value="production">Production</SelectItem>
                          <SelectItem value="maintenance">Maintenance</SelectItem>
                          <SelectItem value="sanitation">Sanitation</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label className="mb-1 block">Include Sections</Label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="section-summary" className="h-4 w-4" defaultChecked />
                          <Label htmlFor="section-summary">Executive Summary</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="section-details" className="h-4 w-4" defaultChecked />
                          <Label htmlFor="section-details">CAPA Details</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="section-metrics" className="h-4 w-4" defaultChecked />
                          <Label htmlFor="section-metrics">Key Metrics</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="section-charts" className="h-4 w-4" defaultChecked />
                          <Label htmlFor="section-charts">Charts & Visualizations</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="section-trends" className="h-4 w-4" defaultChecked />
                          <Label htmlFor="section-trends">Trend Analysis</Label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor="report-format">Report Format</Label>
                      <Select 
                        value={reportFormat} 
                        onValueChange={setReportFormat}
                      >
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
                </div>
                
                <div className="border-t pt-4 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
                  <Button 
                    variant="outline"
                    onClick={() => handleGenerateReport('Custom Report Preview')}
                  >
                    Preview Report
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      toast({
                        title: "Report Template Saved",
                        description: "Your custom report template has been saved for future use."
                      });
                    }}
                  >
                    Save Template
                  </Button>
                  <Button 
                    onClick={() => handleGenerateReport('Custom Report')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-base">
                  <FileText className="h-5 w-5 mr-2 text-blue-600" />
                  Saved Report Templates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="border rounded-md p-3 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">Quarterly Management Review</h4>
                        <p className="text-xs text-gray-500">Last generated: 25 days ago</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        Use
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-3 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">Department Performance</h4>
                        <p className="text-xs text-gray-500">Last generated: 12 days ago</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        Use
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-3 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">Annual Compliance Summary</h4>
                        <p className="text-xs text-gray-500">Last generated: 128 days ago</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        Use
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-base">
                  <Printer className="h-5 w-5 mr-2 text-blue-600" />
                  Recent Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="border rounded-md p-3 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">CAPA Status Summary</h4>
                        <p className="text-xs text-gray-500">Generated: Yesterday</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-3 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">FSMA 204 Compliance Report</h4>
                        <p className="text-xs text-gray-500">Generated: 3 days ago</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-3 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">Effectiveness Analysis</h4>
                        <p className="text-xs text-gray-500">Generated: 1 week ago</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CAPAReports;
