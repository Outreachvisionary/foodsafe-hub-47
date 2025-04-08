
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { useIsMobile } from '@/hooks/use-mobile';

// Sample data for compliance trends over the past 6 months
const complianceData = [
  { month: 'Jan', sqf: 82, iso22000: 78, fssc22000: 85, haccp: 90, brcgs2: 76 },
  { month: 'Feb', sqf: 85, iso22000: 80, fssc22000: 82, haccp: 88, brcgs2: 79 },
  { month: 'Mar', sqf: 83, iso22000: 82, fssc22000: 84, haccp: 91, brcgs2: 81 },
  { month: 'Apr', sqf: 87, iso22000: 85, fssc22000: 86, haccp: 93, brcgs2: 84 },
  { month: 'May', sqf: 90, iso22000: 88, fssc22000: 89, haccp: 94, brcgs2: 86 },
  { month: 'Jun', sqf: 92, iso22000: 89, fssc22000: 91, haccp: 95, brcgs2: 89 },
];

// Define chart config for standards
const chartConfig = {
  sqf: {
    label: "SQF",
    theme: {
      light: '#4f46e5',  // fsms-indigo
      dark: '#6366f1'
    }
  },
  iso22000: {
    label: "ISO 22000",
    theme: {
      light: '#0ea5e9',  // fsms-blue
      dark: '#38bdf8'
    }
  },
  fssc22000: {
    label: "FSSC 22000",
    theme: {
      light: '#10b981',  // green
      dark: '#34d399'
    }
  },
  haccp: {
    label: "HACCP",
    theme: {
      light: '#f59e0b',  // amber
      dark: '#fbbf24'
    }
  },
  brcgs2: {
    label: "BRC GS2",
    theme: {
      light: '#6366f1',  // indigo
      dark: '#818cf8'
    }
  },
};

const ComplianceTrendChart: React.FC = () => {
  const isMobile = useIsMobile();
  
  // Custom tooltip content for the Recharts Tooltip
  const CustomTooltipContent = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded shadow-md">
          <p className="font-medium text-xs mb-1">{`Month: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} className="text-xs" style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}%`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  
  return (
    <Card className="lg:col-span-2 animate-fade-in delay-300">
      <CardHeader>
        <CardTitle>Compliance Trend</CardTitle>
        <CardDescription>Last 6 months performance across standards</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full h-80">
          <ChartContainer
            config={chartConfig}
            className="w-full aspect-[4/3] h-full"
          >
            <BarChart
              data={complianceData}
              margin={{ 
                top: 20, 
                right: isMobile ? 10 : 30, 
                left: isMobile ? 0 : 10, 
                bottom: 5 
              }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis 
                dataKey="month" 
                fontSize={12}
                tickMargin={5}
              />
              <YAxis 
                domain={[50, 100]} 
                label={{ 
                  value: 'Compliance %', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle' },
                  offset: isMobile ? -5 : 0
                }} 
                fontSize={12}
                tickMargin={5}
              />
              <Tooltip content={<CustomTooltipContent />} />
              <Legend 
                verticalAlign="bottom" 
                height={36} 
                fontSize={12}
              />
              <Bar 
                dataKey="sqf" 
                name="SQF" 
                radius={[4, 4, 0, 0]} 
                fillOpacity={0.9}
                className="fill-[--color-sqf]" 
              />
              <Bar 
                dataKey="iso22000" 
                name="ISO 22000" 
                radius={[4, 4, 0, 0]} 
                fillOpacity={0.9}
                className="fill-[--color-iso22000]" 
              />
              <Bar 
                dataKey="fssc22000" 
                name="FSSC 22000" 
                radius={[4, 4, 0, 0]} 
                fillOpacity={0.9}
                className="fill-[--color-fssc22000]" 
              />
              <Bar 
                dataKey="haccp" 
                name="HACCP" 
                radius={[4, 4, 0, 0]} 
                fillOpacity={0.9}
                className="fill-[--color-haccp]" 
              />
              <Bar 
                dataKey="brcgs2" 
                name="BRC GS2" 
                radius={[4, 4, 0, 0]} 
                fillOpacity={0.9}
                className="fill-[--color-brcgs2]" 
              />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ComplianceTrendChart;
