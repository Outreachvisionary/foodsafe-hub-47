
import React from 'react';
import { 
  Chart as ChartJS,
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  BarElement,
  ArcElement
} from 'chart.js';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

type ChartType = 'line' | 'bar' | 'pie' | 'doughnut';

interface ChartProps {
  type: ChartType;
  data: any;
  options?: any;
  height?: number;
}

const Chart: React.FC<ChartProps> = ({ type, data, options = {}, height }) => {
  const renderChart = () => {
    switch (type) {
      case 'line':
        return <Line data={data} options={options} height={height} />;
      case 'bar':
        return <Bar data={data} options={options} height={height} />;
      case 'pie':
        return <Pie data={data} options={options} height={height} />;
      case 'doughnut':
        return <Doughnut data={data} options={options} height={height} />;
      default:
        return <p>Unsupported chart type</p>;
    }
  };

  return <div className="chart-container">{renderChart()}</div>;
};

export default Chart;
