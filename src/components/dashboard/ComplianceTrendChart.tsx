
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Sample data for compliance trends over the past 6 months
const complianceData = [
  { month: 'Jan', sqf: 82, iso22000: 78, fssc22000: 85, haccp: 90, brcgs2: 76 },
  { month: 'Feb', sqf: 85, iso22000: 80, fssc22000: 82, haccp: 88, brcgs2: 79 },
  { month: 'Mar', sqf: 83, iso22000: 82, fssc22000: 84, haccp: 91, brcgs2: 81 },
  { month: 'Apr', sqf: 87, iso22000: 85, fssc22000: 86, haccp: 93, brcgs2: 84 },
  { month: 'May', sqf: 90, iso22000: 88, fssc22000: 89, haccp: 94, brcgs2: 86 },
  { month: 'Jun', sqf: 92, iso22000: 89, fssc22000: 91, haccp: 95, brcgs2: 89 },
];

// Color scheme for the different compliance standards
const colorScheme = {
  sqf: '#4f46e5',         // fsms-indigo
  iso22000: '#0ea5e9',    // fsms-blue
  fssc22000: '#10b981',   // green
  haccp: '#f59e0b',       // amber
  brcgs2: '#6366f1',      // indigo
};

const ComplianceTrendChart: React.FC = () => {
  return (
    <Card className="lg:col-span-2 animate-fade-in delay-300">
      <CardHeader>
        <CardTitle>Compliance Trend</CardTitle>
        <CardDescription>Last 6 months performance across standards</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={complianceData}
              margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="month" />
              <YAxis domain={[50, 100]} label={{ value: 'Compliance %', angle: -90, position: 'insideLeft' }} />
              <Tooltip 
                formatter={(value) => [`${value}%`, '']}
                labelFormatter={(label) => `Month: ${label}`}
              />
              <Legend />
              <Bar dataKey="sqf" name="SQF" fill={colorScheme.sqf} radius={[4, 4, 0, 0]} />
              <Bar dataKey="iso22000" name="ISO 22000" fill={colorScheme.iso22000} radius={[4, 4, 0, 0]} />
              <Bar dataKey="fssc22000" name="FSSC 22000" fill={colorScheme.fssc22000} radius={[4, 4, 0, 0]} />
              <Bar dataKey="haccp" name="HACCP" fill={colorScheme.haccp} radius={[4, 4, 0, 0]} />
              <Bar dataKey="brcgs2" name="BRC GS2" fill={colorScheme.brcgs2} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ComplianceTrendChart;
