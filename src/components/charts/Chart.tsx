
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface ChartProps {
  type: 'bar' | 'line' | 'pie';
  data: ChartData<'bar' | 'line' | 'pie'>;
  options?: ChartOptions<'bar' | 'line' | 'pie'>;
  height?: number | string;
  width?: number | string;
}

const Chart: React.FC<ChartProps> = ({ type, data, options, height = '100%', width = '100%' }) => {
  const chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    ...options
  };

  const style = {
    height,
    width
  };

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return <Bar data={data} options={chartOptions} />;
      case 'line':
        return <Line data={data} options={chartOptions} />;
      case 'pie':
        return <Pie data={data} options={chartOptions} />;
      default:
        return <div>Unsupported chart type</div>;
    }
  };

  return (
    <div style={style}>
      {renderChart()}
    </div>
  );
};

export default Chart;
