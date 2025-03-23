
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowUpRight, 
  BarChart, 
  Calendar, 
  Check, 
  CheckCircle, 
  FileText, 
  LineChart, 
  PieChart, 
  Search, 
  User, 
  X 
} from 'lucide-react';

const CAPAEffectiveness: React.FC = () => {
  // Sample effectiveness data
  const effectivenessData = [
    {
      id: 'CAPA-2023-056',
      title: 'Foreign Material in Production Line 3',
      verifiedDate: '2023-12-10',
      verifiedBy: 'Jane Smith',
      rating: 'Effective',
      recurrenceCheck: 'Passed',
      rootCauseEliminated: true,
      documentationComplete: true,
      preventiveMeasuresImplemented: true,
      score: 85
    },
    {
      id: 'CAPA-2023-062',
      title: 'Allergen Control Program Gaps',
      verifiedDate: '2023-12-12',
      verifiedBy: 'Michael Johnson',
      rating: 'Partially Effective',
      recurrenceCheck: 'Minor Issues',
      rootCauseEliminated: true,
      documentationComplete: false,
      preventiveMeasuresImplemented: true,
      score: 70
    },
    {
      id: 'CAPA-2023-045',
      title: 'Sanitation SOP Non-Compliance',
      verifiedDate: '2023-12-05',
      verifiedBy: 'Robert Chen',
      rating: 'Effective',
      recurrenceCheck: 'Passed',
      rootCauseEliminated: true,
      documentationComplete: true,
      preventiveMeasuresImplemented: true,
      score: 90
    },
    {
      id: 'CAPA-2023-037',
      title: 'Temperature Monitoring Failure',
      verifiedDate: '2023-11-28',
      verifiedBy: 'Sarah Wilson',
      rating: 'Not Effective',
      recurrenceCheck: 'Failed',
      rootCauseEliminated: false,
      documentationComplete: true,
      preventiveMeasuresImplemented: false,
      score: 40
    },
    {
      id: 'CAPA-2023-029',
      title: 'Employee Training Documentation Gaps',
      verifiedDate: '2023-11-20',
      verifiedBy: 'David Garcia',
      rating: 'Effective',
      recurrenceCheck: 'Passed',
      rootCauseEliminated: true,
      documentationComplete: true,
      preventiveMeasuresImplemented: true,
      score: 95
    }
  ];

  const getEffectivenessRatingBadge = (rating: string) => {
    switch (rating) {
      case 'Effective':
        return (
          <Badge className="bg-green-100 text-green-800">
            Effective
          </Badge>
        );
      case 'Partially Effective':
        return (
          <Badge className="bg-amber-100 text-amber-800">
            Partially Effective
          </Badge>
        );
      case 'Not Effective':
        return (
          <Badge className="bg-red-100 text-red-800">
            Not Effective
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800">
            {rating}
          </Badge>
        );
    }
  };

  const getCheckStatus = (passed: boolean) => {
    return passed ? (
      <span className="text-green-600 flex items-center">
        <CheckCircle className="h-4 w-4 mr-1" />
        Yes
      </span>
    ) : (
      <span className="text-red-600 flex items-center">
        <X className="h-4 w-4 mr-1" />
        No
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <PieChart className="h-5 w-5 mr-2 text-blue-600" />
              Overall Effectiveness
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <div className="text-4xl font-bold text-blue-700">76%</div>
              <p className="text-sm text-gray-500 mt-1">Average effectiveness score</p>
            </div>
            <div className="space-y-2 mt-4">
              <div className="flex justify-between text-sm">
                <span>Effective</span>
                <span>60%</span>
              </div>
              <Progress value={60} className="h-2" />
              
              <div className="flex justify-between text-sm">
                <span>Partially Effective</span>
                <span>30%</span>
              </div>
              <Progress value={30} className="h-2 bg-amber-100">
                <div className="bg-amber-500 h-full rounded-full" />
              </Progress>
              
              <div className="flex justify-between text-sm">
                <span>Not Effective</span>
                <span>10%</span>
              </div>
              <Progress value={10} className="h-2 bg-red-100">
                <div className="bg-red-500 h-full rounded-full" />
              </Progress>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <BarChart className="h-5 w-5 mr-2 text-purple-600" />
              By Source
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-center justify-center">
              <div className="text-center space-y-4">
                <BarChart className="h-10 w-10 mx-auto text-gray-300" />
                <p className="text-sm text-gray-500">Chart visualization would show effectiveness by CAPA source</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <LineChart className="h-5 w-5 mr-2 text-green-600" />
              Effectiveness Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-center justify-center">
              <div className="text-center space-y-4">
                <LineChart className="h-10 w-10 mx-auto text-gray-300" />
                <p className="text-sm text-gray-500">Chart visualization would show effectiveness trend over time</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center">
            <FileText className="h-5 w-5 mr-2 text-blue-500" />
            CAPA Effectiveness Verification
          </CardTitle>
          <CardDescription>
            Review verification results and effectiveness ratings for completed CAPAs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input placeholder="Search CAPAs..." className="pl-8" />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="effective">Effective</SelectItem>
                <SelectItem value="partially">Partially Effective</SelectItem>
                <SelectItem value="not-effective">Not Effective</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              Export Report
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>CAPA ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Verified Date</TableHead>
                <TableHead>Verified By</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Score</TableHead>
                <TableHead className="text-right">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {effectivenessData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-gray-500" />
                      {item.verifiedDate}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <User className="h-3.5 w-3.5 text-gray-500" />
                      {item.verifiedBy}
                    </div>
                  </TableCell>
                  <TableCell>{getEffectivenessRatingBadge(item.rating)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={item.score} className="h-2 w-16" />
                      <span className="text-sm">{item.score}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center">
            <FileText className="h-5 w-5 mr-2 text-blue-500" />
            Effectiveness Metrics
          </CardTitle>
          <CardDescription>
            Detailed breakdown of CAPA effectiveness verification criteria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>CAPA ID</TableHead>
                  <TableHead>Root Cause Eliminated</TableHead>
                  <TableHead>Preventive Measures Implemented</TableHead>
                  <TableHead>Documentation Complete</TableHead>
                  <TableHead>Recurrence Check</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {effectivenessData.map((item) => (
                  <TableRow key={`metrics-${item.id}`}>
                    <TableCell className="font-medium">{item.id}</TableCell>
                    <TableCell>{getCheckStatus(item.rootCauseEliminated)}</TableCell>
                    <TableCell>{getCheckStatus(item.preventiveMeasuresImplemented)}</TableCell>
                    <TableCell>{getCheckStatus(item.documentationComplete)}</TableCell>
                    <TableCell>
                      {item.recurrenceCheck === 'Passed' ? (
                        <span className="text-green-600 flex items-center">
                          <Check className="h-4 w-4 mr-1" />
                          Passed
                        </span>
                      ) : item.recurrenceCheck === 'Minor Issues' ? (
                        <span className="text-amber-600 flex items-center">
                          <ArrowUpRight className="h-4 w-4 mr-1" />
                          Minor Issues
                        </span>
                      ) : (
                        <span className="text-red-600 flex items-center">
                          <X className="h-4 w-4 mr-1" />
                          Failed
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CAPAEffectiveness;
