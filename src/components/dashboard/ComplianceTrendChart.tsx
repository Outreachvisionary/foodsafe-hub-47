
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { useTheme } from '@/components/ui/theme-provider';

// Sample data for compliance trends over the past 6 months
const complianceData = [
  { month: 'Jan', sqf: 82, iso22000: 78, fssc22000: 85, haccp: 90, brcgs2: 76 },
  { month: 'Feb', sqf: 85, iso22000: 80, fssc22000: 82, haccp: 88, brcgs2: 79 },
  { month: 'Mar', sqf: 83, iso22000: 82, fssc22000: 84, haccp: 91, brcgs2: 81 },
  { month: 'Apr', sqf: 87, iso22000: 85, fssc22000: 86, haccp: 93, brcgs2: 84 },
  { month: 'May', sqf: 90, iso22000: 88, fssc22000: 89, haccp: 94, brcgs2: 86 },
  { month: 'Jun', sqf: 92, iso22000: 89, fssc22000: 91, haccp: 95, brcgs2: 89 },
];

const ComplianceTrendChart: React.FC = () => {
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  
  // Define chart colors based on theme
  const colors = {
    sqf: theme === 'dark' ? '#6366f1' : '#4f46e5',
    iso22000: theme === 'dark' ? '#38bdf8' : '#0ea5e9',
    fssc22000: theme === 'dark' ? '#34d399' : '#10b981',
    haccp: theme === 'dark' ? '#fbbf24' : '#f59e0b',
    brcgs2: theme === 'dark' ? '#818cf8' : '#6366f1',
  };
  
  // Custom tooltip content for the Recharts Tooltip
  const CustomTooltipContent = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card p-3 border rounded-md shadow-lg border-border text-card-foreground">
          <p className="font-medium text-sm mb-1">{`Month: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} className="text-xs flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
              <span className="font-medium">{entry.name}:</span>
              <span>{entry.value}%</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  
  return (
    <Card className="overflow-hidden border-accent/10">
      {/* Add subtle gradient background to header */}
      <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b border-border/50">
        <CardTitle className="flex items-center gap-2">
          <span className="w-2 h-6 bg-primary rounded-full"></span>
          Compliance Trend
        </CardTitle>
        <CardDescription>Last 6 months performance across standards</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
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
                stroke={theme === 'dark' ? '#94a3b8' : '#64748b'}
              />
              <YAxis 
                domain={[50, 100]} 
                label={{ 
                  value: 'Compliance %', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle', fontSize: 12, fill: theme === 'dark' ? '#94a3b8' : '#64748b' },
                  offset: isMobile ? -5 : 0
                }} 
                fontSize={12}
                tickMargin={5}
                stroke={theme === 'dark' ? '#94a3b8' : '#64748b'}
              />
              <Tooltip content={<CustomTooltipContent />} />
              <Legend 
                verticalAlign="bottom" 
                height={36} 
                fontSize={12}
                iconType="circle"
                iconSize={8}
              />
              <Bar 
                dataKey="sqf" 
                name="SQF" 
                radius={[4, 4, 0, 0]} 
                fillOpacity={0.85}
                fill={colors.sqf}
              />
              <Bar 
                dataKey="iso22000" 
                name="ISO 22000" 
                radius={[4, 4, 0, 0]} 
                fillOpacity={0.85}
                fill={colors.iso22000}
              />
              <Bar 
                dataKey="fssc22000" 
                name="FSSC 22000" 
                radius={[4, 4, 0, 0]} 
                fillOpacity={0.85}
                fill={colors.fssc22000}
              />
              <Bar 
                dataKey="haccp" 
                name="HACCP" 
                radius={[4, 4, 0, 0]} 
                fillOpacity={0.85}
                fill={colors.haccp}
              />
              <Bar 
                dataKey="brcgs2" 
                name="BRC GS2" 
                radius={[4, 4, 0, 0]} 
                fillOpacity={0.85}
                fill={colors.brcgs2}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ComplianceTrendChart;
