import React from 'react';
import { NonConformance, NCStatus } from '@/types/non-conformance';
import NCStatusBadge from './NCStatusBadge';
import NCQuickActions from './NCQuickActions';
import { updateNCStatus } from '@/services/nonConformanceService';
import { toast } from 'sonner';

interface NCDetailsHeaderProps {
  data: NonConformance;
  onDataUpdated: (updatedData: Partial<NonConformance>) => void;
}

const NCDetailsHeader: React.FC<NCDetailsHeaderProps> = ({ data, onDataUpdated }) => {
  // Get current user ID - in a real app this would come from auth context
  const currentUserId = data.created_by || 'system';
  
  const handleEdit = () => {
    // This is handled by the parent component through the Details tab
    console.log('Edit requested for NC:', data.id);
  };
  
  const handleStatusChange = async (newStatus: NCStatus) => {
    try {
      console.log(`Changing status from ${data.status} to ${newStatus}`);
      const updatedNC = await updateNCStatus(data.id, newStatus, currentUserId);
      onDataUpdated(updatedNC);
      return Promise.resolve();
    } catch (error) {
      console.error('Error changing NC status:', error);
      toast.error('Failed to update status');
      return Promise.reject(error);
    }
  };
  
  const handleCreateCapa = () => {
    console.log('Creating CAPA for NC:', data.id);
    // The parent component will show the CAPA creation dialog
  };

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          <NCStatusBadge status={data.status} />
          <span className="text-sm text-gray-500">
            Reported: {new Date(data.reported_date).toLocaleDateString()}
          </span>
        </div>
        <div className="text-sm text-gray-500">
          {data.item_category && <span>Category: {data.item_category}</span>}
          {data.reason_category && <span className="ml-2">| Reason: {data.reason_category}</span>}
        </div>
        {data.priority && (
          <div className="text-sm">
            <span className={`font-medium ${getPriorityBadgeClass(data.priority)}`}>
              {data.priority} Priority
            </span>
          </div>
        )}
      </div>
      
      <NCQuickActions 
        id={data.id}
        status={data.status}
        onEdit={handleEdit}
        onStatusChange={handleStatusChange}
        onCreateCAPA={handleCreateCapa}
      />
    </div>
  );
};

export default NCDetailsHeader;
