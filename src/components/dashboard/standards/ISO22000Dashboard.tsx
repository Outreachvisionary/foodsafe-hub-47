
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
  ShieldCheck, 
  AlertCircle, 
  FileCheck,
  LineChart
} from 'lucide-react';

const ISO22000Dashboard: React.FC = () => {
  // Sample data for ISO 22000 KPIs
  const kpiData = {
    systemEffectiveness: 82,
    hazardControlEfficiency: 89,
    interactiveCommunication: 76,
    emergencyPreparedness: 85
  };

  // Sample data for ISO 22000 requirements
  const requirementsData = [
    { 
      requirement: 'Management Review', 
      frequency: 'Annually', 
      lastCompleted: '2023-12-10', 
      nextDue: '2024-12-10',
      status: 'On Track'
    },
    { 
      requirement: 'Verification Activities', 
      frequency: 'Quarterly', 
      lastCompleted: '2024-03-15', 
      nextDue: '2024-06-15',
      status: 'Upcoming'
    },
    { 
      requirement: 'PRP Verification', 
      frequency: 'Semi-Annually', 
      lastCompleted: '2023-11-22', 
      nextDue: '2024-05-22',
      status: 'Overdue'
    },
    { 
      requirement: 'FSMS Internal Audit', 
      frequency: 'Annually', 
      lastCompleted: '2023-09-05', 
      nextDue: '2024-09-05',
      status: 'On Track'
    }
  ];

  // Additional data specific to ISO 22000
  const criticalAreaPerformance = [
    { area: 'PRPs', score: 88 },
    { area: 'HACCP Plan', score: 91 },
    { area: 'Traceability', score: 94 },
    { area: 'Nonconformity Management', score: 79 }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center">
              <ShieldCheck className="h-4 w-4 text-green-500 mr-2" />
              System Effectiveness
            </CardTitle>
            <CardDescription>Overall FSMS performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-fsms-dark mb-2">{kpiData.systemEffectiveness}%</div>
            <Progress value={kpiData.systemEffectiveness} className="h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center">
              <AlertCircle className="h-4 w-4 text-amber-500 mr-2" />
              Hazard Control
            </CardTitle>
            <CardDescription>Control measure efficiency</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-fsms-dark mb-2">{kpiData.hazardControlEfficiency}%</div>
            <Progress value={kpiData.hazardControlEfficiency} className="h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center">
              <FileCheck className="h-4 w-4 text-blue-500 mr-2" />
              Communication
            </CardTitle>
            <CardDescription>Interactive communication</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-fsms-dark mb-2">{kpiData.interactiveCommunication}%</div>
            <Progress value={kpiData.interactiveCommunication} className="h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center">
              <LineChart className="h-4 w-4 text-indigo-500 mr-2" />
              Emergency Preparedness
            </CardTitle>
            <CardDescription>Response readiness</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-fsms-dark mb-2">{kpiData.emergencyPreparedness}%</div>
            <Progress value={kpiData.emergencyPreparedness} className="h-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>ISO 22000 Requirement Schedule</CardTitle>
            <CardDescription>Key activities and their due dates</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Requirement</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Next Due</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requirementsData.map((item, index) => {
                  let badgeStyle = "bg-green-100 text-green-800 hover:bg-green-100";
                  if (item.status === "Upcoming") {
                    badgeStyle = "bg-blue-100 text-blue-800 hover:bg-blue-100";
                  } else if (item.status === "Overdue") {
                    badgeStyle = "bg-red-100 text-red-800 hover:bg-red-100";
                  }
                  
                  return (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.requirement}</TableCell>
                      <TableCell>{item.frequency}</TableCell>
                      <TableCell>{item.nextDue}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={badgeStyle}>
                          {item.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Critical Area Performance</CardTitle>
            <CardDescription>Key components of ISO 22000</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {criticalAreaPerformance.map((area, i) => (
                <div key={i}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">{area.area}</span>
                    <span className="text-sm text-gray-500">{area.score}%</span>
                  </div>
                  <Progress value={area.score} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ISO22000Dashboard;
