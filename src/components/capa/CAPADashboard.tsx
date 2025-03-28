
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  ClipboardList, 
  LineChart, 
  PieChart, 
  Shield, 
  Users,
  Calendar,
  AlertCircle,
  BarChart3,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CAPADashboardProps {
  filters: {
    status: string;
    priority: string;
    source: string;
    dueDate: string;
  };
  searchQuery: string;
}

const CAPADashboard: React.FC<CAPADashboardProps> = ({ filters, searchQuery }) => {
  // This would normally fetch data based on filters
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Open CAPAs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-end">
              <div className="text-3xl font-bold">24</div>
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                <Clock className="h-3 w-3 mr-1" />
                8 Due Soon
              </Badge>
            </div>
            <Progress value={45} className="h-2 mt-4" />
            <p className="text-xs text-muted-foreground mt-2">45% of total CAPAs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Critical Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-end">
              <div className="text-3xl font-bold">5</div>
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Needs Attention
              </Badge>
            </div>
            <Progress value={20} className="h-2 mt-4 bg-red-100">
              <div className="bg-red-600 h-full rounded-full" />
            </Progress>
            <p className="text-xs text-muted-foreground mt-2">All require management review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Closure Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-end">
              <div className="text-3xl font-bold">14.2</div>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <Calendar className="h-3 w-3 mr-1" />
                Days
              </Badge>
            </div>
            <Progress value={75} className="h-2 mt-4" />
            <p className="text-xs text-muted-foreground mt-2">Target: 10 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">FSMA 204 Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-end">
              <div className="text-3xl font-bold">86%</div>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <Shield className="h-3 w-3 mr-1" />
                Compliant
              </Badge>
            </div>
            <Progress value={86} className="h-2 mt-4" />
            <p className="text-xs text-muted-foreground mt-2">14% gap in documentation</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
              CAPA by Source
            </CardTitle>
            <CardDescription>
              Distribution of CAPAs across different modules
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center border rounded-md bg-gray-50">
              <div className="text-center p-6">
                <PieChart className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-500">
                  Chart visualization would appear here showing the distribution of CAPA sources
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <AlertCircle className="h-5 w-5 mr-2 text-red-600" />
              Critical Action Items
            </CardTitle>
            <CardDescription>
              CAPAs requiring immediate attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border p-3 rounded-md bg-red-50 border-red-100">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-sm">CAPA-2023-056</p>
                    <p className="text-xs text-gray-600 mt-1">Foreign Material in Line 3</p>
                  </div>
                  <Badge className="bg-red-100 text-red-800">Critical</Badge>
                </div>
                <div className="mt-2 flex justify-between items-center text-xs">
                  <span className="text-gray-600">Source: HACCP</span>
                  <span className="text-red-700 font-medium">Due: Today</span>
                </div>
              </div>

              <div className="border p-3 rounded-md bg-amber-50 border-amber-100">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-sm">CAPA-2023-062</p>
                    <p className="text-xs text-gray-600 mt-1">Allergen Control Program Gaps</p>
                  </div>
                  <Badge className="bg-amber-100 text-amber-800">High</Badge>
                </div>
                <div className="mt-2 flex justify-between items-center text-xs">
                  <span className="text-gray-600">Source: Audit</span>
                  <span className="text-amber-700 font-medium">Due: Tomorrow</span>
                </div>
              </div>

              <div className="border p-3 rounded-md bg-amber-50 border-amber-100">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-sm">CAPA-2023-071</p>
                    <p className="text-xs text-gray-600 mt-1">Supplier Documentation Missing</p>
                  </div>
                  <Badge className="bg-amber-100 text-amber-800">High</Badge>
                </div>
                <div className="mt-2 flex justify-between items-center text-xs">
                  <span className="text-gray-600">Source: Supplier</span>
                  <span className="text-amber-700 font-medium">Due: In 2 days</span>
                </div>
              </div>

              <Button className="w-full" variant="outline" size="sm">
                View All Critical Items
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Users className="h-5 w-5 mr-2 text-purple-600" />
              CAPA Assignment Distribution
            </CardTitle>
            <CardDescription>
              Distribution of CAPA responsibilities by department
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center border rounded-md bg-gray-50">
              <div className="text-center p-6">
                <BarChart3 className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-500">
                  Chart visualization would appear here showing CAPA assignments by department
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <LineChart className="h-5 w-5 mr-2 text-green-600" />
              CAPA Effectiveness Trend
            </CardTitle>
            <CardDescription>
              Trend analysis of CAPA effectiveness over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center border rounded-md bg-gray-50">
              <div className="text-center p-6">
                <LineChart className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-500">
                  Chart visualization would appear here showing effectiveness metrics over time
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CAPADashboard;
