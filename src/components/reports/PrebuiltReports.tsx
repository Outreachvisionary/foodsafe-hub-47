
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  ClipboardCheck, 
  AlertTriangle, 
  Users,
  Calendar,
  Download,
  BarChart,
  Clock,
  Bookmark,
  Activity,
  Star,
  Search
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface PrebuiltReportsProps {
  dateRange: string;
  onNavigateToModule: (module: string) => void;
}

const PrebuiltReports: React.FC<PrebuiltReportsProps> = ({ 
  dateRange,
  onNavigateToModule
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const { toast } = useToast();
  
  const handleGenerateReport = (reportType: string) => {
    toast({
      title: `Generating ${reportType} Report`,
      description: "Your report is being generated. It will be available for download shortly."
    });
  };
  
  // Filter reports based on search query and category
  const filterReports = (reports: any[]) => {
    return reports.filter(report => {
      const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          report.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === 'all' || report.category === filterCategory;
      
      return matchesSearch && matchesCategory;
    });
  };
  
  // Sample report definitions
  const documentReports = [
    {
      id: 'doc-1',
      title: 'Document Expiry Summary',
      description: 'Overview of documents expiring in the next 30, 60, and 90 days',
      category: 'documents',
      icon: <Calendar className="h-5 w-5 text-amber-500" />,
      popular: true
    },
    {
      id: 'doc-2',
      title: 'Approval Workflow Analysis',
      description: 'Analysis of document approval times and bottlenecks',
      category: 'documents',
      icon: <Clock className="h-5 w-5 text-blue-500" />,
      popular: false
    },
    {
      id: 'doc-3',
      title: 'Document Compliance Status',
      description: 'Summary of document statuses and compliance metrics',
      category: 'documents',
      icon: <FileText className="h-5 w-5 text-green-500" />,
      popular: true
    }
  ];
  
  const auditReports = [
    {
      id: 'audit-1',
      title: 'Audit Findings Summary',
      description: 'Summary of audit findings by severity and category',
      category: 'audits',
      icon: <ClipboardCheck className="h-5 w-5 text-blue-500" />,
      popular: true
    },
    {
      id: 'audit-2',
      title: 'Non-Conformance Trends',
      description: 'Trend analysis of non-conformances over time',
      category: 'audits',
      icon: <BarChart className="h-5 w-5 text-purple-500" />,
      popular: true
    },
    {
      id: 'audit-3',
      title: 'Audit Schedule Compliance',
      description: 'Report on audit completion rates against schedule',
      category: 'audits',
      icon: <Calendar className="h-5 w-5 text-green-500" />,
      popular: false
    }
  ];
  
  const capaReports = [
    {
      id: 'capa-1',
      title: 'CAPA Status Summary',
      description: 'Summary of CAPAs by status, priority, and age',
      category: 'capa',
      icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
      popular: true
    },
    {
      id: 'capa-2',
      title: 'CAPA Effectiveness Report',
      description: 'Analysis of CAPA effectiveness and recurrence rates',
      category: 'capa',
      icon: <Activity className="h-5 w-5 text-green-500" />,
      popular: false
    },
    {
      id: 'capa-3',
      title: 'Root Cause Analysis Trends',
      description: 'Trends in root causes identified across CAPAs',
      category: 'capa',
      icon: <Search className="h-5 w-5 text-blue-500" />,
      popular: true
    }
  ];
  
  const trainingReports = [
    {
      id: 'training-1',
      title: 'Training Compliance Summary',
      description: 'Overview of training compliance by department and role',
      category: 'training',
      icon: <Users className="h-5 w-5 text-blue-500" />,
      popular: true
    },
    {
      id: 'training-2',
      title: 'Certification Expiry Report',
      description: 'Report on employee certifications expiring in next 90 days',
      category: 'training',
      icon: <Calendar className="h-5 w-5 text-red-500" />,
      popular: true
    },
    {
      id: 'training-3',
      title: 'Training Effectiveness Analysis',
      description: 'Analysis of training effectiveness based on assessments',
      category: 'training',
      icon: <Star className="h-5 w-5 text-amber-500" />,
      popular: false
    }
  ];
  
  // Combine all reports
  const allReports = [
    ...documentReports, 
    ...auditReports,
    ...capaReports,
    ...trainingReports
  ];
  
  // Filter reports based on current filters
  const filteredReports = filterReports(allReports);
  const popularReports = filteredReports.filter(report => report.popular);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search reports..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="documents">Documents</SelectItem>
              <SelectItem value="audits">Audits</SelectItem>
              <SelectItem value="capa">CAPA</SelectItem>
              <SelectItem value="training">Training</SelectItem>
              <SelectItem value="complaints">Complaints</SelectItem>
              <SelectItem value="haccp">HACCP</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {popularReports.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-3">Popular Reports</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {popularReports.map((report) => (
              <ReportCard 
                key={report.id}
                title={report.title}
                description={report.description}
                icon={report.icon}
                onGenerate={() => handleGenerateReport(report.title)}
                onNavigate={() => onNavigateToModule(report.category)}
              />
            ))}
          </div>
        </div>
      )}
      
      <Tabs defaultValue="documents">
        <TabsList className="mb-4">
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Documents</span>
          </TabsTrigger>
          <TabsTrigger value="audits" className="flex items-center gap-2">
            <ClipboardCheck className="h-4 w-4" />
            <span>Audits</span>
          </TabsTrigger>
          <TabsTrigger value="capa" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span>CAPA</span>
          </TabsTrigger>
          <TabsTrigger value="training" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Training</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="documents">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filterReports(documentReports).map((report) => (
              <ReportCard 
                key={report.id}
                title={report.title}
                description={report.description}
                icon={report.icon}
                onGenerate={() => handleGenerateReport(report.title)}
                onNavigate={() => onNavigateToModule('documents')}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="audits">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filterReports(auditReports).map((report) => (
              <ReportCard 
                key={report.id}
                title={report.title}
                description={report.description}
                icon={report.icon}
                onGenerate={() => handleGenerateReport(report.title)}
                onNavigate={() => onNavigateToModule('audits')}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="capa">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filterReports(capaReports).map((report) => (
              <ReportCard 
                key={report.id}
                title={report.title}
                description={report.description}
                icon={report.icon}
                onGenerate={() => handleGenerateReport(report.title)}
                onNavigate={() => onNavigateToModule('capa')}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="training">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filterReports(trainingReports).map((report) => (
              <ReportCard 
                key={report.id}
                title={report.title}
                description={report.description}
                icon={report.icon}
                onGenerate={() => handleGenerateReport(report.title)}
                onNavigate={() => onNavigateToModule('training')}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface ReportCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onGenerate: () => void;
  onNavigate: () => void;
}

const ReportCard: React.FC<ReportCardProps> = ({ 
  title, 
  description, 
  icon,
  onGenerate,
  onNavigate
}) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base flex items-center">
              {icon}
              <span className="ml-2">{title}</span>
            </CardTitle>
            <CardDescription>
              {description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            size="sm"
            onClick={onNavigate}
          >
            View Details
          </Button>
          <Button 
            size="sm"
            onClick={onGenerate}
          >
            <Download className="h-4 w-4 mr-2" />
            Generate
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PrebuiltReports;
