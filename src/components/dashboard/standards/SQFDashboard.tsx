
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
  CheckCircle2, 
  AlertTriangle, 
  CalendarClock,
  BarChart3
} from 'lucide-react';

const SQFDashboard: React.FC = () => {
  // Sample data for SQF KPIs
  const kpiData = {
    auditReadiness: 78,
    nonConformance: 12,
    documentCompliance: 85,
    mockRecallEffectiveness: 92
  };

  // Sample data for SQF requirements
  const requirementsData = [
    { 
      requirement: 'Mock Recall Exercise', 
      frequency: 'Every 6 months', 
      lastCompleted: '2023-11-15', 
      nextDue: '2024-05-15',
      status: 'On Track'
    },
    { 
      requirement: 'Internal Audit', 
      frequency: 'Annually', 
      lastCompleted: '2023-10-22', 
      nextDue: '2024-10-22',
      status: 'On Track'
    },
    { 
      requirement: 'Management Review', 
      frequency: 'Annually', 
      lastCompleted: '2023-09-15', 
      nextDue: '2024-09-15',
      status: 'On Track'
    },
    { 
      requirement: 'Crisis Management Drill', 
      frequency: 'Annually', 
      lastCompleted: '2023-07-30', 
      nextDue: '2024-07-30',
      status: 'On Track'
    }
  ];

  // Sample data for non-conformances
  const nonConformanceData = {
    critical: 0,
    major: 2,
    minor: 10
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center">
              <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
              Audit Readiness
            </CardTitle>
            <CardDescription>Overall compliance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-fsms-dark mb-2">{kpiData.auditReadiness}%</div>
            <Progress value={kpiData.auditReadiness} className="h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center">
              <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
              Non-Conformances
            </CardTitle>
            <CardDescription>Total active issues</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-fsms-dark mb-2">{kpiData.nonConformance}</div>
            <div className="flex space-x-4 text-sm">
              <div className="flex flex-col items-center">
                <span className="text-red-500 font-medium">{nonConformanceData.critical}</span>
                <span className="text-gray-500">Critical</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-amber-500 font-medium">{nonConformanceData.major}</span>
                <span className="text-gray-500">Major</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-blue-500 font-medium">{nonConformanceData.minor}</span>
                <span className="text-gray-500">Minor</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center">
              <BarChart3 className="h-4 w-4 text-blue-500 mr-2" />
              Document Compliance
            </CardTitle>
            <CardDescription>Required documentation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-fsms-dark mb-2">{kpiData.documentCompliance}%</div>
            <Progress value={kpiData.documentCompliance} className="h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center">
              <CalendarClock className="h-4 w-4 text-indigo-500 mr-2" />
              Mock Recall
            </CardTitle>
            <CardDescription>Effectiveness rate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-fsms-dark mb-2">{kpiData.mockRecallEffectiveness}%</div>
            <Progress value={kpiData.mockRecallEffectiveness} className="h-2" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>SQF Requirement Schedule</CardTitle>
          <CardDescription>Key activities and their due dates</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Requirement</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Last Completed</TableHead>
                <TableHead>Next Due</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requirementsData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.requirement}</TableCell>
                  <TableCell>{item.frequency}</TableCell>
                  <TableCell>{item.lastCompleted}</TableCell>
                  <TableCell>{item.nextDue}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                      {item.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default SQFDashboard;
