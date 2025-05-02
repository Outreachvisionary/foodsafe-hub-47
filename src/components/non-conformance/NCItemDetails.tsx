
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { NonConformance } from '@/types/non-conformance';
import { Package } from 'lucide-react';
import { isStatusEqual } from '@/utils/typeAdapters';

interface NCItemDetailsProps {
  nonConformance: NonConformance;
}

const NCItemDetails: React.FC<NCItemDetailsProps> = ({ nonConformance }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Item Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Item Name</h3>
            <p>{nonConformance.item_name}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Item ID</h3>
            <p>{nonConformance.item_id || 'N/A'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Category</h3>
            <p>{nonConformance.item_category}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Reason</h3>
            <p>{nonConformance.reason_category}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Total Quantity</h3>
            <p>{nonConformance.quantity ? `${nonConformance.quantity} ${nonConformance.units || ''}` : 'N/A'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Quantity On Hold</h3>
            <div className="flex items-center">
              {isStatusEqual(nonConformance.status, 'On Hold') && nonConformance.quantity_on_hold ? (
                <>
                  <Package className="h-3 w-3 text-orange-500 mr-1" />
                  <p>{nonConformance.quantity_on_hold ? `${nonConformance.quantity_on_hold} ${nonConformance.units || ''}` : 'N/A'}</p>
                </>
              ) : (
                <p>{nonConformance.quantity_on_hold ? `${nonConformance.quantity_on_hold} ${nonConformance.units || ''}` : 'N/A'}</p>
              )}
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-500">Description</h3>
          <p className="mt-1">{nonConformance.description || 'No description provided.'}</p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-500">Reason Details</h3>
          <p className="mt-1">{nonConformance.reason_details || 'No reason details provided.'}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default NCItemDetails;
