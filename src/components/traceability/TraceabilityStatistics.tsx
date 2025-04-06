
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

interface StatisticsProps {
  recallData?: any[];
  productData?: any[];
  materialData?: any[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const TraceabilityStatistics: React.FC<StatisticsProps> = ({ 
  recallData = [],
  productData = [],
  materialData = [] 
}) => {
  // Mock data for demonstration
  const mockRecallsByStatus = [
    { name: 'Scheduled', value: 4 },
    { name: 'In Progress', value: 3 },
    { name: 'Completed', value: 12 },
    { name: 'Cancelled', value: 2 },
  ];

  const mockRecallSimulationResults = [
    { name: 'Jan', success: 85, duration: 4.2 },
    { name: 'Feb', success: 78, duration: 5.1 },
    { name: 'Mar', success: 92, duration: 3.8 },
    { name: 'Apr', success: 88, duration: 4.0 },
    { name: 'May', success: 95, duration: 3.5 },
  ];

  const mockProductsbyCategory = [
    { name: 'Dairy', count: 15 },
    { name: 'Bakery', count: 22 },
    { name: 'Beverages', count: 18 },
    { name: 'Meat', count: 12 },
    { name: 'Produce', count: 29 },
  ];

  const mockTraceabilityCompleteness = [
    { name: 'Products with Complete Genealogy', value: 78 },
    { name: 'Products with Partial Genealogy', value: 15 },
    { name: 'Products without Genealogy', value: 7 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recalls by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={mockRecallsByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {mockRecallsByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Products by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart 
                data={mockProductsbyCategory}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recall Simulation Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={mockRecallSimulationResults}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="success" stroke="#8884d8" name="Success Rate (%)" />
              <Line yAxisId="right" type="monotone" dataKey="duration" stroke="#82ca9d" name="Duration (hours)" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Traceability Completeness</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={mockTraceabilityCompleteness}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {mockTraceabilityCompleteness.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default TraceabilityStatistics;
