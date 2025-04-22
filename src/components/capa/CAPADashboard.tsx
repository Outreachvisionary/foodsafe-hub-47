
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, BarChart2, PieChart as PieChartIcon, Plus } from 'lucide-react';
import { CAPASource } from '@/types/capa';

// Fix imports and types to avoid TypeScript errors

interface CAPADashboardProps {
  onCreateCAPA?: () => void;
}

interface ChartData {
  name: string;
  value: number;
  color: string;
}

const CAPADashboard: React.FC<CAPADashboardProps> = ({ onCreateCAPA }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusData, setStatusData] = useState<ChartData[]>([]);
  const [sourceData, setSourceData] = useState<ChartData[]>([]);
  const [byMonthData, setByMonthData] = useState<any[]>([]);
  
  // Example status data
  const exampleStatusData = [
    { name: 'Open', value: 12, color: '#FF6B6B' },
    { name: 'In Progress', value: 8, color: '#4ECDC4' },
    { name: 'Pending Verification', value: 3, color: '#FFA07A' },
    { name: 'Closed', value: 22, color: '#6BCB77' },
  ];
  
  // Example source data
  const exampleSourceData = [
    { name: 'Audit', value: 15, color: '#7B68EE' },
    { name: 'Customer Complaint', value: 8, color: '#FF7F50' },
    { name: 'Internal QC', value: 13, color: '#20B2AA' },
    { name: 'Supplier Issue', value: 9, color: '#FFD700' },
  ];
  
  // Example monthly data
  const exampleMonthlyData = [
    { name: 'Jan', 'Created': 2, 'Closed': 1 },
    { name: 'Feb', 'Created': 5, 'Closed': 3 },
    { name: 'Mar', 'Created': 8, 'Closed': 6 },
    { name: 'Apr', 'Created': 4, 'Closed': 5 },
    { name: 'May', 'Created': 7, 'Closed': 4 },
    { name: 'Jun', 'Created': 3, 'Closed': 4 },
  ];
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // For now, using example data
        setStatusData(exampleStatusData);
        setSourceData(exampleSourceData);
        setByMonthData(exampleMonthlyData);
      } catch (err) {
        console.error('Error fetching CAPA data:', err);
        setError('Failed to load CAPA statistics. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Fix the type error by ensuring we're passing a valid CAPASource instead of a string
  const getSourceFromName = (name: string): CAPASource => {
    switch(name.toLowerCase()) {
      case 'audit':
        return 'audit';
      case 'customer complaint':
        return 'customer-complaint';
      case 'internal qc':
        return 'internal-qc';
      case 'supplier issue':
        return 'supplier-issue';
      default:
        return 'other';
    }
  };
  
  const handleSourceClick = (entry: any) => {
    const source = getSourceFromName(entry.name);
    console.log(`Filtering by source: ${source}`);
    // Implement filtering logic here
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">CAPA Dashboard</h2>
        <Button 
          onClick={onCreateCAPA}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create CAPA
        </Button>
      </div>
      
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-1">
          <CardHeader className="py-4">
            <CardTitle className="text-lg">Open CAPAs</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold text-blue-600">
              {loading ? '...' : exampleStatusData.find(d => d.name === 'Open')?.value || 0}
            </div>
            <p className="text-muted-foreground">Requiring action</p>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-1">
          <CardHeader className="py-4">
            <CardTitle className="text-lg">In Progress</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold text-amber-500">
              {loading ? '...' : exampleStatusData.find(d => d.name === 'In Progress')?.value || 0}
            </div>
            <p className="text-muted-foreground">Currently being addressed</p>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-1">
          <CardHeader className="py-4">
            <CardTitle className="text-lg">Pending Verification</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold text-purple-600">
              {loading ? '...' : exampleStatusData.find(d => d.name === 'Pending Verification')?.value || 0}
            </div>
            <p className="text-muted-foreground">Awaiting effectiveness check</p>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-1">
          <CardHeader className="py-4">
            <CardTitle className="text-lg">Closed</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold text-green-600">
              {loading ? '...' : exampleStatusData.find(d => d.name === 'Closed')?.value || 0}
            </div>
            <p className="text-muted-foreground">Successfully completed</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="charts">
        <TabsList>
          <TabsTrigger value="charts" className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" />
            Bar Charts
          </TabsTrigger>
          <TabsTrigger value="pies" className="flex items-center gap-2">
            <PieChartIcon className="h-4 w-4" />
            Pie Charts
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="charts">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>CAPAs by Status</CardTitle>
                <CardDescription>Distribution of CAPAs by current status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={statusData}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" name="Count">
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>CAPAs by Source</CardTitle>
                <CardDescription>Where CAPAs are originating from</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={sourceData}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" name="Count" onClick={handleSourceClick}>
                        {sourceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>CAPA Trends by Month</CardTitle>
                <CardDescription>Created vs. Closed over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={byMonthData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="Created" fill="#82ca9d" />
                      <Bar dataKey="Closed" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="pies">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>CAPAs by Status</CardTitle>
                <CardDescription>Distribution of CAPAs by current status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>CAPAs by Source</CardTitle>
                <CardDescription>Where CAPAs are originating from</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={sourceData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        onClick={handleSourceClick}
                      >
                        {sourceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CAPADashboard;
