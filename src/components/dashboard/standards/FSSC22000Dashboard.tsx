
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
  ShieldAlert, 
  ClipboardList, 
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

const FSSC22000Dashboard: React.FC = () => {
  // Sample data for FSSC 22000 KPIs
  const kpiData = {
    overallCompliance: 84,
    foodDefense: 92,
    foodFraud: 87,
    allergenManagement: 90
  };

  // Sample data for additional FSSC 22000 specific requirements
  const additionalRequirements = [
    { 
      requirement: 'Food Defense Assessment', 
      frequency: 'Annually', 
      lastCompleted: '2023-10-18', 
      nextDue: '2024-10-18',
      status: 'On Track'
    },
    { 
      requirement: 'Food Fraud Vulnerability Assessment', 
      frequency: 'Annually', 
      lastCompleted: '2023-11-05', 
      nextDue: '2024-11-05',
      status: 'On Track'
    },
    { 
      requirement: 'Environmental Monitoring Review', 
      frequency: 'Quarterly', 
      lastCompleted: '2024-01-15', 
      nextDue: '2024-04-15',
      status: 'Overdue'
    },
    { 
      requirement: 'Allergen Management Review', 
      frequency: 'Semi-Annually', 
      lastCompleted: '2023-12-20', 
      nextDue: '2024-06-20',
      status: 'Upcoming'
    }
  ];

  // Sample nonconformities data
  const nonConformities = [
    { 
      category: 'Food Defense', 
      count: 2, 
      severity: 'Minor',
      dueDate: '2024-06-30'
    },
    { 
      category: 'Food Fraud Prevention', 
      count: 1, 
      severity: 'Major',
      dueDate: '2024-06-15'
    },
    { 
      category: 'Allergen Management', 
      count: 3, 
      severity: 'Minor',
      dueDate: '2024-07-10'
    },
    { 
      category: 'Environmental Monitoring', 
      count: 1, 
      severity: 'Critical',
      dueDate: '2024-05-30'
    }
  ];

  const getSeverityBadgeStyle = (severity: string) => {
    switch(severity) {
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
              <ShieldCheck className="h-4 w-4 text-green-500 mr-2" />
              Overall Compliance
            </CardTitle>
            <CardDescription>FSSC 22000 requirements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-fsms-dark mb-2">{kpiData.overallCompliance}%</div>
            <Progress value={kpiData.overallCompliance} className="h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center">
              <ShieldAlert className="h-4 w-4 text-blue-500 mr-2" />
              Food Defense
            </CardTitle>
            <CardDescription>Security measures</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-fsms-dark mb-2">{kpiData.foodDefense}%</div>
            <Progress value={kpiData.foodDefense} className="h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center">
              <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
              Food Fraud
            </CardTitle>
            <CardDescription>Vulnerability mitigation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-fsms-dark mb-2">{kpiData.foodFraud}%</div>
            <Progress value={kpiData.foodFraud} className="h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center">
              <ClipboardList className="h-4 w-4 text-indigo-500 mr-2" />
              Allergen Management
            </CardTitle>
            <CardDescription>Control effectiveness</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-fsms-dark mb-2">{kpiData.allergenManagement}%</div>
            <Progress value={kpiData.allergenManagement} className="h-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>FSSC 22000 Additional Requirements</CardTitle>
            <CardDescription>Unique FSSC 22000 activities</CardDescription>
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
                {additionalRequirements.map((item, index) => {
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
            <CardTitle>Current Non-Conformities</CardTitle>
            <CardDescription>Issues requiring correction</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Count</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Due Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {nonConformities.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.category}</TableCell>
                    <TableCell>{item.count}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getSeverityBadgeStyle(item.severity)}>
                        {item.severity}
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

export default FSSC22000Dashboard;
