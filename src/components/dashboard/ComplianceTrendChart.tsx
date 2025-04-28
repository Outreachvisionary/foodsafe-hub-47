
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Line } from 'react-chartjs-2';
import { getMockComplianceTrendData } from '@/services/mockDataService';

interface ComplianceTrendChartProps {
  title?: string;
}

interface TrendDataPoint {
  month: string;
  compliance: number;
}

const ComplianceTrendChart: React.FC<ComplianceTrendChartProps> = ({ title = "Compliance Trend" }) => {
  const [trendData, setTrendData] = useState<TrendDataPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Use the mock data service function
    setLoading(true);
    setTimeout(() => {
      const mockData = getMockComplianceTrendData();
      setTrendData(mockData);
      setLoading(false);
    }, 500);
  }, []);

  const chartData = {
    labels: trendData.map(d => d.month),
    datasets: [
      {
        label: 'Compliance %',
        data: trendData.map(d => d.compliance),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.parsed.y}%`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        min: 50,
        max: 100,
        ticks: {
          callback: function(value: any) {
            return value + '%';
          }
        }
      }
    },
    maintainAspectRatio: false
  };

  return (
    <Card className="shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-64 flex items-center justify-center text-gray-500">
            Loading chart data...
          </div>
        ) : (
          <div className="h-64">
            <Line data={chartData} options={chartOptions as any} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ComplianceTrendChart;
