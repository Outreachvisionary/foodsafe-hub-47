
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
  ActivitySquare, 
  BarChart, 
  FileWarning,
  ArrowUpDown
} from 'lucide-react';

const HACCPDashboard: React.FC = () => {
  // Sample data for HACCP KPIs
  const kpiData = {
    ccpCompliance: 95,
    prerequisitePrograms: 87,
    hazardAnalysis: 92,
    verification: 83
  };

  // Sample CCP monitoring data
  const ccpMonitoringData = [
    { 
      ccpId: 'CCP-001', 
      description: 'Cooking Temperature', 
      targetValue: '≥ 165°F',
      lastReading: '168°F',
      deviations: 0,
      status: 'Compliant'
    },
    { 
      ccpId: 'CCP-002', 
      description: 'Cooling Temperature', 
      targetValue: '≤ 41°F within 4h',
      lastReading: '39°F',
      deviations: 2,
      status: 'Compliant'
    },
    { 
      ccpId: 'CCP-003', 
      description: 'Metal Detection', 
      targetValue: 'No metal > 2mm',
      lastReading: 'Pass',
      deviations: 0,
      status: 'Compliant'
    },
    { 
      ccpId: 'CCP-004', 
      description: 'pH Control', 
      targetValue: '≤ 4.6',
      lastReading: '4.8',
      deviations: 1,
      status: 'Non-Compliant'
    }
  ];

  // Sample HACCP verification activities
  const verificationActivities = [
    { 
      activity: 'CCP Record Review', 
      frequency: 'Daily', 
      lastCompleted: '2024-05-18', 
      nextDue: '2024-05-19',
      status: 'On Track'
    },
    { 
      activity: 'Equipment Calibration', 
      frequency: 'Monthly', 
      lastCompleted: '2024-05-01', 
      nextDue: '2024-06-01',
      status: 'On Track'
    },
    { 
      activity: 'HACCP Plan Review', 
      frequency: 'Annually', 
      lastCompleted: '2023-08-15', 
      nextDue: '2024-08-15',
      status: 'On Track'
    },
    { 
      activity: 'Microbiological Testing', 
      frequency: 'Weekly', 
      lastCompleted: '2024-05-12', 
      nextDue: '2024-05-19',
      status: 'Overdue'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center">
              <ActivitySquare className="h-4 w-4 text-red-500 mr-2" />
              CCP Compliance
            </CardTitle>
            <CardDescription>Critical control points</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-fsms-dark mb-2">{kpiData.ccpCompliance}%</div>
            <Progress value={kpiData.ccpCompliance} className="h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center">
              <BarChart className="h-4 w-4 text-amber-500 mr-2" />
              Prerequisite Programs
            </CardTitle>
            <CardDescription>Foundation systems</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-fsms-dark mb-2">{kpiData.prerequisitePrograms}%</div>
            <Progress value={kpiData.prerequisitePrograms} className="h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center">
              <FileWarning className="h-4 w-4 text-blue-500 mr-2" />
              Hazard Analysis
            </CardTitle>
            <CardDescription>Risk assessment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-fsms-dark mb-2">{kpiData.hazardAnalysis}%</div>
            <Progress value={kpiData.hazardAnalysis} className="h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center">
              <ArrowUpDown className="h-4 w-4 text-indigo-500 mr-2" />
              Verification
            </CardTitle>
            <CardDescription>System effectiveness</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-fsms-dark mb-2">{kpiData.verification}%</div>
            <Progress value={kpiData.verification} className="h-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>CCP Monitoring Status</CardTitle>
            <CardDescription>Real-time critical control point data</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>CCP ID</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Last Reading</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ccpMonitoringData.map((ccp, index) => {
                  const badgeStyle = ccp.status === "Compliant" 
                    ? "bg-green-100 text-green-800 hover:bg-green-100" 
                    : "bg-red-100 text-red-800 hover:bg-red-100";
                  
                  return (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{ccp.ccpId}</TableCell>
                      <TableCell>{ccp.description}</TableCell>
                      <TableCell>{ccp.targetValue}</TableCell>
                      <TableCell>{ccp.lastReading}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={badgeStyle}>
                          {ccp.status}
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
            <CardTitle>Verification Activities</CardTitle>
            <CardDescription>HACCP system validation and verification</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Activity</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Next Due</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {verificationActivities.map((activity, index) => {
                  let badgeStyle = "bg-green-100 text-green-800 hover:bg-green-100";
                  if (activity.status === "Overdue") {
                    badgeStyle = "bg-red-100 text-red-800 hover:bg-red-100";
                  }
                  
                  return (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{activity.activity}</TableCell>
                      <TableCell>{activity.frequency}</TableCell>
                      <TableCell>{activity.nextDue}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={badgeStyle}>
                          {activity.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HACCPDashboard;
