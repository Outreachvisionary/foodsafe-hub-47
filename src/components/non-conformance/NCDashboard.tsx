
import React from 'react';
import { BarChartComponent, PieChartComponent } from './NCDashboardCharts';
import { NCStats } from '@/types/non-conformance';

// Define ChartData interface
interface ChartData {
  name: string;
  value: number;
  fill?: string;
}

interface NCDashboardProps {
  stats: NCStats;
}

const NCDashboard: React.FC<NCDashboardProps> = ({ stats }) => {
  // Transform stats into chart data
  const statusData: ChartData[] = Object.entries(stats.byStatus).map(([name, value]) => ({
    name: name.replace('_', ' '),
    value: value as number, // Cast to number to satisfy type
    fill: name === 'On Hold' ? '#f59e0b' : 
          name === 'Resolved' ? '#10b981' : 
          name === 'Under Review' ? '#3b82f6' : 
          name === 'Closed' ? '#6b7280' : '#ef4444'
  }));

  const categoryData: ChartData[] = Object.entries(stats.byCategory).map(([name, value]) => ({
    name,
    value: value as number, // Cast to number to satisfy type
  }));

  const reasonData: ChartData[] = Object.entries(stats.byReasonCategory).map(([name, value]) => ({
    name,
    value: value as number, // Cast to number to satisfy type
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Status Distribution</h3>
          <PieChartComponent data={statusData} />
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Item Categories</h3>
          <BarChartComponent data={categoryData} />
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Reason Categories</h3>
        <BarChartComponent data={reasonData} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <h4 className="text-sm font-medium text-gray-500">Total Non-Conformances</h4>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <h4 className="text-sm font-medium text-gray-500">Pending Review</h4>
          <p className="text-2xl font-bold text-amber-600">{stats.pendingReview}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <h4 className="text-sm font-medium text-gray-500">Recently Resolved</h4>
          <p className="text-2xl font-bold text-green-600">{stats.recentlyResolved}</p>
        </div>
      </div>
    </div>
  );
};

export default NCDashboard;
