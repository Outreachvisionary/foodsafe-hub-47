
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Line } from 'react-chartjs-2';

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
    // Mock data - in a real app, this would be fetched from an API
    const generateMockData = () => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const currentMonth = new Date().getMonth();
      
      // Generate last 6 months of data
      const data = [];
      let startValue = 70 + Math.random() * 10;
      
      for (let i = 5; i >= 0; i--) {
        const monthIndex = (currentMonth - i + 12) % 12;
        const randomChange = (Math.random() - 0.3) * 5; // Slightly biased toward improvement
        startValue = Math.min(100, Math.max(50, startValue + randomChange));
        
        data.push({
          month: months[monthIndex],
          compliance: parseFloat(startValue.toFixed(1))
        });
      }
      
      return data;
    };

    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      const mockData = generateMockData();
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
