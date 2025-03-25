
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  FileText, 
  Download, 
  ExternalLink, 
  Calendar, 
  ClipboardCheck, 
  AlertTriangle, 
  Users, 
  ArrowRight, 
  BarChart,
  FileBarChart
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface PrebuiltReportsProps {
  dateRange: string;
  onNavigateToModule: (module: string) => void;
}

const PrebuiltReports: React.FC<PrebuiltReportsProps> = ({ dateRange, onNavigateToModule }) => {
  const [activeCategory, setActiveCategory] = useState('documents');
  const { toast } = useToast();
  
  const handleDownload = (format: string, reportName: string) => {
    toast({
      title: "Report Download Started",
      description: `Your ${reportName} report is being generated as a ${format.toUpperCase()} file.`
    });
  };
  
  const reportCategories = [
    { id: 'documents', name: 'Documents', icon: <FileText className="h-4 w-4" />, count: 8 },
    { id: 'audits', name: 'Audits', icon: <ClipboardCheck className="h-4 w-4" />, count: 6 },
    { id: 'capa', name: 'CAPA', icon: <AlertTriangle className="h-4 w-4" />, count: 5 },
    { id: 'training', name: 'Training', icon: <Users className="h-4 w-4" />, count: 7 },
    { id: 'haccp', name: 'HACCP', icon: <FileBarChart className="h-4 w-4" />, count: 4 }
  ];

  const documentReports = [
    {
      id: 'doc-exp',
      name: 'Expiring Documents',
      description: 'List of documents expiring in the next 30, 60, and 90 days',
      formats: ['pdf', 'excel', 'csv'],
      updated: '2 days ago',
      category: 'Compliance',
      insights: 'Currently 12 documents expiring within 30 days'
    },
    {
      id: 'doc-approval',
      name: 'Approval Status Overview',
      description: 'Summary of all documents by approval status with aging analysis',
      formats: ['pdf', 'excel'],
      updated: '1 day ago',
      category: 'Performance',
      insights: '5 documents pending approval for over 7 days'
    },
    {
      id: 'doc-category',
      name: 'Document Category Distribution',
      description: 'Analysis of document repository by category and status',
      formats: ['pdf', 'excel'],
      updated: '3 days ago',
      category: 'Analysis',
      insights: 'Most documents (34%) are SOPs, followed by Work Instructions (27%)'
    }
  ];
  
  const auditReports = [
    {
      id: 'audit-findings',
      name: 'Audit Findings',
      description: 'Summary of audit findings by category, severity, and department',
      formats: ['pdf', 'excel', 'csv'],
      updated: '1 week ago',
      category: 'Compliance',
      insights: '15 open critical findings require immediate action'
    },
    {
      id: 'audit-schedule',
      name: 'Audit Schedule Compliance',
      description: 'Analysis of planned vs completed audits with compliance rates',
      formats: ['pdf', 'excel'],
      updated: '2 days ago',
      category: 'Performance',
      insights: 'Audit completion rate is 82% for the current quarter'
    }
  ];
  
  const capaReports = [
    {
      id: 'capa-status',
      name: 'CAPA Status Summary',
      description: 'Overview of all CAPAs by status, priority, and age',
      formats: ['pdf', 'excel', 'csv'],
      updated: '3 days ago',
      category: 'Compliance',
      insights: '8 high-priority CAPAs are currently overdue'
    },
    {
      id: 'capa-effectiveness',
      name: 'CAPA Effectiveness',
      description: 'Analysis of CAPA effectiveness and recurrence rates',
      formats: ['pdf', 'excel'],
      updated: '1 week ago',
      category: 'Analysis',
      insights: '92% effectiveness rate for completed CAPAs'
    }
  ];
  
  const trainingReports = [
    {
      id: 'training-compliance',
      name: 'Training Compliance',
      description: 'Employee training compliance by department and training type',
      formats: ['pdf', 'excel', 'csv'],
      updated: '2 days ago',
      category: 'Compliance',
      insights: 'Overall training compliance rate is 87%'
    },
    {
      id: 'cert-expiry',
      name: 'Certification Expiry',
      description: 'List of employees with expiring certifications in next 90 days',
      formats: ['pdf', 'excel'],
      updated: '3 days ago',
      category: 'Planning',
      insights: '15 employee certifications expiring next month'
    }
  ];
  
  const haccpReports = [
    {
      id: 'ccp-monitoring',
      name: 'CCP Monitoring Summary',
      description: 'Analysis of CCP monitoring data with deviation tracking',
      formats: ['pdf', 'excel', 'csv'],
      updated: '1 day ago',
      category: 'Compliance',
      insights: '3 CCPs recorded deviations in the past week'
    },
    {
      id: 'verification-activities',
      name: 'Verification Activities',
      description: 'Summary of HACCP verification activities and findings',
      formats: ['pdf', 'excel'],
      updated: '1 week ago',
      category: 'Analysis',
      insights: 'All verification activities completed on schedule'
    }
  ];
  
  const getReportsForActiveCategory = () => {
    switch (activeCategory) {
      case 'documents':
        return documentReports;
      case 'audits':
        return auditReports;
      case 'capa':
        return capaReports;
      case 'training':
        return trainingReports;
      case 'haccp':
        return haccpReports;
      default:
        return [];
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Prebuilt Reports</h3>
        <Button variant="outline" onClick={() => onNavigateToModule(activeCategory)}>
          View in {activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Module
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
      
      <Tabs defaultValue="documents" value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList>
          {reportCategories.map((category) => (
            <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
              {category.icon}
              <span>{category.name}</span>
              <Badge variant="secondary" className="ml-1">{category.count}</Badge>
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value={activeCategory} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getReportsForActiveCategory().map((report) => (
              <Card key={report.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{report.name}</CardTitle>
                    <Badge variant="outline">{report.category}</Badge>
                  </div>
                  <CardDescription>{report.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm bg-amber-50 border border-amber-100 rounded-md p-3 mb-3">
                    <div className="font-medium text-amber-800 mb-1">Key Insight:</div>
                    <div className="text-amber-700">{report.insights}</div>
                  </div>
                  <div className="text-xs text-gray-500">Last updated: {report.updated}</div>
                </CardContent>
                <CardFooter className="bg-gray-50 border-t flex justify-between">
                  <div className="flex items-center space-x-1">
                    {report.formats.map((format) => (
                      <Button 
                        key={format} 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDownload(format, report.name)}
                        className="text-xs"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        {format.toUpperCase()}
                      </Button>
                    ))}
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      <Card className="bg-gray-50 border-dashed border-2">
        <CardContent className="pt-6">
          <div className="text-center">
            <BarChart className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <h3 className="text-lg font-medium mb-1">Need a custom report?</h3>
            <p className="text-gray-500 mb-4">Use our report builder to create tailored reports for your specific needs.</p>
            <Button onClick={() => toast({
              title: "Coming Soon",
              description: "The custom report builder will be available in the next release."
            })}>
              Create Custom Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrebuiltReports;
