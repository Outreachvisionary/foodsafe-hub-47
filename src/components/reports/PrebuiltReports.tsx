
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, BarChart2, PieChart, TrendingUp, Calendar, Download, Eye } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export interface PrebuiltReportsProps {
  layout: string;
}

interface ReportItem {
  id: string;
  title: string;
  description: string;
  category: string;
  module: string;
  lastRun: string;
  icon: React.ReactNode;
}

const PrebuiltReports: React.FC<PrebuiltReportsProps> = ({ layout }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedModule, setSelectedModule] = useState<string>('all');

  const reportItems: ReportItem[] = [
    {
      id: '1',
      title: 'Training Compliance Overview',
      description: 'Percentage of completed training sessions across departments',
      category: 'compliance',
      module: 'training',
      lastRun: '2024-05-01',
      icon: <BarChart2 className="h-5 w-5 text-blue-500" />,
    },
    {
      id: '2',
      title: 'Document Expiration Report',
      description: 'List of documents expiring in the next 30 days',
      category: 'documents',
      module: 'documents',
      lastRun: '2024-05-03',
      icon: <FileText className="h-5 w-5 text-orange-500" />,
    },
    {
      id: '3',
      title: 'CAPA Trend Analysis',
      description: 'Trends in corrective actions over the past 6 months',
      category: 'analysis',
      module: 'capa',
      lastRun: '2024-04-28',
      icon: <TrendingUp className="h-5 w-5 text-green-500" />,
    },
    {
      id: '4',
      title: 'Audit Findings Distribution',
      description: 'Distribution of audit findings by category and severity',
      category: 'analysis',
      module: 'audits',
      lastRun: '2024-04-25',
      icon: <PieChart className="h-5 w-5 text-purple-500" />,
    },
    {
      id: '5',
      title: 'Non-Conformance Monthly Summary',
      description: 'Summary of non-conformances by department and type',
      category: 'compliance',
      module: 'non-conformance',
      lastRun: '2024-05-02',
      icon: <BarChart2 className="h-5 w-5 text-red-500" />,
    },
    {
      id: '6',
      title: 'Upcoming Training Sessions',
      description: 'List of training sessions scheduled in the next 14 days',
      category: 'scheduling',
      module: 'training',
      lastRun: '2024-05-04',
      icon: <Calendar className="h-5 w-5 text-blue-500" />,
    },
  ];

  const filterReports = () => {
    return reportItems.filter(item => {
      const categoryMatch = selectedCategory === 'all' || item.category === selectedCategory;
      const moduleMatch = selectedModule === 'all' || item.module === selectedModule;
      return categoryMatch && moduleMatch;
    });
  };

  const filteredReports = filterReports();
  
  const handleViewReport = (reportId: string) => {
    console.log(`Viewing report: ${reportId}`);
    // In a real application, this would navigate to the report view
  };

  const handleDownloadReport = (reportId: string) => {
    console.log(`Downloading report: ${reportId}`);
    // In a real application, this would trigger a download
  };

  // Group reports by module for tabbed view
  const moduleGroups = reportItems.reduce<Record<string, ReportItem[]>>((acc, report) => {
    if (!acc[report.module]) {
      acc[report.module] = [];
    }
    acc[report.module].push(report);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-lg font-medium">Prebuilt Reports</h3>
        
        <div className="flex flex-wrap gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="compliance">Compliance</SelectItem>
              <SelectItem value="analysis">Analysis</SelectItem>
              <SelectItem value="documents">Documents</SelectItem>
              <SelectItem value="scheduling">Scheduling</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedModule} onValueChange={setSelectedModule}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Module" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Modules</SelectItem>
              <SelectItem value="training">Training</SelectItem>
              <SelectItem value="documents">Documents</SelectItem>
              <SelectItem value="capa">CAPA</SelectItem>
              <SelectItem value="audits">Audits</SelectItem>
              <SelectItem value="non-conformance">Non-Conformance</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {layout === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReports.map(report => (
            <Card key={report.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {report.icon}
                    <CardTitle className="text-md">{report.title}</CardTitle>
                  </div>
                  <Badge variant="outline" className="capitalize">{report.category}</Badge>
                </div>
                <CardDescription>{report.description}</CardDescription>
              </CardHeader>
              <CardFooter className="pt-3 flex justify-between items-center border-t">
                <div className="text-xs text-muted-foreground">
                  Last run: {report.lastRun}
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleViewReport(report.id)}>
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDownloadReport(report.id)}>
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {layout === 'list' && (
        <div className="space-y-4">
          {filteredReports.map(report => (
            <Card key={report.id}>
              <div className="flex flex-col md:flex-row md:items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-md">
                    {report.icon}
                  </div>
                  <div>
                    <h4 className="font-medium">{report.title}</h4>
                    <p className="text-sm text-muted-foreground">{report.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-4 md:mt-0">
                  <Badge variant="outline" className="capitalize">{report.module}</Badge>
                  <div className="text-xs text-muted-foreground whitespace-nowrap">
                    Last run: {report.lastRun}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleViewReport(report.id)}>
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDownloadReport(report.id)}>
                      <Download className="h-4 w-4 mr-1" />
                      Export
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {layout === 'detailed' && (
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            {Object.keys(moduleGroups).map(module => (
              <TabsTrigger key={module} value={module} className="capitalize">{module}</TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value="all">
            <div className="space-y-4">
              {filteredReports.map(report => (
                <Card key={report.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {report.icon}
                        <CardTitle>{report.title}</CardTitle>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="capitalize">{report.module}</Badge>
                        <Badge variant="outline" className="capitalize">{report.category}</Badge>
                      </div>
                    </div>
                    <CardDescription>{report.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      This report provides detailed insights into {report.description.toLowerCase()}. 
                      Use this report to monitor performance metrics and identify trends.
                    </p>
                  </CardContent>
                  <CardFooter className="border-t pt-4 flex justify-between">
                    <div className="text-xs text-muted-foreground">
                      Last run: {report.lastRun}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => handleViewReport(report.id)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button onClick={() => handleDownloadReport(report.id)}>
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          {Object.entries(moduleGroups).map(([module, reports]) => (
            <TabsContent key={module} value={module}>
              <div className="space-y-4">
                {reports.map(report => (
                  <Card key={report.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {report.icon}
                          <CardTitle>{report.title}</CardTitle>
                        </div>
                        <Badge variant="outline" className="capitalize">{report.category}</Badge>
                      </div>
                      <CardDescription>{report.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        This report provides detailed insights into {report.description.toLowerCase()}. 
                        Use this report to monitor performance metrics and identify trends.
                      </p>
                    </CardContent>
                    <CardFooter className="border-t pt-4 flex justify-between">
                      <div className="text-xs text-muted-foreground">
                        Last run: {report.lastRun}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => handleViewReport(report.id)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button onClick={() => handleDownloadReport(report.id)}>
                          <Download className="h-4 w-4 mr-2" />
                          Export
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
};

export default PrebuiltReports;
