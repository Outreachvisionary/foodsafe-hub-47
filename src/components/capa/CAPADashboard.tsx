
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveLine } from '@nivo/line';
import { CAPAStats, CAPA } from '@/types/capa';
import { getRecentCAPAs } from '@/services/capaService';

interface CAPADashboardProps {
  stats: CAPAStats;
}

const CAPADashboard: React.FC<CAPADashboardProps> = ({ stats }) => {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'quarter'>('month');
  const [recentCapas, setRecentCapas] = useState<CAPA[]>([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const loadRecentCapas = async () => {
      setLoading(true);
      try {
        const data = await getRecentCAPAs(5);
        setRecentCapas(data);
      } catch (error) {
        console.error('Error fetching recent CAPAs:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadRecentCapas();
  }, []);
  
  // Prepare data for the bar chart - CAPA by status
  const statusData = [
    { status: 'Open', count: stats.open },
    { status: 'In Progress', count: stats.inProgress },
    { status: 'Completed', count: stats.completed },
    { status: 'Overdue', count: stats.overdue },
  ];
  
  // Prepare data for pie chart - CAPA by priority
  const priorityData = Object.entries(stats.byPriority).map(([priority, count]) => ({
    id: priority,
    label: priority,
    value: count,
  }));
  
  // Prepare data for pie chart - CAPA by source
  const sourceData = Object.entries(stats.bySource).map(([source, count]) => ({
    id: source.replace(/_/g, ' '),
    label: source.replace(/_/g, ' '),
    value: count,
  }));
  
  // Prepare data for line chart - CAPAs over time (dummy data for now)
  const getTimeData = () => {
    if (timeframe === 'week') {
      return [
        { x: 'Mon', y: 5 },
        { x: 'Tue', y: 8 },
        { x: 'Wed', y: 3 },
        { x: 'Thu', y: 7 },
        { x: 'Fri', y: 9 },
        { x: 'Sat', y: 2 },
        { x: 'Sun', y: 0 },
      ];
    } else if (timeframe === 'month') {
      return [
        { x: 'Week 1', y: 12 },
        { x: 'Week 2', y: 8 },
        { x: 'Week 3', y: 15 },
        { x: 'Week 4', y: 7 },
      ];
    } else {
      return [
        { x: 'Jan', y: 20 },
        { x: 'Feb', y: 30 },
        { x: 'Mar', y: 15 },
      ];
    }
  };
  
  const timelineData = [
    {
      id: 'CAPAs',
      data: getTimeData(),
    },
  ];
  
  // Function to format status for display
  const formatStatus = (status: string): string => {
    return status.replace(/_/g, ' ');
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Total CAPAs</CardTitle>
            <CardDescription>All time</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Open CAPAs</CardTitle>
            <CardDescription>Awaiting action</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-500">{stats.open}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Overdue</CardTitle>
            <CardDescription>Past due date</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-500">{stats.overdue}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Completed</CardTitle>
            <CardDescription>Successfully closed</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-500">{stats.completed}</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>CAPA Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveBar
              data={statusData}
              keys={['count']}
              indexBy="status"
              margin={{ top: 10, right: 10, bottom: 50, left: 60 }}
              padding={0.3}
              colors={{ scheme: 'nivo' }}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
              }}
              labelSkipWidth={12}
              labelSkipHeight={12}
              role="application"
              ariaLabel="CAPA status distribution"
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>CAPA Priority Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsivePie
              data={priorityData}
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              innerRadius={0.5}
              padAngle={0.7}
              cornerRadius={3}
              activeOuterRadiusOffset={8}
              borderWidth={1}
              borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
              arcLinkLabelsSkipAngle={10}
              arcLinkLabelsTextColor="#333333"
              arcLinkLabelsThickness={2}
              arcLinkLabelsColor={{ from: 'color' }}
              arcLabelsSkipAngle={10}
              arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
              legends={[
                {
                  anchor: 'bottom',
                  direction: 'row',
                  justify: false,
                  translateX: 0,
                  translateY: 56,
                  itemsSpacing: 0,
                  itemWidth: 100,
                  itemHeight: 18,
                  itemTextColor: '#999',
                  itemDirection: 'left-to-right',
                  itemOpacity: 1,
                  symbolSize: 18,
                  symbolShape: 'circle',
                },
              ]}
            />
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>CAPA Source Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsivePie
              data={sourceData}
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              innerRadius={0.5}
              padAngle={0.7}
              cornerRadius={3}
              activeOuterRadiusOffset={8}
              borderWidth={1}
              borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
              arcLinkLabelsSkipAngle={10}
              arcLinkLabelsTextColor="#333333"
              arcLinkLabelsThickness={2}
              arcLinkLabelsColor={{ from: 'color' }}
              arcLabelsSkipAngle={10}
              arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
              legends={[
                {
                  anchor: 'bottom',
                  direction: 'row',
                  justify: false,
                  translateX: 0,
                  translateY: 56,
                  itemsSpacing: 0,
                  itemWidth: 100,
                  itemHeight: 18,
                  itemTextColor: '#999',
                  itemDirection: 'left-to-right',
                  itemOpacity: 1,
                  symbolSize: 18,
                  symbolShape: 'circle',
                },
              ]}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>CAPA Timeline</CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant={timeframe === 'week' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeframe('week')}
              >
                Week
              </Button>
              <Button
                variant={timeframe === 'month' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeframe('month')}
              >
                Month
              </Button>
              <Button
                variant={timeframe === 'quarter' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeframe('quarter')}
              >
                Quarter
              </Button>
            </div>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveLine
              data={timelineData}
              margin={{ top: 10, right: 20, bottom: 50, left: 60 }}
              xScale={{ type: 'point' }}
              yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false, reverse: false }}
              curve="natural"
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: timeframe === 'week' ? 'Day' : timeframe === 'month' ? 'Week' : 'Month',
                legendOffset: 36,
                legendPosition: 'middle',
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'count',
                legendOffset: -40,
                legendPosition: 'middle',
              }}
              pointSize={10}
              pointColor={{ theme: 'background' }}
              pointBorderWidth={2}
              pointBorderColor={{ from: 'serieColor' }}
              pointLabelYOffset={-12}
              useMesh={true}
            />
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Department Performance</CardTitle>
            <CardDescription>CAPA completion rate by department</CardDescription>
          </CardHeader>
          <CardContent className="h-96">
            {/* Mock data for department performance */}
            <ResponsiveBar
              data={[
                { department: 'QA', completed: 85, overdue: 15 },
                { department: 'Production', completed: 70, overdue: 30 },
                { department: 'Maintenance', completed: 90, overdue: 10 },
                { department: 'Food Safety', completed: 95, overdue: 5 },
                { department: 'Logistics', completed: 60, overdue: 40 },
                { department: 'R&D', completed: 80, overdue: 20 },
              ]}
              keys={['completed', 'overdue']}
              indexBy="department"
              margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
              padding={0.3}
              layout="vertical"
              valueScale={{ type: 'linear' }}
              indexScale={{ type: 'band', round: true }}
              colors={['#4caf50', '#f44336']}
              borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Department',
                legendPosition: 'middle',
                legendOffset: 32,
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Percentage',
                legendPosition: 'middle',
                legendOffset: -40,
              }}
              labelSkipWidth={12}
              labelSkipHeight={12}
              legends={[
                {
                  dataFrom: 'keys',
                  anchor: 'bottom-right',
                  direction: 'column',
                  justify: false,
                  translateX: 120,
                  translateY: 0,
                  itemsSpacing: 2,
                  itemWidth: 100,
                  itemHeight: 20,
                  itemDirection: 'left-to-right',
                  itemOpacity: 0.85,
                  symbolSize: 20,
                  effects: [
                    {
                      on: 'hover',
                      style: {
                        itemOpacity: 1,
                      },
                    },
                  ],
                },
              ]}
            />
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent CAPA Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="created">Created</TabsTrigger>
                <TabsTrigger value="updated">Updated</TabsTrigger>
                <TabsTrigger value="closed">Closed</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="space-y-4">
                {loading ? (
                  <p className="text-center py-4">Loading recent activities...</p>
                ) : recentCapas.length > 0 ? (
                  recentCapas.map((capa) => (
                    <div key={capa.id} className="flex items-start space-x-4 p-3 rounded-md border">
                      <div className="flex-1">
                        <p className="font-medium">{capa.title}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {capa.description?.length > 100
                            ? capa.description.substring(0, 100) + '...'
                            : capa.description}
                        </p>
                        <div className="flex items-center text-xs text-muted-foreground mt-2 space-x-2">
                          <span>Status: {formatStatus(capa.status)}</span>
                          <span>•</span>
                          <span>Created: {new Date(capa.created_at).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>Assigned to: {capa.assigned_to}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-4">No recent activities found</p>
                )}
              </TabsContent>
              
              <TabsContent value="created" className="space-y-4">
                <p className="text-center py-4">No recent creations</p>
              </TabsContent>
              
              <TabsContent value="updated" className="space-y-4">
                <p className="text-center py-4">No recent updates</p>
              </TabsContent>
              
              <TabsContent value="closed" className="space-y-4">
                <p className="text-center py-4">No recent closures</p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CAPADashboard;
