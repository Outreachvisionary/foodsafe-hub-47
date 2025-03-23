
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Award, 
  ClipboardCheck, 
  Building2,
  FileSearch
} from 'lucide-react';

const BRCDashboard: React.FC = () => {
  // Sample data for BRC KPIs
  const kpiData = {
    overallCompliance: 81,
    seniorManagement: 88,
    siteStandards: 76,
    productControl: 85
  };

  // Sample data for BRC requirements by section
  const sectionCompliance = [
    { section: '1. Senior Management Commitment', compliance: 88 },
    { section: '2. The Food Safety Plan', compliance: 92 },
    { section: '3. Food Safety & Quality Management', compliance: 84 },
    { section: '4. Site Standards', compliance: 76 },
    { section: '5. Product Control', compliance: 85 },
    { section: '6. Process Control', compliance: 90 },
    { section: '7. Personnel', compliance: 83 }
  ];

  // Sample non-conformities data
  const nonConformities = [
    { 
      id: 'NC-001', 
      section: '4.11 Housekeeping and cleaning', 
      grade: 'Minor',
      identified: '2024-04-12',
      dueDate: '2024-06-12'
    },
    { 
      id: 'NC-002', 
      section: '3.9 Traceability', 
      grade: 'Major',
      identified: '2024-04-12',
      dueDate: '2024-05-27'
    },
    { 
      id: 'NC-003', 
      section: '5.3 Management of allergens', 
      grade: 'Minor',
      identified: '2024-04-12',
      dueDate: '2024-06-12'
    }
  ];

  const getGradeBadgeStyle = (grade: string) => {
    switch(grade) {
      case 'Critical':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      case 'Major':
        return 'bg-amber-100 text-amber-800 hover:bg-amber-100';
      case 'Minor':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center">
              <Award className="h-4 w-4 text-purple-500 mr-2" />
              Overall Compliance
            </CardTitle>
            <CardDescription>BRC requirements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-fsms-dark mb-2">{kpiData.overallCompliance}%</div>
            <Progress value={kpiData.overallCompliance} className="h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center">
              <ClipboardCheck className="h-4 w-4 text-green-500 mr-2" />
              Senior Management
            </CardTitle>
            <CardDescription>Leadership commitment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-fsms-dark mb-2">{kpiData.seniorManagement}%</div>
            <Progress value={kpiData.seniorManagement} className="h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center">
              <Building2 className="h-4 w-4 text-amber-500 mr-2" />
              Site Standards
            </CardTitle>
            <CardDescription>Facility requirements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-fsms-dark mb-2">{kpiData.siteStandards}%</div>
            <Progress value={kpiData.siteStandards} className="h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center">
              <FileSearch className="h-4 w-4 text-blue-500 mr-2" />
              Product Control
            </CardTitle>
            <CardDescription>Product safety</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-fsms-dark mb-2">{kpiData.productControl}%</div>
            <Progress value={kpiData.productControl} className="h-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Section Compliance</CardTitle>
            <CardDescription>BRC Global Standard sections</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sectionCompliance.map((section, i) => (
                <div key={i}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">{section.section}</span>
                    <span className="text-sm text-gray-500">{section.compliance}%</span>
                  </div>
                  <Progress value={section.compliance} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Non-Conformities</CardTitle>
            <CardDescription>Issues from recent audit</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Section</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Due Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {nonConformities.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.id}</TableCell>
                    <TableCell>{item.section}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getGradeBadgeStyle(item.grade)}>
                        {item.grade}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.dueDate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BRCDashboard;
