
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ClipboardList, 
  AlertTriangle, 
  CheckCircle2, 
  FileCheck, 
  BarChart3,
  Users,
  Calendar,
  Landmark
} from 'lucide-react';
import FoodSafetyPlans from '@/components/standards/modules/sqf/FoodSafetyPlans';

const HACCPPage = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">HACCP Management System</h1>
        <p className="text-muted-foreground">
          Hazard Analysis and Critical Control Points management and monitoring
        </p>
      </header>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 mb-8">
          <TabsTrigger value="overview">
            <ClipboardList className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="plans">
            <FileCheck className="mr-2 h-4 w-4" />
            Plans
          </TabsTrigger>
          <TabsTrigger value="monitoring">
            <AlertTriangle className="mr-2 h-4 w-4" />
            Monitoring
          </TabsTrigger>
          <TabsTrigger value="verification">
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Verification
          </TabsTrigger>
          <TabsTrigger value="reports">
            <BarChart3 className="mr-2 h-4 w-4" />
            Reports
          </TabsTrigger>
          <TabsTrigger value="training">
            <Users className="mr-2 h-4 w-4" />
            Training
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <MetricCard 
              title="Active HACCP Plans" 
              value="12" 
              icon={<FileCheck className="text-blue-500" />} 
              trend="up"
              trendValue="2"
            />
            <MetricCard 
              title="CCPs Monitored Today" 
              value="38" 
              icon={<AlertTriangle className="text-amber-500" />} 
              trend="stable"
            />
            <MetricCard 
              title="Critical Limits Exceeded" 
              value="2" 
              icon={<AlertTriangle className="text-red-500" />} 
              trend="down"
              trendValue="1"
            />
            <MetricCard 
              title="Verification Activities" 
              value="8" 
              icon={<CheckCircle2 className="text-green-500" />} 
              trend="up"
              trendValue="3"
            />
            <MetricCard 
              title="Staff Trained" 
              value="95%" 
              icon={<Users className="text-purple-500" />} 
              trend="up"
              trendValue="5%"
            />
            <MetricCard 
              title="Audit Compliance" 
              value="97%" 
              icon={<Landmark className="text-indigo-500" />} 
              trend="up"
              trendValue="2%"
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent CCP Monitoring</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Recent critical control point monitoring data will be displayed here.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Verification Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <UpcomingActivity 
                    name="CCP Verification - Cooking Line 1"
                    date="2023-05-15"
                    assignee="John Smith"
                  />
                  <UpcomingActivity 
                    name="Monthly Record Review"
                    date="2023-05-20"
                    assignee="Maria Johnson"
                  />
                  <UpcomingActivity 
                    name="Equipment Calibration Check"
                    date="2023-05-22"
                    assignee="Technical Team"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="plans">
          <FoodSafetyPlans />
        </TabsContent>
        
        <TabsContent value="monitoring">
          <Card>
            <CardHeader>
              <CardTitle>Critical Control Point Monitoring</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                CCP monitoring tools and records will be displayed here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="verification">
          <Card>
            <CardHeader>
              <CardTitle>Verification Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                HACCP verification activities will be displayed here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>HACCP Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                HACCP reports and analytics will be displayed here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="training">
          <Card>
            <CardHeader>
              <CardTitle>HACCP Training</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                HACCP training materials and records will be displayed here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: 'up' | 'down' | 'stable';
  trendValue?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, trend, trendValue }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <h3 className="text-2xl font-bold">{value}</h3>
            {trend && (
              <p className={`text-xs mt-1 flex items-center ${
                trend === 'up' ? 'text-green-600' : 
                trend === 'down' ? 'text-red-600' : 
                'text-gray-600'
              }`}>
                {trend === 'up' && '↑ '}
                {trend === 'down' && '↓ '}
                {trend === 'stable' && '→ '}
                {trendValue ? trendValue : ''} {trend !== 'stable' ? 'from last period' : 'No change'}
              </p>
            )}
          </div>
          <div className="p-3 bg-muted rounded-md">
            {React.cloneElement(icon as React.ReactElement, { className: `h-5 w-5 ${(icon as React.ReactElement).props.className}` })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface UpcomingActivityProps {
  name: string;
  date: string;
  assignee: string;
}

const UpcomingActivity: React.FC<UpcomingActivityProps> = ({ name, date, assignee }) => {
  return (
    <div className="flex items-center">
      <div className="bg-blue-100 p-2 rounded-md mr-4">
        <Calendar className="h-5 w-5 text-blue-600" />
      </div>
      <div className="flex-1">
        <p className="font-medium">{name}</p>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Due: {new Date(date).toLocaleDateString()}</span>
          <span>Assigned to: {assignee}</span>
        </div>
      </div>
    </div>
  );
};

export default HACCPPage;
